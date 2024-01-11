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
    var isInstance = function isInstance(x, of) {
        return x && isSet(of) && x instanceof of ;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if ('object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object) : true;
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
    var toObjectCount = function toObjectCount(x) {
        return toCount(toObjectKeys(x));
    };
    var toObjectKeys = function toObjectKeys(x) {
        return Object.keys(x);
    };
    var fromStates = function fromStates() {
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
                    out[k] = fromStates({
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
    var name = 'TextEditor';

    function trim(str, dir) {
        return (str || "")['trim' + (-1 === dir ? 'Left' : 1 === dir ? 'Right' : "")]();
    }

    function TextEditor(self, state) {
        if (state === void 0) {
            state = {};
        }
        var $ = this;
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
        } : state || {});
        // The `<textarea>` element
        $.self = $.source = self;
        // Store current instance to `TextEditor.instances`
        TextEditor.instances[self.id || self.name || toObjectCount(TextEditor.instances)] = $;
        // Mark current DOM as active text editor to prevent duplicate instance
        self[name] = $;
        var any = /^([\s\S]*?)$/,
            // Any character(s)
            isDisabled = function isDisabled() {
                return self.disabled;
            },
            isReadOnly = function isReadOnly() {
                return self.readOnly;
            },
            theValue = function theValue() {
                return self.value.replace(/\r/g, "");
            };
        // The initial value
        $.value = theValue();
        // Get value
        $.get = function () {
            return !isDisabled() && theValue() || null;
        };
        // Reset to the initial value
        $.let = function () {
            return self.value = $.value, $;
        };
        // Set value
        $.set = function (value) {
            if (isDisabled() || isReadOnly()) {
                return $;
            }
            return self.value = value, $;
        };
        // Get selection
        $.$ = function () {
            return new TextEditor.S(self.selectionStart, self.selectionEnd, theValue());
        };
        $.focus = function (mode) {
            var x, y;
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
        $.blur = function () {
            return self.blur(), $;
        };
        // Select value
        $.select = function () {
            if (isDisabled() || isReadOnly()) {
                return self.focus(), $;
            }
            for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
                lot[_key] = arguments[_key];
            }
            var count = toCount(lot),
                _$$$ = $.$(),
                start = _$$$.start,
                end = _$$$.end,
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
        // Match at selection
        $.match = function (pattern, then) {
            var _$$$2 = $.$(),
                after = _$$$2.after,
                before = _$$$2.before,
                value = _$$$2.value;
            if (isArray(pattern)) {
                var _m = [before.match(pattern[0]), value.match(pattern[1]), after.match(pattern[2])];
                return isFunction(then) ? then.call($, _m[0] || [], _m[1] || [], _m[2] || []) : [!!_m[0], !!_m[1], !!_m[2]];
            }
            var m = value.match(pattern);
            return isFunction(then) ? then.call($, m || []) : !!m;
        };
        // Replace at selection
        $.replace = function (from, to, mode) {
            var _$$$3 = $.$(),
                after = _$$$3.after,
                before = _$$$3.before,
                value = _$$$3.value;
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
        // Insert/replace at caret
        $.insert = function (value, mode, clear) {
            var from = any;
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
        // Wrap current selection
        $.wrap = function (open, close, wrap) {
            var _$$$4 = $.$(),
                after = _$$$4.after,
                before = _$$$4.before,
                value = _$$$4.value;
            if (wrap) {
                return $.replace(any, open + '$1' + close);
            }
            return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
        };
        // Unwrap current selection
        $.peel = function (open, close, wrap) {
            var _$$$5 = $.$(),
                after = _$$$5.after,
                before = _$$$5.before,
                value = _$$$5.value;
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
        $.pull = function (by, includeEmptyLines) {
            if (includeEmptyLines === void 0) {
                includeEmptyLines = true;
            }
            var _$$$6 = $.$(),
                before = _$$$6.before,
                end = _$$$6.end,
                length = _$$$6.length,
                start = _$$$6.start,
                value = _$$$6.value;
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
                return $.insert(value.split('\n').map(function (v) {
                    if (toPattern('^(' + by + ')*$', "").test(v)) {
                        return v;
                    }
                    return v.replace(toPattern('^' + by, ""), "");
                }).join('\n'));
            }
            return $.replace(toPattern(by + '$', ""), "", -1);
        };
        $.push = function (by, includeEmptyLines) {
            if (includeEmptyLines === void 0) {
                includeEmptyLines = false;
            }
            var _$$$7 = $.$(),
                before = _$$$7.before,
                end = _$$$7.end,
                length = _$$$7.length,
                start = _$$$7.start;
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
        $.trim = function (open, close, start, end, tidy) {
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
            var _$$$8 = $.$(),
                before = _$$$8.before,
                value = _$$$8.value,
                after = _$$$8.after,
                beforeClean = trim(before, 1),
                afterClean = trim(after, -1);
            before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
            after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
            if (false !== start) value = trim(value, -1);
            if (false !== end) value = trim(value, 1);
            return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
        };
        // Destructor
        $.pop = function () {
            if (!self[name]) {
                return $; // Already ejected!
            }
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
            delete TextEditor.instances[self.id || self.name || toObjectCount(TextEditor.instances) - 1];
            for (var key in $) {
                delete $[key];
            }
            return $;
        };
        if (isArray(state.with)) {
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
    }
    TextEditor.esc = esc;
    TextEditor.instances = {};
    TextEditor.state = {
        'tab': '\t',
        'with': []
    };
    TextEditor.S = function (a, b, c) {
        var t = this,
            d = c.slice(a, b);
        t.after = c.slice(b);
        t.before = c.slice(0, a);
        t.end = b;
        t.length = toCount(d);
        t.start = a;
        t.value = d;
        t.toString = function () {
            return d;
        };
    };
    TextEditor.version = '4.0.2';
    TextEditor.x = x;
    return TextEditor;
}));