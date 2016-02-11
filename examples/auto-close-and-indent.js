(function() {

    var myEditor = new Editor(document.getElementById('editor-area')),
        tabSize = '  ';

    var insert = function(chars, s) {
        myEditor.insert(chars, function() {
            myEditor.select(s.end + 1);
        });
        return false;
    };

    var shortcut = [];

    myEditor.area.onkeydown = function(e) {

        var area = this,
            s = myEditor.selection(),
            k = myEditor.key(e);

        if (k.match(/^control|shift|alt$/)) {
            shortcut = [k];
        } else {
            if (shortcut[shortcut.length - 1] !== k) { // prevent duplicate
                shortcut.push(k);
            }
        }

        // Auto close for `(`
        if (shortcut.join('+') === 'shift+(') {
            return insert('(' + s.value + ')', s);
        }

        // Auto close for `{`
        if (shortcut.join('+') === 'shift+{') {
            return insert('{' + s.value + '}', s);
        }

        // Auto close for `[`
        if (shortcut.join('+') === 'shift+[') {
            return insert('[' + s.value + ']', s);
        }

        // Auto close for `"`
        if (shortcut.join('+') === 'shift+"') {
            return insert('\"' + s.value + '\"', s);
        }

        // Auto close for `'`
        if (k === "'") {
            return insert('\'' + s.value + '\'', s);
        }

        // Auto close for `<`
        if (shortcut.join('+') === 'shift+<') {
            return insert('<' + s.value + '>', s);
        }

        // `Shift + Tab` to outdent
        if (shortcut.join('+') === 'shift+tab') {
            myEditor.outdent(tabSize);
            return false;
        }

        // `Tab` key was pressed
        if (k === 'tab') {

            var isTagName = /\b([a-z0-9\-\:]+)$/i;

            // Basic auto close for HTML and XML tag
            // write a tag name without `<` or `>` then press your `Tab` key!
            if (s.before.match(isTagName)) {
                var tagName = isTagName.exec(s.before)[1],
                    before = s.before.replace(isTagName, '');
                area.value = before + '<' + tagName + ' ></' + tagName + '>' + s.after;
                myEditor.select(s.start + 2);
                return false;
            }

            // `Tab` to indent
            myEditor.indent(tabSize);
            return false;
        }

        // `BackSpace` key was pressed
        if (k === 'backspace' && s.value.length === 0 && s.before.match(new RegExp('(' + tabSize + '|^)$'))) {
            var outdent = s.before.replace(new RegExp(tabSize + '$'), "");
            area.value = outdent + s.value + s.after;
            myEditor.select(outdent.length);
            return false;
        }

        // `Enter` key was pressed
        if (k === 'enter') {
            var getIndentBefore = /(^|\n)( +)(.*?)$/.exec(s.before),
                indentBefore = getIndentBefore ? getIndentBefore[2] : "";
            if (s.before.match(/[\[\{\(\<\>]$/) && s.after.match(/^[\]\}\)\>\<]/)) {
                myEditor.insert('\n' + indentBefore + tabSize + '\n' + indentBefore, function() {
                    myEditor.select(s.start + indentBefore.length + tabSize.length + 1, s.start + indentBefore.length + tabSize.length + 1);
                });
                return false;
            }
            myEditor.insert('\n' + indentBefore);
            return false;
        }

        // `ArrowRight` key was pressed
        if (k === 'arrowright') {
            if (s.after.match(/^<\/.*?>/)) {
                myEditor.select(s.start + s.after.indexOf('>') + 1);
                return false;
            }
        }

    };

    myEditor.area.onkeyup = function(e) {
        var k = myEditor.key(e);
        if (k.match(/^control|shift|alt$/)) {
            shortcut = []; // clear shortcut
        }
    };

})();