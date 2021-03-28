import * as file from '@taufik-nurrohman/file';
import * as folder from '@taufik-nurrohman/folder';

import {rollup} from 'rollup';
import {getBabelOutputPlugin, babel} from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

import {minify} from 'terser';

import beautify from 'js-beautify';

let license = file.getContent('.github/src/LICENSE').trim(),
    state = JSON.parse(file.getContent('package.json'));

state.year = (new Date).getFullYear();

file.setContent('LICENSE', file.parseContent(license, state));

license = license.replace(/\n/g, '\n * ');
license = license.replace(/\n \* \n/g, '\n *\n');
license = '/*!\n *\n * ' + license + '\n *\n */';

function factory(from, to, name, format, options = {}) {
    const c = Object.assign({
        input: from,
        output: {
            file: to,
            format,
            name,
            sourcemap: false
        },
        plugins: [
            babel({
                babelHelpers: 'bundled',
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-proposal-private-methods'
                ],
                presets: [
                    ['@babel/preset-env', {
                        loose: true,
                        modules: false,
                        targets: '>0.25%'
                    }]
                ]
            }),
            getBabelOutputPlugin({
                allowAllFormats: true
            }),
            resolve()
        ]
    }, options);
    (async () => {
        const generator = await rollup(c);
        await generator.write(c.output);
        await generator.close();
        state.rollup = c;
        delete state.scripts;
        // Generate browser module…
        let content = file.getContent(c.output.file);
        content = file.parseContent(license + '\n\n' + content, state);
        file.setContent(c.output.file, beautify.js(content, {
            indent_char: ' ',
            indent_size: 4
        }));
        minify(content, {
            compress: {
                unsafe: true
            }
        }).then(result => {
            file.setContent(c.output.file.replace(/\.js$/, '.min.js'), result.code);
        });
        // Generate Node.js module…
        content = file.getContent(from);
        content = file.parseContent(license + '\n\n' + content, state);
        file.setContent(to.replace(/\.js$/, '.mjs'), beautify.js(content, {
            indent_char: ' ',
            indent_size: 4
        }));
    })();
}

factory('.github/src/-/index.mjs', 'index.js', 'TE', 'umd');

['history', 'hook', 'rect', 'source'].forEach(plug => {
    factory('.github/src/-/index/' + plug + '.mjs', 'index/' + plug + '.js', null, 'iife');
});
