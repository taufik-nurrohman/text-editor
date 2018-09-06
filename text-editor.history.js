/*!
 * ==========================================================
 *  TEXT EDITOR HISTORY 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $ = win[NS],
        $$ = $._,
        edge = $.edge,
        x = $.is.x,
        _history = '_history',
        _historyState = _history + 'State';

    $$[_history] = [];
    $$[_historyState] = -1;

    // Get history data {$index, $default}
    $$.history = function(i, def) {
        if (x(i)) {
            return this[_history];
        }
        return x(this[_history][i]) ? def : this[_history][i]; 
    };

    // Save current state to history {$index}
    $$.record = function(i) {
        var s = this.$(),
            current = this[_history][this[_historyState]] || [],
            next = [this.get(this.value), s.start, s.end];
        if (
            next[0] === current[0] &&
            next[1] === current[1] &&
            next[2] === current[2]
        ) {
            return this; // Do not save duplicate
        }
        ++this[_historyState];
        return (this[_history][x(i) ? this[_historyState] : i] = next), this;
    };

    // Remove state from history {$index} or {true}
    $$.loss = function(i) {
        if (i === true) {
            this[_history] = [];
            this[_historyState] = -1;
            return [];
        }
        var current = this[_history].splice(x(i) ? this[_historyState] : i, 1);
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