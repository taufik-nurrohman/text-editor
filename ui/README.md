UI › Text Editor
================

> User interface module for text editor plugin.

### CSS

~~~ .html
<link href="font-awesome.min.css" rel="stylesheet">
<link href="../ui/ui.min.css" rel="stylesheet">
<style>
.text-editor-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../ui/ui.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = new TE(document.querySelector('textarea'));
~~~

Methods
-------

### Create

Create a text editor with graphic user interface:

~~~ .javascript
editor.create({
    tab: '  ', // indent size
    dir: 'ltr',
    keys: true, // enable/disable keyboard shortcut feature
    tools: 'indent outdent | undo redo',
    attributes: {
        'spellcheck': 'false'
    },
    css: 'body{background:#fff;color:#000}', // CSS for iframe content
    auto_tab: 1,
    auto_close: {
        '"': '"',
        "'": "'",
        '(': ')',
        '{': '}',
        '[': ']',
        '<': '>'
    },
    languages: {
        tools: {
            undo: 'Undo (⌘+Z)',
            redo: 'Redo (⌘+Y)',
            preview: 'Preview (⌘+⌥+V)'
        },
        buttons: {
            okay: 'OK',
            cancel: 'Cancel',
            yes: 'Yes',
            no: 'No',
            enter: 'Enter',
            exit: 'Exit',
            open: 'Open',
            close: 'Close',
            ignore: 'Ignore'
        },
        others: {
            placeholder: 'text here…',
            preview: 'Preview',
            _word: '%1 Word',
            _words: '%1 Words'
        }
    },
    classes: {
        editor: 'text-editor',
        i: 'fa fa-%1'
    }
});
~~~

### Update

Update the already created text editor with custom configuration value:

~~~ .javascript
editor.update({
    tab: '\t',
    classes: {
        editor: 'text-editor-dark text-editor'
    }
});
~~~

### Destroy

Destroy the graphic user interface of text editor:

~~~ .javascript
editor.destroy();
~~~

### Utility

#### Format

Replace pattern in a string with custom text:

~~~ .javascript
var s = editor._.format('Lorem %1 ipsum dolor %2 sit amet.', ['apple', 'orange']);
~~~

#### Element

Create HTML elements:

~~~ .javascript
var div = editor._.el('div', 'yo!', {
    id: 'foo',
    title: 'Test element.',
    style: {
        border: '1px solid #000',
        color: '#fff'
    }
});

var input = editor._.el('input', false, {
    type: 'text',
    value: 'yo!'
});

var select = editor._.el('select', [
    editor._.el('option', 'Option 1', { value: 1 }),
    editor._.el('option', 'Option 2', { value: 2 }),
    editor._.el('option', 'Option 3', { value: 3 })
], {
    name: 'category',
    id: 'foo:123'
});
~~~

#### Events

Add, remove and trigger HTML events:

~~~ .javascript
// handler as hook ID
function handler(e) {
    alert('click!');
}

// add
editor._.event.set('click', element, handler);

// remove
editor._.event.reset('click', element, handler);

// trigger
editor._.event.fire('click', element, []);
~~~

#### Hooks

Add, remove and trigger custom events:

~~~ .javascript
// add
editor._.hook.set('yo', function(a, b, c) {
    alert(a + ' ' + b + ' ' + c);
});

// remove
editor._.hook.reset('yo');

// trigger
editor._.hook.fire('yo', ['foo', 'bar', 'baz']);
~~~

### Selection

#### Tidy

Smarter method to force white–spaces between selection. This method will not add white-spaces at the start of text selection if characters before selection is empty, and will not add white–spaces at the end of text selection if characters after selection is empty:

~~~ .javascript
editor.tidy('\n\n', '\n\n').insert('<div>force block</div>');
~~~

#### Format HTML

Toggle HTML tags with this:

~~~ .javascript
editor.format('strong', ' ', ""); // span
editor.format('blockquote', '\n\n', '\n'); // block
~~~

### Modal

~~~ .javascript
// create a modal button
var button = editor._.el('button', 'OK');

// set event
editor._.event.set('click', button, function() {
    editor.ui.exit(true); // restore selection on modal hide
});

editor.ui.modal('my-modal', {
    // title
    header: 'Modal Title',
    // description
    body: 'Modal content.',
    // action(s)
    footer: button
});
~~~

#### Alert › Modal

~~~ .javascript
editor.ui.alert('Alert Title', 'Alert content.');
~~~

#### Confirm › Modal

~~~ .javascript
editor.ui.confirm(
    // title
    'Confirm Title',
    // description
    'Are you sure?',
    // if yes…
    function(e, $) {
        $.insert('<yes>');
    },
    // if no…
    function(e, $) {
        $.insert('<no>');
    }
);
~~~

#### Prompt › Modal

~~~ .javascript
editor.ui.prompt(
    // title
    'Link URL',
    // default value
    'http://',
    // is required?
    true,
    // if yes…
    function(e, $, value) {
        $.insert(value);
    },
    0 // input type: (0: text input, 1: text area, 2: select box)
);
~~~

> ##### Notes
>
> If _input type_ parameter is set to `2`, use _default value_ as the select box option(s) container, and set the default value in _is required?_ parameter:
>
> ~~~ .javascript
> editor.ui.prompt('Choose', {
>     'red': 'Red',
>     'green': 'Green',
>     'blue': 'Blue'
> }, function(e, $, value) {
>     $.insert(value);
> }, 2);
> ~~~

### Overlay

A single method to show only the overlay:

~~~ .javascript
editor.ui.overlay('Overlay content.', true); // click to exit
~~~

### Drop

~~~ .javascript
editor.ui.drop('my-drop', function(drop) {
    drop.classList.add('test-class-add');
    drop.innerHTML = 'Test content.';
});
~~~

~~~ .javascript
editor.ui.drop('my-drop', '<div class="test-class-add">Test content.</div>');
~~~

### Bubble

~~~ .javascript
editor.ui.bubble('my-bubble', function(bubble) {
    bubble.classList.add('test-class-add');
    bubble.innerHTML = 'Test content.';
});
~~~

~~~ .javascript
editor.ui.bubble('my-bubble', '<div class="test-class-add">Test content.</div>');
~~~

### Exit

Hide overlay, modal, drop and bubble:

~~~ .javascript
editor.ui.exit();
~~~

~~~ .javascript
editor.ui.exit(true); // restore selection
~~~

~~~ .javascript
editor.ui.exit(true, 'drop'); // restore selection, exit drop only
~~~

Tools
-----

### Add

#### Method 1

~~~ .javascript
// [1]. register new button to the `editor.ui.tools` object
editor.ui.tools.bold = {
    i: 'bold', // icon ID for `fa fa-%1`
    title: 'Bold Text', // button title
    click: function(e, $) { // action
        // `$` maps to the `editor` so you can use it to trigger the available selection method(s)
        $.format('b'); // toggle HTML `<b>` to selection
        return false; // hijack default event
    }
};

// [2]. put button to the tools list
editor.config.tools = 'bold undo redo';

// [3]. update the editor
editor.update();
~~~

#### Method 2

~~~ .javascript
// register
editor._.extend(editor.ui.tools, {
    bold: { … },
    italic: { … },
    underline: { … },
    link: {
        title: 'Insert Link',
        click: function(e, $) {
            $.ui.prompt('URL', 'http://', true, function(e, $, value) {
                $.wrap('<a href="' + value + '">', '</a>');
            });
            return false;
        }
    }
});

// put
editor.config.tools = 'bold italic underline | link | undo redo';

// update
editor.update();
~~~

#### Method 3

~~~ .javascript
var position = 1; // button position in the tools bar
editor.ui.tool('bold', {
    title: 'Bold Text',
    click: function(e, $) {
        return $.format('strong'), false;
    }
}, position);
~~~

> #### Notes
>
> A tool without `i` property will use the button key as the icon ID:
>
> ~~~ .javascript
> // this…
> editor.ui.tools.bold = {
>     click: function(e, $) { … }
> };
>
> // is equal to this…
> editor.ui.tools.bold = {
>     i: 'bold',
>     click: function(e, $) { … }
> };
> ~~~
>
> A tool with function value will use that function as the `click` property:
>
> ~~~ .javascript
> // this…
> editor.ui.tools.bold = function(e, $) { … };
>
> // is equal to this…
> editor.ui.tools.bold = {
>     i: 'bold',
>     click: function(e, $) { … }
> };
> ~~~

### Remove

~~~ .javascript
editor.ui.tool('bold', false);
~~~

### Disable

~~~ .javascript
editor.ui.tool('bold', {
    active: false
});
~~~

Keyboard Shortcuts
------------------

### Add

#### Method 1

~~~ .javascript
// [1]. register new shortcut to the `editor.ui.keys` object
editor.ui.keys['control+f'] = function(e, $) {
    $.ui.prompt('Search', "", true, function(e, $, value) {
        // do something…
    });
};

// [2]. update the editor
editor.update();
~~~

#### Method 2

~~~ .javascript
// register
editor._.extend(editor.ui.keys, {
    'control+b': function(e, $) { … },
    'control+i': function(e, $) { … },
    'control+u': function(e, $) { … }
});

// update
editor.update();
~~~

#### Method 3

~~~ .javascript
editor.ui.key('control+b', function(e, $) { … });
~~~

> #### Notes
>
> A key with string value will be used to take a tool item from the `editor.ui.tools` if available:
>
> ~~~ .javascript
> // this…
> editor.ui.keys['control+b'] = 'bold';
>
> // is equal to this…
> editor.ui.keys['control+b'] = editor.ui.tools.bold;
>
> // or this…
> editor.ui.keys['control+b'] = function(e, $) {
>     return editor.ui.tools.bold(e, $);
> });
> ~~~

### Remove

~~~ .javascript
editor.ui.key('control+b', false);
~~~

Menus
-----

### Add

~~~ .javascript
editor.ui.menu('my-menu', 'Arial', {
    'Arial': function(e, $) {
        return $.wrap('<span style="font-family: Arial;">', '</span>'), false;
    },
    'Times New Roman': function(e, $) { … },
    'Test': 'italic'
});
~~~

> #### Notes
>
> A key with string value will be used to take a tool item from the `editor.ui.tools` if available.

### Remove

~~~ .javascript
editor.ui.menu('my-menu', false);
~~~

Hooks
-----

 - `create`
 - `update`
 - `update.tools`
 - `update.keys`
 - `update.menus`
 - `destroy`
 - `enter`
 - `enter.overlay`
 - `enter.overlay.preview`
 - `enter.modal`
 - `enter.modal.default`
 - `enter.modal.alert`
 - `enter.modal.confirm`
 - `enter.modal.prompt`
 - `enter.modal.foo` → for `editor.ui.modal('foo')`
 - `enter.drop`
 - `enter.drop.default`
 - `enter.drop.foo` → for `editor.ui.drop('foo')`
 - `enter.bubble`
 - `enter.bubble.default`
 - `enter.bubble.foo` → for `editor.ui.bubble('foo')`
 - `exit`
 - `exit.overlay`
 - `exit.modal`
 - `exit.drop`
 - `exit.bubble`
 - `on:change`