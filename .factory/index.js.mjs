import {B, D, H, R, W} from '@taufik-nurrohman/document';
import {esc, fromPattern, toPattern, x} from '@taufik-nurrohman/pattern';
import {fromStates} from '@taufik-nurrohman/from';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFunction, isInstance, isInteger, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, onEvent} from '@taufik-nurrohman/event';
import {toCount, toObjectCount} from '@taufik-nurrohman/to';

const events = {
    blur: 0,
    click: 0,
    copy: 0,
    cut: 0,
    focus: 0,
    input: 0,
    keydown: 'key.down',
    keyup: 'key.up',
    mousedown: 'mouse.down',
    mouseenter: 'mouse.enter',
    mouseleave: 'mouse.exit',
    mousemove: 'mouse.move',
    mouseup: 'mouse.up',
    paste: 0,
    scroll: 0,
    touchend: 'mouse.up',
    touchmove: 'mouse.move',
    touchstart: 'mouse.down',
    wheel: 'scroll'
};

function trim(str, dir) {
    return (str || "")['trim' + (-1 === dir ? 'Left' : 1 === dir ? 'Right' : "")]();
}

function TextEditor(self, state) {

    const $ = this;

    if (!self) {
        return $;
    }

    // Return new instance if `TextEditor` was called without the `new` operator
    if (!isInstance($, TextEditor)) {
        return new TextEditor(self, state);
    }

    let any = /^([\s\S]*?)$/, // Any character(s)
        isDisabled = () => self.disabled,
        isReadOnly = () => self.readOnly,
        theValue = () => self.value.replace(/\r/g, ""),
        theValuePrevious = theValue();

    $.attach = () => {
        const {fire} = hook($);
        const theEvent = e => {
            let type = e.type,
                value = theValue();
            if (value !== theValuePrevious) {
                theValuePrevious = value;
                fire('change', [e]);
            }
            fire(events[type] || type, [e]);
        };
        $.$ = () => {
            return new TextEditor.S(self.selectionStart, self.selectionEnd, theValue());
        };
        $.blur = () => (self.blur(), $);
        $.detach = () => {
            // Detach event(s)
            theValuePrevious = theValue();
            for (let event in events) {
                offEvent(event, self, theEvent);
            }
            // Detach extension(s)
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
            for (let key in $) {
                if ('attach' === key) {
                    continue;
                }
                delete $[key];
            }
            return $;
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
        $.get = () => !isDisabled() && theValue() || null;
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
        $.let = () => ((self.value = $.value), $);
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
        $.pull = (by, withEmptyLines = true) => {
            let {before, end, length, start, value} = $.$();
            if (isInteger(by = isSet(by) ? by : state.tab)) {
                by = ' '.repeat(by);
            }
            if ("" !== before && '\n' !== before.slice(-1) && by !== before.slice(-toCount(by))) {
                // Move cursor to the start of the line
                $.select(start = start - toCount(before.split('\n').pop()), length ? end : start);
            }
            by = esc(by);
            if (length) {
                if (withEmptyLines) {
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
        $.push = (by, withEmptyLines = false) => {
            let {before, end, length, start} = $.$();
            if (isInteger(by = isSet(by) ? by : state.tab)) {
                by = ' '.repeat(by);
            }
            if ("" !== before && '\n' !== before.slice(-1) && by !== before.slice(-toCount(by))) {
                // Move cursor to the start of the line
                $.select(start = start - toCount(before.split('\n').pop()), length ? end : start);
            }
            if (length) {
                return $.replace(toPattern('^' + (withEmptyLines ? "" : '(?!$)'), 'gm'), by);
            }
            return $.insert(by, -1);
        };
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
        $.self = self;
        $.set = value => {
            if (isDisabled() || isReadOnly()) {
                return $;
            }
            return (self.value = value), $;
        };
        $.state = state = fromStates({}, TextEditor.state, isInteger(state) || isString(state) ? {
            tab: state
        } : (state || {}));
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
            let {after, before, value} = $.$(),
                afterClean = trim(after, -1),
                beforeClean = trim(before, 1);
            after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
            before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
            if (false !== end) value = trim(value, 1);
            if (false !== start) value = trim(value, -1);
            return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
        };
        $.value = theValue();
        $.wrap = (open, close, wrap) => {
            let {after, before, value} = $.$();
            if (wrap) {
                return $.replace(any, open + '$1' + close);
            }
            return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
        };
        // Attach event(s)
        for (let event in events) {
            onEvent(event, self, theEvent);
        }
        // Attach extension(s)
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
    };

    return $.attach();

}

TextEditor.esc = esc;

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

TextEditor.version = '%(version)';

TextEditor.x = x;

export default TextEditor;