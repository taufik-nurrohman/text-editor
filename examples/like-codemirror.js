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
            var s = myEditor.selection();
            L1.innerHTML = '<pre class="prettyprint"><code>' + htmlEntities(myEditor.area.value) + '</code></pre>';
            prettyPrint(); // Trigger the Google Code Prettify
            L2.innerHTML = '<pre>' + htmlEntities(s.before + s.value) + '<span class="fake-caret"></span>' + htmlEntities(s.after) + '</pre>';
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

    // Typing ...
    myEditor.area.onkeydown = function(e) {

        var s = myEditor.selection(),
            k = myEditor.key(e);

        // `Shift + Tab` to outdent
        if (e.shiftKey && k === 'tab') {
            myEditor.outdent('  ', updateSyntaxHighlighter);
            return false;
        }

        // `Tab` to indent
        if (k === 'tab') {
            myEditor.indent('  ', updateSyntaxHighlighter);
            return false;
        }

        // `BackSpace` was pressed
        if (k === 'backspace' && s.value.length === 0 && s.before.match(/(  |^)$/)) {
            var outdent = s.before.replace(/  $/, "");
            myEditor.area.value = outdent + s.value + s.after;
            myEditor.select(outdent.length, outdent.length, updateSyntaxHighlighter);
            return false;
        }

        // Auto indent
        if (k === 'enter') {
            var getIndentBefore = /(^|\n)( +)(.*?)$/.exec(s.before),
                indentBefore = getIndentBefore ? getIndentBefore[2] : "";
            myEditor.insert('\n' + indentBefore, updateSyntaxHighlighter);
            return false;
        }

        updateSyntaxHighlighter();
    };

    myEditor.area.onfocus = function(e) {
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