/*!
 * ==========================================================
 *  TEXT EDITOR IDE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $ = win[NS],
        _ = $._,

        canUndo = 'undo' in _,

        delay = setTimeout,

        blur = 'blur',
        ctrlKey = 'ctrlKey',
        focus = 'focus',
        fromCharCode = 'fromCharCode',
        indexOf = 'indexOf',
        lastIndexOf = 'lastIndexOf',
        key = '[i-d-e]',
        keydown = 'keydown',
        match = 'match',
        mousedown = 'mousedown',
        pull = 'pull',
        push = 'push',
        record = 'record',
        redo = 'redo',
        replace = 'replace',
        select = 'select',
        shiftKey = 'shiftKey',
        toLowerCase = 'toLowerCase',
        touch = 'touch',
        touchstart = touch + 'start',
        undo = 'undo',

        defaults = {
            close: {
                '(': ')',
                '{': '}',
                '[': ']',
                '"': '"',
                "'": "'",
                '<': '>'
            },
            e: {}, // Event bound(s)
            select: true // Enable smart selection?
        };

    function eventLet(el, name, fn) {
        el && fn && el.removeEventListener(name, fn);
    }

    function eventSet(el, name, fn) {
        el && fn && el.addEventListener(name, fn, false);
    }

    function extend(a, b) {
        return Object.assign(a, b);
    }

    function offKeyDown(e) {
        e && e.preventDefault();
    }

    function onTouch() {
        var t = this;
        delay(function() {
            var selection = t.$(),
                from = /\W/g,
                to = '.',
                start = selection.before[replace](from, to)[lastIndexOf](to),
                end = selection.after[replace](from, to)[indexOf](to);
            start = start < 0 ? 0 : start + 1;
            end = end < 0 ? selection.after.length : end;
            t[select](start, selection.end + end);
        }, 0);
    }

    function onKeyDown(e) {
        var t = this,
            state = t.state[key].close,
            tab = t.state.tab,
            k = e.keyCode,
            kk = (e.key || String[fromCharCode](k))[toLowerCase](),
            isCtrl = e[ctrlKey],
            isEnter = 'enter' === kk || 13 === k,
            isShift = e[shiftKey],
            isTab = 'tab' === kk || 9 === k,
            $$ = t.$(),
            before = $$.before,
            value = $$.value,
            after = $$.after,
            charBefore = before.slice(-1),
            charAfter = after.slice(0, 1),
            lastDent = before[match](new RegExp('(?:^|\\n)(' + $.esc(tab) + '+).*$')),
            dent = lastDent ? lastDent[1] : "",
            end = state[kk];
        if (isCtrl) {
            if (canUndo) {
                // Undo
                if ('z' === kk || 90 === k) {
                    t[undo]();
                    offKeyDown(e);
                // Redo
                } else if ('y' === kk || 89 === k) {
                    t[redo]();
                    offKeyDown(e);
                }
            }
        } else if (isTab) {
            t[isShift ? pull : push](tab);
            canUndo && t[record]();
            offKeyDown(e); // TODO: Control how to escape from text area using `Tab` key
        } else if ('\\' !== charBefore && kk === charAfter) {
            // Move to the next character
            t[select]($$.end + 1);
            canUndo && t[record]();
            offKeyDown(e);
        } else if ('\\' !== charBefore && end) {
            t.wrap(kk, end);
            canUndo && t[record]();
            offKeyDown(e);
        } else if ('backspace' === kk || 8 === k) {
            if ("" === value && before[match](new RegExp($.esc(tab) + '$'))) {
                t.pull(tab);
                offKeyDown(e);
            } else {
                end = state[charBefore];
                if (end && end === charAfter) {
                    t.peel(charBefore, charAfter);
                    offKeyDown(e);
                }
            }
            canUndo && t[record]();
        } else if ('delete' === kk || 46 === k) {
            end = state[charBefore];
            if (end && end === charAfter) {
                t.peel(charBefore, charAfter);
                offKeyDown(e);
            }
            canUndo && t[record]();
        } else if (isEnter) {
            end = state[charBefore];
            if (end && end === charAfter) {
                t.wrap('\n' + tab + dent, '\n' + dent)[blur]()[focus]();
            } else {
                t.insert('\n', -1)[push](dent)[blur]()[focus]();
            }
            canUndo && t[record]();
            offKeyDown(e);
        } else {
            // Record history
            delay(function() {
                t[record]();
            }, 0);
        }
    }

    function IDE(alt) {
        var t = this,
            el = t.self,
            state = t.state,
            stateScoped = state[key] || {},
            o = {};

        o[key] = extend(defaults, true === alt ? {} : (alt || {}));

        state = extend(state, o);
        stateScoped = state[key];

        eventLet(el, mousedown, stateScoped.e[touch]);
        eventLet(el, touchstart, stateScoped.e[touch]);
        eventLet(el, keydown, stateScoped.e[keydown]);

        if (false !== alt) {
            stateScoped.e[touch] = onTouch.bind(t);
            stateScoped.e[keydown] = onKeyDown.bind(t);
            if (stateScoped[select]) {
                eventSet(el, mousedown, stateScoped.e[touch]);
                eventSet(el, touchstart, stateScoped.e[touch]);
            }
            eventSet(el, keydown, stateScoped.e[keydown]);
            canUndo && t[record](); // Initialize history
        }

        // Update data
        state[key] = stateScoped;
        t.state = state;

        return t;

    }

    _.IDE = IDE;

})(window, document, 'TE');