(function(factory) {
    typeof define === 'function' && define.amd ? define(factory) : factory();
})(function() {
    'use strict';
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of ) {
        return x && isSet( of ) && x instanceof of ;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var offEvent = function offEvent(name, node, then) {
        node.removeEventListener(name, then);
    };
    var offEventDefault = function offEventDefault(e) {
        return e && e.preventDefault();
    };
    var onEvent = function onEvent(name, node, then, options) {
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
    var hasKey = function hasKey(x, data) {
        return x in data;
    };
    var hasObjectKey = hasKey;
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
    var toObject = function toObject(x) {
        return Object.create(x);
    };
    const TextEditorConstructor = TE;

    function TextEditor(source, state = {}) {
        const $ = this;
        TextEditorConstructor.call($, source, state);
        state = $.state;
        let active = hasObjectKey('source', state) ? state.source : {};
        if (!active) {
            return $;
        }
        let defaults = {},
            pop = $.pop,
            canUndo = hasObjectKey('undo', TextEditorConstructor.prototype);
        defaults.close = {
            '`': '`',
            '(': ')',
            '{': '}',
            '[': ']',
            '"': '"',
            "'": "'",
            '<': '>'
        };
        defaults.pull = e => {
            let key = e.key,
                keyCode = e.keyCode,
                keyIsCtrl = e.ctrlKey,
                keyIsShift = e.shiftKey;
            return keyIsCtrl && !keyIsShift && (key && '[' === key || keyCode && 219 === keyCode);
        };
        defaults.push = e => {
            let key = e.key,
                keyCode = e.keyCode,
                keyIsCtrl = e.ctrlKey,
                keyIsShift = e.shiftKey;
            return keyIsCtrl && !keyIsShift && (key && ']' === key || keyCode && 221 === keyCode);
        };
        if (active) {
            state.source = fromStates(defaults, true === state.source ? {} : state.source);
        }
        let sourceIsDisabled = () => source.disabled,
            sourceIsReadOnly = () => source.readOnly,
            theState = state.source || {};

        function onKeyDown(e) {
            if (sourceIsDisabled() || sourceIsReadOnly()) {
                return;
            }
            let closure = theState.close,
                tab = state.tab,
                key = toCaseLower(e.key || String.fromCharCode(k)),
                keyCode = e.keyCode,
                keyIsCtrl = e.ctrlKey,
                keyIsEnter = 'enter' === key || 13 === keyCode;
            e.shiftKey;
            let {
                after,
                before,
                end,
                start,
                value
            } = $.$(),
                charBefore = before.slice(-1),
                charAfter = after.slice(0, 1),
                lastTabs = before.match(toPattern('(?:^|\\n)(' + esc(tab) + '+).*$', "")),
                tabs = lastTabs ? lastTabs[1] : "",
                closureEnd = closure[key]; // Indent
            if (theState.push && theState.push.call($, e)) {
                $.push(tab), doUpdateHistory(), offEventDefault(e); // Outdent
            } else if (theState.pull && theState.pull.call($, e)) {
                $.pull(tab), doUpdateHistory(), offEventDefault(e);
            } else if (keyIsCtrl) {
                // Undo
                if ('z' === key || 90 === keyCode) {
                    $.undo(), doUpdateHistory(), offEventDefault(e); // Redo
                } else if ('y' === key || 89 === keyCode) {
                    $.redo(), doUpdateHistory(), offEventDefault(e);
                }
            } else if ('\\' !== charBefore && key === charAfter) {
                // Move to the next character
                $.select(end + 1), doUpdateHistory(), offEventDefault(e);
            } else if ('\\' !== charBefore && closureEnd) {
                doUpdateHistory(), $.wrap(key, closureEnd), doUpdateHistory(), offEventDefault(e);
            } else if ('backspace' === key || 8 === keyCode) {
                let bracketsOpen = "",
                    bracketsClose = "";
                for (let i in closure) {
                    bracketsOpen += i;
                    bracketsClose += closure[i];
                }
                bracketsOpen = '([' + esc(bracketsOpen) + '])';
                bracketsClose = '([' + esc(bracketsClose) + '])';
                let matchBefore = before.match(toPattern(bracketsOpen + '\\n(?:' + esc(tabs) + ')$', "")),
                    matchAfter = after.match(toPattern('^\\n(?:' + esc(tabs) + ')' + bracketsClose, ""));
                if (!value && matchBefore && matchAfter && matchAfter[1] === closure[matchBefore[1]]) {
                    // Collapse bracket(s)
                    $.trim("", ""), doUpdateHistory(), offEventDefault(e);
                } else if (!value && before.match(toPattern(esc(tab) + '$', ""))) {
                    $.pull(tab), doUpdateHistory(), offEventDefault(e);
                } else {
                    closureEnd = closure[charBefore];
                    if (closureEnd && closureEnd === charAfter && '\\' !== before.slice(-2, -1)) {
                        $.peel(charBefore, charAfter), offEventDefault(e);
                    }
                }
                doUpdateHistory();
            } else if ('delete' === key || 46 === keyCode) {
                closureEnd = closure[charBefore];
                if (closureEnd && closureEnd === charAfter) {
                    $.peel(charBefore, charAfter);
                    offEventDefault(e);
                }
                doUpdateHistory();
            } else if (keyIsEnter) {
                closureEnd = closure[charBefore];
                if (closureEnd && closureEnd === charAfter) {
                    $.wrap('\n' + tab + tabs, '\n' + tabs).blur().focus();
                    offEventDefault(e);
                } else if (value || tabs) {
                    $.insert('\n', -1, true).push(tabs).blur().focus();
                    offEventDefault(e);
                } else;
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
            onEvent('keydown', source, onKeyDown);
            doUpdateHistory(); // Initialize history
        }
        $.pop = () => {
            isFunction(pop) && pop.call($);
            offEvent('keydown', source, onKeyDown); // Reset history
            canUndo && $.loss(true);
            return $;
        }; // Override
        $.state = state;
        return $;
    } // Clone all prototype(s) from the old constructor
    TextEditor.prototype = toObject(TextEditorConstructor.prototype);
    TextEditor.prototype.constructor = TextEditor; // Clone all static property from the old constructor
    for (let key in TextEditorConstructor) {
        TextEditor[key] = TextEditorConstructor[key];
    } // Override the old constructor
    TE = TextEditor;
});