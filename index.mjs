import {B, D, H, R, W} from '@taufik-nurrohman/document';
import {fromStates} from '@taufik-nurrohman/from';
import {isArray, isFunction, isInstance, isSet, isString} from '@taufik-nurrohman/is';
import {esc, fromPattern, toPattern, x} from '@taufik-nurrohman/pattern';
import {toCount, toObjectCount} from '@taufik-nurrohman/to';

let name = 'TE';

function trim(str, dir) {
    return (str || "")['trim' + (-1 === dir ? 'Left' : 1 === dir ? 'Right' : "")]();
}

function TE(source, state = {}) {

    const $ = this;

    if (!source) {
        return $;
    }

    // Already instantiated, skip!
    if (source[name]) {
        return source[name];
    }

    // Return new instance if `TE` was called without the `new` operator
    if (!isInstance($, TE)) {
        return new TE(source, state);
    }

    $.state = state = fromStates({}, TE.state, isString(state) ? {
        tab: state
    } : (state || {}));

    // The `<textarea>` element
    $.self = $.source = source;

    // Store current instance to `TE.instances`
    TE.instances[source.id || source.name || toObjectCount(TE.instances)] = $;

    // Mark current DOM as active text editor to prevent duplicate instance
    source[name] = $;

    let any = /^([\s\S]*?)$/, // Any character(s)
        sourceIsDisabled = () => source.disabled,
        sourceIsReadOnly = () => source.readOnly,
        sourceValue = () => source.value.replace(/\r/g, "");

    // The initial value
    $.value = sourceValue();

    // Get value
    $.get = () => !sourceIsDisabled() && trim(sourceValue()) || null;

    // Reset to the initial value
    $.let = () => ((source.value = $.value), $);

    // Set value
    $.set = value => {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
            return $;
        }
        return (source.value = value), $;
    };

    // Get selection
    $.$ = () => {
        return new TE.S(source.selectionStart, source.selectionEnd, sourceValue());
    };

    $.focus = mode => {
        let x, y;
        if (-1 === mode) {
            x = y = 0; // Put caret at the start of the editor, scroll to the start of the editor
        } else if (1 === mode) {
            x = toCount(sourceValue()); // Put caret at the end of the editor
            y = source.scrollHeight; // Scroll to the end of the editor
        }
        if (isSet(x) && isSet(y)) {
            source.selectionStart = source.selectionEnd = x;
            source.scrollTop = y;
        }
        return source.focus(), $;
    };

    // Blur from the editor
    $.blur = () => (source.blur(), $);

    // Select value
    $.select = (...lot) => {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
            return source.focus(), $;
        }
        let count = toCount(lot),
            {start, end} = $.$(),
            x, y, X, Y;
        x = W.pageXOffset || R.scrollLeft || B.scrollLeft;
        y = W.pageYOffset || R.scrollTop || B.scrollTop;
        X = source.scrollLeft;
        Y = source.scrollTop;
        if (0 === count) { // Restore selection with `$.select()`
            lot[0] = start;
            lot[1] = end;
        } else if (1 === count) { // Move caret position with `$.select(7)`
            if (true === lot[0]) { // Select all with `$.select(true)`
                return source.focus(), source.select(), $;
            }
            lot[1] = lot[0];
        }
        source.focus();
        // Default `$.select(7, 100)`
        source.selectionStart = lot[0];
        source.selectionEnd = lot[1];
        source.scrollLeft = X;
        source.scrollTop = Y;
        return W.scroll(x, y), $;
    };

    // Match at selection
    $.match = (pattern, then) => {
        let {after, before, value} = $.$();
        if (isArray(pattern)) {
            let m = [
                before.match(pattern[0]),
                value.match(pattern[1]),
                after.match(pattern[2])
            ];
            return isFunction(then) ? then.call($, m[0] || [], m[1] || [], m[2] || []) : [!!m[0], !!m[1], !!m[2]];
        }
        let m = value.match(pattern);
        return isFunction(then) ? then.call($, m || []) : !!m;
    };

    // Replace at selection
    $.replace = (from, to, mode) => {
        let {after, before, value} = $.$();
        if (-1 === mode) { // Replace before
            before = before.replace(from, to);
        } else if (1 === mode) { // Replace after
            after = after.replace(from, to);
        } else { // Replace value
            value = value.replace(from, to);
        }
        return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
    };

    // Insert/replace at caret
    $.insert = (value, mode, clear) => {
        let from = any;
        if (clear) {
            $.replace(from, ""); // Force to delete selection on insert before/after?
        }
        if (-1 === mode) { // Insert before
            from = /$/;
        } else if (1 === mode) { // Insert after
            from = /^/;
        }
        return $.replace(from, value, mode);
    };

    // Wrap current selection
    $.wrap = (open, close, wrap) => {
        let {after, before, value} = $.$();
        if (wrap) {
            return $.replace(any, open + '$1' + close);
        }
        return $.set(before + open + value + close + after).select(before = toCount(before + open), before + toCount(value));
    };

    // Unwrap current selection
    $.peel = (open, close, wrap) => {
        let {after, before, value} = $.$();
        open = esc(open);
        close = esc(close);
        let openPattern = toPattern(open + '$', ""),
            closePattern = toPattern('^' + close, "");
        if (wrap) {
            return $.replace(toPattern('^' + open + '([\\s\\S]*?)' + close + '$', ""), '$1');
        }
        if (openPattern.test(before) && closePattern.test(after)) {
            before = before.replace(openPattern, "");
            after = after.replace(closePattern, "");
            return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
        }
        return $.select();
    };

    $.pull = (by, includeEmptyLines = true) => {
        let {length, value} = $.$();
        by = esc(isSet(by) ? by : state.tab);
        if (length) {
            if (includeEmptyLines) {
                return $.replace(toPattern('^' + by, 'gm'), "");
            }
            return $.insert(value.split('\n').map(v => {
                if (toPattern('^(' + by + ')*$', "").test(v)) {
                    return v;
                }
                return v.replace(toPattern('^' + by, ""), "");
            }).join('\n'));
        }
        return $.replace(toPattern(by + '$', ""), "", -1);
    };

    $.push = (by, includeEmptyLines = false) => {
        let {length} = $.$();
        by = isSet(by) ? by : state.tab;
        if (length) {
            return $.replace(toPattern('^' + (includeEmptyLines ? "" : '(?!$)'), 'gm'), by);
        }
        return $.insert(by, -1);
    };

    $.trim = (open, close, start, end, tidy = true) => {
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
        let {before, value, after} = $.$(),
            beforeClean = trim(before, 1),
            afterClean = trim(after, -1);
        before = false !== open ? trim(before, 1) + (beforeClean || !tidy ? open : "") : before;
        after = false !== close ? (afterClean || !tidy ? close : "") + trim(after, -1) : after;
        if (false !== start) value = trim(value, -1);
        if (false !== end) value = trim(value, 1);
        return $.set(before + value + after).select(before = toCount(before), before + toCount(value));
    };

    // Destructor
    $.pop = () => {
        if (!source[name]) {
            return $; // Already ejected!
        }
        return (delete source[name]), $;
    };

    // Return the text editor state
    $.state = state;

    return $;

}

TE.esc = esc;

TE.instances = {};

TE.state = {
    'tab': '\t'
};

TE.S = function (a, b, c) {
    let t = this,
        d = c.slice(a, b);
    t.after = c.slice(b);
    t.before = c.slice(0, a);
    t.end = b;
    t.length = toCount(d);
    t.start = a;
    t.value = d;
    t.toString = () => d;
};

TE.version = '3.3.13';

TE.x = x;

export default TE;