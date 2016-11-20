Bubble Tools › Text Editor
==========================

> Floating tools bar.

![Bubble Tools](https://cloud.githubusercontent.com/assets/1669261/20364359/6b8d788e-ac75-11e6-9f56-e153e6cdab6a.png)

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/bubble-tools/bubble-tools.html)

Include the script just after the plugin instances, then set a new configuration data called `tools_alt` with a value of `true`:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script src="../text-editor/html/html.min.js"></script>
<script>
var editor = new TE.HTML(document.querySelector('textarea'), {
    tools_alt: true
});
</script>
<script src="../text-editor/ui/bubble-tools/bubble-tools.min.js"></script>
~~~

Options
-------

### Custom Tools

~~~ .javascript
editor.update({
    tools_alt: 'b i | a img'
});
~~~

~~~ .javascript
editor.update({
    tools_alt: [
        'b i u', // span
        'p hr table' // block
    ]
});
~~~