(function() {

    var editorArea = document.getElementById('editor-area-wrapper'),
        L1 = editorArea.children[0],
        L2 = editorArea.children[1],
        L3 = editorArea.children[2],
        myEditor = new Editor(L3.children[0]);

    L2.style.display = "none";

    function htmlEntities(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
                .replace(/</g, "&gt;");
    }

    function autoResizeTextArea() {
        myEditor.area.style.height = '16px';
        myEditor.area.style.height = parseInt(myEditor.area.scrollHeight, 10) + 'px';
    }

    function updateSyntaxHighlighter() {
        visible = false;
        L2.className = 'editor-layer editor-layer-2';
        setTimeout(function() {
            var sel = myEditor.selection();
            L1.innerHTML = '<pre class="prettyprint"><code>' + htmlEntities(myEditor.area.value) + '</code></pre>';
            prettyPrint(); // Trigger the Google Code Prettify
            if (sel.value.length > 0) {
                L2.innerHTML = '<pre>' + htmlEntities(myEditor.area.value) + '</pre>';
            } else {
                L2.innerHTML = '<pre>' + htmlEntities(sel.before) + '<span class="fake-caret"></span>' + htmlEntities(sel.after) + '</pre>';
            }
            autoResizeTextArea();
        }, 1);
    }

    var visible = true;

    // Blink the second layer for caret animation
    function blinkCaret() {
        L2.className = visible ? 'editor-layer editor-layer-2 dim' : 'editor-layer editor-layer-2';
        visible = visible ? false : true;
        setTimeout(blinkCaret, 400);
    }

    // Typing...
    myEditor.area.onkeydown = function(e) {

        var sel = myEditor.selection();

        // `Shift + Tab` to outdent
        if (e.shiftKey && e.keyCode == 9) {
            myEditor.outdent('  ', updateSyntaxHighlighter);
            return false;
        }

        // `Tab` to indent
        if (e.keyCode == 9) {
            myEditor.indent('  ', updateSyntaxHighlighter);
            return false;
        }

        // `Backspace` was pressed
        if (e.keyCode == 8 && sel.value.length === 0 && sel.before.match(/(  |^)$/)) {
            var outdent = sel.before.replace(/  $/, "");
            myEditor.area.value = outdent + sel.value + sel.after;
            myEditor.select(outdent.length, outdent.length, updateSyntaxHighlighter);
            return false;
        }

        // Auto indent
        if (e.keyCode == 13) {
            var getIndentBefore = /(^|\n)( +)(.*?)$/.exec(sel.before),
                indentBefore = getIndentBefore ? getIndentBefore[2] : "";
            myEditor.insert('\n' + indentBefore, updateSyntaxHighlighter);
            return false;
        }

        updateSyntaxHighlighter();
    };

    myEditor.area.onmousedown = function(e) {
        L2.style.display = "block";
        updateSyntaxHighlighter();
    };

    myEditor.area.onmouseup = updateSyntaxHighlighter;

    myEditor.area.onblur = function() {
        L2.style.display = "none";
        updateSyntaxHighlighter();
    };

    updateSyntaxHighlighter();

    blinkCaret();

})();
