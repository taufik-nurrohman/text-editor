/*!
 * ==========================================================
 *  TEXT EDITOR PLUGIN 2.6.5
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc) {

    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z,

        insert = 'insert',
        replace = 'replace',
        set = 'appendChild',
        reset = 'removeChild',
        content = 'textContent',
        cut = 'substring',
        start = 'selectionStart',
        end = 'selectionEnd',
        top = 'scrollTop',
        scroll = 'scroll',
        rec = 'record',
        rec_x = 'loss',
        select = 'select',
        create = 'createElement',
        instance = '__instance__';

    function cl(s) {
        return s.toLowerCase();
    }

    function cu(s) {
        return s.toUpperCase();
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
                a.style[camelize(i.replace(/^\!/, ""))] = j === 0 ? 0 : (j ? (is_string(j) ? j : j + 'px') : "");
            }
            return a;
        } else if (b) {
            if (b[0] === '!') {
                b = b.slice(1);
                k = 1;
            }
            i = o[camelize(b)];
            j = k ? i : num(i);
            return j === 0 ? 0 : (j || i);
        }
        return (function() {
            for (i in o) {
                j = num(o[i]);
                h[dasherize(i)] = j === 0 ? 0 : (j || o[i] || "");
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
                    if (!x || x === true) return k;
                    if (is_string(y)) {
                        y = t[y + 'Key'];
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
        $.version = '2.6.5';

        // collect all instance(s)
        $[instance] = {};

        // plug to all instance(s)
        $.each = function(fn, t) {
            return setTimeout(function() {
                j = $[instance];
                for (i in j) {
                    fn(j[i], i, j);
                }
            }, t === 0 ? 0 : (t || 1)), $;
        };

    })(win.TE = function(target) {

        var $ = this,
            any = /^([\s\S]*?)$/,
            history = 0, // current state of history
            history_x = 0, // history feature is active
            history_count = 1, // cache of history length
            bin = {}, // storage
            indent = '\t',
            html = doc.documentElement,
            body = doc.body,
            div = doc[create]('div'),
            span = doc[create]('span'),
            scroll_width = (function() {
                a = '-200px';
                b = '200px';
                body[set](div);
                css(div, {
                    'position': 'absolute',
                    'top': a,
                    'left': a,
                    'width': b,
                    'height': b,
                    'overflow': 'scroll',
                    'visibility': 'hidden'
                });
                c = div.offsetWidth - div.clientWidth;
                return body[reset](div), c;
            })(), H;

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
        $.x = '!$^*()-=+[]{}\\|:<>,./?'; // character(s) to escape

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

        function get_pattern(x) {
            return is_pattern(x) || esc(x);
        }

        // <https://github.com/component/textarea-caret-position>
        function offset(x) {
            var font = 'font-',
                text = 'text-',
                padding = 'padding-',
                border = 'border-',
                width = '-width',
                keep = '!',
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
                    'width',
                    'word-spacing'
                ];
            i = count(properties);
            body[set](div);
            t = css(target, properties);
            u = {};
            for (i in properties) {
                u[properties[i]] = t[i];
            }
            w = t[26];
            span[content] = val()[cut](x) || '.';
            css(div, extend(u, {
                'width': is_set(win.mozInnerScreenX) ? w : w + scroll_width, // Firefox :(
                'overflow-y': target.scrollHeight > t[13] ? 'scroll' : 'auto',
                'white-space': 'pre-wrap',
                'word-wrap': 'break-word',
                'position': 'absolute',
                'visibility': 'hidden'
            }));
            div[content] = val()[cut](0, x);
            div[set](span);
            o = {
                x: span.offsetLeft + t[1],
                y: span.offsetTop + t[3]
            };
            return body[reset](div), o;
        }

        // access editor instance from `this` scope with `this.TE`
        target.TE = $;

        // store editor instance to `TE.__instance__`
        TE[instance][target.id || target.name || count(Object.keys(TE[instance]))] = $;

        // scroll the editor
        $[scroll] = function(i) {
            c = target[top];
            h = css(target, ['line-height', 'font-size']);
            if (!is_set(i)) {
                return [Math.floor(c / h[0]), h[0]];
            } else if (is_boolean(i)) {
                return $[scroll]($[scroll]()[0] + (i === false ? -1 : 1));
            }
            return target[top] = (h[0] * i) + h[1] + (h[0] - h[1]), $;
        };

        // set value
        $.set = function(v) {
            return target.value = v, $;
        };

        // get value
        $.get = function(f) {
            if (is_set(f)) {
                return count(val()) ? val() : f;
            }
            return val();
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
        $.focus = function(x, y) {
            if (x === true) {
                x = count(val()); // put caret at the end of the editor
                y = target.scrollHeight; // scroll to the end of the editor
            } else if (x === false) {
                x = y = 0; // put caret at the start of the editor, scroll to the start of the editor
            }
            if (is_set(x)) {
                target[start] = target[end] = x;
                target[top] = y;
            }
            return target.focus(), $;
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
                t.caret = d ? [offset(a), offset(b)] : [];
                t.length = count(e);
                t.toString = function() {
                    return e;
                };
            }
            return new $$(target[start], target[end], val(), caret);
        };

        // select value
        $[select] = function() {
            var arg = arguments,
                counts = count(arg),
                s = $.$(),
                id = 'TE.scroll';
            $.save(id, [html[top], body[top], target[top]]).focus();
            if (counts === 0) { // restore selection with `$.select()`
                arg[0] = s.start;
                arg[1] = s.end;
            } else if (counts === 1) { // move caret position with `$.select(7)`
                if (arg[0] === true) { // select all with `$.select(true)`
                    return target[select](), $;
                }
                arg[1] = arg[0];
            }
            target.setSelectionRange(arg[0], arg[1]); // default `$.select(7, 100)`
            o = $.restore(id, [0, 0, 0]);
            html[top] = o[0];
            body[top] = o[1];
            target[top] = o[2];
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
            if (history_x) return $;
            o = H[history];
            s = $.$();
            v = val();
            w = s.start;
            x = s.end;
            a = is_set(a) ? a : [v, w, x, $[scroll]()[0]];
            if (o && is_object(o) && (
                o[0] === v &&
                o[1] === w &&
                o[2] === x
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
            return $.set(a[0])[select](a[1], a[2])[scroll](a[3]);
        };

        // redo
        $.redo = function() {
            history++;
            a = H[history = edge(history, 0, history_count - 1)];
            return $.set(a[0])[select](a[1], a[2])[scroll](a[3]);
        };

        // disable the history feature
        $[0] = function() {
            return history_x = 1, $;
        };

        // enable the history feature
        $[1] = function(x) {
            return history_x = 0, (x === false ? $ : $[rec]());
        };

        // logic ...
        $.is = function(s, x) {
            x = is_set(x) ? x : false;
            if (is_pattern(s)) {
                return s.test($.type) ? $.type : x;
            }
            return $.type === s ? $.type : x;
        };

        var check = {
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

        for (i in check) $.is[i] = check[i];

        // utility ...
        $._ = {
            x: esc,
            extend: extend,
            each: each,
            trim: trim,
            css: css,
            edge: edge,
            pattern: pattern,
            i: num
        };

        // the target element
        $.target = target;

        // return the global object
        return $;

    });

})(window, document);