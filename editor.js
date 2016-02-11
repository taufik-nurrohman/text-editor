/*!
 * --------------------------------------------------------------------
 *  SIMPLE TEXT SELECTION LIBRARY FOR ONLINE TEXT EDITING (2016-02-11)
 * --------------------------------------------------------------------
 *  https://github.com/tovic/simple-text-editor-library
 * --------------------------------------------------------------------
 *
 *    Author : Taufik Nurrohman
 *    URL    : http://latitudu.com
 *
 * --------------------------------------------------------------------
 *
 */


var Editor = function(source) {

    var base = this,
        win = window,
        doc = document,
        history = [];

    // Key maps for the deprecated `KeyboardEvent.keyCode`
    base.keys = {
        // control
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'control',
        18: 'alt',
        19: 'pause',
        20: 'capslock', // not working on `keypress`
        27: 'escape',
        33: 'pageup',
        34: 'pagedown',
        37: 'arrowleft',
        38: 'arrowup',
        39: 'arrowright',
        40: 'arrowdown',
        44: 'printscreen', // works only on `keyup` :(
        45: 'insert',
        46: 'delete',
        91: 'os',
        93: 'contextmenu',
        // function
        112: 'f1',
        113: 'f2',
        114: 'f3',
        115: 'f4',
        116: 'f5',
        117: 'f6',
        118: 'f7',
        119: 'f8',
        120: 'f9',
        121: 'f10',
        122: 'f11',
        123: 'f12',
        // number
        48: ['0', ')'],
        49: ['1', '!'],
        50: ['2', '@'],
        51: ['3', '#'],
        52: ['4', '$'],
        53: ['5', '%'],
        54: ['6', '^'],
        55: ['7', '&'],
        56: ['8', '*'],
        57: ['9', '('],
        // alphabet
        65: 'a',
        66: 'b',
        67: 'c',
        68: 'd',
        69: 'e',
        70: 'f',
        71: 'g',
        72: 'h',
        73: 'i',
        74: 'j',
        75: 'k',
        76: 'l',
        77: 'm',
        78: 'n',
        79: 'o',
        80: 'p',
        81: 'q',
        82: 'r',
        83: 's',
        84: 't',
        85: 'u',
        86: 'v',
        87: 'w',
        88: 'x',
        89: 'y',
        90: 'z',
        // symbol
        32: ' ',
        59: [';', ':'],
        61: ['=', '+'],
        173: ['-', '_'],
        188: [',', '<'],
        190: ['.', '>'],
        191: ['/', '?'],
        192: ['`', '~'],
        219: ['[', '{'],
        220: ['\\', '|'],
        221: [']', '}'],
        222: ['\'', '"']
    };

    // Index data
    base.index = {
        undo: 0,
        redo: 0
    };

    // Helpers
    function is_set(test) { return typeof test !== "undefined"; }
    function is_object(test) { return typeof test === "object"; }
    function is_function(test) { return typeof test === "function"; }

    // Current `<textarea>` element
    base.area = is_set(source) ? source : doc.getElementsByTagName('textarea')[0];

    // Escapes for `RegExp`
    base.escape = /([!$^*\(\)\-=+\[\]\{\}\\|:<>,.\/?])/g;

    // Load the first history data
    history[base.index.undo] = {
        value: base.area.value,
        start: 0,
        end: 0
    };


    /**
     * Return the typed character inside a `<textarea>`
     *
     * <code>
     *   var editor = new Editor(elem);
     *   elem.onkeydown = function(e) {
     *       alert(editor.key(e));
     *   };
     * </code>
     *
     */

    base.key = function(e, is) {

        var code = e.keyCode || e.which,
            out = null;

        // Use the `KeyboardEvent.key` API where possible
        if (is_set(e.key)) {
            out = e.key.toLowerCase();
        } else {
            out = base.keys[code] || null;
            if (is_object(out)) {
                out = e.shiftKey ? (out[1] || out[0]) : out[0];
            }
        }

        // Aliases
        var aliases = {
            'alternate': 'alt',
            'option': 'alt',
            'ctrl': 'control',
            'cmd': 'control',
            'command': 'control',
            'meta': 'control',
            'context': 'contextmenu',
            'return': 'enter',
            'ins': 'insert',
            'del': 'delete',
            'esc': 'escape',
            'home': 'pageup',
            'end': 'pagedown',
            'left': 'arrowleft',
            'up': 'arrowup',
            'right': 'arrowright',
            'down': 'arrowdown',
            'space': ' '
        };

        is = aliases[is] || is || null;

        return is ? out === is.toLowerCase() : out;

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

        var v = base.area.value.replace(/\r/g, ""),
            start = base.area.selectionStart,
            end = base.area.selectionEnd,
            data = {
                start: start,
                end: end,
                value: v.substring(start, end),
                before: v.substring(0, start),
                after: v.substring(end)
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

        var scHtml = doc.documentElement.scrollTop,
            scBody = doc.body.scrollTop,
            scTextarea = base.area.scrollTop,
            sel = base.selection();

        base.area.focus();

        // Restore selection with `editor.select()`
        if (!is_set(start)) {
            start = sel.start;
            end = sel.end;
        }

        // Allow moving caret position with `editor.select(7)`
        if (!is_set(end)) {
            end = start;
        }

        // Allow callback function after moving caret position with `editor.select(7, function() {})`
        if (is_function(end) || end === true) {
            callback = end;
            end = start;
        }

        base.area.setSelectionRange(start, end);

        doc.documentElement.scrollTop = scHtml;
        doc.body.scrollTop = scBody;
        base.area.scrollTop = scTextarea;

        // NOTE: `select` method doesn't populate history data by default
        if (callback === true) {
            base.updateHistory();
        } else if (is_function(callback)) {
            callback();
        }

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

    base.replace = function(frm, to, callback) {

        var sel = base.selection(),
            start = sel.start,
            end = sel.end,
            value = sel.value.replace(frm, to);

        base.area.value = sel.before + value + sel.after;

        base.select(start, start + value.length, callback || true);

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

        base.select(start + str.length, callback || true);

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

    base.wrap = function(open, close, callback, wrapAll) {

        var sel = base.selection(),
            value = sel.value,
            before = sel.before,
            after = sel.after;

        if (wrapAll) {
            base.replace(/^([\s\S]*?)$/, open + '$1' + close);
        } else {
            base.area.value = before + open + value + close + after;
            base.select((before + open).length, (before + open + value).length, callback || true);
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

            base.select(sel.start + str.length, callback || true);

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

    base.outdent = function(str, callback, strIsRegExp) {

        var sel = base.selection(),
            regex = strIsRegExp ? str : str.replace(base.escape, '\\$1');

        if (sel.value.length > 0) { // multi-line

            base.replace(new RegExp('(^|\n)' + regex, 'g'), '$1', callback);

        } else { // single-line

            var before = sel.before.replace(new RegExp(regex + '$'), "");

            base.area.value = before + sel.value + sel.after;

            base.select(before.length, callback || true);

        }

    };


    /**
     * Call available history data
     *
     * <code>
     *   var editor = new Editor(elem);
     *   alert(editor.callHistory(2).value);
     *   alert(editor.callHistory(2).start);
     *   alert(editor.callHistory(2).end);
     * </code>
     *
     */

    base.callHistory = function(index) {

        return index ? history[index] : history;

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
            value = is_set(data) ? data : {
            value: base.area.value,
            start: sel.start,
            end: sel.end
        };

        base.index.undo++;

        history[index ? index : base.index.undo] = value;

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

        base.select(data.start, data.end, callback);

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

        base.select(data.start, data.end, callback);

    };

};