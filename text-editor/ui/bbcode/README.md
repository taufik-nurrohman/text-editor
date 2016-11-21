BBCode › UI › Text Editor
=========================

> BBCode text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/bbcode/bbcode.html)

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
<script src="../text-editor/ui/bbcode/bbcode.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = TE.ui.BBcode(document.querySelector('textarea'));
~~~