/*!
 * ==============================================================
 *  TEXT EDITOR SOURCE 1.1.9
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

((win, doc, name) => {

    let $$ = win[name],

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
        toLowerCase = 'toLowerCase',
        undo = 'undo',

        $$$, prop;

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

    $$$ = function(source, o) {

        let $ = this,
            pop = $.pop,
            canUndo = undo in $$.prototype;

        // Is the same as `parent::__construct()` in PHP
        $$[call]($, source, o);

        let plugin = 'source',
            state = $.state,
            defaults = {},
            // Is enabled by default, unless you set the `source` option to `false`
            active = !(plugin in state) || state[plugin];

        defaults[close] = {
            '`': '`',
            '(': ')',
            '{': '}',
            '[': ']',
            '"': '"',
            "'": "'",
            '<': '>'
        };

        defaults[pull] = e => {
            let isCtrl = e.ctrlKey,
                key = e.key,
                keyCode = e.keyCode;
            return isCtrl && ((key && '[' === key) || (keyCode && 219 === keyCode));
        };

        defaults[push] = e => {
            let isCtrl = e.ctrlKey,
                key = e.key,
                keyCode = e.keyCode;
            return isCtrl && ((key && ']' === key) || (keyCode && 221 === keyCode));
        };

        if (active) {
            state[plugin] = extend(defaults, true === state[plugin] ? {} : state[plugin]);
        }

        let stateScoped = state[plugin] || {};

        function onKeyDown(e) {
            if (source[disabled] || source[readOnly]) {
                return;
            }
            let closure = stateScoped[close],
                tab = state.tab,
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
                tabs = lastTabs ? lastTabs[1] : "",
                end = closure[kk];
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
                let bracketsOpen = "",
                    bracketsClose = "";
                for (let i in closure) {
                    bracketsOpen += i;
                    bracketsClose += closure[i];
                }
                bracketsOpen = '([' + esc(bracketsOpen) + '])';
                bracketsClose = '([' + esc(bracketsClose) + '])';
                let matchBefore = before[match](toPattern(bracketsOpen + '\\n(?:' + esc(tabs) + ')$')),
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
        }

        function rec() {
            canUndo && $[record]();
        }

        if (active) {
            eventSet(source, keydown, onKeyDown);
            rec(); // Initialize history
        }

        // Destructor
        $.pop = () => {
            pop && pop[call]($);
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
    $$$.prototype = $$.prototype;

    // Override
    win[name] = $$$;

})(window, document, 'TE');
