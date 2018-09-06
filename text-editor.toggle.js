/*!
 * ==========================================================
 *  TEXT EDITOR TOGGLE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $ = win[NS],
        x = $.is.x,
        f = $.is.f,
        $$ = $._,
        _toggle = '_toggle',
        _toggleState = _toggle + 'State';

    $$[_toggleState] = 0;

    // Toggle state(s) {$fn}
    $$[_toggle.slice(1)] = function() {
        var arg = arguments,
            count = arg.length,
            i = this[_toggleState];
        if (!x(arg[i]) && f(arg[i])) {
            arg[i].call(this, this.$());
        }
        if (this[_toggleState] >= count - 1) {
            this[_toggleState] = -1;
        }
        ++this[_toggleState];
    };

})(window, document, 'TE');