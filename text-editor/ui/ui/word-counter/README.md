Word Counter › UI › Text Editor
===============================

> Counts words in editor text area.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/ui/word-counter/word-counter.html)

Include the script just after the plugin instances:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../text-editor/ui/html/html.min.js"></script>
<script>
var editor = TE.ui.HTML(document.querySelector('textarea'));
</script>
<script src="../text-editor/ui/ui/word-counter/word-counter.min.js"></script>
~~~

Options
-------

### Disable Word Counter

~~~ .javascript
editor.update({
    word_counter: false
});
~~~