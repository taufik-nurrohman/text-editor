/*!
 * ==========================================================
 *  TEXT EDITOR HISTORY 1.1.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $ = win[NS],
        $$ = $._,
        x = $.is.x,
        _history = '_history',
        _historyState = _history + 'State';

    function edge(a, b, c) {
        if (!x(b) && a < b) {
            return b;
        }
        if (!x(c) && a > c) {
            return c;
        }
        return a;
    }

    $$[_history] = [];
    $$[_historyState] = -1;

    // Get history data
    $$.history = function(index) {
        if (x(index)) {
            return this[_history];
        }
        return x(this[_history][index]) ? null : this[_history][index]; 
    };

    // Save current state to history
    $$.record = function(index) {
        var selection = this.$(),
            current = this[_history][this[_historyState]] || [],
            next = [this.get(this.value), selection.start, selection.end];
        if (
            next[0] === current[0] &&
            next[1] === current[1] &&
            next[2] === current[2]
        ) {
            return this; // Do not save duplicate
        }
        ++this[_historyState];
        return (this[_history][x(index) ? this[_historyState] : index] = next), this;
    };

    // Remove state from history
    $$.loss = function(index) {
        if (true === index) {
            this[_history] = [];
            this[_historyState] = -1;
            return [];
        }
        var current = this[_history].splice(x(index) ? this[_historyState] : index, 1);
        this[_historyState] = edge(this[_historyState] - 1, -1);
        return current;
    };

    // Undo current state
    $$.undo = function() {
        this[_historyState] = edge(this[_historyState] - 1, 0, this[_history].length - 1);
        var state = this[_history][this[_historyState]];
        return this.set(state[0]).select(state[1], state[2]);
    };

    // Redo previous state
    $$.redo = function() {
        this[_historyState] = edge(this[_historyState] + 1, 0, this[_history].length - 1);
        var state = this[_history][this[_historyState]];
        return this.set(state[0]).select(state[1], state[2]);
    };

})(window, document, 'TE');