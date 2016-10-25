Internationalization
--------------------

Include this script just after the plugin script:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../TE.HTML/TE.HTML.min.js"></script>
<script src="../text-editor/ui/language/id-id.min.js"></script>
<script>
var editor = new TE.HTML(document.querySelector('textarea'));
</script>
~~~