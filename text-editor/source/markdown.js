/*!
 * ==============================================================
 *  TEXT EDITOR MARKDOWN SOURCE 1.0.0
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, name) {

    var $$ = win[name],

        delay = win.setTimeout,
        esc = $$.esc,

        blur = 'blur',
        call = 'call',
        close = 'close',
        ctrlKey = 'ctrlKey',
        disabled = 'disabled',
        focus = 'focus',
        fromCharCode = 'fromCharCode',
        indexOf = 'indexOf',
        lastIndexOf = 'lastIndexOf',
        length = 'length',
        keydown = 'keydown',
        match = 'match',
        mousedown = 'mousedown',
        mouseup = 'mouseup',
        pull = 'pull',
        push = 'push',
        readOnly = 'readOnly',
        record = 'record',
        redo = 'redo',
        replace = 'replace',
        select = 'select',
        shiftKey = 'shiftKey',
        slice = 'slice',
        toLowerCase = 'toLowerCase',
        touch = 'touch',
        touchend = touch + 'end',
        touchstart = touch + 'start',
        undo = 'undo',

        $$$, prop;

    function count(x) {
        return x.length;
    }

    function eventLet(el, name, fn) {
        el.removeEventListener(name, fn);
    }

    function eventSet(el, name, fn) {
        el.addEventListener(name, fn, false);
    }

    function extend(a, b) {
        return Object.assign(a, b);
    }

    function isFunction(x) {
        return 'function' === typeof x;
    }

    function offKeyDown(e) {
        e && e.preventDefault();
    }

    function toPattern(a, b) {
        return new RegExp(a, b);
    }

    $$$ = function(source, state) {

        var $ = this,
            pop = $.pop,
            canUndo = undo in $$._;

        // Is the same as `parent::__construct()` in PHP
        $$[call]($, source, state);

        var patternAny = /^([\s\S]*?)$/,
            plugin = 'source',
            state = $.state,
            defaults = {},
            // Is enabled by default, unless you set the `source` option to `false`
            active = !(plugin in state) || state[plugin];

        function toggle(open, close, wrap) {
            var selection = $.$(),
                before = selection.before,
                after = selection.after,
                value = selection.value;
            if (wrap) {
                if (open === value[slice](0, count(open)) && close === value[slice](-count(close))) {
                    return $.peel(open, close, wrap);
                }
                return $.wrap(open, close, wrap);
            }
            if (open === before[slice](-count(open)) && close === after[slice](0, count(close))) {
                return $.peel(open, close, wrap);
            }
            return $.wrap(open, close, wrap);
        }

        function onKeyDown(e) {
            if (source[disabled] || source[readOnly]) {
                return;
            }
            var tab = state.tab,
                k = e.keyCode,
                kk = (e.key || String[fromCharCode](k))[toLowerCase](),
                isCtrl = e[ctrlKey],
                isEnter = 'enter' === kk || 13 === k,
                isShift = e[shiftKey],
                selection = $.$(),
                before = selection.before,
                value = selection.value,
                after = selection.after,
                charBefore = before.slice(-1),
                charAfter = after.slice(0, 1),
                lastTabs = before[match](toPattern('(?:^|\\n)(' + esc(tab) + '+).*$')),
                tabs = lastTabs ? lastTabs[1] : "";
            /*
            // Indent
            if (stateScoped[push] && stateScoped[push][call]($, e)) {
                $[push](tab), rec(), offKeyDown(e);
            // Outdent
            } else if (stateScoped[pull] && stateScoped[pull][call]($, e)) {
                $[pull](tab), rec(), offKeyDown(e);
            } else if (isCtrl) {
                // Undo
                if ('z' === kk || 90 === k) {
                    $[undo](), rec(), offKeyDown(e);
                // Redo
                } else if ('y' === kk || 89 === k) {
                    $[redo](), rec(), offKeyDown(e);
                }
            } else if ('\\' !== charBefore && kk === charAfter) {
                // Move to the next character
                $[select](selection.end + 1), rec(), offKeyDown(e);
            } else if ('\\' !== charBefore && end) {
                rec(), $.wrap(kk, end), rec(), offKeyDown(e);
            } else if ('backspace' === kk || 8 === k) {
                var bracketsOpen = "",
                    bracketsClose = "";
                for (var i in closure) {
                    bracketsOpen += i;
                    bracketsClose += closure[i];
                }
                bracketsOpen = '([' + esc(bracketsOpen) + '])';
                bracketsClose = '([' + esc(bracketsClose) + '])';
                var matchBefore = before[match](toPattern(bracketsOpen + '\\n(?:' + esc(tabs) + ')$')),
                    matchAfter = after[match](toPattern('^\\n(?:' + esc(tabs) + ')' + bracketsClose));
                if (!value && matchBefore && matchAfter && matchAfter[1] === closure[matchBefore[1]]) {
                    // Collapse bracket(s)
                    $.trim("", ""), rec(), offKeyDown(e);
                } else if (!value && before[match](toPattern(esc(tab) + '$'))) {
                    $[pull](tab), rec(), offKeyDown(e);
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
                } else if (value || tabs) {
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
            */
            if (isCtrl) {
                if ('b' === kk || 66 === k) {
                    rec(), toggle('**', '**'), rec();
                    offKeyDown(e);
                } else if ('h' === kk || 72 === k) {
                    console.log('toggle block');
                    offKeyDown(e);
                } else if ('i' === kk || 73 === k) {
                    rec(), toggle('_', '_'), rec();
                    offKeyDown(e);
                } else if ('k' === kk || 75 === k) {
                    rec(), toggle('`', '`'), rec();
                    offKeyDown(e);
                }
            }
        }

        function rec() {
            canUndo && $[record]();
        }

        if (active) {
            eventSet(source, keydown, onKeyDown);
            rec(); // Initialize history
        }

        // Destructor
        $.pop = function() {
            pop && pop[call]($);
            // Remove event(s) from memory
            eventLet(source, keydown, onKeyDown);
            // Reset history
            canUndo && $.loss(true);
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
    win[name] = $$$;

})(this, this.document, 'TE');
