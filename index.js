/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2024 Taufik Nurrohman <https://github.com/taufik-nurrohman>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function (g, f) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = f() : typeof define === 'function' && define.amd ? define(f) : (g = typeof globalThis !== 'undefined' ? globalThis : g || self, g.TextEditor = f());
})(this, (function () {
    'use strict';
    var hasValue = function hasValue(x, data) {
        return -1 !== data.indexOf(x);
    };
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of, exact) {
        if (!x || 'object' !== typeof x) {
            return false;
        }
        if (exact) {
            return isSet(of) && isSet(x.constructor) && of === x.constructor;
        }
        return isSet(of) && x instanceof of ;
    };
    var isInteger = function isInteger(x) {
        return isNumber(x) && 0 === x % 1;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if (!x || 'object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object, 1) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var isString = function isString(x) {
        return 'string' === typeof x;
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var _fromStates = function fromStates() {
        for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
            lot[_key] = arguments[_key];
        }
        var out = lot.shift();
        for (var i = 0, j = toCount(lot); i < j; ++i) {
            for (var k in lot[i]) {
                // Assign value
                if (!isSet(out[k])) {
                    out[k] = lot[i][k];
                    continue;
                }
                // Merge array
                if (isArray(out[k]) && isArray(lot[i][k])) {
                    out[k] = [ /* Clone! */ ].concat(out[k]);
                    for (var ii = 0, jj = toCount(lot[i][k]); ii < jj; ++ii) {
                        if (!hasValue(lot[i][k][ii], out[k])) {
                            out[k].push(lot[i][k][ii]);
                        }
                    }
                    // Merge object recursive
                } else if (isObject(out[k]) && isObject(lot[i][k])) {
                    out[k] = _fromStates({
                        /* Clone! */ }, out[k], lot[i][k]);
                    // Replace value
                } else {
                    out[k] = lot[i][k];
                }
            }
        }
        return out;
    };
    var D = document;
    var W = window;
    var B = D.body;
    var R = D.documentElement;
    var hasClass = function hasClass(node, value) {
        return node.classList.contains(value);
    };
    var letClass = function letClass(node, value) {
        return node.classList.remove(value), node;
    };
    var setClass = function setClass(node, value) {
        return node.classList.add(value), node;
    };
    var esc = function esc(pattern, extra) {
        if (extra === void 0) {
            extra = "";
        }
        return pattern.replace(toPattern('[' + extra + x.replace(/./g, '\\$&') + ']'), '\\$&');
    };
    var isPattern = function isPattern(pattern) {
        return isInstance(pattern, RegExp);
    };
    var toPattern = function toPattern(pattern, opt) {
        if (isPattern(pattern)) {
            return pattern;
        }
        return new RegExp(pattern, isSet(opt) ? opt : 'g');
    };
    var x = "!$^*()+=[]{}|:<>,.?/-";

    function hook($, $$) {
        $$ = $$ || $;
        $$.fire = function (event, data, that) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[event])) {
                return $;
            }
            hooks[event].forEach(function (then) {
                return then.apply(that || $, data);
            });
            return $;
        };
        $$.off = function (event, then) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(event)) {
                return hooks = {}, $;
            }
            if (isSet(hooks[event])) {
                if (isSet(then)) {
                    var j = hooks[event].length;
                    // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[event];
                    } else {
                        for (var i = 0; i < j; ++i) {
                            if (then === hooks[event][i]) {
                                hooks[event].splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    delete hooks[event];
                }
            }
            return $;
        };
        $$.on = function (event, then) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[event])) {
                hooks[event] = [];
            }
            if (isSet(then)) {
                hooks[event].push(then);
            }
            return $;
        };
        return $.hooks = {}, $;
    }
    var offEvent = function offEvent(name, node, then) {
        node.removeEventListener(name, then);
    };
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };
    var events = {
        blur: 0,
        click: 0,
        copy: 0,
        cut: 0,
        focus: 0,
        input: 0,
        keydown: 'key.down',
        keyup: 'key.up',
        mousedown: 'caret.down',
        mouseenter: 'caret.enter',
        mouseleave: 'caret.exit',
        mousemove: 'caret.move',
        mouseup: 'caret.up',
        paste: 0,
        scroll: 0,
        select: 0,
        touchend: 'caret.up',
        touchmove: 'caret.move',
        touchstart: 'caret.down',
        wheel: 'scroll'
    };
    var name = 'TextEditor';
    var references = new WeakMap();

    function getReference(key) {
        return getValueInMap(key, references) || null;
    }

    function getValue(self) {
        return (self.value || "").replace(/\r/g, "");
    }

    function getValueInMap(k, map) {
        return map.get(k);
    }

    function isDisabled(self) {
        return self.disabled;
    }

    function isReadOnly(self) {
        return self.readOnly;
    }

    function setReference(key, value) {
        return setValueInMap(key, value, references);
    }

    function setValue(self, value) {
        self.value = value;
    }

    function setValueInMap(k, v, map) {
        return map.set(k, v);
    }

    function trim(str, dir) {
        return (str || "")['trim' + (-1 === dir ? 'Left' : 1 === dir ? 'Right' : "")]();
    }

    function TextEditor(self, state) {
        var $ = this;
        if (!self) {
            return $;
        }
        // Return new instance if `TextEditor` was called without the `new` operator
        if (!isInstance($, TextEditor)) {
            return new TextEditor(self, state);
        }
        setReference(self, hook($, TextEditor.prototype));
        return $.attach(self, _fromStates({}, TextEditor.state, isInteger(state) || isString(state) ? {
            tab: state
        } : state || {}));
    }
    TextEditor.esc = esc;
    TextEditor.from = function (self, state) {
        return new TextEditor(self, state);
    };
    TextEditor.of = getReference;
    TextEditor.state = {
        'n': 'text-editor',
        'tab': '\t',
        'with': []
    };
    TextEditor.version = '4.2.5';
    TextEditor.x = x;
    var S = function S(start, end, value) {
        var $ = this,
            current = value.slice(start, end);
        $.after = value.slice(end);
        $.before = value.slice(0, start);
        $.end = end;
        $.length = toCount(current);
        $.start = start;
        $.value = current;
    };
    S.prototype.toString = function () {
        return this.value;
    };
    TextEditor.S = S;
    Object.defineProperty(TextEditor, 'name', {
        value: name
    });
    var theValuePrevious;

    function theEvent(e) {
        var self = this,
            $ = getReference(self),
            type = e.type,
            value = getValue(self);
        if (value !== theValuePrevious) {
            theValuePrevious = value;
            $.fire('change');
        }
        $.fire(events[type] || type, [e]);
    }
    var $$ = TextEditor.prototype;
    $$.$ = function () {
        var self = this.self;
        return new S(self.selectionStart, self.selectionEnd, getValue(self));
    };
    $$.attach = function (self, state) {
        var $ = this;
        self = self || $.self;
        if (state && (isInteger(state) || isString(state))) {
            state = {
                tab: state
            };
        }
        state = _fromStates({}, $.state, state || {});
        if (hasClass(self, state.n + '__self')) {
            return $;
        }
        $._active = !isDisabled(self) && !isReadOnly(self);
        $._value = getValue(self);
        $.self = self;
        $.state = state;
        // Attach event(s)
        for (var event in events) {
            onEvent(event, self, theEvent);
        }
        setClass(self, state.n + '__self');
        // Attach extension(s)
        if (isSet(state) && isArray(state.with)) {
            for (var i = 0, j = toCount(state.with); i < j; ++i) {
                var value = state.with[i];
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
        var $ = this,
            self = $.self,
            state = $.state;
        if (!hasClass(self, state.n + '__self')) {
            return $;
        }
        $._active = false;
        // Detach event(s)
        for (var event in events) {
            offEvent(event, self, theEvent);
        }
        letClass(self, state.n + '__self');
        // Detach extension(s)
        if (isArray(state.with)) {
            for (var i = 0, j = toCount(state.with); i < j; ++i) {
                var value = state.with[i];
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
        var $ = this,
            _active = $._active,
            self = $.self,
            x,
            y;
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
        var $ = this,
            _active = $._active,
            self = $.self;
        if (!_active) {
            return false;
        }
        return !isDisabled(self) && getValue(self) || null;
    };
    $$.insert = function (value, mode, clear) {
        var $ = this,
            from = /^[\s\S]*?$/;
        if (!$._active) {
            return $;
        }
        if (clear) {
            $.replace(from, ""); // Force to delete selection on insert before/after?
        }
        if (-1 === mode) {
            // Insert before
            from = /$/;
        } else if (1 === mode) {
            // Insert after
            from = /^/;
        }
        return $.replace(from, value, mode);
    };
    $$.let = function () {
        var $ = this,
            _active = $._active,
            self = $.self;
        if (!_active) {
            return $;
        }
        return setValue(self, $._value), $;
    };
    $$.match = function (pattern, then) {
        var $ = this,
            _$$$ = $.$(),
            after = _$$$.after,
            before = _$$$.before,
            value = _$$$.value;
        if (isArray(pattern)) {
            var _m = [before.match(pattern[0]), value.match(pattern[1]), after.match(pattern[2])];
            return isFunction(then) ? then.call($, _m[0] || [], _m[1] || [], _m[2] || []) : [!!_m[0], !!_m[1], !!_m[2]];
        }
        var m = value.match(pattern);
        return isFunction(then) ? then.call($, m || []) : !!m;
    };
    $$.peel = function (open, close, wrap) {
        var $ = this,
            _$$$2 = $.$(),
            after = _$$$2.after,
            before = _$$$2.before,
            value = _$$$2.value;
        open = esc(open);
        close = esc(close);
        var openPattern = toPattern(open + '$', ""),
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
    $$.pull = function (by, withEmptyLines) {
        if (withEmptyLines === void 0) {
            withEmptyLines = true;
        }
        var $ = this,
            state = $.state,
            _$$$3 = $.$(),
            before = _$$$3.before,
            end = _$$$3.end,
            length = _$$$3.length,
            start = _$$$3.start,
            value = _$$$3.value;
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
            return $.insert(value.split('\n').map(function (v) {
                if (toPattern('^(' + by + ')*$', "").test(v)) {
                    return v;
                }
                return v.replace(toPattern('^' + by, ""), "");
            }).join('\n'));
        }
        return $.replace(toPattern(by + '$', ""), "", -1);
    };
    $$.push = function (by, withEmptyLines) {
        if (withEmptyLines === void 0) {
            withEmptyLines = false;
        }
        var $ = this,
            state = $.state,
            _$$$4 = $.$(),
            before = _$$$4.before,
            end = _$$$4.end,
            length = _$$$4.length,
            start = _$$$4.start;
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
        var $ = this,
            _$$$5 = $.$(),
            after = _$$$5.after,
            before = _$$$5.before,
            value = _$$$5.value;
        if (-1 === mode) {
            // Replace before
            before = before.replace(from, to);
        } else if (1 === mode) {
            // Replace after
            after = after.replace(from, to);
        } else {
            // Replace value
            value = value.replace(from, to);
        }
        return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
    };
    $$.select = function () {
        var $ = this,
            _active = $._active,
            self = $.self;
        if (!_active) {
            return self.focus(), $;
        }
        for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
            lot[_key] = arguments[_key];
        }
        var count = toCount(lot),
            _$$$6 = $.$(),
            start = _$$$6.start,
            end = _$$$6.end,
            x,
            y,
            X,
            Y;
        x = W.pageXOffset || R.scrollLeft || B.scrollLeft;
        y = W.pageYOffset || R.scrollTop || B.scrollTop;
        X = self.scrollLeft;
        Y = self.scrollTop;
        if (0 === count) {
            // Restore selection with `$.select()`
            lot[0] = start;
            lot[1] = end;
        } else if (1 === count) {
            // Move caret position with `$.select(7)`
            if (true === lot[0]) {
                // Select all with `$.select(true)`
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
        var $ = this,
            _active = $._active,
            self = $.self;
        if (!_active) {
            return $;
        }
        return setValue(self, value), $;
    };
    $$.trim = function (open, close, start, end, tidy) {
        if (tidy === void 0) {
            tidy = true;
        }
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
        var $ = this,
            _$$$7 = $.$(),
            after = _$$$7.after,
            before = _$$$7.before,
            value = _$$$7.value,
            afterClean = trim(after, -1),
            beforeClean = trim(before, 1);
        after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
        before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
        if (false !== end) value = trim(value, 1);
        if (false !== start) value = trim(value, -1);
        return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
    };
    $$.wrap = function (open, close, wrap) {
        var $ = this,
            _$$$8 = $.$(),
            after = _$$$8.after,
            before = _$$$8.before,
            value = _$$$8.value;
        if (wrap) {
            return $.replace(/^[\s\S]*?$/, open + '$&' + close);
        }
        return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
    };
    Object.defineProperty($$, 'value', {
        get: function get() {
            return getValue(this.self);
        },
        set: function set(value) {
            setValue(this.self, value);
        }
    });
    return TextEditor;
}));