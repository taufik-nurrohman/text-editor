(function() {

    var myEditor = new Editor(document.getElementById('editor-area')),
        tabSize = '  ';

    var insert = function(chars, s) {
        myEditor.insert(chars, function() {
            myEditor.select(s.end + 1, s.end + 1);
        });
        return false;
    };

    myEditor.area.onkeydown = function(e) {

        var area = this,
            sel = myEditor.selection();

        // Auto close for `(`
        if (e.shiftKey && e.keyCode == 57) {
            return insert('(' + sel.value + ')', sel);
        }

        // Auto close for `{`
        if (e.shiftKey && e.keyCode == 219) {
            return insert('{' + sel.value + '}', sel);
        }

        // Auto close for `[`
        if (e.keyCode == 219) {
            return insert('[' + sel.value + ']', sel);
        }

        // Auto close for `"`
        if (e.shiftKey && e.keyCode == 222) {
            return insert('\"' + sel.value + '\"', sel);
        }

        // Auto close for `'`
        if (e.keyCode == 222) {
            return insert('\'' + sel.value + '\'', sel);
        }

        // Auto close for `<`
        if (e.shiftKey && e.keyCode == 188) {
            return insert('<' + sel.value + '>', sel);
        }

        // `Shift + Tab` to outdent
        if (e.shiftKey && e.keyCode == 9) {
            myEditor.outdent(tabSize);
            return false;
        }

        // `Tab` was pressed
        if (e.keyCode == 9) {

            var isTagName = /(^|\n| |>)([a-z0-9\-\:]+)$/i;

            // Basic auto close for HTML and XML tag
            // write a tag name without `<` or `>` then press your `Tab` key!
            if (sel.before.match(isTagName)) {
                var tagName = isTagName.exec(sel.before)[2],
                    before = sel.before.replace(isTagName, '$1');

                area.value = before + '<' + tagName + ' ></' + tagName + '>' + sel.after;
                myEditor.select(sel.start + 2, sel.start + 2);
                return false;
            }

            // `Tab` to indent
            myEditor.indent(tabSize);
            return false;
        }

        // `Backspace` was pressed
        if (e.keyCode == 8 && sel.value.length === 0 && sel.before.match(new RegExp('(' + tabSize + '|^)$'))) {
            var outdent = sel.before.replace(new RegExp(tabSize + '$'), "");
            area.value = outdent + sel.value + sel.after;
            myEditor.select(outdent.length, outdent.length);
            return false;
        }

        if (e.keyCode == 13) {
            var getIndentBefore = /(^|\n)( +)(.*?)$/.exec(sel.before),
                indentBefore = getIndentBefore ? getIndentBefore[2] : "";
            if (sel.before.match(/[\[\{\(\<\>]$/) && sel.after.match(/^[\]\}\)\>\<]/)) {
                myEditor.insert('\n' + indentBefore + tabSize + '\n' + indentBefore, function() {
                    myEditor.select(sel.start + indentBefore.length + tabSize.length + 1, sel.start + indentBefore.length + tabSize.length + 1);
                });
                return false;
            }
            myEditor.insert('\n' + indentBefore);
            return false;
        }

        // Right arrow was pressed
        if (e.keyCode == 39) {
            if (sel.after.match(/^<\/.*>/)) {
                var jump = sel.start + sel.after.indexOf('>') + 1;
                myEditor.select(jump, jump);
                return false;
            }
        }

        // console.log(e.keyCode);

    };

})();
