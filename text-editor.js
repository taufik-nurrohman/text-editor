/*!
 * ==========================================================
 *  TEXT EDITOR 2.8.2
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc) {

    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z,

        insert = 'insert',
        replace = 'replace',
        children = 'children',
        set = 'appendChild',
        reset = 'removeChild',
        content = 'innerHTML',
        cut = 'substring',
        start = 'selectionStart',
        end = 'selectionEnd',
        scroll = 'scroll',
        left = scroll + 'Left',
        top = scroll + 'Top',
        left_o = 'offsetLeft',
        top_o = 'offsetTop',
        rec = 'record',
        rec_x = 'loss',
        focus = 'focus',
        select = 'select',
        create = 'createElement',
        instance = '__instance__';

    function cl(s) {
        return s.toLowerCase();
    }

    function cu(s) {
        return s.toUpperCase();
    }

    function enc(s) {
        return s[replace](/&/g, '&amp;')[replace](/</g, '&lt;')[replace](/>/g, '&gt;');
    }

    function count(x) {
        return x.length;
    }

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_string(x) {
        return typeof x === "string";
    }

    function is_number(x) {
        return typeof x === "number";
    }

    function is_function(x) {
        return typeof x === "function";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function is_array(x) {
        return x instanceof Array;
    }

    function is_boolean(x) {
        return typeof x === "boolean";
    }

    function is_pattern(x) {
        return x instanceof RegExp ? (x.source || true) : false;
    }

    function is_dom(x) {
        return x instanceof HTMLElement;
    }

    function edge(a, b, c) {
        if (is_set(b) && a < b) return b;
        if (is_set(c) && a > c) return c;
        return a;
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function trim(s, x) {
        if (x === 0) {
            return s[replace](/^\s*/, ""); // trim left
        } else if (x === 1) {
            return s[replace](/\s*$/, ""); // trim right
        }
        return s[replace](/^\s*|\s*$/g, "") // trim left and right
    }

    function num(x, i) {
        return parseInt(x, is_set(i) ? i : 10);
    }

    function camelize(s) {
        return s[replace](/\-([a-z])/g, function(a, b) {
            return cu(b);
        });
    }

    function dasherize(s) {
        return s[replace](/([A-Z])/g, function(a, b) {
            return '-' + cl(b);
        });
    }

    function css(a, b, c) {
        var o = win.getComputedStyle(a, (c = c || null)),
            h = {}, i, j, k, l;
        if (is_object(b)) {
            if (is_array(b)) {
                o = [];
                for (i in b) {
                    if (j = b[i]) {
                        l = css(a, j, c);
                        o[i] = l;
                    }
                }
                return o;
            }
            for (i in b) {
                j = b[i];
                a.style[camelize(i[replace](/^\0/, ""))] = j === 0 ? 0 : (j ? (is_string(j) ? j : j + 'px') : "");
            }
            return a;
        } else if (b) {
            if (b[0] === '\0') {
                b = b.slice(1);
                k = 1;
            }
            i = o[camelize(b)];
            j = k ? i : num(i);
            return j === 0 ? 0 : (j || i);
        }
        return (function() {
            for (i in o) {
                j = o.getPropertyValue(i);
                if (!j) continue;
                k = num(j);
                h[dasherize(i)] = k === 0 ? 0 : (k || j || "");
            }
            return h;
        })();
    }

    function extend(a, b) {
        b = b || {};
        for (i in b) {
            if (is_object(a[i]) && is_object(b[i]) && !is_dom(a[i]) && !is_dom(b[i])) {
                a[i] = extend(a[i], b[i]);
            } else {
                a[i] = b[i];
            }
        }
        return a;
    }

    function each(a, fn) {
        var i, j, k;
        if (is_array(a)) {
            for (i = 0, j = count(a); i < j; ++i) {
                k = fn(a[i], i, a);
                if (k === true) {
                    continue;
                } else if (k === false) {
                    break;
                }
            }
        } else {
            for (i in a) {
                k = fn(a[i], i, a);
                if (k === true) {
                    continue;
                } else if (k === false) {
                    break;
                }
            }
        }
        return a;
    }

    function timer_set(fn, i) {
        return setTimeout(fn, i || 0);
    }

    function timer_reset(timer_set_fn) {
        return clearTimeout(timer_set_fn);
    }

    (function($) {

        // key maps for the deprecated `KeyboardEvent.keyCode`
        var keys = {
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
        },

        // key alias(es)
        keys_alias = {
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
            'back': 'backspace',
            'space': ' ',
            'plus': '+',
            'minus': '-'
        }, i, j;

        // function
        for (i = 1; i < 25; ++i) {
            keys[111 + i] = 'f' + i;
        }

        // alphabet
        for (i = 65; i < 91; ++i) {
            keys[i] = cl(String.fromCharCode(i));
        }

        // register key(s)
        $.keys = keys;
        $.keys_alias = keys_alias;

        // add `KeyboardEvent.TE` property
        Object.defineProperty(KeyboardEvent.prototype, 'TE', {
            configurable: true,
            get: function() {
                // custom `KeyboardEvent.key` for internal use
                var t = this,
                    keys = $.keys, // refresh ...
                    keys_alias = $.keys_alias, // refresh ...
                    k = t.key ? cl(t.key) : keys[t.which || t.keyCode];
                if (is_object(k)) {
                    k = t.shiftKey ? (k[1] || k[0]) : k[0];
                }
                k = cl(k);
                function ret(x, y) {
                    if (is_string(y)) {
                        y = t[y + 'Key'];
                    }
                    if (!x || x === true) {
                        if (is_boolean(y)) {
                            return y;
                        }
                        return k;
                    }
                    if (is_pattern(x)) return y && x.test(k);
                    return x = cl(x), y && (keys_alias[x] || x) === k;
                }
                return {
                    key: function(x) {
                        return ret(x, 1);
                    },
                    control: function(x) {
                        return ret(x, 'ctrl');
                    },
                    shift: function(x) {
                        return ret(x, 'shift');
                    },
                    option: function(x) {
                        return ret(x, 'alt');
                    },
                    meta: function(x) {
                        return ret(x, 'meta');
                    }
                };
            }
        });

        // plugin version
        $.version = '2.8.2';

        // collect all instance(s)
        $[instance] = {};

        // plug to all instance(s)
        $.each = function(fn, t) {
            return timer_set(function() {
                j = $[instance];
                for (i in j) {
                    fn(j[i], i, j);
                }
            }, t === 0 ? 0 : (t || 1)), $;
        };

        // character(s) to escape
        $.x = '!$^*()-=+[]{}\\|:<>,./?';

        function esc(x) {
            if (is_array(x)) {
                o = [];
                for (i in x) {
                    o[i] = esc(x[i]);
                }
                return o;
            }
            return x[replace](pattern('[' + $.x[replace](/./g, '\\$&') + ']', 'g'), '\\$&');
        }

        // utility ...
        $._ = {
            x: esc,
            extend: extend,
            each: each,
            trim: trim,
            css: css,
            edge: edge,
            pattern: pattern,
            i: num,
            timer: {
                set: timer_set,
                reset: timer_reset
            }
        };

        $.is = {
            a: is_array,
            b: is_boolean,
            e: is_dom,
            f: is_function,
            i: is_number,
            n: function(x) {
                return x === null;
            },
            o: is_object,
            r: is_pattern,
            s: is_string,
            x: function(x) {
                return !is_set(x);
            }
        };

    })(win.TE = function(target) {

        var $ = this,
            any = /^([\s\S]*?)$/,
            history = 0, // current state of history
            history_count = 1, // cache of history length
            bin = {}, // storage
            indent = '\t',
            html = doc.documentElement,
            body = doc.body,
            div = doc[create]('div'), H;

        function get_pattern(x) {
            return is_pattern(x) || TE._.x(x);
        }

        function get_caret_px(s) {
            var span = '<span>&zwnj;</span>',
                font = 'font-',
                text = 'text-',
                padding = 'padding-',
                border = 'border-',
                width = '-width',
                keep = '\0',
                properties = [
                    border + 'bottom' + width,
                    border + 'left' + width,
                    border + 'right' + width,
                    border + 'top' + width,
                    'box-sizing',
                    'direction',
                    keep + font + 'family',
                    font + 'size',
                    keep + font + 'size-adjust',
                    keep + font + 'stretch',
                    keep + font + 'style',
                    keep + font + 'variant',
                    keep + font + 'weight',
                    'height',
                    'letter-spacing',
                    'line-height',
                    padding + 'bottom',
                    padding + 'left',
                    padding + 'right',
                    padding + 'top',
                    'tab-size',
                    text + 'align',
                    text + 'decoration',
                    text + 'indent',
                    text + 'transform',
                    'width',
                    'word-spacing'
                ];
            i = count(properties);
            body[set](div);
            if (!s) return;
            t = css(target, properties);
            u = {};
            for (i in properties) {
                u[properties[i]] = t[i];
            }
            div[content] = enc(s.before) + span + enc(s.value) + span + enc(s.after);
            css(div, extend(u, {
                'width': t[25] + 'px',
                'white-space': 'pre-wrap',
                'word-wrap': 'break-word',
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'overflow': 'auto',
                'visibility': 'hidden'
            }));
            return [{
                x: div[children][0][left_o] + t[1],
                y: div[children][0][top_o] + t[3]
            }, {
                x: div[children][1][left_o] + t[1],
                y: div[children][1][top_o] + t[3]
            }];
        }

        if (!is_set(target)) {
            target = doc[create]('textarea');
        }

        function val() {
            return target.value[replace](/\r/g, "");
        }

        // load the first history data
        H = [[val(), 0, 0, 0]];

        // return a new instance if `TE` was called without the `new` operator
        if (!($ instanceof TE)) {
            return new TE(target);
        }

        $.type = ""; // default editor type
        $.h = 1; // history feature is active

        // store editor instance to `TE.__instance__`
        TE[instance][target.id || target.name || count(Object.keys(TE[instance]))] = $;

        // scroll the editor
        $[scroll] = function(i, j) {
            c = target[top];
            h = css(target, 'line-height');
            if (!is_set(i)) {
                return [Math.floor(c / h), h];
            } else if (!is_set(j)) {
                if (i === true) {
                    return target[top] = target[scroll + 'Height'], $;
                }
                return $[scroll](0, $[scroll]()[0] + i);
            }
            return target[top] = h * j, $;
        };

        // set value
        $.set = function(v) {
            if (target.disabled || target.readOnly) return $;
            return target.value = v, $;
        };

        // get value
        $.get = function(f) {
            f = is_set(f) ? f : "";
            g = val();
            if (target.disabled) return f;
            return count(g) ? g : f;
        };

        // save state
        $.save = function(k, v) {
            return bin[k] = v, $;
        };

        // restore state
        $.restore = function(k, f) {
            if (!is_set(k)) return bin; // read all storage with `$.restore()`
            return is_set(bin[k]) ? bin[k] : (is_set(f) ? f : "");
        };

        // focus the editor
        $[focus] = function(x, y) {
            if (x === 0) {
                x = y = 0; // put caret at the start of the editor, scroll to the start of the editor
            } else if (x === 1) {
                x = count(val()); // put caret at the end of the editor
                y = target[scroll + 'Height']; // scroll to the end of the editor
            }
            if (is_set(x)) {
                target[start] = target[end] = x;
                target[top] = y;
            }
            return target[focus](), $;
        };

        // blur the editor
        $.blur = function() {
            return target.blur(), $;
        };

        // get selection
        $.$ = function(caret) {
            function $$(a, b, c, d) {
                t = this;
                t.start = a;
                t.end = b;
                t.value = (e = c[cut](a, b));
                t.before = c[cut](0, a);
                t.after = c[cut](b);
                t.caret = d ? get_caret_px($.$()) : [];
                t.toString = function() {
                    return e;
                };
            }
            var o = new $$(target[start], target[end], val(), caret);
            o.length = count(e);
            return o;
        };

        // select value
        $[select] = function() {
            var arg = arguments,
                counts = count(arg),
                s = $.$();
            x = win.pageXOffset || html[left] || body[left];
            y = win.pageYOffset || html[top] || body[top];
            z = target[top];
            if (counts === 0) { // restore selection with `$.select()`
                arg[0] = s.start;
                arg[1] = s.end;
            } else if (counts === 1) { // move caret position with `$.select(7)`
                if (arg[0] === true) { // select all with `$.select(true)`
                    return target[select](), $;
                }
                arg[1] = arg[0];
            }
            target[focus]();
            if (target.disabled || target.readOnly) return $;
            target.setSelectionRange(arg[0], arg[1]); // default `$.select(7, 100)`
            target[top] = z, win.scroll(x, y);
            return $; // `select` method does not populate history data
        };

        // match selection
        $.match = function(a, b) {
            m = $.$().value.match(a);
            return is_function(b) ? b(m || []) : !!m; // `match` method does not populate history data
        };

        // replace at selection
        $[replace] = function(f, t, x) {
            s = $.$();
            a = s.before;
            b = s.after;
            c = s.value;
            if (x === 0) { // replace before
                a = a[replace](f, t);
            } else if (x === 1) { // replace after
                b = b[replace](f, t);
            } else {
                c = c[replace](f, t);
            }
            d = count(a);
            e = d + count(c);
            return $.set(a + c + b)[select](d, e)[rec]();
        };

        // replace before selection
        $[replace + 'Before'] = function(f, t) {
            return $[replace](f, t, 0);
        };

        // replace after selection
        $[replace + 'After'] = function(f, t) {
            return $[replace](f, t, 1);
        };

        // insert/replace at caret
        $[insert] = function(s, x, clear) {
            f = any;
            if (clear && count($.$())) {
                $[replace](f, "")[rec_x](); // force to delete selection on insert before/after?
            }
            if (x === 0) { // insert before
                f = /$/;
            } else if (x === 1) { // insert after
                f = /^/;
            }
            return $[replace](f, s, x);
        };

        // insert before selection
        $[insert + 'Before'] = function(s, clear) {
            return $[insert](s, 0, clear);
        };

        // insert after selection
        $[insert + 'After'] = function(s, clear) {
            return $[insert](s, 1, clear);
        };

        // wrap selection
        $.wrap = function(O, C, wrap) {
            s = $.$();
            a = s.before;
            b = s.after;
            c = s.value;
            if (wrap) {
                return $[replace](any, O + '$1' + C);
            }
            return $.set(a + O + c + C + b)[select](count(a + O), count(a + O + c))[rec]();
        };

        // unwrap selection
        $.unwrap = function(O, C, wrap) {
            s = $.$();
            a = s.before;
            b = s.after;
            c = s.value;
            O = get_pattern(O);
            C = get_pattern(C);
            f = pattern(O + '$');
            g = pattern('^' + C);
            if (wrap) {
                return $[replace](pattern('^' + O + '([\\s\\S]*?)' + C + '$'), '$1');
            }
            if (f.test(a) && g.test(b)) {
                d = a[replace](f, "");
                e = b[replace](g, "");
                return $.set(d + c + e)[select](count(d), count(d + c))[rec]();
            }
            return $[select]();
        };

        // indent
        $.indent = function(B, e) {
            s = $.$();
            B = is_set(B) ? B : indent;
            if (count(s)) {
                return $[replace](pattern('^' + (e ? "" : '(?!$)'), 'gm'), B);
            }
            return $[insert](B, 0);
        };

        // outdent
        $.outdent = function(B) {
            s = $.$();
            B = is_set(B) ? B : indent;
            B = get_pattern(B);
            if (count(s)) {
                return $[replace](pattern('^' + B, 'gm'), "");
            }
            return $[replace](pattern(B + '$'), "", 0);
        };

        // trim white-space before and after selection range
        $.trim = function(O, C, B, E) {
            if (O !== false) O = O || "";
            if (C !== false) C = C || "";
            if (B !== false) B = B || "";
            if (E !== false) E = E || "";
            s = $.$();
            a = s.before;
            b = s.after;
            c = s.value;
            d = O !== false ? trim(a, 1) + O : a,
            e = C !== false ? C + trim(b, 0) : b,
            f = (B !== false ? B : "") + trim(c) + (E !== false ? E : "");
            return $.set(d + f + e)[select](count(d), count(d + f)); // `trim` method does not populate history data
        };

        // toggle state
        $.toggle = function(a, b) {
            if (!is_set(b)) {
                return $[select]();
            }
            if (a === true) {
                a = 0;
            } else if (a === false) {
                a = 1;
            }
            return is_function(b[a]) ? (b[a]($, a), $) : $[select]();
        };

        // save state to history
        $[rec] = function(a, i) {
            if (!$.h) return $;
            o = H[history];
            s = $.$();
            v = val();
            w = s.start;
            x = s.end;
            a = is_set(a) ? a : [v, w, x, $[scroll]()[0]];
            if (o && is_object(o) && (
                o[0] === a[0] &&
                o[1] === a[1] &&
                o[2] === a[2]
            )) return $; // prevent duplicate history data
            history++;
            H[is_set(i) ? i : history] = a;
            return history_count = count(H), $;
        };

        // remove state from history
        $[rec_x] = function(i) {
            if (i === true) { // clear all history with `$.loss(true)`
                H = [H[0]];
                history = 0;
                return $;
            }
            i = is_set(i) ? i : history;
            if (i <= history) {
                history--;
            }
            H.splice(i, 1);
            return history_count = count(H), $;
        };

        // read history
        $[rec + 's'] = function(i, f) {
            if (!is_set(i)) return H; // read all history with `$.records()`
            return is_set(H[i]) ? H[i] : (is_set(f) ? f : false);
        };

        // undo
        $.undo = function() {
            history--;
            a = H[history = edge(history, 0, history_count - 1)];
            return $.set(a[0])[select](a[1], a[2])[scroll](0, a[3]);
        };

        // redo
        $.redo = function() {
            history++;
            a = H[history = edge(history, 0, history_count - 1)];
            return $.set(a[0])[select](a[1], a[2])[scroll](0, a[3]);
        };

        // disable the history feature
        $[0] = function() {
            return $.h = 0, $;
        };

        // enable the history feature
        $[1] = function(x) {
            return $.h = 1, (x === false ? $ : $[rec]());
        };

        // logic ...
        $.is = function(s, x) {
            x = is_set(x) ? x : false;
            if (is_pattern(s)) {
                return s.test($.type) ? $.type : x;
            }
            return $.type === s ? $.type : x;
        };

        // make a copy of utility ...
        extend($._ = {}, TE._);

        // --ditto
        for (i in TE.is) $.is[i] = TE.is[i];

        // the target element
        $.target = target;

        // the invisible target copy element
        $.mirror = div;

        // return the global object
        return get_caret_px(), $;

    });

})(window, document);