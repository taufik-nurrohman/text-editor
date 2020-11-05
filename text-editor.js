/*!
 * ==============================================================
 *  TEXT EDITOR 3.1.11
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

((win, doc, name) => {

    let blur = 'blur',
        disabled = 'disabled',
        focus = 'focus',
        insert = 'insert',
        match = 'match',
        parentNode = 'parentNode',
        readOnly = 'readOnly',
        replace = 'replace',
        scroll = 'scroll',
        scrollLeft = scroll + 'Left',
        scrollTop = scroll + 'Top',
        select = 'select',
        selection = select + 'ion',
        selectionEnd = selection + 'End',
        selectionStart = selection + 'Start',
        slice = 'slice',

        delay = win.setTimeout,
        instances = 'instances';

    function count(x) {
        return x.length;
    }

    function isArray(x) {
        return x instanceof Array;
    }

    function isFunction(x) {
        return 'function' === typeof x;
    }

    function isPattern(x) {
        return x instanceof RegExp ? (x.source || true) : false;
    }

    function isSet(x) {
        return 'undefined' !== typeof x && null !== x;
    }

    function isString(x) {
        return 'string' === typeof x;
    }

    function esc(x) {
        if (isArray(x)) {
            let o = [], i;
            for (i in x) {
                o[i] = esc(x[i]);
            }
            return o;
        }
        return x[replace](toPattern('[' + win[name].x[replace](/./g, '\\$&') + ']', 'g'), '\\$&');
    }

    function toPattern(a, b) {
        return isPattern(a) || new RegExp(a, b);
    }

    function trim(s, x) {
        return s['trim' + (-1 === x ? 'Left' : 1 === x ? 'Right' : "")]();
    }

    ($$ => {

        $$.S = function(a, b, c) {
            let t = this, d;
            t.start = a;
            t.end = b;
            t.value = (d = c[slice](a, b));
            t.before = c[slice](0, a);
            t.after = c[slice](b);
            t.length = count(d);
            t.toString = () => d;
        };

        $$.esc = esc;

        $$[instances] = {};

        $$.state = {
            'tab': '\t'
        };

        $$.version = '3.1.11';

        $$.x = '!$^*()-=+[]{}\\|:<>,./?'; // Escape character(s)

    })(win[name] = function(source, o) {

        if (!source) return;

        let $ = this,
            $$ = win[name],
            patternAny = /^([\s\S]*?)$/, // Any character(s)

            body = doc.body,
            html = body[parentNode],
            state = Object.assign({}, $$.state, isString(o) ? {
                'tab': o
            } : (o || {}));

        // Already instantiated, skip!
        if (source[name]) {
            return $;
        }

        // Return new instance if `TE` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, state);
        }

        // Store text editor instance to `TE.instances`
        $$[instances][source.id || source.name || count(Object.keys($$[instances]))] = $;

        function sourceValueGet() {
            return source.value[replace](/\r/g, "");
        }

        // The `<textarea>` element
        $.self = $.source = source;

        // The initial value
        $.value = sourceValueGet();

        // Get value
        $.get = () => !source[disabled] && trim(source.value) || null;

        // Reset to the initial value
        $.let = () => (source.value = $.value), $;

        // Set value
        $.set = value => {
            if (source[disabled] || source[readOnly]) {
                return $;
            }
            return (source.value = value), $;
        };

        // Get selection
        $.$ = () => {
            let selection = new $$.S(source[selectionStart], source[selectionEnd], sourceValueGet());
            return selection;
        };

        $[focus] = mode => {
            let x, y;
            if (-1 === mode) {
                x = y = 0; // Put caret at the start of the editor, scroll to the start of the editor
            } else if (1 === mode) {
                x = count(sourceValueGet()); // Put caret at the end of the editor
                y = source[scroll + 'Height']; // Scroll to the end of the editor
            }
            if (isSet(x) && isSet(y)) {
                source[selectionStart] = source[selectionEnd] = x;
                source[scrollTop] = y;
            }
            return source[focus](), $;
        };

        // Blur from the editor
        $[blur] = () => (source[blur](), $);

        // Select value
        $[select] = (...args) => {
            if (source[disabled] || source[readOnly]) {
                return source[focus](), $;
            }
            let counts = count(args),
                s = $.$(),
                x, y, z;
            x = win.pageXOffset || html[scrollLeft] || body[scrollLeft];
            y = win.pageYOffset || html[scrollTop] || body[scrollTop];
            z = source[scrollTop];
            if (0 === counts) { // Restore selection with `$.select()`
                args[0] = s.start;
                args[1] = s.end;
            } else if (1 === counts) { // Move caret position with `$.select(7)`
                if (true === args[0]) { // Select all with `$.select(true)`
                    return source[focus](), source[select](), $;
                }
                args[1] = args[0];
            }
            source[focus]();
            // Default `$.select(7, 100)`
            source[selectionStart] = args[0];
            source[selectionEnd] = args[1];
            return source[scrollTop] = z, win.scroll(x, y), $;
        };

        // Match at selection
        $[match] = (pattern, fn) => {
            if (isArray(pattern)) {
                let selection = $.$(),
                    m = [selection.before[match](pattern[0]), selection.value[match](pattern[1]), selection.after[match](pattern[2])];
                return isFunction(fn) ? fn.call($, m[0] || [], m[1] || [], m[2] || []) : [!!m[0], !!m[1], !!m[2]];
            }
            let m = $.$().value[match](pattern);
            return isFunction(fn) ? fn.call($, m || []) : !!m;
        };

        // Replace at selection
        $[replace] = (from, to, mode) => {
            let selection = $.$(),
                before = selection.before,
                after = selection.after,
                value = selection.value;
            if (-1 === mode) { // Replace before
                before = before[replace](from, to);
            } else if (1 === mode) { // Replace after
                after = after[replace](from, to);
            } else { // Replace value
                value = value[replace](from, to);
            }
            return $.set(before + value + after)[select](before = count(before), before + count(value));
        };

        // Insert/replace at caret
        $[insert] = (value, mode, clear) => {
            let from = patternAny;
            if (clear) {
                $[replace](from, ""); // Force to delete selection on insert before/after?
            }
            if (-1 === mode) { // Insert before
                from = /$/;
            } else if (1 === mode) { // Insert after
                from = /^/;
            }
            return $[replace](from, value, mode);
        };

        // Wrap current selection
        $.wrap = (open, close, wrap) => {
            let selection = $.$(),
                before = selection.before,
                after = selection.after,
                value = selection.value;
            if (wrap) {
                return $[replace](patternAny, open + '$1' + close);
            }
            return $.set(before + open + value + close + after)[select](before = count(before + open), before + count(value));
        };

        // Unwrap current selection
        $.peel = (open, close, wrap) => {
            let selection = $.$(),
                before = selection.before,
                after = selection.after,
                value = selection.value;
            open = isPattern(open) || esc(open);
            close = isPattern(close) || esc(close);
            let openPattern = toPattern(open + '$'),
                closePattern = toPattern('^' + close);
            if (wrap) {
                return $[replace](toPattern('^' + open + '([\\s\\S]*?)' + close + '$'), '$1');
            }
            if (openPattern.test(before) && closePattern.test(after)) {
                before = before[replace](openPattern, "");
                after = after[replace](closePattern, "");
                return $.set(before + value + after)[select](before = count(before), before + count(value));
            }
            return $[select]();
        };

        $.pull = (by, includeEmptyLines /* = true */) => {
            let selection = $.$();
            by = isSet(by) ? by : state.tab;
            by = isPattern(by) || esc(by);
            isSet(includeEmptyLines) || (includeEmptyLines = true);
            if (count(selection)) {
                if (includeEmptyLines) {
                    return $[replace](toPattern('^' + by, 'gm'), "");
                }
                return $[insert](selection.value.split('\n').map(v => {
                    if (toPattern('^(' + by + ')*$').test(v)) {
                        return v;
                    }
                    return v[replace](toPattern('^' + by), "");
                }).join('\n'));
            }
            return $[replace](toPattern(by + '$'), "", -1);
        };

        $.push = (by, includeEmptyLines /* = false */) => {
            let selection = $.$();
            by = isSet(by) ? by : state.tab;
            isSet(includeEmptyLines) || (includeEmptyLines = false);
            if (count(selection)) {
                return $[replace](toPattern('^' + (includeEmptyLines ? "" : '(?!$)'), 'gm'), by);
            }
            return $[insert](by, -1);
        };

        $.trim = (open, close, start, end, tidy) => {
            if (!isSet(tidy)) {
                tidy = true;
            }
            if (null !== open && false !== open) {
                open = open || "";
            }
            if (null !== close && false !== close) {
                close = close || "";
            }
            if (null !== start && false !== start) {
                start = start || "";
            }
            if (null !== end && false !== end) {
                end = end || "";
            }
            let selection = $.$(),
                before = selection.before,
                after = selection.after,
                value = selection.value,
                beforeClean = trim(before, 1),
                afterClean = trim(after, -1);
            before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
            after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
            if (false !== start) value = trim(value, -1);
            if (false !== end) value = trim(value, 1);
            return $.set(before + value + after)[select](before = count(before), before + count(value));
        };

        // Destructor
        $.pop = () => ((delete source[name]), $);

        // Return the text editor state
        $.state = state;

    });

})(window, document, 'TE');
