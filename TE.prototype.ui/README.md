UI › Text Editor
================

> User interface module for text editor plugin.

### CSS

~~~ .html
<link href="font-awesome.min.css" rel="stylesheet">
<link href="ui.min.css" rel="stylesheet">
<style>
.text-editor-content {height:300px} /* adjust editor height */
</style>
~~~

### JavaScript

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="ui.min.js"></script>
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
    keys: true, // enable/disable keyboard shortcut feature
    tab: '  ', // indent size
    tools: 'undo redo',
    languages: {
        tools: {
            undo: 'Undo (⌘+Z)',
            redo: 'Redo (⌘+Y)'
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

Once created, these methods will be attached to the `editor` instance.

#### Selection

Smarter method to force white-spaces between selection. This method will not add white-spaces at the start of text selection if characters before selection is empty, and will not add white-spaces at the end of text selection if characters after selection is empty:

~~~ .javascript
var gap_start = '\n\n',
    gap_end = '\n\n';

editor.gap(gap_start, gap_end).insert('<div>force block</div>');
~~~

Toggle HTML tags with this method:

~~~ .javascript
var gap_out = '\n\n',
    gap_in = '\n';

editor.format('strong'); // span
editor.format('blockquote', gap_out, gap_in); // block
~~~

#### User Interface

##### Modal

~~~ .javascript
// create a modal button
var button = el('button', 'OK');

// set event
editor._.event.set('click', button, function() {
    editor.ui.exit(true, 'modal'); // restore selection, hide modal
});

editor.ui.modal('my-modal', {
    header: 'Modal Title', // title
    body: 'Modal content.', // content
    footer: button // action(s)
});
~~~

##### Alert › Modal

~~~ .javascript
editor.ui.alert('Alert Title', 'Alert content.');
~~~

##### Confirm › Modal

~~~ .javascript
editor.ui.confirm(
    'Confirm Title', // title
    'Are you sure?' // description
    function(e, $) { // if yes…
        $.insert('**yes**');
    },
    function(e, $) { // if no…
        $.insert('**no**');
    }
);
~~~

##### Prompt › Modal

~~~ .javascript
editor.ui.prompt(
    'Link URL', // title
    'http://' // pre-defined value
    true, // is required?
    function(e, $) { // if yes…
        $.insert('**yes**');
    },
    function(e, $) { // if no…
        $.insert('**no**');
    }
);
~~~

##### Overlay

A single method to show only the overlay:

~~~ .javascript
editor.ui.overlay('Overlay content.', true); // click to exit
~~~

##### Drop [TODO]

~~~ .javascript
editor.ui.drop('my-drop', 'Drop content.', function(drop) {
    drop.classList.add('test-class-add');
});
~~~

##### Bubble [TODO]

~~~ .javascript
editor.ui.drop('my-bubble', 'Bubble content.', function(bubble) {
    bubble.classList.add('test-class-add');
});
~~~

#### Utility

Replace pattern in a string with custom text:

~~~ .javascript
var s = 'Lorem %1 ipsum dolor %2 sit amet.',

s = editor._.format(s, ['apple', 'orange']);
~~~

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
editor._.event.fire('click', element, {});
~~~

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

### Destroy

Remove the attached user interface features:

~~~ .javascript
editor.destroy();
~~~

### Update

Update the text editor graphic user interface with custom settings:

~~~ .javascript
editor.update({
    tab: '\t',
    classes: {
        editor: 'text-editor-dark text-editor'
    }
});
~~~

---

### Add Custom Toolbar Buttons

#### Method 1

~~~ .javascript
// [1]. register new button to the `editor.ui.tools` object
editor.ui.tools.bold = {
    i: 'bold', // icon ID for `fa fa-%1`
    title: 'Bold Text', // button title
    click: function(e, $) { // action
        // `$` maps to the `editor` so you can use it to trigger the available selection method(s)
        $.format('strong'); // toggle HTML `<b>` to selection
        return false; // hijack default event
    }
};

// [2]. add button to the toolbar list
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

// got it?
~~~

#### Method 3

~~~ .javascript
var position = 1; // button position in the toolbar
editor.ui.tool('bold', {
    title: 'Bold Text',
    click: function(e, $) {
        return $.format('strong'), false;
    }
}, position);
~~~

#### Notes

A tool without `i` property will use the button key as the icon ID:

~~~ .javascript
// this…
editor.ui.tools.bold = {
    click: function(e, $) { … }
};

// is equal to this…
editor.ui.tools.bold = {
    i: 'bold',
    click: function(e, $) { … }
};
~~~

A tool with function value will be used as the `click` property:

~~~ .javascript
// this…
editor.ui.tools.bold = function(e, $) { … };

// is equal to this…
editor.ui.tools.bold = {
    click: function(e, $) { … }
};
~~~

### Add Custom Keyboard Shortcuts

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

#### Notes

A key with string value will be used to take a tool item from the `editor.ui.tools` if available:

~~~ .javascript
// this…
editor.ui.keys['control+b'] = 'bold';

// is equal to this…
editor.ui.keys['control+b'] = editor.ui.tools.bold;

// or this…
editor.ui.keys['control+b'] = function(e, $) {
    return editor.ui.tools.bold(e, $);
});
~~~