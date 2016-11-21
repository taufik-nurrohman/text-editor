Markdown › UI › Text Editor
===========================

> Markdown text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/markdown/markdown.html)

### CSS

~~~ .html
<link href="../font-awesome.min.css" rel="stylesheet">
<link href="../text-editor/ui/ui.min.css" rel="stylesheet">
<link href="../text-editor/ui/ui/ui.white.min.css" rel="stylesheet">
<style>
.text-editor-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../text-editor/ui/html/html.min.js"></script>
<script src="../text-editor/ui/markdown/markdown.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var config = {
    extra: true, // enable **Markdown Extra** feature
    auto_close: {
        '`': '`'
    },
    tools: 'b i s | a img | sup abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
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
    'advance_br': true, // press `⇧+↵` to do a hard break
    'advance_h1,h2': true, // enable **SEText** header style
    'advance_pre,code': true, // replace with `true` or `%1 .foo` to enable fenced code block syntax in **Markdown Extra**
    'close_h1,h2,h3,h4,h5,h6': false, // replace with `true` for `### heading 3 ###`
    'close_tr': false, // enable closed table pipe
    formats: {
        b: ['**', '__'],
        i: ['_', '*'],
        s: ['~~'],
        h1: ['=', '#'],
        h2: ['-', '##'],
        h3: ['###'],
        h4: ['####'],
        h5: ['#####'],
        h6: ['######'],
        blockquote: ['>'],
        code: ['`', '~'],
        ul: ['-', '+', '*'],
        ol: ['%1.'],
        hr: ['---', '+++', '***']
    }
};

var editor = TE.ui.Markdown(document.querySelector('textarea'), config);
~~~

Methods
-------

### Mark

~~~ .javascript
editor.mark(['**', '**']); // strong text
~~~