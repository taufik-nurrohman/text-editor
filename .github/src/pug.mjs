import * as file from '@taufik-nurrohman/file';
import * as folder from '@taufik-nurrohman/folder';

import {compile} from 'pug';

import beautify from 'js-beautify';

const state = JSON.parse(file.getContent('package.json'));

state.year = (new Date).getFullYear();

let content,
    paths = folder.getContent('.github/src/-', 'pug', true);

delete state.scripts;

for (let path in paths) {
    if (!/^[_.]/.test(file.name(path))) {
        content = compile(file.getContent(path), {
            basedir: '.github/src/-',
            doctype: 'html',
            filename: path // What is this for by the way?
        });
        path = path.replace('/.github/src/-/', '/');
        path = path.replace(/\.pug$/, "");
        // path += file.x(path) ? "" : '.html';
        path += '.html';
        folder.set(file.parent(path) ?? '.', true);
        file.setContent(path, beautify.html(file.parseContent(content(state), state), {
            indent_char: ' ',
            indent_inner_html: true,
            indent_size: 2,
            js: {
                indent_size: 4
            }
        }));
    }
}
