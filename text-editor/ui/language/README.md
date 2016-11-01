Internationalization
--------------------

Include the script just after the plugin instances:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../text-editor/html/html.min.js"></script>
<script>
var editor = new TE.HTML(document.querySelector('textarea'));
</script>
<script src="../text-editor/ui/language/id-id.min.js"></script>
~~~

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/language/language.html)