HTML › Text Editor
==================

> HTML text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/TE.HTML/TE.HTML.html)

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
~~~

Instance
--------

~~~ .javascript
var options = {
    tab: '  ', // indent size
    dir: 'ltr',
    suffix: '>', // replace with `/>` to output `<br/>` instead of `<br>`
    auto_tab: true, // press ⇥ key to indent
    auto_close: {
        '"': '"',
        "'": "'",
        '(': ')',
        '{': '}',
        '[': ']',
        '<': '>'
    },
    auto_encode_html: true, // auto encode HTML tag(s) in `<code>` tag
    auto_p: true, // smart paragraph insertion
    keys: true, // enable keyboard shortcut feature
    tools: 'clear | b i u s | sub sup | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
    attributes: {
        'spellcheck': 'false'
    },
    states: {
        tr: [1, 20], // minimum and maximum table row(s)
        td: [1, 20] // minimum and maximum table column(s)
    },
    languages: {
        tools: {
            clear: 'Clear Format (✘)',
            b: 'Bold (⌘+B)',
            i: 'Italic (⌘+I)',
            u: 'Underline (⌘+U)',
            s: 'Strike (⌘+✘)',
            a: 'Link (⌘+L)',
            img: 'Image (⌘+G)',
            sub: 'Subscript (⌘+↓)',
            sup: 'Superscript (⌘+↑)',
            p: 'Paragraph (⌘+↵)',
            'p,h1,h2,h3,h4,h5,h6': 'H1 – H6 (⌘+H)',
            'blockquote,q': 'Quote (⌘+Q)',
            'pre,code': 'Code (⌘+K)',
            ul: 'Unordered List (⌘+-)',
            ol: 'Ordered List (⌘++)',
            indent: 'Indent (⇥)',
            outdent: 'Outdent (⇧+⇥)',
            table: 'Table (⌘+T)',
            hr: 'Horizontal Rule (⌘+R)'
        },
        modals: {
            a: {
                title: ['Link URL', 'Link Title'],
                placeholder: ['http://', 'link title here…']
            },
            img: {
                title: ['Image URL', 'Image Title', 'Image Caption'],
                placeholder: ['http://', 'image title here…', 'image caption here…']
            },
            table: {
                title: ['Number of Columns', 'Number of Rows', 'Table Caption'],
                placeholder: ['3', '3', 'table caption here…']
            }
        },
        placeholders: {
            table: ['Table Head %1.%2', 'Table Data %1.%2', 'Table Foot %1.%2']
        }
    },
    classes: {
        formats: {}
    },
    advance_img: true, // insert image with a `<figure>` element if title field is defined
    advance_table: true, // include `<thead>`, `<tbody>` and `<tfoot>` markup
    formats: {
        b: 'strong',
        i: 'em',
        u: 'u',
        s: 'del datetime="%1-%2-%3"',
        a: 'a',
        figure: 'figure',
        figcaption: 'figcaption',
        img: 'img',
        sub: 'sub',
        sup: 'sup',
        p: 'p',
        br: 'br',
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        blockquote: 'blockquote',
        q: 'q',
        pre: 'pre',
        code: 'code',
        ul: 'ul',
        ol: 'ol',
        li: 'li',
        table: 'table border="1"',
        caption: 'caption',
        thead: 'thead',
        tbody: 'tbody',
        tfoot: 'tfoot',
        tr: 'tr',
        th: 'th',
        td: 'td',
        hr: 'hr'
    }
};

var editor = new TE.HTML(document.querySelector('textarea'), options);
~~~

### Destroy Editor

~~~ .javascript
editor.destroy();
~~~

### Trigger Editor Tools

~~~ .javascript
editor.ui.tools.b.click(null, editor);
~~~

### Methods

#### Force Inline

~~~ .javascript
editor.i(); // is equal to `editor.trim(false, false).replace(/\s+/g, ' ');
~~~