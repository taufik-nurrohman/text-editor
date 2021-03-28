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

(function() {
    'use strict';

    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };

    var isNull = function isNull(x) {
        return null === x;
    };

    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };

    var toCount = function toCount(x) {
        return x.length;
    };

    var toEdge = function toEdge(x, edges) {
        if (isSet(edges[0]) && x < edges[0]) {
            return edges[0];
        }

        if (isSet(edges[1]) && x > edges[1]) {
            return edges[1];
        }

        return x;
    };

    if (isSet(TE)) {
        var __proto__ = TE.prototype;
        __proto__._history = [];
        __proto__._historyState = -1; // Get history data

        __proto__.history = function(index) {
            var t = this;

            if (!isSet(index)) {
                return t._history;
            }

            return isSet(t._history[index]) ? t._history[index] : null;
        }; // Save current state to history


        __proto__.record = function(index) {
            var t = this,
                _t$$ = t.$(),
                end = _t$$.end,
                start = _t$$.start,
                current = t._history[t._historyState] || [],
                next = [t.self.value, start, end];

            if (next[0] === current[0] && next[1] === current[1] && next[2] === current[2]) {
                return t; // Do not save duplicate
            }

            ++t._historyState;
            return t._history[isSet(index) ? index : t._historyState] = next, t;
        }; // Remove state from history


        __proto__.loss = function(index) {
            var t = this,
                current;

            if (true === index) {
                t._history = [];
                t._historyState = -1;
                return [];
            }

            current = t._history.splice(isSet(index) ? index : t._historyState, 1);
            t._historyState = toEdge(t._historyState - 1, [-1]);
            return current;
        }; // Undo current state


        __proto__.undo = function() {
            var t = this,
                state;
            t._historyState = toEdge(t._historyState - 1, [0, toCount(t._history) - 1]);
            state = t._history[t._historyState];
            return t.set(state[0]).select(state[1], state[2]);
        }; // Redo previous state


        __proto__.redo = function() {
            var t = this,
                state;
            t._historyState = toEdge(t._historyState + 1, [0, toCount(t._history) - 1]);
            state = t._history[t._historyState];
            return t.set(state[0]).select(state[1], state[2]);
        };
    }
})();