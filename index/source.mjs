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

import {eventPreventDefault, off as offEvent, on as onEvent} from '@taufik-nurrohman/event';
import {fromStates} from '@taufik-nurrohman/from';
import {isFunction, isObject, isSet} from '@taufik-nurrohman/is';
import {esc, toPattern} from '@taufik-nurrohman/pattern';
import {toCaseLower} from '@taufik-nurrohman/to';

if (isSet(TE)) {
    const TextEditorConstructor = TE;
    function TextEditor(source, state = {}) {
        const $ = this;
        TextEditorConstructor.call($, source, state);
        state = $.state;
        let active = 'source' in state ? state.source : {};
        if (!active) {
            return $;
        }
        let defaults = {},
            pop = $.pop,
            canUndo = 'undo' in TextEditorConstructor.prototype;
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
                keyIsCtrl = e.ctrlKey;
            return keyIsCtrl && ((key && '[' === key) || (keyCode && 219 === keyCode));
        };
        defaults.push = e => {
            let key = e.key,
                keyCode = e.keyCode,
                keyIsCtrl = e.ctrlKey;
            return keyIsCtrl && ((key && ']' === key) || (keyCode && 221 === keyCode));
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
                selection = $.$(),
                before = selection.before,
                value = selection.value,
                after = selection.after,
                charBefore = before.slice(-1),
                charAfter = after.slice(0, 1),
                lastTabs = before.match(toPattern('(?:^|\\n)(' + esc(tab) + '+).*$', "")),
                tabs = lastTabs ? lastTabs[1] : "",
                end = closure[key];
            // Indent
            if (theState.push && theState.push.call($, e)) {
                $.push(tab), doUpdateHistory(), eventPreventDefault(e);
            // Outdent
            } else if (theState.pull && theState.pull.call($, e)) {
                $.pull(tab), doUpdateHistory(), eventPreventDefault(e);
            } else if (keyIsCtrl) {
                // Undo
                if ('z' === key || 90 === keyCode) {
                    $.undo(), doUpdateHistory(), eventPreventDefault(e);
                // Redo
                } else if ('y' === key || 89 === keyCode) {
                    $.redo(), doUpdateHistory(), eventPreventDefault(e);
                }
            } else if ('\\' !== charBefore && key === charAfter) {
                // Move to the next character
                $.select(selection.end + 1), doUpdateHistory(), eventPreventDefault(e);
            } else if ('\\' !== charBefore && end) {
                doUpdateHistory(), $.wrap(key, end), doUpdateHistory(), eventPreventDefault(e);
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
    TextEditor.prototype = Object.create(TextEditorConstructor.prototype);
    TextEditor.prototype.constructor = TextEditor;
    // Clone all static property from the old constructor
    for (let key in TextEditorConstructor) {
        TextEditor[key] = TextEditorConstructor[key];
    }
    // Override the old constructor
    TE = TextEditor;
}
