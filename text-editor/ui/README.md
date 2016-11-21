UI › Text Editor
================

> User interface module for text editor plugin.

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/ui.html)

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
~~~

Instance
--------

Enable graphic user interface feature in text editor:

~~~ .javascript
var editor = TE.ui(document.querySelector('textarea'), {
    tab: '  ', // indent size
    dir: 'ltr',
    resize: true, // allow text area resize
    keys: true, // enable/disable keyboard shortcut feature
    tools: 'indent outdent | undo redo',
    attributes: {
        'spellcheck': 'false'
    },
    auto_tab: true, // press ⇥ key to indent
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
    debounce: 500
});
~~~

Methods
-------

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

Helper functions:

~~~ .javascript
// static
TE._.is.a(x); // check if `x` is array
TE._.is.b(x); // check if `x` is a boolean
TE._.is.e(x); // check if `x` is a HTML node
TE._.is.f(x); // check if `x` is a function
TE._.is.i(x); // check if `x` is a number
TE._.is.n(x); // check if `x` is `null`
TE._.is.o(x); // check if `x` is array or object
TE._.is.r(x); // check if `x` is a regular expression
TE._.is.s(x); // check if `x` is a string
TE._.is.x(x); // check if `x` is not set

TE._.x(s); // escape regular expression character(s) in `s`
TE._.extend(a, b); // extend `a` object with `b` object
TE._.each(a, function(value, key, a) {}); // iterate over `a`
TE._.trim(s); // trim white-space before and after `s`
TE._.trim(s, 0); // trim white-space before `s`
TE._.trim(s, 1); // trim white-space after `s`
TE._.css(node, 'font-size'); // get CSS `font-size` value from `node`
TE._.css(node, {'font-size': '200%'}); // set CSS `font-size` as `200%` to `node`

TE._.time(); // get time data as year, month, date, hour, minute, second and millisecond
TE._.replace(); // replace multiple
TE._.format(); // replace variable(s) in string

timer = TE._.timer.set(function() {}, 1000); // set time out in 1000 milliseconds
TE._.timer.reset(timer); // reset time out

TE._.dom.set(container, node); // append `node` to `container`
TE._.dom.reset(container, node); // remove `node` from `container`
TE._.dom.get('#foo'); // get HTML element with ID of `foo`

TE._.dom.is(node, 'i'); // check if `node` is an `<i>` tag

TE._.dom.id(node); // set a unique ID to the `node` if it does not have ID
TE._.dom.copy(node); // clone `node`

TE._.dom.classes.set(node, 'foo'); // add `foo` class to `node`
TE._.dom.classes.reset(node, 'foo'); // remove `foo` class from `node`
TE._.dom.classes.get(node, 'foo'); // check if `node` contains `foo` class

TE._.dom.attributes.set(node, 'href', '/'); // add `href` attribute with value of `/` to `node`
TE._.dom.attributes.reset(node, 'href'); // remove `href` attribute from `node`
TE._.dom.attributes.get(node, 'href'); // get `href` attribute value from `node`

TE._.dom.data.set(node, 'foo', 'bar'); // add `data-foo` attribute with value of `bar` to `node`
TE._.dom.data.reset(node, 'foo'); // remove `data-foo` attribute from `node`
TE._.dom.data.get(node, 'foo'); // get `data-foo` attribute value from `node`

TE._.dom.offset(node); // get `l` (left) and `t` (top) offset of `node` relative to its parent
TE._.dom.pointer(node, e); // get `x` (horizontal) and `y` (vertical) offset of mouse pointer relative to `node`
TE._.dom.size(node); // get `w` (width) and `h` (height) of `node`

TE._.dom.content.set(node, 'foo'); // set `node` content with `foo`
TE._.dom.content.reset(node); // remove `node` content
TE._.dom.content.get(node); // get `node` content

TE._.dom.parent(node); // get `node` parent
TE._.dom.children(node); // get `node` children
TE._.dom.next(node); // get closest `node` next sibling
TE._.dom.previous(node); // get closest `node` previous sibling
TE._.dom.index(node); // get `node` index order from its siblings

TE._.dom.before(container, node); // put `node` before `container`
TE._.dom.after(container, node); // put `node` after `container`
TE._.dom.prepend(container, node); // put `node` at the top of the `container` content
TE._.dom.append(container, node); // put `node` at the end of the `container` content

node = TE._.el('div', 'content', {'id': 'foo'}); // create `node` as `<div id="foo">content</div>`

TE._.event.set('click', node, handler); // add HTML click event to `node`
TE._.event.reset('click', node, handler); // remove HTML click event from `node`
TE._.event.fire('click', node, []); // trigger HTML click event in `node`
TE._.event.x(e); // prevent default event behaviour

// not static
editor._.is('Markdown'); // check if editor type is `Markdown`
editor._.is(/^(html|markdown)$/i); // check if editor type is `HTML` or `Markdown`
editor._.hook.set('foo', handler); // add custom event named as `foo`
editor._.hook.reset('foo'); // remove `foo` custom event
editor._.hook.fire('foo', []); // trigger `foo` event
~~~

#### Replace Multiple

Can accept string or a `RegExp` instance. The string version is always global:

~~~ .javascript
function encode_html(s) {
    return TE._.replace(s, ['&', '<', '>', /\n/g], ['&amp;', '&lt;', '&gt;', '<br>']);
}
~~~

#### Format

Replace pattern in a string with custom text:

~~~ .javascript
var s = TE._.format('Lorem %1 ipsum dolor %2 sit amet.', ['apple', 'orange']);
~~~

#### Element

Create HTML elements:

~~~ .javascript
var div = TE._.el('div', 'yo!', {
    id: 'foo',
    title: 'Test element.',
    style: {
        border: '1px solid #000',
        color: '#fff'
    }
});

var input = TE._.el('input', false, {
    type: 'text',
    value: 'yo!'
});

var select = TE._.el('select', [
    TE._.el('option', 'Option 1', { value: 1 }),
    TE._.el('option', 'Option 2', { value: 2 }),
    TE._.el('option', 'Option 3', { value: 3 })
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
TE._.event.set('click', element, handler);

// remove
TE._.event.reset('click', element, handler);

// trigger
TE._.event.fire('click', element, []);
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

~~~ .javascript
editor.ui.modal('my-modal', {
    // title
    header: 'Modal Title',
    // description
    body: 'Modal content.',
    // action(s)
    footer: {
        'OK': function(e, $) {
            editor.insert('[ok]');
            editor.ui.exit(true);
            return false;
        },
        'Cancel': function(e, $) {
            editor.insert('[cancel]');
            editor.ui.exit(true);
            return false;
        }
    }
});
~~~

Custom modal position:

~~~ .javascript
editor.ui.modal.fit(); // refresh modal position after modal content update (center)
editor.ui.modal.fit([10, 40]); // set modal position 10 pixels from left and 40 pixels from top
~~~

### Alert › Modal

~~~ .javascript
editor.ui.alert('Alert Title', 'Alert content.');
~~~

### Confirm › Modal

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

A single method to show only the overlay:

~~~ .javascript
editor.ui.overlay(true); // `true` means: click to exit
~~~

### Panel

Show panel that will cover the editor area:

~~~ .javascript
editor.ui.panel('Panel content.');
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

Custom drop position:

~~~ .javascript
editor.ui.drop.fit(); // refresh drop position after drop content update
editor.ui.drop.fit(true); // force drop position to be centered vertically and horizontally from the page
editor.ui.drop.fit([10, 40]); // set drop position 10 pixels from left and 40 pixels from top
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

Custom bubble position:

~~~ .javascript
editor.ui.bubble.fit(); // refresh bubble position after bubble content update
editor.ui.bubble.fit([10, 40]); // set bubble position 10 pixels from left and 40 pixels from top
~~~

### Exit

Hide overlay, panel, modal, drop and bubble:

~~~ .javascript
editor.ui.exit();
~~~

~~~ .javascript
editor.ui.exit(true); // restore selection
~~~

~~~ .javascript
editor.ui.overlay.exit(true); // exit overlay only, restore selection
editor.ui.panel.exit(true); // exit panel only, restore selection
editor.ui.modal.exit(true); // exit modal only, restore selection
editor.ui.drop.exit(true); // exit drop only, restore selection
editor.ui.bubble.exit(true); // exit bubble only, restore selection
~~~

Tools
-----

### Add

~~~ .javascript
var index = 1; // tool position in the tools bar (use negative number to order from the back)
editor.ui.tool('bold', {
    title: 'Bold Text',
    click: function(e, $) {
        return $.format('strong'), false;
    }
}, index);
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
 - `target` → HTML element used to trigger the tool item

Separator › Tools
-----------------

~~~ .javascript
var index = 4; // tool separator position in the tools bar (use negative number to order from the back)
editor.ui.tool('|', index);
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
 - `destroy`
 - `enter`
 - `enter.panel`
 - `enter.overlay`
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
 - `exit.panel`
 - `exit.overlay`
 - `exit.modal`
 - `exit.drop`
 - `exit.bubble`
 - `fit`
 - `fit.panel`
 - `fit.overlay`
 - `fit.modal`
 - `fit.drop`
 - `fit.bubble`
 - `on:change`
 - `on:click`
 - `on:focus`
 - …
