/*!
 * -------------------------------------------------------
 *  SIMPLE TEXT SELECTION LIBRARY FOR ONLINE TEXT EDITING
 * -------------------------------------------------------
 *
 * Author => Taufik Nurrohman
 * URL => http://www.dte.web.id, http://latitudu.com
 *
 */


var Editor = function(source) {

    var base = this,
        history = [],
        undo = 0,
        redo = null;

    base.area = typeof source != "undefined" ? source : document.getElementsByTagName('textarea')[0];

    history[undo] = {
        value: base.area.value,
        selectionStart: 0,
        selectionEnd: 0
    };

    undo++;


    /**
     * Collect data from selected text inside a textarea
     *
     * <code>
     *   var editor = new Editor(elem);
     *   elem.onmouseup = function() {
     *       alert(editor.selection().start);
     *       alert(editor.selection().end);
     *       alert(editor.selection().value);
     *   };
     * </code>
     *
     */

    base.selection = function() {

        var start = base.area.selectionStart,
            end = base.area.selectionEnd,
            value = base.area.value.substring(start, end),
            before = base.area.value.substring(0, start),
            after = base.area.value.substring(end),
            data = {
                start: start,
                end: end,
                value: value,
                before: before,
                after: after
            };

        // console.log(data);

        return data;

    };


    /**
     * Select portion of text inside a textarea
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.select(7, 11);
     * </code>
     *
     */

    base.select = function(start, end, callback) {

        base.area.focus();

        base.area.setSelectionRange(start, end);

        if (typeof callback == "function") callback();

    };


    /**
     * Replace portion of selected text inside a textarea with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.replace(/foo/, "bar");
     * </code>
     *
     */

    base.replace = function(from, to, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end,
            selections = sel.value.replace(from, to);

        base.area.value = sel.before + selections + sel.after;

        base.select(start, start + selections.length);

        if (typeof callback == "function") {
            callback();
        } else {
            base.updateHistory({
                value: base.area.value,
                selectionStart: start,
                selectionEnd: start + selections.length
            });
        }

    };


    /**
     * Replace selected text inside a textarea with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.insert('foo');
     * </code>
     *
     */

    base.insert = function(insertion, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end;

        base.area.value = sel.before + insertion + sel.after;

        base.select(start + insertion.length, start + insertion.length);

        if (typeof callback == "function") {
            callback();
        } else {
            base.updateHistory({
                value: base.area.value,
                selectionStart: start + insertion.length,
                selectionEnd: start + insertion.length
            });
        }

    };


    /**
     * Wrap selected text inside a textarea with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.wrap('<strong>', '</strong>');
     * </code>
     *
     */

    base.wrap = function(open, close, callback) {

        var sel = base.selection(),
            selections = sel.value,
            before = sel.before,
            after = sel.after;

        base.area.value = before + open + selections + close + after;

        base.select(before.length + open.length, before.length + open.length + selections.length);

        if (typeof callback == "function") {
            callback();
        } else {
            base.updateHistory({
                value: base.area.value,
                selectionStart: before.length + open.length,
                selectionEnd: before.length + open.length + selections.length
            });
        }

    };


    /**
     * Indent selected text inside a textarea with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.indent('\t');
     * </code>
     *
     */

    base.indent = function(chars, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end,
            selections = sel.value.split('\n');

        for (var i = 0, len = selections.length; i < len; ++i) {
            selections[i] = chars + selections[i];
        }

        base.area.value = sel.before + selections.join('\n') + sel.after;

        var selectEnd = end + (chars.length * selections.length);

        if (start == end) {

            base.select(selectEnd, selectEnd);

            if (typeof callback == "function") {
                callback();
            } else {
                base.updateHistory({
                    value: base.area.value,
                    selectionStart: selectEnd,
                    selectionEnd: selectEnd
                });
            }

        } else {

            base.select(start, selectEnd);

            if (typeof callback == "function") {
                callback();
            } else {
                base.updateHistory({
                    value: base.area.value,
                    selectionStart: start,
                    selectionEnd: selectEnd
                });
            }

        }

    };


    /**
     * Outdent selected text inside a textarea from something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.outdent('\t');
     * </code>
     *
     */

    base.outdent = function(chars, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end,
            val = base.area.value,
            pattern = new RegExp("^" + chars),
            edits = 0;

        if (start == end) { // Single line

            while (start > 0) {
                if (val.charAt(start) == '\n') {
                    start++;
                    break;
                }
                start--;
            }

            var portion = val.substring(start, end),
                matches = portion.match(pattern);

            if (matches) {
                base.area.value = val.substring(0, start) + portion.replace(pattern, "") + val.substring(end);
                end--;
            }

            var selectEnd = end <= start ? end : end - chars.length + 1;

            base.select(selectEnd, selectEnd);

            if (typeof callback == "function") {
                callback();
            } else {
                base.updateHistory({
                    value: base.area.value,
                    selectionStart: selectEnd,
                    selectionEnd: selectEnd
                });
            }

        } else { // Multi line

            var selections = sel.value.split('\n');

            for (var i = 0, len = selections.length; i < len; ++i) {
                if (selections[i].match(pattern)) {
                    edits++;
                    selections[i] = selections[i].replace(pattern, "");
                }
            }

            base.area.value = sel.before + selections.join('\n') + sel.after;

            base.select(start, (edits > 0 ? end - (chars.length * edits) : end));

            if (typeof callback == "function") {
                callback();
            } else {
                base.updateHistory({
                    value: base.area.value,
                    selectionStart: start,
                    selectionEnd: edits > 0 ? end - (chars.length * edits) : end
                });
            }

        }

    };


    /**
     * Call available history data
     *
     * <code>
     *   var editor = new Editor(elem);
     *   alert(editor.callHistory(2).value);
     *   alert(editor.callHistory(2).selectionStart);
     *   alert(editor.callHistory(2).selectionEnd);
     * </code>
     *
     */

    base.callHistory = function(index) {

        return (typeof index == "number") ? history[index] : history;

    };


    /**
     * Update history data
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.area.onkeydown = function() {
     *       editor.updateHistory();
     *   };
     * </code>
     *
     */

    base.updateHistory = function(data, index) {

        var value = (typeof data != "undefined") ? data : {
            value: base.area.value,
            selectionStart: base.selection().start,
            selectionEnd: base.selection().end
        };

        history[typeof index == "number" ? index : undo] = value;

        undo++;

    };


    /**
     * Undo from previous action or previous Redo
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.undo();
     * </code>
     *
     */

    base.undo = function(callback) {

        if (history.length > 1) {

            if (undo > 1) {
                undo--;
            } else {
                undo = 1;
            }

            var data = base.callHistory(undo - 1);

            redo = undo <= 0 ? undo - 1 : undo;

        } else {

            return;

        }

        base.area.value = data.value;

        base.select(data.selectionStart, data.selectionEnd);

        // console.log(undo);

        if (typeof callback == "function") callback();

    };


    /**
     * Redo from previous Undo
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.redo();
     * </code>
     *
     */

    base.redo = function(callback) {

        if (redo !== null) {

            var data = base.callHistory(redo);

            if (redo < history.length - 1) {
                redo++;
            } else {
                redo = history.length - 1;
            }

            undo = redo >= history.length - 1 ? redo + 1 : redo;

        } else {

            return;

        }

        base.area.value = data.value;

        base.select(data.selectionStart, data.selectionEnd);

        // console.log(redo);

        if (typeof callback == "function") callback();

    };

};
