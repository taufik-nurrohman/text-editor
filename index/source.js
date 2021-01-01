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

(function () {
  'use strict';

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

  var eventPreventDefault = function eventPreventDefault(e) {
    return e && e.preventDefault();
  };

  var off = function off(name, node, then) {
    node.removeEventListener(name, then);
  };

  var on = function on(name, node, then, options) {
    if (options === void 0) {
      options = false;
    }

    node.addEventListener(name, then, options);
  };

  var fromStates = function fromStates() {
    for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
      lot[_key] = arguments[_key];
    }

    return Object.assign.apply(Object, [{}].concat(lot));
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
    } // No need to escape `/` in the pattern string


    pattern = pattern.replace(/\//g, '\\/');
    return new RegExp(pattern, isSet(opt) ? opt : 'g');
  };

  var x = "!$^*()+=[]{}|:<>,.?/-";

  var toCaseLower = function toCaseLower(x) {
    return x.toLowerCase();
  };

  if (isSet(TE)) {
    var TextEditor = function TextEditor(source, state) {
      if (state === void 0) {
        state = {};
      }

      var $ = this;
      TextEditorConstructor.call($, source, state);
      state = $.state;
      var active = 'source' in state ? state.source : {};

      if (!active) {
        return $;
      }

      var defaults = {},
          pop = $.pop,
          canUndo = ('undo' in TextEditorConstructor.prototype);
      defaults.close = {
        '`': '`',
        '(': ')',
        '{': '}',
        '[': ']',
        '"': '"',
        "'": "'",
        '<': '>'
      };

      defaults.pull = function (e) {
        var key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = e.ctrlKey;
        return keyIsCtrl && (key && '[' === key || keyCode && 219 === keyCode);
      };

      defaults.push = function (e) {
        var key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = e.ctrlKey;
        return keyIsCtrl && (key && ']' === key || keyCode && 221 === keyCode);
      };

      if (active) {
        state.source = fromStates(defaults, true === state.source ? {} : state.source);
      }

      var sourceIsDisabled = function sourceIsDisabled() {
        return source.disabled;
      },
          sourceIsReadOnly = function sourceIsReadOnly() {
        return source.readOnly;
      },
          theState = state.source || {};

      function onKeyDown(e) {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
          return;
        }

        var closure = theState.close,
            tab = state.tab,
            key = toCaseLower(e.key || String.fromCharCode(k)),
            keyCode = e.keyCode,
            keyIsCtrl = e.ctrlKey,
            keyIsEnter = 'enter' === key || 13 === keyCode,
            keyIsShift = e.shiftKey,
            selection = $.$(),
            before = selection.before,
            value = selection.value,
            after = selection.after,
            charBefore = before.slice(-1),
            charAfter = after.slice(0, 1),
            lastTabs = before.match(toPattern('(?:^|\\n)(' + esc(tab) + '+).*$', "")),
            tabs = lastTabs ? lastTabs[1] : "",
            end = closure[key]; // Indent

        if (theState.push && theState.push.call($, e)) {
          $.push(tab), doUpdateHistory(), eventPreventDefault(e); // Outdent
        } else if (theState.pull && theState.pull.call($, e)) {
          $.pull(tab), doUpdateHistory(), eventPreventDefault(e);
        } else if (keyIsCtrl) {
          // Undo
          if ('z' === key || 90 === keyCode) {
            $.undo(), doUpdateHistory(), eventPreventDefault(e); // Redo
          } else if ('y' === key || 89 === keyCode) {
            $.redo(), doUpdateHistory(), eventPreventDefault(e);
          }
        } else if ('\\' !== charBefore && key === charAfter) {
          // Move to the next character
          $.select(selection.end + 1), doUpdateHistory(), eventPreventDefault(e);
        } else if ('\\' !== charBefore && end) {
          doUpdateHistory(), $.wrap(key, end), doUpdateHistory(), eventPreventDefault(e);
        } else if ('backspace' === key || 8 === keyCode) {
          var bracketsOpen = "",
              bracketsClose = "";

          for (var i in closure) {
            bracketsOpen += i;
            bracketsClose += closure[i];
          }

          bracketsOpen = '([' + esc(bracketsOpen) + '])';
          bracketsClose = '([' + esc(bracketsClose) + '])';
          var matchBefore = before.match(toPattern(bracketsOpen + '\\n(?:' + esc(tabs) + ')$', "")),
              matchAfter = after.match(toPattern('^\\n(?:' + esc(tabs) + ')' + bracketsClose, ""));

          if (!value && matchBefore && matchAfter && matchAfter[1] === closure[matchBefore[1]]) {
            // Collapse bracket(s)
            $.trim("", ""), doUpdateHistory(), eventPreventDefault(e);
          } else if (!value && before.match(toPattern(esc(tab) + '$', ""))) {
            $.pull(tab), doUpdateHistory(), eventPreventDefault(e);
          } else {
            end = closure[charBefore];

            if (end && end === charAfter) {
              $.peel(charBefore, charAfter), eventPreventDefault(e);
            }
          }

          doUpdateHistory();
        } else if ('delete' === key || 46 === keyCode) {
          end = closure[charBefore];

          if (end && end === charAfter) {
            $.peel(charBefore, charAfter);
            eventPreventDefault(e);
          }

          doUpdateHistory();
        } else if (keyIsEnter) {
          end = closure[charBefore];

          if (end && end === charAfter) {
            $.wrap('\n' + tab + tabs, '\n' + tabs).blur().focus();
            eventPreventDefault(e);
          } else if (value || tabs) {
            $.insert('\n', -1, true).push(tabs).blur().focus();
            eventPreventDefault(e);
          } else ;

          doUpdateHistory();
        } else {
          // Record history
          setTimeout(doUpdateHistory, 0);
        }
      }

      function doUpdateHistory() {
        canUndo && $.record();
      }

      if (active) {
        on('keydown', source, onKeyDown);
        doUpdateHistory(); // Initialize history
      }

      $.pop = function () {
        isFunction(pop) && pop.call($);
        off('keydown', source, onKeyDown); // Reset history

        canUndo && $.loss(true);
        return $;
      }; // Override


      $.state = state;
      return $;
    }; // Clone all prototype(s) from the old constructor


    var TextEditorConstructor = TE;
    TextEditor.prototype = Object.create(TextEditorConstructor.prototype);
    TextEditor.prototype.constructor = TextEditor; // Clone all static property from the old constructor

    for (var key in TextEditorConstructor) {
      TextEditor[key] = TextEditorConstructor[key];
    } // Override the old constructor


    TE = TextEditor;
  }
})();
