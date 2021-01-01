import * as file from '@taufik-nurrohman/file';
import * as folder from '@taufik-nurrohman/folder';

import {rollup} from 'rollup';
import {getBabelOutputPlugin, babel} from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

import {minify} from 'terser';

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
    let license = '/*!\n *\n * ' + file.getContent('LICENSE').trim().replace(/\n/g, '\n * ').replace(/\n \* \n/g, '\n *\n') + '\n *\n */';
    (async () => {
        const generator = await rollup(c);
        const state = JSON.parse(file.getContent('package.json'));
        await generator.write(c.output);
        await generator.close();
        state.rollup = c;
        delete state.scripts;
        // Generate browser module…
        let content = file.getContent(c.output.file);
        content = license + '\n\n' + file.parseContent(content, state);
        file.setContent(c.output.file, content);
        minify(content, {
            compress: {
                unsafe: true
            }
        }).then(result => {
            file.setContent(c.output.file.replace(/\.js$/, '.min.js'), result.code);
        });
        // Generate Node.js module…
        content = file.getContent(from);
        content = license + '\n\n' + file.parseContent(content, state);
        file.setContent(to.replace(/\.js$/, '.mjs'), content);
    })();
}

factory('.source/-/index.mjs', 'index.js', 'TE', 'umd');

['history', 'hook', 'rect', 'source'].forEach(plug => {
    factory('.source/-/index/' + plug + '.mjs', 'index/' + plug + '.js', null, 'iife');
});
