/*!
 * ==========================================================
 *  TEXT EDITOR PLUGIN 2.4.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

var TE = function(target) {

    var w = window,
        d = document,
        r = this,
        _ = 1, // cache of history length
        F = 0, // history feature is active
        H = [[val(), 0, 0, 0]], // load the first history data
        I = 0, // current state of history
        S = {}, // storage
        div = d.createElement('div'),
        span = d.createElement('span'),
        nbsp = '\u00A0',
        tab = '\t',
        scroll_width = (function() {
            var x = d.createElement('div'),
                y = d.body,
                z = x.style, w;
            y.appendChild(x);
            z.position = 'absolute';
            z.top = z.left = '-9999px';
            z.width = z.height = '100px';
            z.overflow = 'scroll';
            z.visibility = 'hidden';
            w = x.offsetWidth - x.clientWidth;
            y.removeChild(x);
            return w;
        })();

    r.type = ""; // default editor type
    r.x = '!$^*()-=+[]{}\\|:<>,./?'; // character(s) to escape

    function val() {
        return target.value.replace(/\r/g, "");
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

    function is_node(x) {
        return x instanceof HTMLElement;
    }

    function get_pattern(x) {
        return is_pattern(x) || r._.x(x);
    }

    function edge(a, b, c) {
        if (a < b) return b;
        if (a > c) return c;
        return a;
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function num(x) {
        return parseInt(x, 10);
    }

    function css(a, b) {
        var o = w.getComputedStyle(a);
        return b ? o[b.replace(/\-([a-z])/g, function(a, b) {
            return b.toUpperCase();
        })] : o;
    }

    function extend(a, b) {
        b = b || {};
        for (var i in b) {
            if (is_object(a[i]) && is_object(b[i]) && !is_node(a[i]) && !is_node(b[i])) {
                a[i] = extend(a[i], b[i]);
            } else {
                a[i] = b[i];
            }
        }
        return a;
    }

    // <https://github.com/component/textarea-caret-position>
    function offset(x) {
        var font = 'font-',
            text = 'text-',
            padding = 'padding-',
            prop = [
                'box-sizing',
                'direction',
                font + 'family',
                font + 'size',
                font + 'size-adjust',
                font + 'stretch',
                font + 'style',
                font + 'variant',
                font + 'weight',
                'height',
                'letter-pacing',
                'line-height',
                'overflow-x',
                padding + 'bottom',
                padding + 'left',
                padding + 'right',
                padding + 'top',
                'tab-size',
                text + 'align',
                text + 'decoration',
                text + 'indent',
                text + 'transform',
                'word-spacing'
            ];
        var b = d.body,
            i = prop.length,
            s, t, o, v, width,
            input = target.nodeName === 'INPUT';
        b.appendChild(div);
        s = div.style;
        t = css(target);
        width = num(t.width);
        s.whiteSpace = 'pre-wrap';
        if (!input) {
            s.wordWrap = 'break-word';
        }
        s.position = 'absolute';
        s.visibility = 'hidden';
        while (--i) s[prop[i]] = t[prop[i]];
        s.overflowY = target.scrollHeight > num(t.height) ? 'scroll' : 'auto';
        if (is_set(w.mozInnerScreenX)) { // Firefox :(
            s.width = width + 'px';
        } else {
            s.width = width + scroll_width + 'px';
        }
        span.textContent = val().substring(x) || '.';
        v = val().substring(0, x);
        if (input) {
            v = v.replace(/\s/g, nbsp);
        }
        div.textContent = v;
        div.appendChild(span);
        o = {
            x: span.offsetLeft + num(t.borderLeftWidth),
            y: span.offsetTop + num(t.borderTopWidth)
        };
        b.removeChild(div);
        return o;
    }

    // access editor instance from `this` scope with `this.TE`
    target.TE = r;

    // store editor instance to `TE.__instance__`
    TE.__instance__[target.id || target.name || Object.keys(TE.__instance__).length] = r;

    // scroll the editor
    r.scroll = function(i) {
        var current = target.scrollTop,
            h = num(css(target, 'line-height'));
        if (!is_set(i)) {
            return Math.floor(current / h);
        } else if (is_string(i)) {
            return r.scroll(r.scroll() + (i === '-' ? -1 : 1)), r;
        }
        return target.scrollTop = h * i, r;
    };

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
    r.$ = function(O) {
        var v = val().replace(/\r/g, ""),
            a = target.selectionStart,
            b = target.selectionEnd,
            c = v.substring(a, b),
            o = O ? [offset(a), offset(b)] : [];
        return {
            start: a,
            end: b,
            value: c,
            before: v.substring(0, a),
            after: v.substring(b),
            caret: o,
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
        c.setSelectionRange(arg[0], arg[1]); // default `r.select(7, 100)`
        z = r.restore(id, [0, 0, 0]);
        a[D] = z[0];
        b[D] = z[1];
        c[D] = z[2];
        return r; // `select` method does not populate history data
    };

    // match selection
    r.match = function(a, b) {
        var m = r.$().value.match(a);
        return is_func(b) ? b(m || []) : !!m; // `match` method does not populate history data
    };

    // replace at selection
    r.replace = function(f, t) {
        if (!is_set(t) && !is_pattern(f)) {
            t = f;
            f = /^[\s\S]*?$/;
        }
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
            c = $.value,
            A, B, before, after;
        O = get_pattern(O);
        C = get_pattern(C);
        before = pattern(O + '$');
        after = pattern('^' + C);
        if (wrap) {
            return r.replace(pattern('^' + O + '([\\s\\S]*?)' + C + '$'), '$1');
        }
        if (before.test(a) && after.test(b)) {
            A = a.replace(before, "");
            B = b.replace(after, "");
            return r.set(A + c + B).select(A.length, (A + c).length).record();
        }
        return r.select();
    };

    // indent
    r.indent = function(s) {
        var $ = r.$(),
            s = is_set(s) ? s : tab;
        if ($.length) {
            return r.replace(/^(?!$)/gm, s);
        }
        return r.set($.before + s + $.value + $.after).select($.start + s.length).record();
    };

    // outdent
    r.outdent = function(s) {
        var $ = r.$(), a,
            s = is_set(s) ? s : tab;
        s = get_pattern(s);
        if ($.length) {
            return r.replace(pattern('^' + s, 'gm'), "");
        }
        a = $.before.replace(pattern(s + '$'), "");
        return r.set(a + $.value + $.after).select(a.length).record();
    };

    // trim white-space before and after selection range
    r.trim = function(O, C, B, E) {
        if (O !== false) O = O || "";
        if (C !== false) C = C || "";
        if (B !== false) B = B || "";
        if (E !== false) E = E || "";
        var $ = r.$(),
            a = $.before,
            b = $.after,
            c = $.value,
            aa = O !== false ? a.replace(/\s*$/, O) : a,
            bb = C !== false ? b.replace(/^\s*/, C) : b,
            cc = c.replace(/^(\s*)([\s\S]*?)(\s*)$/g, (B !== false ? B : '$1') + '$2' + (E !== false ? E : '$3'));
        return r.set(aa + cc + bb).select(aa.length, (aa + cc).length); // `trim` method does not populate history data
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
            a = is_set(a) ? a : [v, w, x, r.scroll()];
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
        return r.set(a[0]).select(a[1], a[2]).scroll(a[3]);
    };

    // redo
    r.redo = function() {
        I++;
        I = edge(I, 0, _ - 1);
        var a = H[I];
        return r.set(a[0]).select(a[1], a[2]).scroll(a[3]);
    };

    // utility ...
    r._ = {
        // capture current time
        time: function() {
            var time = new Date(),
                year = time.getFullYear(),
                month = time.getMonth() + 1,
                date = time.getDate(),
                hour = time.getHours(),
                minute = time.getMinutes(),
                second = time.getSeconds(),
                millisecond = time.getMilliseconds();
            if (month < 10) month = '0' + month;
            if (date < 10) date = '0' + date;
            if (hour < 10) hour = '0' + hour;
            if (minute < 10) minute = '0' + minute;
            if (second < 10) second = '0' + second;
            if (millisecond < 10) millisecond = '0' + millisecond;
            return [
                "" + year,
                "" + month,
                "" + date,
                "" + hour,
                "" + minute,
                "" + second,
                "" + millisecond
            ];
        },
        // escape regex character(s)
        x: function(x) {
            if (is_object(x)) {
                var o = [],
                    i = x.length;
                while (i--) o.unshift(r._.x(x[i]));
                return o;
            }
            return x.replace(pattern('[' + r.x.replace(/./g, '\\$&') + ']', 'g'), '\\$&');
        },
        // extend object ...
        extend: extend,
        // iterate ...
        each: function(a, fn) {
            var x;
            for (var i in a) {
                x = fn(a[i], i, a);
                if (x === true) {
                    continue;
                } else if (x === false) {
                    break;
                }
            }
            return a;
        },
        css: css
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

(function(r) {

    // Plugin version
    r.version = '2.4.1';

    // Collect all instance(s)
    r.__instance__ = {};

    // Plug to all instance(s)
    r.each = function(fn, t) {
        return setTimeout(function() {
            var ins = r.__instance__, i;
            for (i in ins) {
                fn(ins[i]);
            }
        }, t === 0 ? 0 : (t || 1)), r;
    };

    // Key maps for the deprecated `KeyboardEvent.keyCode`
    r.keys = {
        // control
        3: 'cancel',
        6: 'help',
        8: 'backspace',
        9: 'tab',
        12: 'clear',
        13: 'enter',
        16: 'shift',
        17: 'control',
        18: 'alt',
        19: 'pause',
        20: 'capslock', // not working on `keypress`
        27: 'escape',
        28: 'convert',
        29: 'nonconvert',
        30: 'accept',
        31: 'modechange',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'arrowleft',
        38: 'arrowup',
        39: 'arrowright',
        40: 'arrowdown',
        41: 'select',
        42: 'print',
        43: 'execute',
        44: 'printscreen', // works only on `keyup` :(
        45: 'insert',
        46: 'delete',
        91: 'meta', // <https://bugzilla.mozilla.org/show_bug.cgi?id=1232918>
        93: 'contextmenu',
        144: 'numlock',
        145: 'scrolllock',
        181: 'volumemute',
        182: 'volumedown',
        183: 'volumeup',
        224: 'meta',
        225: 'altgraph',
        246: 'attn',
        247: 'crsel',
        248: 'exsel',
        249: 'eraseeof',
        250: 'play',
        251: 'zoomout',
        // num
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

    // Key alias(es)
    r.keys_alt = {
        'alternate': 'alt',
        'option': 'alt',
        'ctrl': 'control',
        'cmd': 'meta',
        'command': 'meta',
        'os': 'meta', // <https://bugzilla.mozilla.org/show_bug.cgi?id=1232918>
        'context': 'contextmenu',
        'return': 'enter',
        'ins': 'insert',
        'del': 'delete',
        'esc': 'escape',
        'left': 'arrowleft',
        'right': 'arrowright',
        'up': 'arrowup',
        'down': 'arrowdown',
        'space': ' ',
        'plus': '+'
    };

    // small caps
    function scap(x) {
        return x.toLowerCase();
    }

    // function
    for (var i = 1; i < 25; ++i) {
        r.keys[111 + i] = 'f' + i;
    }

    // alphabet
    for (var s = "", i = 65; i < 91; ++i) {
        r.keys[i] = scap(String.fromCharCode(i));
    }

    // Add `KeyboardEvent.TE` property
    Object.defineProperty(KeyboardEvent.prototype, 'TE', {
        configurable: true,
        get: function() {
            var keys = r.keys,
                keys_alt = r.keys_alt;
            // custom `KeyboardEvent.key` for internal use
            var t = this,
                k = t.key ? scap(t.key) : keys[t.which || t.keyCode];
            if (typeof k === "object") {
                k = t.shiftKey ? (k[1] || k[0]) : k[0];
            }
            k = scap(k);
            function ret(x, y) {
                if (!x || x === true) return y;
                return x = scap(x), y && (keys_alt[x] || x) === k;
            }
            return {
                key: function(x) {
                    if (!x || x === true) return k;
                    if (x instanceof RegExp) return x.test(k);
                    return x = scap(x), (keys_alt[x] || x) === k;
                },
                control: function(x) {
                    return ret(x, t.ctrlKey);
                },
                shift: function(x) {
                    return ret(x, t.shiftKey);
                },
                option: function(x) {
                    return ret(x, t.altKey);
                },
                meta: function(x) {
                    return ret(x, t.metaKey);
                }
            };
        }
    });

})(TE);