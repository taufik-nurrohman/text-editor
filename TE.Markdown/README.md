Markdown › Text Editor
======================

> Markdown text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/TE.Markdown/TE.Markdown.html)

### CSS

~~~ .html
<link href="../font-awesome.min.css" rel="stylesheet">
<link href="../text-editor/ui/ui.min.css" rel="stylesheet">
<style>
.text-editor-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../TE.HTML/TE.HTML.min.js"></script>
<script src="../TE.Markdown/TE.Markdown.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var config = {
    tab: '  ', // indent size
    dir: 'ltr',
    auto_tab: true, // press ⇥ key to indent
    extra: true, // enable **Markdown Extra** feature
    auto_close: {
        '"': '"',
        "'": "'",
        '(': ')',
        '{': '}',
        '[': ']',
        '<': '>',
        '`': '`'
    },
    keys: true, // enable keyboard shortcut feature
    tools: 'b i | a img | sup abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
    attributes: {
        'spellcheck': 'false'
    },
    states: {
        a: {
            'test': ['../foo.html', 'Test Reference Link']
        },
        img: {
            'test': ['../foo.jpg', 'Test Reference Image']
        },
        abbr: {
            'CSS': 'Cascading Style Sheet'
        }
    },
    languages: { … },
    advance_br: true, // press `⇧+↵` to do a hard break
    'advance_h1,h2': true, // enable **SEText** header style
    'advance_pre,code': true, // replace with `true` or `%1 .foo` to enable fenced code block syntax in **Markdown Extra**
    'close_h1,h2,h3,h4,h5,h6': false, // replace with `true` for `### heading 3 ###`
    close_tr: false, // enable closed table pipe
    formats: {
        b: ['**', '__'],
        i: ['_', '*'],
        s: '~~',
        h1: ['=', '#'],
        h2: ['-', '##'],
        h3: '###',
        h4: '####',
        h5: '#####',
        h6: '######',
        blockquote: '>',
        code: ['`', '~'],
        ul: ['-', '+', '*'],
        ol: '%1.',
        hr: ['---', '+++', '***']
    }
};

var editor = new TE.Markdown(document.querySelector('textarea'), config);
~~~

### Destroy Editor

~~~ .javascript
editor.destroy();
~~~

### Trigger Editor Tools

~~~ .javascript
editor.ui.tools.b.click(null, editor);
~~~

Methods
-------

### Mark

~~~ .javascript
editor.mark(['**', '**']); // strong text
~~~

Hooks
-----

 - `enter.modal.prompt:a[href]`
 - `enter.modal.prompt:a[title]`
 - `exit.modal.prompt:a[href].y`
 - `exit.modal.prompt:a[title].y`
 - `exit.modal.prompt:a[href].n`
 - `exit.modal.prompt:a[title].n`
 - `enter.modal.prompt:img[src]`
 - `enter.modal.prompt:img[title]`
 - `exit.modal.prompt:img[src].y`
 - `exit.modal.prompt:img[title].y`
 - `exit.modal.prompt:img[src].n`
 - `exit.modal.prompt:img[title].n`
 - `enter.modal.prompt:sup[id]`
 - `exit.modal.prompt:sup[id].y`
 - `exit.modal.prompt:sup[id].n`
 - `enter.modal.prompt:abbr[title]`
 - `exit.modal.prompt:abbr[title].y`
 - `exit.modal.prompt:abbr[title].n`
 - `enter.modal.prompt:table>td`
 - `enter.modal.prompt:table>tr`
 - `exit.modal.prompt:table>td.y`
 - `exit.modal.prompt:table>tr.y`
 - `exit.modal.prompt:table>td.n`
 - `exit.modal.prompt:table>tr.n`

HTML Preview
------------

Using <https://github.com/tanakahisateru/js-markdown-extra> library to create proper HTML preview.

~~~ .html
<script src="https://cdn.rawgit.com/tanakahisateru/js-markdown-extra/1.2.4/js-markdown-extra.js"></script>
<script>

editor._.hook.set('enter.overlay.preview', function(e, $, value, container) {
    var html = value[1].replace(/<body(|\s[^<>]*?)>([\s\S]*?)<\/body>/, function(a, b, c) {
        return '<body' + b + '>' + Markdown(c).replace(/<table>/g, '<table border="1">') + '</body>';
    });
    container.firstChild.src = 'data:text/html,' + encodeURIComponent(html);
});

</script>
~~~