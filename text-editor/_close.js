/*!
 * ==========================================================
 *  TEXT EDITOR AUTO-CLOSE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(name) {

    TE[name] = {
        reset: function($) {
            return $.self.removeEventListener("keydown", $['.' + name]), $;
        },
        set: function($, o) {
            if ($['.' + name]) {
                return $; // Apply event once!
            }
            o = Object.assign({
                '(': ')',
                '{': '}',
                '[': ']',
                '"': '"',
                "'": "'",
                '<': '>'
            }, o || {});
            function stop(e) {
                e.preventDefault();
            }
            var current;
            function close(e) {
                var $$ = $.$(),
                    key = e.key,
                    back = key === 'Backspace',
                    open = $$.before.slice(-1);
                // Open
                if (back && open in o && $$.after[0] === o[open]) {
                    $.peel(open, o[open]), stop(e), (current = false);
                // Jump
                } else if (current && current in o && key === o[current]) {
                    $.select($$.start + o[current].length), stop(e), (current = false);
                // Close
                } else if (key in o) {
                    current = key;
                    $.wrap(key, o[key]), stop(e);
                }
            }
            $['.' + name] = close;
            $.self.addEventListener("keydown", close, false);
            return $;
        }
    };

})('_close');