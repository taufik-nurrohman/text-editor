HTML › Text Editor
==================

> HTML editor plugin.

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
    tools: 'clear | b i u s | sub sup | a img | p | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | align-left align-center align-right align-justify | hr | undo redo',
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
            sup: 'Subscript (⌘+↑)',
            p: 'Paragraph (⌘+↵)',
            'p,h1,h2,h3,h4,h5,h6': 'H1 – H6 (⌘+H)',
            'blockquote,q': 'Quote (⌘+Q)',
            'pre,code': 'Code (⌘+K)',
            ul: 'Unordered List (⌘+-)',
            ol: 'Ordered List (⌘++)',
            indent: 'Indent (⇥)',
            outdent: 'Outdent (⇧+⇥)',
            'align-left': 'Align Left',
            'align-center': 'Align Center',
            'align-right': 'Align Right',
            'align-justify': 'Align Justify',
            'align-top': 'Align Top',
            'align-middle': 'Align Middle',
            'align-bottom': 'Align Bottom',
            hr: 'Horizontal Rule (⌘+R)'
        },
        modals: {
            a: {
                title: ['Link URL', 'Link Title'],
                placeholder: ['http://', 'link title here…']
            },
            img: {
                title: ['Image URL', 'Image Caption'],
                placeholder: ['http://', 'image caption here…']
            }
        }
    },
    classes: {
        formats: {
            align: ['left', 'center', 'right', 'justify', 'top', 'middle', 'bottom', ""]
        }
    },
    formats: {
        align: 'div class="%1-%2"',
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
        hr: 'hr'
    }
};

var editor = new TE.HTML(document.querySelector('textarea'), options);
~~~

### Destroy Editor

~~~ .javascript
editor.destroy();
~~~

### Trigger Editor Toolbars

~~~ .javascript
editor.ui.tools.b.click(null, editor);
~~~