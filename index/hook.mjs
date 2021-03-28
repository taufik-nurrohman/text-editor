/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2021 Taufik Nurrohman
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

import {
    off as offEvent,
    on as onEvent
} from '@taufik-nurrohman/event';
import {
    fromStates
} from '@taufik-nurrohman/from';
import {
    hasObjectKey
} from '@taufik-nurrohman/has';
import {
    hook
} from '@taufik-nurrohman/hook';
import {
    isFunction,
    isObject,
    isSet
} from '@taufik-nurrohman/is';
import {
    toObject
} from '@taufik-nurrohman/to';

if (isSet(TE)) {
    const TextEditorConstructor = TE;

    function TextEditor(source, state = {}) {
        const $ = this;
        TextEditorConstructor.call($, source, state);
        state = $.state;
        let active = hasObjectKey('hook', state) ? state.hook : {};
        if (!active) {
            return $;
        }
        let {
            fire
        } = hook($);
        let events = isObject(active) && active.events || {},
            pop = $.pop,
            theNativeEvents = fromStates({
                'blur': 1,
                'click': 1,
                'focus': 1,
                'input': 1,
                'keydown': 1,
                'keypress': 1,
                'keyup': 1,
                'select': 1
            }, events),
            value;

        function doFireHooks(e) {
            fire(e.type, [e]);
        }
        // Add hook to all native event(s)
        for (let theNativeEvent in theNativeEvents) {
            theNativeEvents[theNativeEvent] && onEvent(theNativeEvent, source, doFireHooks);
        }
        $.pop = () => {
            // Remove hook from all native event(s)
            for (let theNativeEvent in theNativeEvents) {
                theNativeEvents[theNativeEvent] && offEvent(theNativeEvent, source, doFireHooks);
            }
            return isFunction(pop) ? pop.call($) : $;
        };
        state.hook = state.hook || {};
        state.hook.events = theNativeEvents;
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
}