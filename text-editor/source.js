/*!
 * ==========================================================
 *  TEXT EDITOR SOURCE 1.1.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $$ = win[NS],

        delay = setTimeout,
        esc = $$.esc,

        blur = 'blur',
        ctrlKey = 'ctrlKey',
        focus = 'focus',
        fromCharCode = 'fromCharCode',
        indexOf = 'indexOf',
        lastIndexOf = 'lastIndexOf',
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

        $$$, prop;

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

    $$$ = function(source, state) {

        var $ = this,
            canUndo = undo in $$._;

        // Is the same as `parent::__construct()` in PHP
        $$.call(this, source, state);

        var name = 'source',
            state = $.state,
            defaults = {
                close: {
                    '(': ')',
                    '{': '}',
                    '[': ']',
                    '"': '"',
                    "'": "'",
                    '<': '>'
                },
                select: true // Enable smart selection?
            },
            // Is enabled by default, unless you set the `source` option to `false`
            active = !(name in state) || state[name];

        if (active) {
            state[name] = extend(defaults, true === state[name] ? {} : state[name]);
        }

        var stateScoped = state[name] || {};

        function onTouch() {
            delay(function() {
                var selection = $.$(),
                    from = /\W/g,
                    to = '.',
                    start = selection.before[replace](from, to)[lastIndexOf](to),
                    end = selection.after[replace](from, to)[indexOf](to);
                start = start < 0 ? 0 : start + 1;
                end = end < 0 ? selection.after.length : end;
                $[select](start, selection.end + end);
            }, 0);
        }

        function onKeyDown(e) {
            var closure = stateScoped.close,
                tab = state.tab,
                k = e.keyCode,
                kk = (e.key || String[fromCharCode](k))[toLowerCase](),
                isCtrl = e[ctrlKey],
                isEnter = 'enter' === kk || 13 === k,
                isShift = e[shiftKey],
                isTab = 'tab' === kk || 9 === k,
                selection = $.$(),
                before = selection.before,
                value = selection.value,
                after = selection.after,
                charBefore = before.slice(-1),
                charAfter = after.slice(0, 1),
                lastTabs = before[match](new RegExp('(?:^|\\n)(' + esc(tab) + '+).*$')),
                tabs = lastTabs ? lastTabs[1] : "",
                end = closure[kk];
            if (isCtrl) {
                if (canUndo) {
                    // Undo
                    if ('z' === kk || 90 === k) {
                        $[undo]();
                        offKeyDown(e);
                    // Redo
                    } else if ('y' === kk || 89 === k) {
                        $[redo]();
                        offKeyDown(e);
                    }
                }
            } else if (isTab) {
                $[isShift ? pull : push](tab);
                // TODO: Control how to escape from text area using `Tab` key
                rec(), offKeyDown(e);
            } else if ('\\' !== charBefore && kk === charAfter) {
                // Move to the next character
                $[select](selection.end + 1);
                rec(), offKeyDown(e);
            } else if ('\\' !== charBefore && end) {
                rec(), $.wrap(kk, end);
                rec(), offKeyDown(e);
            } else if ('backspace' === kk || 8 === k) {
                if ("" === value && before[match](new RegExp(esc(tab) + '$'))) {
                    $[pull](tab), offKeyDown(e);
                } else {
                    end = closure[charBefore];
                    if (end && end === charAfter) {
                        $.peel(charBefore, charAfter), offKeyDown(e);
                    }
                }
                rec();
            } else if ('delete' === kk || 46 === k) {
                end = closure[charBefore];
                if (end && end === charAfter) {
                    $.peel(charBefore, charAfter);
                    offKeyDown(e);
                }
                rec();
            } else if (isEnter) {
                end = closure[charBefore];
                if (end && end === charAfter) {
                    $.wrap('\n' + tab + tabs, '\n' + tabs)[blur]()[focus]();
                    offKeyDown(e);
                } else if ("" !== value || tabs) {
                    $.insert('\n', -1, true)[push](tabs)[blur]()[focus]();
                    offKeyDown(e);
                } else {
                    // Do normal `Enter` key here
                }
                rec();
            } else {
                // Record history
                delay(rec, 0);
            }
        }

        function rec() {
            canUndo && $[record]();
        }

        if (active) {
            if (stateScoped[select]) {
                eventSet(source, mousedown, onTouch);
                eventSet(source, touchstart, onTouch);
            }
            eventSet(source, keydown, onKeyDown);
            rec(); // Initialize history
        }

        // Destructor
        $.pop = function() {
            // Remove event(s) from memory
            eventLet(source, mousedown, onTouch);
            eventLet(source, touchstart, onTouch);
            eventLet(source, keydown, onKeyDown);
            // Delete marker
            delete source[NS];
            // Reset history
            canUndo && $[loss](true);
            return $;
        };

        // Override
        $.state = state;

    };

    // Clone all static property from the old constructor
    for (prop in $$) {
        $$$[prop] = $$[prop];
    }

    // Clone prototype(s)
    $$$.prototype = $$$._ = $$._;

    // Override
    win[NS] = $$$;

})(window, document, 'TE');