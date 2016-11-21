HTML Auto–Complete › UI › Text Editor
=====================================

> Auto–close HTML tags and auto–add HTML attributes.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/ui/auto-complete-html/auto-complete-html.html)

Include the script just after the plugin instances, then set a new configuration data called `auto_close_html` with a value of `true`:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script>
var editor = new TE.ui(document.querySelector('textarea'). {
    auto_close_html: true
});
</script>
<script src="../text-editor/ui/ui/auto-complete-html/auto-complete-html.min.js"></script>
~~~