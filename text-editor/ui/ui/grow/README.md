Editor Grow › UI › Text Editor
==============================

> Text area auto–grow.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/ui/grow/grow.html)

Include the script just after the plugin instances, then set a new configuration data called `auto_grow` with a value of `true`:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script>
var editor = TE.ui(document.querySelector('textarea'), {
    auto_grow: true,
    resize: false // optional to disable the text area resize
});
</script>
<script src="../text-editor/ui/ui/grow/grow.min.js"></script>
~~~