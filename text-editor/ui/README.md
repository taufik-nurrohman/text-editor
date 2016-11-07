UI › Text Editor
================

> User interface module for text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/ui.html)

### CSS

~~~ .html
<link href="../font-awesome.min.css" rel="stylesheet">
<link href="../text-editor/ui/ui.min.css" rel="stylesheet">
<style>
.TE-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = new TE(document.querySelector('textarea'));
~~~

Methods
-------

### UI

Enable graphic user interface feature in text editor:

~~~ .javascript
editor.ui({
    tab: '  ', // indent size
    dir: 'ltr',
    keys: true, // enable/disable keyboard shortcut feature
    tools: 'indent outdent | undo redo',
    attributes: {
        'spellcheck': 'false'
    },
    css: 'body{background:#fff;color:#000}', // CSS for iframe content
    auto_tab: true,
    auto_close: {
        '"': '"',
        "'": "'",
        '(': ')',
        '{': '}',
        '[': ']',
        '<': '>'
    },
    languages: { … },
    classes: {
        "": 'text-editor',
        i: 'icon icon-%1 fa fa-%1'
    },
    debounce: 250
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

### Create

Recreate the graphic user interface of text editor after destroyed:

~~~ .javascript
editor.create({
    tab: '\t',
    classes: {
        editor: 'text-editor-dark text-editor'
    }
});
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

#### Force Inline

This is equal to `editor.trim(false, false).replace(/\s+/g, ' ')`:

~~~ .javascript
editor.i();
~~~

### Modal

![Modal](https://cloud.githubusercontent.com/assets/1669261/20048290/0bfb8fc0-a4ee-11e6-81ee-79827bc30ac3.png)

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

Custom modal position:

~~~ .javascript
editor.ui.modal.fit(); // refresh modal position after modal content update (center)
editor.ui.modal.fit([10, 40]); // set modal position 10 pixels from left and 40 pixels from top
~~~

### Alert › Modal

![Alert › Modal](https://cloud.githubusercontent.com/assets/1669261/20048093/8967edfc-a4ec-11e6-9fd2-69cbf8c0665f.png)

~~~ .javascript
editor.ui.alert('Alert Title', 'Alert content.');
~~~

### Confirm › Modal

![Confirm › Modal](https://cloud.githubusercontent.com/assets/1669261/20048096/89deba04-a4ec-11e6-9806-c491a625192d.png)

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

### Prompt › Modal

![Prompt › Modal](https://cloud.githubusercontent.com/assets/1669261/20048097/89eecac0-a4ec-11e6-9eb9-54f548df5ec6.png)

~~~ .javascript
editor.ui.prompt(
    // title
    'Link URL',
    // default value
    'http://',
    // is required?
    true,
    // if yes…
    function(e, $, value, placeholder) { // `placeholder` is the default value
        $.insert(value);
    },
    0 // input type: (0: text input, 1: text area, 2: select box)
);
~~~

If _input type_ parameter is set to `2`, use _default value_ as the select box option(s) container, and set the default value in _is required?_ parameter:

~~~ .javascript
editor.ui.prompt(
    'Choose',
    {
        'red': 'Red',
        'green': 'Green',
        'blue': 'Blue'
    },
    'green',
    function(e, $, value, placeholder) {
        $.insert(value);
    },
    2
);
~~~

### Overlay

![Overlay](https://cloud.githubusercontent.com/assets/1669261/20048089/895e0940-a4ec-11e6-9b7b-0cbd584d3d1a.png)

A single method to show only the overlay:

~~~ .javascript
editor.ui.overlay('Overlay content.', true); // click to exit
~~~

### Drop

![Drop](https://cloud.githubusercontent.com/assets/1669261/20048091/8960746e-a4ec-11e6-8127-3b4f7349bf5c.png)

~~~ .javascript
editor.ui.drop('my-drop', function(drop) {
    drop.classList.add('test-class-add');
    drop.innerHTML = 'Test content.';
});
~~~

~~~ .javascript
editor.ui.drop('my-drop', '<div class="test-class-add">Test content.</div>');
~~~

Custom drop position:

~~~ .javascript
editor.ui.drop.fit(); // refresh drop position after drop content update
editor.ui.drop.fit(true); // force drop position to be centered vertically and horizontally from the page
editor.ui.drop.fit([10, 40]); // set drop position 10 pixels from left and 40 pixels from top
~~~

### Bubble

![Bubble](https://cloud.githubusercontent.com/assets/1669261/20048090/896047fa-a4ec-11e6-8871-203b2dc664cf.png)

~~~ .javascript
editor.ui.bubble('my-bubble', function(bubble) {
    bubble.classList.add('test-class-add');
    bubble.innerHTML = 'Test content.';
});
~~~

~~~ .javascript
editor.ui.bubble('my-bubble', '<div class="test-class-add">Test content.</div>');
~~~

Custom bubble position:

~~~ .javascript
editor.ui.bubble.fit(); // refresh bubble position after bubble content update
editor.ui.bubble.fit([10, 40]); // set bubble position 10 pixels from left and 40 pixels from top
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

![Tools](https://cloud.githubusercontent.com/assets/1669261/20048094/896c5e82-a4ec-11e6-8a8d-ac6ab5ae9b28.png)

### Add

~~~ .javascript
var pos = 1; // tool position in the tools bar (use negative number to order from the back)
editor.ui.tool('bold', {
    title: 'Bold Text',
    click: function(e, $) {
        return $.format('strong'), false;
    }
}, pos);
~~~

A tool without `i` property will use the tool key as the icon ID:

~~~ .javascript
// this…
editor.ui.tool('bold', {
    click: function(e, $) { … }
}, 1);

// is equal to this…
editor.ui.tool('bold', {
    i: 'bold',
    click: function(e, $) { … }
});
~~~

A tool with function value will use that function as the `click` property:

~~~ .javascript
// this…
editor.ui.tool('bold', function(e, $) { … });

// is equal to this…
editor.ui.tool('bold', {
    i: 'bold',
    click: function(e, $) { … }
});
~~~

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

### Properties

Here are all of the available properties for `editor.ui.tool`:

 - `title` → the tool title
 - `i` → icon identifier
 - `click` → function that will be executed on click event
 - `text` → use text instead of icon?
 - `active` → `true` by default, it means that the tool is active and can be operated
 - `attributes` → extra HTML attributes for the tool markup

Separator › Tools
-----------------

~~~ .javascript
var pos = 4; // tool separator position in the tools bar (use negative number to order from the back)
editor.ui.tool('|', pos);
~~~

Keyboard Shortcuts
------------------

### Add

~~~ .javascript
editor.ui.key('control+b', function(e, $) { … });
~~~

A key with string value will be used to take a tool item from the `editor.ui.tools` if available:

~~~ .javascript
// this…
editor.ui.key('control+b', 'bold');

// is equal to this…
editor.ui.key('control+b', editor.ui.tools.bold);
~~~

### Remove

~~~ .javascript
editor.ui.key('control+b', false);
~~~

Menus › Drop
------------

![Menus › Drop](https://cloud.githubusercontent.com/assets/1669261/20048092/896350c6-a4ec-11e6-9d6b-38f8767322c5.png)

### Add

~~~ .javascript
editor.ui.menu('my-menu', 'Arial', {
    'Arial': function(e, $) {
        return $.wrap('<span style="font-family: Arial;">', '</span>'), false;
    },
    'Times New Roman': function(e, $) { … },
    'Test': 'italic',
    'foo': {
        text: 'This text will overrides the `foo`',
        active: false, // disabled menu
        click: function(e, $) {
            return $.insert('[foo]'), false;
        }
    }
});
~~~

Text with icon…

~~~ .javascript
editor.ui.menu('my-menu', ['user', 'Arial'], { … });
~~~

A key with string value will be used to take a tool item from the `editor.ui.tools` if available:

~~~ .javascript
// this…
editor.ui.menu('my-menu', 'Arial', {
    'Test': 'italic'
});

// is equal to this…
// this…
editor.ui.menu('my-menu', 'Arial', {
    'Test': editor.ui.tools.italic
});
~~~

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
 - `fit`
 - `fit.modal`
 - `fit.drop`
 - `fit.bubble`
 - `on:change`
 - `on:click`
 - `on:focus`
 - …