Element › Text Editor
=====================

> Element module for text editor plugin.

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="el.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = new TE(document.querySelector('textarea'));
~~~

Methods
-------

### Create Element

~~~ .javascript
editor.el('div', {
    'id': 'test-id',
    'class': 'test-class'
});
~~~

### Set HTML Content

~~~ .javascript
editor.el( … ).content('foo bar baz');
~~~

### Add Event

~~~ .javascript
function test_click() {
    alert('click!');
}

editor.el( … ).on("click", test_click);
~~~

### Remove Event

~~~ .javascript
editor.el( … ).off("click", test_click);
~~~

### Get the Raw Element

~~~ .javascript
console.log(editor.el( … ).$);
~~~

### Append Element

Append element to the `document.body`:

~~~ .javascript
editor.el( … ).appendTo(document.body);
~~~

### Prepend Element

Prepend element to the `document.body`:

~~~ .javascript
editor.el( … ).prependTo(document.body);
~~~

### Treat Element as String

~~~ .javascript
document.body.innerHTML = editor.el( … );
~~~