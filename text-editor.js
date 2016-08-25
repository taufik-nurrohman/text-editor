/*!
 * ==========================================================
 *  TEXT EDITOR PLUGIN 1.1.1
 * ==========================================================
 * Author: Taufik Nurrohman <http://latitudu.com>
 * License: MIT
 * ----------------------------------------------------------
 */

var TE = function(target) {

    var w = window,
        d = document,
        r = this,
        _ = 1, // cache of history length
        F = 0, // history feature is active
        H = [[val(), 0, 0]], // load the first history data
        I = 0, // current state of history
        S = {}; // storage

    r.x = '!$^*()-=+[]{}\\|:<>,./?'; // character(s) to escape
    r.version = '1.1.1'; // plugin version

    function val() {
        return target.value;
    }

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_string(x) {
        return typeof x === "string";
    }

    function is_func(x) {
        return typeof x === "function";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function is_pattern(x) {
        return x instanceof RegExp && x.source ? x.source : false;
    }

    function get_pattern(x) {
        return is_pattern(x) || r.esc(x);
    }

    function edge(a, b, c) {
        if (a < b) return b;
        if (a > c) return c;
        return a;
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    // access editor instance from `this` scope with `this.TE`
    target.TE = r;

    // Key maps for the deprecated `KeyboardEvent.keyCode`
    r.keys = {
        // control
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'control',
        18: 'alt',
        19: 'pause',
        20: 'capslock', // not working on `keypress`
        27: 'escape',
        33: 'pageup',
        34: 'pagedown',
        37: 'arrowleft',
        38: 'arrowup',
        39: 'arrowright',
        40: 'arrowdown',
        44: 'printscreen', // works only on `keyup` :(
        45: 'insert',
        46: 'delete',
        91: 'meta', // <https://bugzilla.mozilla.org/show_bug.cgi?id=1232918>
        93: 'contextmenu',
        // function
        112: 'f1',
        113: 'f2',
        114: 'f3',
        115: 'f4',
        116: 'f5',
        117: 'f6',
        118: 'f7',
        119: 'f8',
        120: 'f9',
        121: 'f10',
        122: 'f11',
        123: 'f12',
        // number
        48: ['0', ')'],
        49: ['1', '!'],
        50: ['2', '@'],
        51: ['3', '#'],
        52: ['4', '$'],
        53: ['5', '%'],
        54: ['6', '^'],
        55: ['7', '&'],
        56: ['8', '*'],
        57: ['9', '('],
        // alphabet
        65: 'a',
        66: 'b',
        67: 'c',
        68: 'd',
        69: 'e',
        70: 'f',
        71: 'g',
        72: 'h',
        73: 'i',
        74: 'j',
        75: 'k',
        76: 'l',
        77: 'm',
        78: 'n',
        79: 'o',
        80: 'p',
        81: 'q',
        82: 'r',
        83: 's',
        84: 't',
        85: 'u',
        86: 'v',
        87: 'w',
        88: 'x',
        89: 'y',
        90: 'z',
        // symbol
        32: ' ',
        59: [';', ':'],
        61: ['=', '+'],
        173: ['-', '_'],
        188: [',', '<'],
        190: ['.', '>'],
        191: ['/', '?'],
        192: ['`', '~'],
        219: ['[', '{'],
        220: ['\\', '|'],
        221: [']', '}'],
        222: ['\'', '"']
    };
    r.keys_a = {
        'alternate': 'alt',
        'option': 'alt',
        'ctrl': 'control',
        'cmd': 'meta',
        'command': 'meta',
        'context': 'contextmenu',
        'return': 'enter',
        'ins': 'insert',
        'del': 'delete',
        'esc': 'escape',
        'home': 'pageup',
        'end': 'pagedown',
        'left': 'arrowleft',
        'up': 'arrowup',
        'right': 'arrowright',
        'down': 'arrowdown',
        'space': ' '
    };
    Object.defineProperty(KeyboardEvent.prototype, 'TE', {
        configurable: true,
        get: function() {
            // custom `KeyboardEvent.key` for internal use
            var t = this,
                k = t.key || r.keys[t.which || t.keyCode];
            function xx(x, y) {
                return y && (!is_set(x) || is_string(x) && (r.keys_a[x] || x) === k || x === true);
            }
            if (is_object(k)) {
                k = t.shiftKey ? (k[1] || k[0]) : k[0];
            }
            k = k.toLowerCase();
            return {
                key: function(x) {
                    if (!is_set(x)) return k;
                    if (is_pattern(x)) return x.test(k);
                    x = x.toLowerCase();
                    return (r.keys_a[x] || x) === k;
                },
                control: function(x) {
                    return xx(x, t.ctrlKey);
                },
                shift: function(x) {
                    return xx(x, t.shiftKey);
                },
                option: function(x) {
                    return xx(x, t.altKey);
                },
                meta: function(x) {
                    return xx(x, t.metaKey);
                }
            };
        }
    });

    // set value
    r.set = function(v) {
        return target.value = v, r;
    };

    // get value
    r.get = function(f) {
        if (is_set(f)) {
            return val().length ? val() : f;
        }
        return val();
    };

    // save state
    r.save = function(k, v) {
        return S[k] = v, r;
    };

    // restore state
    r.restore = function(k, f) {
        if (!is_set(k)) return S; // read all storage with `r.restore()`
        return is_set(S[k]) ? S[k] : (is_set(f) ? f : false);
    };

    // focus the editor
    r.focus = function(x, y) {
        if (x === true) {
            x = val().length; // put caret at the end of the editor
            y = target.scrollHeight; // scroll to the end of the editor
        } else if (x === false) {
            x = y = 0; // put caret at the start of the editor, scroll to the start of the editor
        }
        if (is_set(x)) {
            target.selectionStart = target.selectionEnd = x;
            target.scrollTop = y;
        }
        return target.focus(), r;
    };

    // blur the editor
    r.blur = function() {
        return target.blur(), r;
    };

    // get selection
    r.$ = function() {
        var v = val().replace(/\r/g, ""),
            a = target.selectionStart,
            b = target.selectionEnd,
            c = v.substring(a, b);
        return {
            start: a,
            end: b,
            value: c,
            before: v.substring(0, a),
            after: v.substring(b),
            length: c.length
        };
    };

    // select value
    r.select = function() {
        var arg = arguments,
            count = arg.length,
            a = d.documentElement,
            b = d.body,
            c = target,
            D = 'scrollTop',
            $ = r.$(),
            id = 'TE.scroll', z;
        r.save(id, [a[D], b[D], c[D]]).focus();
        if (count === 0) { // restore selection with `r.select()`
            arg[0] = $.start;
            arg[1] = $.end;
        } else if (count === 1) { // move caret position with `r.select(7)`
            if (arg[0] === true) { // select all with `r.select(true)`
                return c.select(), r;
            }
            arg[1] = arg[0];
        }
        target.setSelectionRange(arg[0], arg[1]); // default `r.select(7, 100)`
        z = r.restore(id, [0, 0, 0]);
        a[D] = z[0];
        b[D] = z[1];
        c[D] = z[2];
        return r; // `select` method #1
    };

    // match selection
    r.match = function(a, b) {
        var m = r.$().value.match(a);
        return is_func(b) ? b(m || []) : !!m; // `match` method #1
    };

    // replace at selection
    r.replace = function(f, t) {
        var $ = r.$(),
            a = $.start,
            b = $.end,
            c = $.value.replace(f, t);
        return r.set($.before + c + $.after).select(a, a + c.length).record();
    };

    // insert/replace at caret
    r.insert = function(s, x) {
        var $ = r.$(),
            a = $.start,
            b = $.end,
            c = $.value,
            d = $.before,
            e = $.after,
            f = d + s + e,
            g = s.length;
        if (x === -1) { // insert before
            f = d + s + c + e;
            a += g;
            b += g;
        } else if (x === 1) { // insert after
            f = d + c + s + e;
        } else {
            b = a + g;
        }
        return r.set(f).select(a, b).record();
    };

    // insert before selection
    r.insertBefore = function(s) {
        return r.insert(s, -1);
    };

    // insert after selection
    r.insertAfter = function(s) {
        return r.insert(s, 1);
    };

    // wrap selection
    r.wrap = function(O, C, wrap) {
        var $ = r.$(),
            a = $.before,
            b = $.after,
            c = $.value;
        if (wrap) {
            return r.replace(/^([\s\S]*?)$/, O + '$1' + C);
        }
        return r.set(a + O + c + C + b).select((a + O).length, (a + O + c).length).record();
    };

    // unwrap selection
    r.unwrap = function(O, C, wrap) {
        var $ = r.$(),
            a = $.before,
            b = $.after,
            c = $.value;
        O = get_pattern(O);
        C = get_pattern(C);
        if (wrap) {
            return r.replace(pattern('^' + O + '([\\s\\S]*?)' + C + '$'), '$1');
        }
        var A = a.replace(pattern(O + '$'), ""),
            B = b.replace(pattern('^' + C), "");
        return r.set(A + c + B).select(A.length, (A + c).length).record();
    };

    // indent
    r.indent = function(s) {
        var $ = r.$(),
            s = is_set(s) ? s : '\t';
        if ($.length) {
            return r.replace(/^(?!$)/gm, s);
        }
        return r.set($.before + s + $.value + $.after).select($.start + s.length).record();
    };

    // outdent
    r.outdent = function(s) {
        var $ = r.$(), a,
            s = is_set(s) ? s : '\t';
        s = get_pattern(s);
        if ($.length) {
            return r.replace(pattern('^' + s, 'gm'), "");
        }
        a = $.before.replace(pattern(s + '$'), "");
        return r.set(a + $.value + $.after).select(a.length).record();
    };

    // trim white-space before and after selection range
    r.trim = function(O, C, B, E) {
        O = O || "";
        C = C || "";
        B = B || "";
        E = E || "";
        var $ = r.$(),
            a = $.before,
            b = $.after,
            c = $.value,
            aa = a.replace(/\s*$/, O),
            bb = b.replace(/^\s*/, C),
            cc = c.replace(/^\s*([\s\S]*?)\s*$/g, B + '$1' + E);
        return r.set(aa + cc + bb).select(aa.length, (aa + cc).length); // `trim` method #1
    };

    // toggle state
    r.toggle = function(a, b) {
        if (!is_set(b)) {
            return r.select();
        }
        if (a === true) {
            a = 0;
        } else if (a === false) {
            a = 1;
        }
        return is_func(b[a]) ? (b[a](r, a), r) : r.select();
    };

    // save state to history
    r.record = function(a, i) {
        if (F) return r;
        var o = H[I],
            $ = r.$(),
            v = val(),
            w = $.start,
            x = $.end,
            a = is_set(a) ? a : [v, w, x];
        if (o && is_object(o) && (
            o[0] === v &&
            o[1] === w &&
            o[2] === x
        )) return r; // prevent duplicate history data
        I++;
        H[is_set(i) ? i : I] = a;
        return _ = H.length, r;
    };

    // remove state from history
    r.loss = function(i) {
        if (i === true) { // clear all history with `r.loss(true)`
            H = [H[0]];
            I = 0;
            return r;
        }
        i = is_set(i) ? i : I;
        if (i <= I) {
            I--;
        }
        H.splice(i, 1);
        return _ = H.length, r;
    };

    // read history
    r.records = function(i, f) {
        if (!is_set(i)) return H; // read all history with `r.records()`
        return is_set(H[i]) ? H[i] : (is_set(f) ? f : false);
    };

    // undo
    r.undo = function() {
        I--;
        I = edge(I, 0, _ - 1);
        var a = H[I];
        return r.set(a[0]).select(a[1], a[2]);
    };

    // redo
    r.redo = function() {
        I++;
        I = edge(I, 0, _ - 1);
        var a = H[I];
        return r.set(a[0]).select(a[1], a[2]);
    };

    // escape regex character(s)
    r.esc = function(x) {
        if (is_object(x)) {
            var o = [],
                i = x.length;
            while (i--) o.unshift(r.esc(x[i]));
            return o;
        }
        return x.replace(pattern('[' + r.x.replace(/./g, '\\$&') + ']', 'g'), '\\$&');
    };

    // disable the history feature
    r[0] = function() {
        return F = 1, r;
    };

    // enable the history feature
    r[1] = function(x) {
        return F = 0, (x === false ? r : r.record());
    };

    // the target element
    r.target = target;

    // return the global object
    return r;

};

// #1: ~ does not populate history data