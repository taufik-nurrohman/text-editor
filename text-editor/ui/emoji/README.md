Emoji › Text Editor
===================

> Insertion helper for native _emoji_.

![Emoji](https://cloud.githubusercontent.com/assets/1669261/20274987/4eb40ba4-aac9-11e6-9413-fcf63e26d694.png)

[View Demo](https://rawgit.com/tovic/text-editor/master/text-editor/ui/emoji/emoji.html)

Include the script just after the plugin instances:

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../text-editor/ui/ui.min.js"></script>
<script>
var editor = new TE(document.querySelector('textarea')),
    ui = editor.ui();
</script>
<script src="../text-editor/ui/emoji/emoji.min.js"></script>
~~~

Options
-------

### Emoji

Default _emoji_ data are stored in `editor.config.emoji`:

~~~ .javascript
// console.log(editor.config.emoji);

[

    // recent emoji
    [
        ['Recently Used', ""],
        []
    ],

    // category 1
    [
        ['Smileys & People', '😃'],
        [
            ['\uD83D\uDE00', 'GRINNING FACE'],
            ['\uD83D\uDE01', 'GRINNING FACE WITH SMILING EYES'],
            [ … ],
            …
            …
        ]
    ],

    // category 2
    [
        ['Animals & Nature', '🐻'],
        [ … ]
    ],

    // category 3
    [
        ['Food & Drink', '🍔'],
        [ … ]
    ],

    // category 4
    [
        ['Activity', '⚽'],
        [ … ]
    ],

    // category 5
    [
        ['Travel & Places', '🌇'],
        [ … ]
    ],

    // category 6
    [
        ['Objects', '💡'],
        [ … ]
    ],

    // category 7
    [
        ['Symbols', '🔣'],
        [ … ]
    ],

    // category 8
    [
        ['Flags', '🎌'],
        [ … ]
    ]
]
~~~

Each _emoji_ classified in a particular category:

~~~ .javascript
editor.config.emoji[1]; // Smileys & People
~~~

Each category consists of a title and data:

~~~.javascript
editor.config.emoji[1] = [
    ['Smileys & People', '😃'],
    [ … ]
];
~~~

Each category title consists of a title and its icon (optional):

~~~.javascript
editor.config.emoji[1][0] = ['Smileys & People', '😃'];
~~~

Each category data consists of an icon, title and its custom string to insert (optional). By default, it will insert the first array but if the third array is defined, then it will insert the third array item:

~~~.javascript
editor.config.emoji[1][1] = [
    ['\uD83D\uDE00', 'GRINNING FACE'],
    ['\uD83D\uDE01', 'GRINNING FACE WITH SMILING EYES'],
    [ … ],
    …
    …
];
~~~

### Replace

Replace the first emoji data (`GRINNING FACE`) with a custom one:

~~~.javascript
// this will inserts `©`
editor.config.emoji[1][1][0] = ['©', 'COPYRIGHT SIGN'];
~~~

~~~.javascript
// this will inserts `(c)`
editor.config.emoji[1][1][0] = ['©', 'COPYRIGHT SIGN', '(c)'];
~~~

Example with image icon:

~~~.javascript
// this will inserts `<img src="../img/smile.png">`
editor.config.emoji[1][1][0] = ['<img src="../img/smile.png">', 'SMILING FACE'];
~~~

~~~.javascript
// this will inserts `:)`
editor.config.emoji[1][1][0] = ['<img src="../img/smile.png">', 'SMILING FACE', ':)'];
~~~

### Remove

Remove “Smileys & People” category from _emoji_ set:

~~~ .javascript
editor.config.emoji[1] = false;
~~~

### Remove

Remove 😀 icon from “Smileys & People” set:

~~~ .javascript
editor.config.emoji[1][1][0] = false;
~~~

### Custom Set

Add your own custom set:

~~~.javascript
editor.config.emoji.push([
    ['My Emoji Set', '❄'],
    [
        ['A', 'LETTER A'],
        ['B', 'LETTER B'],
        [ … ],
        …
        …
    ]
]);
~~~