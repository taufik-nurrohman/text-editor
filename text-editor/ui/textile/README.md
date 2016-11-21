Textile › UI › Text Editor
==========================

> Textile text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/textile/textile.html)

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
<script src="../text-editor/ui/textile/textile.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = TE.ui.Textile(document.querySelector('textarea'));
~~~

Methods
-------

### Mark

~~~ .javascript
editor.mark(['*', '*']); // strong text
~~~