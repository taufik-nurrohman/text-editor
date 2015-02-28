/*!
 * --------------------------------------------------------------------
 *  SIMPLE TEXT SELECTION LIBRARY FOR ONLINE TEXT EDITING (2015-02-28)
 * --------------------------------------------------------------------
 *
 *    Author => Taufik Nurrohman
 *    URL => http://www.dte.web.id, http://latitudu.com
 *
 * --------------------------------------------------------------------
 *
 */


var Editor = function(source) {

    var base = this,
        win = window,
        doc = document,
        history = [];

    // Index data
    base.index = {
        undo: 0,
        redo: 0
    };

    // Current `<textarea>` element
    base.area = typeof source !== "undefined" ? source : doc.getElementsByTagName('textarea')[0];

    // Escapes for `RegExp`
    base.escape = /([!$^*\(\)\-=+\[\]\{\}\\|:<>,.\/?])/g;

    // Load the first history data
    history[base.index.undo] = {
        value: base.area.value,
        selectionStart: 0,
        selectionEnd: 0
    };


    /**
     * Collect data from selected text inside a `<textarea>`
     *
     * <code>
     *   var editor = new Editor(elem);
     *   elem.onmouseup = function() {
     *       alert(editor.selection().start);
     *       alert(editor.selection().end);
     *       alert(editor.selection().value);
     *       alert(editor.selection().before);
     *       alert(editor.selection().after);
     *   };
     * </code>
     *
     */

    base.selection = function() {

        var v = base.area.value,
            start = base.area.selectionStart,
            end = base.area.selectionEnd,
            value = v.substring(start, end),
            before = v.substring(0, start),
            after = v.substring(end),
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
     * Select portion of text inside a `<textarea>`
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.select(7, 11);
     * </code>
     *
     */

    base.select = function(start, end, callback) {

        var sHTML = doc.documentElement.scrollTop,
            sBODY = doc.body.scrollTop,
            sTEXTAREA = base.area.scrollTop,
            sel = base.selection();

        base.area.focus();

        // Restore selection with `editor.select()`
        if (arguments.length === 0) {
            start = sel.start;
            end = sel.end;
        }

        // Allow moving caret position with `editor.select(7)`
        if (typeof end === "undefined") {
            end = start;
        }

        // Allow callback function after moving caret position with `editor.select(7, function() {})`
        if (typeof end === "function" && typeof callback === "undefined") {
            callback = end;
            end = start;
        }

        base.area.setSelectionRange(start, end);

        doc.documentElement.scrollTop = sHTML;
        doc.body.scrollTop = sBODY;
        base.area.scrollTop = sTEXTAREA;

        if (typeof callback === "function") callback();

        // NOTE: `select` method doesn't populate history data

    };


    /**
     * Replace portion of selected text inside a `<textarea>` with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.replace(/foo/g, 'bar');
     * </code>
     *
     */

    base.replace = function(from, to, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end,
            value = sel.value.replace(from, to);

        base.area.value = sel.before + value + sel.after;

        base.select(start, start + value.length);

        if (typeof callback === "function") {
            callback();
        } else {
            base.updateHistory({
                value: base.area.value,
                selectionStart: start,
                selectionEnd: start + value.length
            });
        }

    };


    /**
     * Replace selected text inside a `<textarea>` with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.insert('foo');
     * </code>
     *
     */

    base.insert = function(str, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end;

        base.area.value = sel.before + str + sel.after;

        base.select(start + str.length);

        if (typeof callback === "function") {
            callback();
        } else {
            base.updateHistory({
                value: base.area.value,
                selectionStart: start + str.length,
                selectionEnd: start + str.length
            });
        }

    };


    /**
     * Wrap selected text inside a `<textarea>` with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.wrap('<strong>', '</strong>');
     * </code>
     *
     */

    base.wrap = function(open, close, callback) {

        var sel = base.selection(),
            value = sel.value,
            before = sel.before,
            after = sel.after;

        base.area.value = before + open + value + close + after;

        base.select(before.length + open.length, before.length + open.length + value.length);

        if (typeof callback === "function") {
            callback();
        } else {
            base.updateHistory({
                value: base.area.value,
                selectionStart: before.length + open.length,
                selectionEnd: before.length + open.length + value.length
            });
        }

    };


    /**
     * Indent selected text inside a `<textarea>` with something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.indent('\t');
     * </code>
     *
     */

    base.indent = function(str, callback) {

        var sel = base.selection();

        if (sel.value.length > 0) { // multi-line

            base.replace(/(^|\n)([^\n])/g, '$1' + str + '$2', callback);

        } else { // single-line

            base.area.value = sel.before + str + sel.value + sel.after;

            base.select(sel.start + str.length);

            if (typeof callback === "function") {
                callback();
            } else {
                base.updateHistory({
                    value: base.area.value,
                    selectionStart: sel.start + str.length,
                    selectionEnd: sel.start + str.length
                });
            }

        }

    };


    /**
     * Outdent selected text inside a `<textarea>` from something
     *
     * <code>
     *   var editor = new Editor(elem);
     *   editor.outdent('\t');
     * </code>
     *
     */

    base.outdent = function(str, callback, regex) {

        var sel = base.selection(),
            str_regex = str.replace(base.escape, '\\$1'),
            regex = regex && regex !== false ? str : str_regex;

        if (sel.value.length > 0) { // multi-line

            base.replace(new RegExp('(^|\n)' + regex, 'g'), '$1', callback);

        } else { // single-line

            var before = sel.before.replace(new RegExp(regex + '$'), "");

            base.area.value = before + sel.value + sel.after;

            base.select(before.length);

            if (typeof callback === "function") {
                callback();
            } else {
                base.updateHistory({
                    value: base.area.value,
                    selectionStart: before.length,
                    selectionEnd: before.length
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

        return (typeof index === "number") ? history[index] : history;

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

        var sel = base.selection(),
            value = (typeof data !== "undefined") ? data : {
            value: base.area.value,
            selectionStart: sel.start,
            selectionEnd: sel.end
        };

        base.index.undo++;

        history[typeof index === "number" ? index : base.index.undo] = value;

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

        if (base.index.undo > 0) {
            base.index.undo--;
        } else {
            base.index.undo = 0;
        }

        // console.log('undo: ' + base.index.undo);

        base.index.redo = base.index.undo;

        var data = history[base.index.undo];

        base.area.value = data.value;

        base.select(data.selectionStart, data.selectionEnd);

        if (typeof callback === "function") callback();

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

        if (base.index.redo < history.length - 1) {
            base.index.redo++;
        } else {
            base.index.redo = history.length - 1;
        }

        // console.log('redo: ' + base.index.redo);

        base.index.undo = base.index.redo;

        var data = history[base.index.redo];

        base.area.value = data.value;

        base.select(data.selectionStart, data.selectionEnd);

        if (typeof callback === "function") callback();

    };

};