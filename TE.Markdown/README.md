Markdown › Text Editor
======================

> Markdown text editor plugin.

### CSS

~~~ .html
<link href="font-awesome.min.css" rel="stylesheet">
<link href="../ui/ui.min.css" rel="stylesheet">
<style>
.text-editor-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../ui/ui.min.js"></script>
<script src="../TE.HTML/TE.HTML.min.js"></script>
<script src="../TE.Markdown/TE.Markdown.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var options = {
    tab: '  ', // indent size
    dir: 'ltr',
    auto_tab: true, // press ⇥ key to indent
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
    tools: 'b i | a img | footnote abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | hr | undo redo',
    attributes: {
        'spellcheck': 'false'
    },
    states: {
        a: {
            'test': ['../foo.html', 'Test Reference Link']
        },
        img: {
            'test': ['../foo.jpg', 'Test Reference Image']
        }
    },
    languages: {
        tools: { … },
        modals: { … }
    },
    enable_setext_header: true,
    enable_closed_atx_header: false,
    enable_fenced_code_block: true, // replace with `true` or `~~~ .my-class` to enable fenced code block syntax in **Markdown Extra**
    enable_hard_break: 1, // press `⇧+↵` to do a hard break
    formats: {
        b: '**',
        i: '_',
        s: '~~',
        blockquote: '>',
        ul: '-',
        ol: '%1.',
        hr: '---'
    }
};

var editor = new TE.Markdown(document.querySelector('textarea'), options);
~~~

### Destroy Editor

~~~ .javascript
editor.destroy();
~~~

### Trigger Editor Tools

~~~ .javascript
editor.ui.tools.b.click(null, editor);
~~~

HTML Preview
------------

Using <https://github.com/showdownjs/showdown> library to create proper HTML preview.

~~~ .html
<script src="https://cdn.rawgit.com/showdownjs/showdown/1.4.2/dist/showdown.min.js"></script>
<script>

editor._.hook.set('enter.overlay.preview', function(e, $, value, container) {
    var html = value[1].replace(/<body(?:\s[^<>]*?)?>([\s\S]*?)<\/body>/, function(a, b) {
        return (new showdown.Converter()).makeHtml(b);
    });
    container.firstChild.src = 'data:text/html,' + encodeURIComponent(html);
});

</script>
~~~