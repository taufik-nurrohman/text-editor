import {B, D, H, R, W} from '@taufik-nurrohman/document';
import {fromStates} from '@taufik-nurrohman/from';
import {isArray, isFunction, isInstance, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {esc, fromPattern, toPattern, x} from '@taufik-nurrohman/pattern';
import {toCount, toObjectCount} from '@taufik-nurrohman/to';

let name = 'TextEditor';

function trim(str, dir) {
    return (str || "")['trim' + (-1 === dir ? 'Left' : 1 === dir ? 'Right' : "")]();
}

function TextEditor(self, state = {}) {

    const $ = this;

    if (!self) {
        return $;
    }

    // Already instantiated, skip!
    if (self[name]) {
        return self[name];
    }

    // Return new instance if `TextEditor` was called without the `new` operator
    if (!isInstance($, TextEditor)) {
        return new TextEditor(self, state);
    }

    $.state = state = fromStates({}, TextEditor.state, isString(state) ? {
        tab: state
    } : (state || {}));

    // The `<textarea>` element
    $.self = $.source = self;

    // Store current instance to `TextEditor.instances`
    TextEditor.instances[self.id || self.name || toObjectCount(TextEditor.instances)] = $;

    // Mark current DOM as active text editor to prevent duplicate instance
    self[name] = $;

    let any = /^([\s\S]*?)$/, // Any character(s)
        isDisabled = () => self.disabled,
        isReadOnly = () => self.readOnly,
        theValue = () => self.value.replace(/\r/g, "");

    // The initial value
    $.value = theValue();

    // Get value
    $.get = () => !isDisabled() && theValue() || null;

    // Reset to the initial value
    $.let = () => ((self.value = $.value), $);

    // Set value
    $.set = value => {
        if (isDisabled() || isReadOnly()) {
            return $;
        }
        return (self.value = value), $;
    };

    // Get selection
    $.$ = () => {
        return new TextEditor.S(self.selectionStart, self.selectionEnd, theValue());
    };

    $.focus = mode => {
        let x, y;
        if (-1 === mode) {
            x = y = 0; // Put caret at the start of the editor, scroll to the start of the editor
        } else if (1 === mode) {
            x = toCount(theValue()); // Put caret at the end of the editor
            y = self.scrollHeight; // Scroll to the end of the editor
        }
        if (isSet(x) && isSet(y)) {
            self.selectionStart = self.selectionEnd = x;
            self.scrollTop = y;
        }
        return self.focus(), $;
    };

    // Blur from the editor
    $.blur = () => (self.blur(), $);

    // Select value
    $.select = (...lot) => {
        if (isDisabled() || isReadOnly()) {
            return self.focus(), $;
        }
        let count = toCount(lot),
            {start, end} = $.$(),
            x, y, X, Y;
        x = W.pageXOffset || R.scrollLeft || B.scrollLeft;
        y = W.pageYOffset || R.scrollTop || B.scrollTop;
        X = self.scrollLeft;
        Y = self.scrollTop;
        if (0 === count) { // Restore selection with `$.select()`
            lot[0] = start;
            lot[1] = end;
        } else if (1 === count) { // Move caret position with `$.select(7)`
            if (true === lot[0]) { // Select all with `$.select(true)`
                return self.focus(), self.select(), $;
            }
            lot[1] = lot[0];
        }
        self.focus();
        // Default `$.select(7, 100)`
        self.selectionStart = lot[0];
        self.selectionEnd = lot[1];
        self.scrollLeft = X;
        self.scrollTop = Y;
        return W.scroll(x, y), $;
    };

    // Match at selection
    $.match = (pattern, then) => {
        let {after, before, value} = $.$();
        if (isArray(pattern)) {
            let m = [
                before.match(pattern[0]),
                value.match(pattern[1]),
                after.match(pattern[2])
            ];
            return isFunction(then) ? then.call($, m[0] || [], m[1] || [], m[2] || []) : [!!m[0], !!m[1], !!m[2]];
        }
        let m = value.match(pattern);
        return isFunction(then) ? then.call($, m || []) : !!m;
    };

    // Replace at selection
    $.replace = (from, to, mode) => {
        let {after, before, value} = $.$();
        if (-1 === mode) { // Replace before
            before = before.replace(from, to);
        } else if (1 === mode) { // Replace after
            after = after.replace(from, to);
        } else { // Replace value
            value = value.replace(from, to);
        }
        return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
    };

    // Insert/replace at caret
    $.insert = (value, mode, clear) => {
        let from = any;
        if (clear) {
            $.replace(from, ""); // Force to delete selection on insert before/after?
        }
        if (-1 === mode) { // Insert before
            from = /$/;
        } else if (1 === mode) { // Insert after
            from = /^/;
        }
        return $.replace(from, value, mode);
    };

    // Wrap current selection
    $.wrap = (open, close, wrap) => {
        let {after, before, value} = $.$();
        if (wrap) {
            return $.replace(any, open + '$1' + close);
        }
        return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
    };

    // Unwrap current selection
    $.peel = (open, close, wrap) => {
        let {after, before, value} = $.$();
        open = esc(open);
        close = esc(close);
        let openPattern = toPattern(open + '$', ""),
            closePattern = toPattern('^' + close, "");
        if (wrap) {
            return $.replace(toPattern('^' + open + '([\\s\\S]*?)' + close + '$', ""), '$1');
        }
        if (openPattern.test(before) && closePattern.test(after)) {
            before = before.replace(openPattern, "");
            after = after.replace(closePattern, "");
            return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
        }
        return $.select();
    };

    $.pull = (by, includeEmptyLines = true) => {
        let {before, end, length, start, value} = $.$();
        by = isSet(by) ? by : state.tab;
        if ("" !== before && '\n' !== before.slice(-1) && by !== before.slice(-toCount(by))) {
            // Move cursor to the start of the line
            $.select(start = start - toCount(before.split('\n').pop()), length ? end : start);
        }
        by = esc(by);
        if (length) {
            if (includeEmptyLines) {
                return $.replace(toPattern('^' + by, 'gm'), "");
            }
            return $.insert(value.split('\n').map(v => {
                if (toPattern('^(' + by + ')*$', "").test(v)) {
                    return v;
                }
                return v.replace(toPattern('^' + by, ""), "");
            }).join('\n'));
        }
        return $.replace(toPattern(by + '$', ""), "", -1);
    };

    $.push = (by, includeEmptyLines = false) => {
        let {before, end, length, start} = $.$();
        by = isSet(by) ? by : state.tab;
        if ("" !== before && '\n' !== before.slice(-1) && by !== before.slice(-toCount(by))) {
            // Move cursor to the start of the line
            $.select(start = start - toCount(before.split('\n').pop()), length ? end : start);
        }
        if (length) {
            return $.replace(toPattern('^' + (includeEmptyLines ? "" : '(?!$)'), 'gm'), by);
        }
        return $.insert(by, -1);
    };

    $.trim = (open, close, start, end, tidy = true) => {
        if (null !== open && false !== open) {
            open = open || "";
        }
        if (null !== close && false !== close) {
            close = close || "";
        }
        if (null !== start && false !== start) {
            start = start || "";
        }
        if (null !== end && false !== end) {
            end = end || "";
        }
        let {before, value, after} = $.$(),
            beforeClean = trim(before, 1),
            afterClean = trim(after, -1);
        before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
        after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
        if (false !== start) value = trim(value, -1);
        if (false !== end) value = trim(value, 1);
        return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
    };

    // Destructor
    $.pop = () => {
        if (!self[name]) {
            return $; // Already ejected!
        }
        if (isArray(state.with)) {
            for (let i = 0, j = toCount(state.with); i < j; ++i) {
                let value = state.with[i];
                if (isString(value)) {
                    value = TextEditor[value];
                }
                if (isObject(value) && isFunction(value.detach)) {
                    value.detach.call($, self, state);
                    continue;
                }
            }
        }
        delete TextEditor.instances[self.id || self.name || toObjectCount(TextEditor.instances) - 1];
        delete self[name];
        return $;
    };

    if (isArray(state.with)) {
        for (let i = 0, j = toCount(state.with); i < j; ++i) {
            let value = state.with[i];
            if (isString(value)) {
                value = TextEditor[value];
            }
            // `const Extension = function (self, state = {}) {}`
            if (isFunction(value)) {
                value.call($, self, state);
                continue;
            }
            // `const Extension = {attach: function (self, state = {}) {}, detach: function (self, state = {}) {}}`
            if (isObject(value) && isFunction(value.attach)) {
                value.attach.call($, self, state);
                continue;
            }
        }
    }

    return $;

}

TextEditor.esc = esc;

TextEditor.instances = {};

TextEditor.state = {
    'tab': '\t',
    'with': []
};

TextEditor.S = function (a, b, c) {
    let t = this,
        d = c.slice(a, b);
    t.after = c.slice(b);
    t.before = c.slice(0, a);
    t.end = b;
    t.length = toCount(d);
    t.start = a;
    t.value = d;
    t.toString = () => d;
};

TextEditor.version = '4.0.2';

TextEditor.x = x;

export default TextEditor;