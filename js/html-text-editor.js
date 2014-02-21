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
            myEditor.wrap('<strong>', '</strong>');
        },
        'italic': function() {
            myEditor.wrap('<em>', '</em>');
        },
        'code': function() {
            myEditor.wrap('<code>', '</code>');
        },
        'code-block': function() {
            myEditor.wrap('<pre><code>', '</code></pre>');
        },
        'quote': function() {
            myEditor.wrap('<blockquote>', '</blockquote>');
        },
        'li': function() {
            myEditor.wrap('  <li>', '</li>');
        },
        'ul-list': function() {
            var sel = myEditor.selection();
            if (sel.value.length > 0) {
                myEditor.insert('<ul>\n  <li>' + sel.value.replace(/\n/g, '</li>\n  <li>') + '</li>\n</ul>');
            } else {
                var placeholder = '<ul>\n  <li>List Item</li>\n</ul>';
                myEditor.indent(placeholder, function() {
                    myEditor.select(sel.start + 11, sel.start + placeholder.length - 11);
                });
            }
        },
        'ol-list': function() {
            var sel = myEditor.selection();
            if (sel.value.length > 0) {
                myEditor.insert('<ol>\n  <li>' + sel.value.replace(/\n/g, '</li>\n  <li>') + '</li>\n</ol>');
            } else {
                var placeholder = '<ol>\n  <li>List Item</li>\n</ol>';
                myEditor.indent(placeholder, function() {
                    myEditor.select(sel.start + 11, sel.start + placeholder.length - 11);
                });
            }
        },
        'link': function() {
            var sel = myEditor.selection(),
                url = prompt('Link URL:', 'http://'),
                placeholder = 'Your link text goes here...';
            if (url && url !== "" && url !== 'http://') {
                myEditor.wrap('<a href="' + url + '">' + (sel.value.length === 0 ? placeholder : ''), '</a>', function() {
                    var s = sel.start + 9 + url.length + 2;
                    myEditor.select(s, s + (sel.value.length === 0 ? placeholder.length : sel.value.length));
                });
            }
            return false;
        },
        'image': function() {
            var url = prompt('Image URL:', 'http://'),
                alt = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')).replace(/[\-\_\+]+/g, " ").capitalize();
            alt = alt.indexOf('/') < 0 ? decodeURIComponent(alt) : 'Image';
            if (url && url !== "" && url !== 'http://') {
                myEditor.insert('<img alt="' + alt + '" src="' + url + '">');
            }
            return false;
        },
        'h1': function() {
            heading('h1');
        },
        'h2': function() {
            heading('h2');
        },
        'h3': function() {
            heading('h3');
        },
        'h4': function() {
            heading('h4');
        },
        'h5': function() {
            heading('h5');
        },
        'h6': function() {
            heading('h6');
        },
        'hr': function() {
            myEditor.insert('\n\n<hr>\n\n');
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
            myEditor.wrap('<' + key + '>', '</' + key + '>');
        } else {
            var placeholder = '<' + key + '>Heading ' + key.substr(1) + '</' + key + '>';
            myEditor.insert(placeholder, function() {
                var s = myEditor.selection().start;
                myEditor.select(s - placeholder.length + 4, s - 5);
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

    myTextArea.onkeydown = function(e) {

        // Press `Shift + Tab` to outdent
        if (e.shiftKey && e.keyCode == 9) {
            myEditor.outdent('    ');
            return false;
        }

        // Press `Shift + Enter` to add a line break
        if (e.shiftKey && e.keyCode == 13) {
            myEditor.insert('<br>\n');
            return false;
        }

        // Press `Ctrl + Enter` to create a new paragraph
        if (e.ctrlKey && e.keyCode == 13) {
            myEditor.wrap('\n<p>', '</p>');
            return false;
        }

        // Press `Tab` to indent
        if (e.keyCode == 9) {
            myEditor.indent('    ');
            return false;
        }

        // Press `Enter` to insert new `<li></li>` element on certain conditions
        if (e.keyCode == 13) {
            var sel = myEditor.selection();
            if (sel.before.substring(sel.before.length - 5) == '</li>') {
                myEditor.insert('\n  <li></li>', function() {
                    var s = myEditor.selection().start - 5;
                    myEditor.select(s, s);
                });
                return false;
            }
            if (sel.after.substring(0, 5) == '</li>') {
                myEditor.insert('</li>\n  <li>');
                return false;
            }
        }

    };

})();
