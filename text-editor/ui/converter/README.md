Converter › Text Editor
=======================

> Common string conversion tools.

![Common String Converter](https://cloud.githubusercontent.com/assets/1669261/20245388/e5c00572-a9d2-11e6-84db-d7d522f6683d.png)

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/converter/converter.html)

Include the script just after the plugin instances:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script>
var editor = new TE(document.querySelector('textarea')),
    ui = editor.ui();
</script>
<script src="../text-editor/ui/converter/converter.min.js"></script>
~~~

Options
-------

### Custom Converter

~~~ .javascript
editor.update({
    converters: {
        my_converter: function(e, $) {
            $.ui.tools.converter.check(); // check for empty text selection
            $.replace(/she/gi, 'he'); // replace `she` with `he`
            return false;
        }
    },
    languages: {
        tools: {
            my_converter: ['From Girl to Boy']
        }
    }
});
~~~

### Disable Converter

Disable _Base64_ converters:

~~~ .javascript
editor.update({
    converters: {
        base64_encode: false,
        base64_decode: false
    }
});
~~~

Methods
-------

### Trigger Single Converter

This is the same as clicking the _URL Encode_ menu item:

~~~ .javascript
editor.ui.tools.converter.data.url_encode.click(null, editor);
~~~

### Check for Empty Selection

~~~ .javascript
if (editor.ui.tools.converter.check()) {
    // is not empty
}
~~~

~~~ .javascript
editor.ui.tools.converter.check('Custom Title', 'Custom message.');
~~~