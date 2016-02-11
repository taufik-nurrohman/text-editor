(function() {

    // => http://stackoverflow.com/a/7592235/1163000
    String.prototype.capitalize = function(lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        });
    };

    var myTextArea = document.getElementById('editor-area'),
        myButton = document.getElementById('editor-control').getElementsByTagName('a'),
        myEditor = new Editor(myTextArea);

    var controls = {
        'bold': function() {
            myEditor.wrap('**', '**');
        },
        'italic': function() {
            myEditor.wrap('_', '_');
        },
        'code': function() {
            myEditor.wrap('`', '`');
        },
        'code-block': function() {
            myEditor.indent('    ');
        },
        'quote': function() {
            myEditor.indent('> ');
        },
        'ul-list': function() {
            var sel = myEditor.selection();
            if (sel.value.length > 0) {
                myEditor.indent('- ');
            } else {
                var placeholder = '- List Item';
                myEditor.insert(placeholder, function() {
                    myEditor.select(sel.start + 2, sel.start + placeholder.length, true);
                });
            }
        },
        'ol-list': function() {
            var sel = myEditor.selection(),
                ol = 0;
            if (sel.value.length > 0) {
                myEditor.indent("", function() {
                    myEditor.replace(/^[^\n]/gm, function(str) {
                        ol++;
                        return str.replace(/^/, ol + '. ');
                    });
                    myEditor.select(sel.start, sel.end + ol + (2 * ol));
                });
            } else {
                var placeholder = '1. List Item';
                myEditor.indent(placeholder, function() {
                    myEditor.select(sel.start + 3, sel.start + placeholder.length, true);
                });
            }
        },
        'link': function() {
            var sel = myEditor.selection(),
                url = prompt('Link URL:', 'http://'),
                title = prompt('Link Title:', 'Link title goes here...'),
                placeholder = 'Your link text goes here...';
            if (url && url !== "" && url !== 'http://') {
                myEditor.wrap('[' + (sel.value.length === 0 ? placeholder : ""), '](' + url + (title !== "" ? ' \"' + title + '\"' : "") + ')', function() {
                    myEditor.select(sel.start + 1, (sel.value.length === 0 ? sel.start + placeholder.length + 1 : sel.end + 1));
                });
            }
            return false;
        },
        'image': function() {
            var url = prompt('Image URL:', 'http://'),
                alt = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')).replace(/[^\w]/g, ' ').capitalize();
            alt = alt.indexOf('/') < 0 ? decodeURIComponent(alt) : 'Image';
            if (url && url !== "" && url !== 'http://') {
                myEditor.insert('\n\n![' + alt + '](' + url + ')\n\n');
            }
            return false;
        },
        'h1': function() {
            heading('#');
        },
        'h2': function() {
            heading('##');
        },
        'h3': function() {
            heading('###');
        },
        'h4': function() {
            heading('####');
        },
        'h5': function() {
            heading('#####');
        },
        'h6': function() {
            heading('######');
        },
        'hr': function() {
            myEditor.insert('\n\n---\n\n');
        },
        'undo': function() {
            myEditor.undo();
        },
        'redo': function() {
            myEditor.redo();
        }
    };

    function heading(key) {
        if (myEditor.selection().value.length > 0) {
            myEditor.wrap(key + ' ', "");
        } else {
            var placeholder = key + ' Heading ' + key.length + '\n\n';
            myEditor.insert(placeholder, function() {
                var s = myEditor.selection().start;
                myEditor.select(s - placeholder.length + key.length + 1, s - 2);
            });
        }
    }

    function click(elem) {
        var hash = elem.hash.replace('#', "");
        if(controls[hash]) {
            elem.onclick = function() {
                controls[hash]();
                return false;
            };
        }
    }

    for (var i = 0, len = myButton.length; i < len; ++i) {
        click(myButton[i]);
        myButton[i].href = 'javascript:;';
    }

    var pressed = 0, shortcut = [];

    myEditor.area.onkeydown = function(e) {

        var s = myEditor.selection(),
            k = myEditor.key(e);

        if (k.match(/^control|shift|alt$/)) {
            shortcut = [k];
        } else {
            if (shortcut[shortcut.length - 1] !== k) { // prevent duplicate
                shortcut.push(k);
            }
        }

        // Update history data on every 5 key presses
        if (pressed < 5) {
            pressed++;
        } else {
            if (!k.match(/^control|shift|alt$/)) {
                myEditor.updateHistory();
                pressed = 0;
            }
        }

        // Press `Shift + Tab` to outdent
        if (shortcut.join('+') === 'shift+tab') {
            // Outdent from quote
            // Outdent from ordered list
            // Outdent from unordered list
            // Outdent from code block
            myEditor.outdent('(> |\\d+\\. |\\- | {4})', null, true); 
            return false;
        }

        // Press `Tab` to indent
        if (k === 'tab') {
            myEditor.indent('    ');
            return false;
        }

    };

    myEditor.area.onkeyup = function(e) {
        var k = myEditor.key(e);
        if (k.match(/^control|shift|alt$/)) {
            shortcut = []; // clear shortcut
        }
    };

})();