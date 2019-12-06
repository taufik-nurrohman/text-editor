/*!
 * ==========================================================
 *  TEXT EDITOR IDE EFFECT 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $ = win[NS],
        _ = $._,

        key = '[i-d-e]',
        defaults = {
            '(': ')',
            '{': '}',
            '[': ']',
            '"': '"',
            "'": "'",
            '<': '>'
        };

    function extend(a, b) {
        return Object.assign(a, b);
    }

    function offKeyDown(e) {
        e && e.preventDefault();
    }

    function onKeyDown(e) {
        var t = this,
            tt = t._this,
            k = e.keyCode,
            kk = (e.key || String.fromCharCode(k)).toLowerCase(),
            isCtrl = e.ctrlKey,
            isEnter = 'enter' === kk || 13 === k,
            isShift = e.shiftKey,
            isTab = 'tab' === kk || 9 === k,
            state = tt.state[key],
            $$ = tt.$(),
            before = $$.before,
            after = $$.after,
            charBefore = before.slice(-1),
            charAfter = after.slice(0, 1),
            getDent = before.match(/^([ \t]+).*?$/m);
        if (isTab) {
            tt[isShift ? 'pull' : 'push'](tt.state.tab);
            offKeyDown(e); // TODO: Control how to escape from text area using `Tab` key
        } else if (isEnter) {
            var dent = getDent ? getDent[1] : "";
            tt.insert('\n', -1).push(dent);
            offKeyDown(e);
        }
        /*
        setTimeout(function() {
            $$ = tt.$(); // Refresh after value change(s)
            var before2 = $$.before,
                after2 = $$.after,
                charBefore2 = before2.slice(-1),
                charAfter2 = after2.slice(0, 1);
            if (
                charBefore && (end = state[charBefore]) &&
                charAfter && end === charAfter
            ) {
                if ('backspace' === kk || 8 === k) {
                    tt.replace(new RegExp('^' + $.esc(charAfter2)), "", 1);
                } else if ('enter' === kk || 13 === k) {
                    var tabs = before2.match(/^([ \t]+).*?$/m),
                        tab = tabs ? tabs[1] : "";
                    tt.wrap(tt.state.tab + tab, '\n' + tab);
                }
            } else if (end = state[charBefore2]) {
                tt.insert(end, 1);
            }
        }, 1);
        */
    }

    function onKeyUp() {
        var t = this;
        // Trigger scroll
        t.blur();
        t.focus();
    }

    function IDE(state) {
        var t = this;
        t.state = extend(t.state, {
            '+i-d-e': extend(defaults, state)
        });
        t.self._this = this;
        t.self.addEventListener('keydown', onKeyDown, false);
        t.self.addEventListener('keyup', onKeyUp, false);
    }

    IDE.get = function() {}; // Not available

    IDE.let = function() {
        var t = this;
        delete t.self._this;
        t.self.removeEventListener('keydown', onKeyDown);
        t.self.removeEventListener('keyup', onKeyUp);
    };

    IDE.set = IDE;

    _.IDE = IDE;

})(window, document, 'TE');