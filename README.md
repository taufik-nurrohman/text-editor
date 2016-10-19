Text Editor
===========

> A text selection range API written in pure JavaScript, for modern browsers.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor.html "View Demo")

~~~ .html
<!DOCTYPE html>
<html dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Test</title>
  </head>
  <body>
    <p>
      <textarea></textarea>
    </p>
    <script src="text-editor.min.js"></script>
    <script>
    var editor = new TE(document.querySelector('textarea'));
    </script>
    <p>
      <button onclick="return editor.wrap('<b>', '</b>'), false;">Bold</button>
      <button onclick="return editor.wrap('<i>', '</i>'), false;">Italic</button>
      <button onclick="return editor.wrap('<u>', '</u>'), false;">Underline</button>
    </p>
  </body>
</html>
~~~

Instance
--------

~~~ .javascript
var editor = new TE(document.querySelector('textarea'));
~~~

Methods
-------

### Get the Editor Area

~~~ .javascript
var target = editor.target;
~~~

### Set Value

Set value to the editor area:

~~~ .javascript
editor.set('foo bar baz');
~~~

### Get Value

Get value of the editor area:

~~~ .javascript
var value = editor.get();
~~~

Get value of the editor area with `#` as the alternate value if the editor area is empty:

~~~ .javascript
var value = editor.get('#');
~~~

### Save State

Save state to the editor storage:

~~~ .javascript
editor.save('my_state_id', 1);
~~~

### Restore State

Restore the saved state from the editor storage:

~~~ .javascript
var previous = editor.restore('my_state_id', '#'); // should return `1` or `#` if not available
~~~

### Focus the Editor Area

~~~ .javascript
editor.focus();
~~~

Focus to the end of the editor area:

~~~ .javascript
editor.focus(true);
~~~

Focus to the start of the editor area:

~~~ .javascript
editor.focus(false);
~~~

### Blur the Editor Area

~~~ .javascript
editor.blur();
~~~

### Get Selection

A method to capture the current text selection. Set the first parameter to `true` to capture the caret offset from text area in pixel(s):

~~~ .javascript
console.log(editor.$(true));
~~~

~~~ .javascript
// for “test before i am selected test after”
// with “i am selected” as the selected value
{
  start: 12, // selection start
  end: 25, // selection end
  value: 'i am selected', // selected text
  before: 'test before ', // text before selection
  after: ' test after', // text after selection
  caret: [ // caret offset from text area in pixel(s)
    { // selection start
      x: 99,
      y: 3
    },
    { // selection end
      x: 203,
      y: 3
    }
  ],
  length: 13 // length of selected text
}
~~~

### Set Selection

Set selection range without `select` event:

~~~ .javascript
editor.select(7, 10);
~~~

Move caret position:

~~~ .javascript
editor.select(7);
~~~

Restore selection after editor’s blur event:

~~~ .javascript
editor.select();
~~~

### Replace Selection

Replace selected text with something:

~~~ .javascript
editor.replace(/foo/g, 'bar');
~~~

### Match Selection

Return `true` if selection matched with pattern:

~~~ .javascript
if (editor.match(/foo/)) { … }
~~~

Custom return value:

~~~ .javascript
var match = editor.match(/^\d+$/, function(m) {
    return +(m[0] || 0);
});

if (match === 1) { … }
~~~

### Insert at Caret/Selection

Insert something at caret/selection. The current selected text will be replaced by the inserted text:

~~~ .javascript
editor.insert(':)');
~~~

### Insert Before Caret/Selection

Insert something before caret/selection:

~~~ .javascript
editor.insertBefore(':)');
~~~

### Insert After Caret/Selection

Insert something after caret/selection:

~~~ .javascript
editor.insertAfter(':)');
~~~

### Wrap Selection

Wrap selection with `<b>` and `</b>`:

~~~ .javascript
editor.wrap('<b>', '</b>');
~~~

~~~ .javascript
editor.wrap('<b>', '</b>', true); // include `<b>` and `</b>` to selection
~~~

### Unwrap Selection

Unwrap selection from `<b>` and `</b>`:

~~~ .javascript
editor.unwrap('<b>', '</b>');
~~~

~~~ .javascript
editor.unwrap('<b>', '</b>', true); // trim `<b>` and `</b>` in selection
~~~

Unwrap selection from any HTML tag(s):

~~~ .javascript
editor.unwrap(/<[^\/<>]+?>/, /<\/[^<>]+?>/);
~~~

~~~ .javascript
editor.unwrap(/<[^\/<>]+?>/, /<\/[^<>]+?>/, true); // trim `<*>` and `</*>` in selection
~~~

### Indent at Caret/Selection

Indent selected text with a tab:

~~~ .javascript
editor.indent();
~~~

Indent selected text with a `****`:

~~~ .javascript
editor.indent('****');
~~~

### Outdent at Caret/Selection

Outdent selected text from a tab:

~~~ .javascript
editor.outdent();
~~~

Outdent selected text from a `****`:

~~~ .javascript
editor.outdent('****');
~~~

Outdent selected text from any white-space(s):

~~~ .javascript
editor.outdent(/[ \t]*/);
~~~

### Trim White-Space(s)

Trim white-space(s) before and after selection range, and at the beginning and end of selection range:

~~~ .javascript
editor.trim();
~~~

Replace the trimmed white-space(s) before and after selection range with `*`:

~~~ .javascript
editor.trim('*', '*');
~~~

Replace the trimmed white-space(s) at the beginning and end of selection range with `*`:

~~~ .javascript
editor.trim("", "", '*', '*');
~~~

### Toggle State

The first parameter should return an array index to access a function in the second parameter by its array index:

~~~ .javascript
var state = /^do state 1$/.test(editor.$().value) ? 1 : 0;
editor.toggle(state, [
    function(r) {
        r.insert('did state 0');
    },
    function(r) {
        r.insert('did state 1');
    },
    …
]);
~~~

### Update History

Update history data:

~~~ .javascript
editor.record();
~~~

Replace the second history data with custom value:

~~~ .javascript
// 0: content
// 1: selection start
// 2: selection end
// 3: scroll / text height
editor.record(['foo bar baz', 2, 4, 1], 1); // 0–based index
~~~

### Remove History

Remove the last history data:

~~~ .javascript
editor.loss();
~~~

Remove the second history data:

~~~ .javascript
editor.loss(1); // 0–based index
~~~

Reset the history data:

~~~ .javascript
editor.loss(true);
~~~

### Read History

Read all history data:

~~~ .javascript
console.log(editor.records());
~~~

Read the second history data:

~~~ .javascript
console.log(editor.records(1)); // 0–based index
~~~

Read the second history data if any, otherwise, return `#`:

~~~ .javascript
console.log(editor.records(1, '#'));
~~~

### Disable History Feature

Temporarily disable the history feature:

~~~ .javascript
editor[0](); // disable

editor.foo().bar().baz();

editor[1](); // re–enable
~~~

Inline mode:

~~~ .javascript
editor[0]().foo().bar().baz()[1]();
~~~

### Undo

Undo from the previous state:

~~~ .javascript
editor.undo();
~~~

### Redo

Redo from the previous undo:

~~~ .javascript
editor.redo();
~~~

Scope
-----

~~~ .javascript
editor.target.onkeydown = function(e) {

    console.log(e.key); // return the native `KeyboardEvent.key` value if supported

    console.log(e.TE.key()); // return the current key character (lower-cased)
    console.log(e.TE.control()); // return `true` if control key is pressed
    console.log(e.TE.shift()); // return `true` if shift key is pressed
    console.log(e.TE.option()); // return `true` if option key is pressed
    console.log(e.TE.meta()); // return `true` if meta key is pressed

    console.log(e.TE.control('b')); // return `true` if control and `b` keys are pressed

    console.log(this.TE); // is equal to the current `editor`

    // check for current key character (try pressing the “control” key)
    if (e.TE.key('ctrl')) { … } // `ctrl` is an alias for `control`, this will return `true`
    if (e.TE.key() === 'ctrl') { … } // comparing `ctrl` outside the function, this will return `false`
    if (e.TE.key() === 'control') { … } // is equal to the original key value, this will return `true`
    if (e.TE.key(/^[abc]$/)) { … } // return `true` if key character is `a`, `b` or `c`

};
~~~

Examples
--------

 - [Basic HTML Text Editor](https://rawgit.com/tovic/text-editor/master/text-editor.noob.html)
 - [Auto–Correct/Auto–Convert](https://rawgit.com/tovic/text-editor/master/text-editor.auto-convert.html)
 - [Test for Editor Keys](https://rawgit.com/tovic/text-editor/master/text-editor.key.html)
 - [Test for Caret Position](https://rawgit.com/tovic/text-editor/master/text-editor.$.caret.html)

Modules
-------

 - [Persistent Storage](https://rawgit.com/tovic/text-editor/master/save/save.html)
 - [User Interface](https://rawgit.com/tovic/text-editor/master/ui/ui.html)
   - [Internationalization](https://rawgit.com/tovic/text-editor/master/ui/language/language.html)

Plugins
-------

![HTML Text Editor](https://cloud.githubusercontent.com/assets/1669261/18806346/373d3bb4-8254-11e6-8634-ef5bdc0d955e.png)

 - [HTML Text Editor](https://rawgit.com/tovic/text-editor/master/TE.HTML/TE.HTML.html)
 - [Markdown Text Editor](https://rawgit.com/tovic/text-editor/master/TE.Markdown/TE.Markdown.html)