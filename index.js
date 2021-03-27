/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2020 Taufik Nurrohman
 *
 * <https://github.com/taufik-nurrohman/text-editor>
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

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TE = factory());
})(this, function () {
  'use strict';

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
    return x && isSet(of) && x instanceof of;
  };

  var isNull = function isNull(x) {
    return null === x;
  };

  var isSet = function isSet(x) {
    return isDefined(x) && !isNull(x);
  };

  var isString = function isString(x) {
    return 'string' === typeof x;
  };

  var fromStates = function fromStates() {
    for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
      lot[_key] = arguments[_key];
    }

    return Object.assign.apply(Object, [{}].concat(lot));
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

  var fromPattern = function fromPattern(pattern) {
    if (isPattern(pattern)) {
      // Un-escape `/` in the pattern string
      return pattern.source.replace(/\\\//g, '/');
    }

    return null;
  };

  var isPattern = function isPattern(pattern) {
    return isInstance(pattern, RegExp);
  };

  var toPattern = function toPattern(pattern, opt) {
    if (isPattern(pattern)) {
      return pattern;
    } // No need to escape `/` in the pattern string


    pattern = pattern.replace(/\//g, '\\/');
    return new RegExp(pattern, isSet(opt) ? opt : 'g');
  };

  var x = "!$^*()+=[]{}|:<>,.?/-";
  var name = 'TE';

  function trim(str, dir) {
    return (str || "")['trim' + (-1 === dir ? 'Left' : 1 === dir ? 'Right' : "")]();
  }

  function TE(source, state) {
    if (state === void 0) {
      state = {};
    }

    if (!source) return;
    var $ = this; // Already instantiated, skip!

    if (source[name]) {
      return;
    } // Return new instance if `TE` was called without the `new` operator


    if (!isInstance($, TE)) {
      return new TE(source, state);
    }

    $.state = state = fromStates(TE.state, isString(state) ? {
      tab: state
    } : state || {}); // The `<textarea>` element

    $.self = $.source = source; // Store current instance to `TE.instances`

    TE.instances[source.id || source.name || toObjectCount(TE.instances)] = $; // Mark current DOM as active text editor to prevent duplicate instance

    source[name] = 1;

    var any = /^([\s\S]*?)$/,
        // Any character(s)
    sourceIsDisabled = function sourceIsDisabled() {
      return source.disabled;
    },
        sourceIsReadOnly = function sourceIsReadOnly() {
      return source.readOnly;
    },
        sourceValue = function sourceValue() {
      return source.value.replace(/\r/g, "");
    }; // The initial value


    $.value = sourceValue(); // Get value

    $.get = function () {
      return !sourceIsDisabled() && trim(sourceValue()) || null;
    }; // Reset to the initial value


    $.let = function () {
      return source.value = $.value;
    }, $; // Set value

    $.set = function (value) {
      if (sourceIsDisabled() || sourceIsReadOnly()) {
        return $;
      }

      return source.value = value, $;
    }; // Get selection


    $.$ = function () {
      return new TE.S(source.selectionStart, source.selectionEnd, sourceValue());
    };

    $.focus = function (mode) {
      var x, y;

      if (-1 === mode) {
        x = y = 0; // Put caret at the start of the editor, scroll to the start of the editor
      } else if (1 === mode) {
        x = toCount(sourceValue()); // Put caret at the end of the editor

        y = source.scrollHeight; // Scroll to the end of the editor
      }

      if (isSet(x) && isSet(y)) {
        source.selectionStart = source.selectionEnd = x;
        source.scrollTop = y;
      }

      return source.focus(), $;
    }; // Blur from the editor


    $.blur = function () {
      return source.blur(), $;
    }; // Select value


    $.select = function () {
      if (sourceIsDisabled() || sourceIsReadOnly()) {
        return source.focus(), $;
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
      X = source.scrollLeft;
      Y = source.scrollTop;

      if (0 === count) {
        // Restore selection with `$.select()`
        lot[0] = start;
        lot[1] = end;
      } else if (1 === count) {
        // Move caret position with `$.select(7)`
        if (true === lot[0]) {
          // Select all with `$.select(true)`
          return source.focus(), source.select(), $;
        }

        lot[1] = lot[0];
      }

      source.focus(); // Default `$.select(7, 100)`

      source.selectionStart = lot[0];
      source.selectionEnd = lot[1];
      source.scrollLeft = X;
      source.scrollTop = Y;
      return W.scroll(x, y), $;
    }; // Match at selection


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
    }; // Replace at selection


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
    }; // Insert/replace at caret


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
    }; // Wrap current selection


    $.wrap = function (open, close, wrap) {
      var _$$$4 = $.$(),
          after = _$$$4.after,
          before = _$$$4.before,
          value = _$$$4.value;

      if (wrap) {
        return $.replace(any, open + '$1' + close);
      }

      return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
    }; // Unwrap current selection


    $.peel = function (open, close, wrap) {
      var _$$$5 = $.$(),
          after = _$$$5.after,
          before = _$$$5.before,
          value = _$$$5.value;

      open = fromPattern(open) || esc(open);
      close = fromPattern(close) || esc(close); // Ignore begin and end marker

      open = open.replace(/^\^|\$$/g, "");
      close = close.replace(/^\^|\$$/, "");
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
          length = _$$$6.length,
          value = _$$$6.value;

      by = isSet(by) ? by : state.tab;
      by = fromPattern(by) || esc(by); // Ignore begin marker

      by = by.replace(/^\^/, "");

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
          length = _$$$7.length;

      by = isSet(by) ? by : state.tab;

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
    }; // Destructor


    $.pop = function () {
      if (!source[name]) {
        return $; // Already ejected!
      }

      return delete source[name], $;
    }; // Return the text editor state


    $.state = state;
    return $;
  }

  TE.esc = esc;
  TE.instances = {};
  TE.state = {
    'tab': '\t'
  };

  TE.S = function (a, b, c) {
    var t = this,
        d = c.slice(a, b);
    t.start = a;
    t.end = b;
    t.value = d;
    t.before = c.slice(0, a);
    t.after = c.slice(b);
    t.length = toCount(d);

    t.toString = function () {
      return d;
    };
  };

  TE.version = '3.2.6';
  TE.x = x;
  return TE;
});
