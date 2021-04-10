import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {fromStates} from '@taufik-nurrohman/from';
import {hasObjectKey} from '@taufik-nurrohman/has';
import {isFunction, isObject, isSet} from '@taufik-nurrohman/is';
import {esc, toPattern} from '@taufik-nurrohman/pattern';
import {toCaseLower, toObject} from '@taufik-nurrohman/to';

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
        return keyIsCtrl && !keyIsShift && ((key && '[' === key) || (keyCode && 219 === keyCode));
    };
    defaults.push = e => {
        let key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey;
        return keyIsCtrl && !keyIsShift && ((key && ']' === key) || (keyCode && 221 === keyCode));
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
            keyIsEnter = 'enter' === key || 13 === keyCode,
            keyIsShift = e.shiftKey,
            {after, before, end, start, value} = $.$(),
            charBefore = before.slice(-1),
            charAfter = after.slice(0, 1),
            lastTabs = before.match(toPattern('(?:^|\\n)(' + esc(tab) + '+).*$', "")),
            tabs = lastTabs ? lastTabs[1] : "",
            closureEnd = closure[key];
        // Indent
        if (theState.push && theState.push.call($, e)) {
            $.push(tab), doUpdateHistory(), offEventDefault(e);
        // Outdent
        } else if (theState.pull && theState.pull.call($, e)) {
            $.pull(tab), doUpdateHistory(), offEventDefault(e);
        } else if (keyIsCtrl) {
            // Undo
            if ('z' === key || 90 === keyCode) {
                $.undo(), doUpdateHistory(), offEventDefault(e);
            // Redo
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
            } else {
                // Do normal `Enter` key here
            }
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
        offEvent('keydown', source, onKeyDown);
        // Reset history
        canUndo && $.loss(true);
        return $;
    };
    // Override
    $.state = state;
    return $;
}

// Clone all prototype(s) from the old constructor
TextEditor.prototype = toObject(TextEditorConstructor.prototype);
TextEditor.prototype.constructor = TextEditor;

// Clone all static property from the old constructor
for (let key in TextEditorConstructor) {
    TextEditor[key] = TextEditorConstructor[key];
}

// Override the old constructor
TE = TextEditor;
