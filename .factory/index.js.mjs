import {B, D, H, R, W, getAttribute, hasClass, letClass, setClass} from '@taufik-nurrohman/document';
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

const name = 'TextEditor';

function getValue(self) {
    return (self.value || getAttribute(self, 'value') || "").replace(/\r/g, "");
}

function isDisabled(self) {
    return self.disabled;
}

function isReadOnly(self) {
    return self.readOnly;
}

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

    self['_' + name] = hook($, TextEditor.prototype);

    return $.attach(self, fromStates({}, TextEditor.state, isInteger(state) || isString(state) ? {
        tab: state
    } : (state || {})));

}

TextEditor.esc = esc;

TextEditor.state = {
    'n': 'text-editor',
    'tab': '\t',
    'with': []
};

TextEditor.S = function (start, end, value) {
    let $ = this,
        current = value.slice(start, end);
    $.after = value.slice(end);
    $.before = value.slice(0, start);
    $.end = end;
    $.length = toCount(current);
    $.start = start;
    $.value = current;
    $.toString = () => current;
};

TextEditor.version = '%(version)';

TextEditor.x = x;

Object.defineProperty(TextEditor, 'name', {
    value: name
});

let theValuePrevious;

function theEvent(e) {
    let self = this,
        $ = self['_' + name],
        type = e.type,
        value = getValue(self);
    if (value !== theValuePrevious) {
        theValuePrevious = value;
        $.fire('change');
    }
    $.fire(events[type] || type, [e]);
}

const $$ = TextEditor.prototype;

$$.$ = function () {
    let {self} = this;
    return new TextEditor.S(self.selectionStart, self.selectionEnd, getValue(self));
};

$$.attach = function (self, state) {
    let $ = this;
    self = self || $.self;
    if (state && (isInteger(state) || isString(state))) {
        state = {
            tab: state
        };
    }
    state = fromStates({}, $.state, state || {});
    if (hasClass(self, state.n + '__self')) {
        return $;
    }
    $._active = !isDisabled(self) && !isReadOnly(self);
    $._value = getValue(self);
    $.self = self;
    $.state = state;
    // Attach event(s)
    for (let event in events) {
        onEvent(event, self, theEvent);
    }
    setClass(self, state.n + '__self');
    // Attach extension(s)
    if (isSet(state) && isArray(state.with)) {
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

$$.blur = function () {
    return this.self.blur();
};

$$.detach = function () {
    let $ = this,
        {self, state} = $;
    if (!hasClass(self, state.n + '__self')) {
        return $;
    }
    $._active = false;
    // Detach event(s)
    for (let event in events) {
        offEvent(event, self, theEvent);
    }
    letClass(self, state.n + '__self');
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
    return $;
};

$$.focus = function (mode) {
    let $ = this,
        {_active, self} = $, x, y;
    if (!_active) {
        return self.focus(), $;
    }
    if (-1 === mode) {
        x = y = 0; // Put caret at the start of the editor, scroll to the start of the editor
    } else if (1 === mode) {
        x = toCount(getValue(self)); // Put caret at the end of the editor
        y = self.scrollHeight; // Scroll to the end of the editor
    }
    if (isSet(x) && isSet(y)) {
        self.selectionStart = self.selectionEnd = x;
        self.scrollTop = y;
    }
    return self.focus(), $;
};

$$.get = function () {
    let $ = this,
        {_active, self} = $;
    if (!_active) {
        return false;
    }
    return !isDisabled(self) && getValue(self) || null;
};

$$.insert = function (value, mode, clear) {
    let $ = this,
        from = /^[\s\S]*?$/;
    if (!$._active) {
        return $;
    }
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

$$.let = function () {
    let $ = this,
        {_active, self} = $;
    if (!_active) {
        return $;
    }
    return (self.value = $._value), $;
};

$$.match = function (pattern, then) {
    let $ = this,
        {after, before, value} = $.$();
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

$$.peel = function (open, close, wrap) {
    let $ = this,
        {after, before, value} = $.$();
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

$$.pull = function (by, withEmptyLines = true) {
    let $ = this,
        {state} = $,
        {before, end, length, start, value} = $.$();
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

$$.push = function (by, withEmptyLines = false) {
    let $ = this,
        {state} = $,
        {before, end, length, start} = $.$();
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

$$.replace = function (from, to, mode) {
    let $ = this,
        {after, before, value} = $.$();
    if (-1 === mode) { // Replace before
        before = before.replace(from, to);
    } else if (1 === mode) { // Replace after
        after = after.replace(from, to);
    } else { // Replace value
        value = value.replace(from, to);
    }
    return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
};

$$.select = function (...lot) {
    let $ = this,
        {_active, self} = $;
    if (!_active) {
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

$$.set = function (value) {
    let $ = this,
        {_active, self} = $;
    if (!_active) {
        return $;
    }
    return (self.value = value), $;
};

$$.trim = function (open, close, start, end, tidy = true) {
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
    let $ = this,
        {after, before, value} = $.$(),
        afterClean = trim(after, -1),
        beforeClean = trim(before, 1);
    after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
    before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
    if (false !== end) value = trim(value, 1);
    if (false !== start) value = trim(value, -1);
    return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
};

$$.wrap = function (open, close, wrap) {
    let $ = this,
        {after, before, value} = $.$();
    if (wrap) {
        return $.replace(/^[\s\S]*?$/, open + '$&' + close);
    }
    return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
};

Object.defineProperty($$, 'value', {
    get: function () {
        return this.self.value;
    },
    set: function (value) {
        this.self.value = value;
    }
});

export default TextEditor;