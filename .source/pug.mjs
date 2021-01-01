import * as file from '@taufik-nurrohman/file';
import * as folder from '@taufik-nurrohman/folder';

import {compile} from 'pug';

const state = JSON.parse(file.getContent('package.json'));

let content,
    paths = folder.getContent('.source/-', 'pug', true);

delete state.scripts;

for (let path in paths) {
    if (!/^[_.]/.test(file.name(path))) {
        content = compile(file.getContent(path), {
            basedir: '.source/-',
            doctype: 'html',
            filename: path // What is this for by the way?
        });
        path = path.replace('/.source/-/', '/');
        path = path.replace(/\.pug$/, "");
        // path += file.x(path) ? "" : '.html';
        path += '.html';
        folder.set(file.parent(path) ?? '.', true);
        file.setContent(path, file.parseContent(content(state), state));
    }
}
