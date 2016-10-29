Textile › Text Editor
=====================

> Textile text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/TE.Textile/TE.Textile.html)

### CSS

~~~ .html
<link href="../font-awesome.min.css" rel="stylesheet">
<link href="../text-editor/ui/ui.min.css" rel="stylesheet">
<style>
.text-editor-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../TE.HTML/TE.HTML.min.js"></script>
<script src="../TE.Textile/TE.Textile.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = new TE.Textile(document.querySelector('textarea'));
~~~

### Destroy Editor

~~~ .javascript
editor.destroy();
~~~

### Trigger Editor Tools

~~~ .javascript
editor.ui.tools.b.click(null, editor);
~~~

Methods
-------

### Mark

~~~ .javascript
editor.mark(['*', '*']); // strong text
~~~

Hooks
-----

 - `enter.modal.prompt:a[href]`
 - `enter.modal.prompt:a[title]`
 - `exit.modal.prompt:a[href].y`
 - `exit.modal.prompt:a[title].y`
 - `exit.modal.prompt:a[href].n`
 - `exit.modal.prompt:a[title].n`
 - `enter.modal.prompt:img[src]`
 - `enter.modal.prompt:img[title]`
 - `exit.modal.prompt:img[src].y`
 - `exit.modal.prompt:img[title].y`
 - `exit.modal.prompt:img[src].n`
 - `exit.modal.prompt:img[title].n`
 - `enter.modal.prompt:sup[id]`
 - `exit.modal.prompt:sup[id].y`
 - `exit.modal.prompt:sup[id].n`
 - `enter.modal.prompt:abbr[title]`
 - `exit.modal.prompt:abbr[title].y`
 - `exit.modal.prompt:abbr[title].n`
 - `enter.modal.prompt:table>td`
 - `enter.modal.prompt:table>tr`
 - `exit.modal.prompt:table>td.y`
 - `exit.modal.prompt:table>tr.y`
 - `exit.modal.prompt:table>td.n`
 - `exit.modal.prompt:table>tr.n`