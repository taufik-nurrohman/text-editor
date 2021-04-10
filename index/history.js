(function(factory) {
    typeof define === 'function' && define.amd ? define(factory) : factory();
})(function() {
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
    const __proto__ = TE.prototype;
    __proto__._history = [];
    __proto__._historyState = -1; // Get history data
    __proto__.history = function(index) {
        let t = this;
        if (!isSet(index)) {
            return t._history;
        }
        return isSet(t._history[index]) ? t._history[index] : null;
    }; // Remove state from history
    __proto__.loss = function(index) {
        let t = this,
            current;
        if (true === index) {
            t._history = [];
            t._historyState = -1;
            return [];
        }
        current = t._history.splice(isSet(index) ? index : t._historyState, 1);
        t._historyState = toEdge(t._historyState - 1, [-1]);
        return current;
    }; // Save current state to history
    __proto__.record = function(index) {
        let t = this,
            {
                end,
                start
            } = t.$(),
            current = t._history[t._historyState] || [],
            next = [t.self.value, start, end];
        if (next[0] === current[0] && next[1] === current[1] && next[2] === current[2]) {
            return t; // Do not save duplicate
        }
        ++t._historyState;
        return t._history[isSet(index) ? index : t._historyState] = next, t;
    }; // Redo previous state
    __proto__.redo = function() {
        let t = this,
            state;
        t._historyState = toEdge(t._historyState + 1, [0, toCount(t._history) - 1]);
        state = t._history[t._historyState];
        return t.set(state[0]).select(state[1], state[2]);
    }; // Undo current state
    __proto__.undo = function() {
        let t = this,
            state;
        t._historyState = toEdge(t._historyState - 1, [0, toCount(t._history) - 1]);
        state = t._history[t._historyState];
        return t.set(state[0]).select(state[1], state[2]);
    };
});