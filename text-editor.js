/*!
 * ==========================================================
 *  TEXT EDITOR PLUGIN 2.6.3
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(w, d) {

    function cl(s) {
        return s.toLowerCase();
    }

    function cu(s) {
        return s.toUpperCase();
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
            return s.replace(/^\s*/, ""); // trim left
        } else if (x === 1) {
            return s.replace(/\s*$/, ""); // trim right
        }
        return s.replace(/^\s*|\s*$/g, "") // trim left and right
    }

    function num(x, i) {
        return parseInt(x, is_set(i) ? i : 10);
    }

    function camelize(s) {
        return s.replace(/\-([a-z])/g, function(a, b) {
            return cu(b);
        });
    }

    function dasherize(s) {
        return s.replace(/([A-Z])/g, function(a, b) {
            return '-' + cl(b);
        });
    }

    function css(a, b, c) {
        var o = w.getComputedStyle(a, c),
            g = 0,
            h = {}, i, j, k, l;
        if (is_object(b)) {
            if (is_array(b)) {
                o = {};
                for (i in b) {
                    i = b[i];
                    l = css(a, i, c);
                    o[g] = l;
                    o[i.replace(/^\!/, "")] = l;
                    ++g;
                }
                return o;
            }
            for (i in b) {
                j = b[i];
                a.style[camelize(i)] = j ? (is_string(j) ? j : j + 'px') : "";
            }
            return a;
        }
        return b ? (b[0] === '!' && (b = b.slice(1), k = 1), i = o[camelize(b)], j = k ? i : num(i), j === 0 ? 0 : (j || i)) : (function() {
            for (i in o) {
                j = num(o[i]);
                h[dasherize(i)] = j === 0 ? 0 : (j || o[i]);
            }
            return h;
        })();
    }

    function extend(a, b) {
        b = b || {};
        for (var i in b) {
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
            for (i = 0, j = a.length; i < j; ++i) {
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

        // plugin version
        $.version = '2.6.3';

        // collect all instance(s)
        $.__instance__ = {};

        // plug to all instance(s)
        $.each = function(fn, t) {
            return setTimeout(function() {
                var ins = $.__instance__, i;
                for (i in ins) {
                    fn(ins[i], i, ins);
                }
            }, t === 0 ? 0 : (t || 1)), $;
        };

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
            'plus': '+'
        };

        // function
        for (var i = 1; i < 25; ++i) {
            keys[111 + i] = 'f' + i;
        }

        // alphabet
        for (var s = "", i = 65; i < 91; ++i) {
            keys[i] = cl(String.fromCharCode(i));
        }

        // add `KeyboardEvent.TE` property
        Object.defineProperty(KeyboardEvent.prototype, 'TE', {
            configurable: true,
            get: function() {
                // custom `KeyboardEvent.key` for internal use
                var t = this,
                    k = t.key ? cl(t.key) : keys[t.which || t.keyCode];
                if (is_object(k)) {
                    k = t.shiftKey ? (k[1] || k[0]) : k[0];
                }
                k = cl(k);
                function ret(x, y) {
                    if (!x || x === true) return k;
                    if (is_pattern(x)) return y && x.test(k);
                    return x = cl(x), y && (keys_alias[x] || x) === k;
                }
                return {
                    key: function(x) {
                        return ret(x, 1);
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

        $.keys = keys;
        $.keys_alias = keys_alias;

    })(w.TE = function(target) {

        var $ = this,
            _ = 1, // cache of history length
            F = 0, // history feature is active
            H = [[val(), 0, 0, 0]], // load the first history data
            I = 0, // current state of history
            S = {}, // storage
            html = d.documentElement,
            body = d.body,
            div = d.createElement('div'),
            span = d.createElement('span'),
            tab = '\t';
    
        // return a new instance if `TE` was called without the `new` operator
        if (!($ instanceof TE)) {
            return new TE(target);
        }
    
        var scroll_width = (function() {
            var a = '-200px',
                b = '200px', c;
            body.appendChild(div);
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
            return body.removeChild(div), c;
        })();

        $.type = ""; // default editor type
        $.x = '!$^*()-=+[]{}\\|:<>,./?'; // character(s) to escape

        function val() {
            return target.value.replace(/\r/g, "");
        }

        function esc(x) {
            if (is_array(x)) {
                var i, o = [];
                for (i in x) {
                    o[i] = esc(x[i]);
                }
                return o;
            }
            return x.replace(pattern('[' + $.x.replace(/./g, '\\$&') + ']', 'g'), '\\$&');
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
                i = '!',
                prop = [
                    border + 'bottom' + width,
                    border + 'left' + width,
                    border + 'right' + width,
                    border + 'top' + width,
                    'box-sizing',
                    'direction',
                    i + font + 'family',
                    font + 'size',
                    i + font + 'size-adjust',
                    i + font + 'stretch',
                    i + font + 'style',
                    i + font + 'variant',
                    i + font + 'weight',
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
                ],
                i = prop.length,
                s, t, o, w;
            body.appendChild(div);
            s = div.style;
            t = css(target, prop);
            w = t.width;
            css(div, extend(t, {
                'width': is_set(w.mozInnerScreenX) ? w : w + scroll_width, // Firefox :(
                'overflow-y': target.scrollHeight > t.height ? 'scroll' : 'auto',
                'white-space': 'pre-wrap',
                'word-wrap': 'break-word',
                'position': 'absolute',
                'visibility': 'hidden'
            }));
            span.textContent = val().substring(x) || '.';
            div.textContent = val().substring(0, x);
            div.appendChild(span);
            o = {
                x: span.offsetLeft + t[border + 'left' + width],
                y: span.offsetTop + t[border + 'top' + width]
            };
            return body.removeChild(div), o;
        }

        // access editor instance from `this` scope with `this.TE`
        target.TE = $;

        // store editor instance to `TE.__instance__`
        TE.__instance__[target.id || target.name || Object.keys(TE.__instance__).length] = $;

        // scroll the editor
        $.scroll = function(i) {
            var current = target.scrollTop,
                h = css(target, ['line-height', 'font-size']);
            if (!is_set(i)) {
                return [Math.floor(current / h[0]), h[0]];
            } else if (is_boolean(i)) {
                return $.scroll($.scroll()[0] + (i === false ? -1 : 1));
            }
            return target.scrollTop = (h[0] * i) + h[1] + (h[0] - h[1]), $;
        };

        // set value
        $.set = function(v) {
            return target.value = v, $;
        };

        // get value
        $.get = function(f) {
            if (is_set(f)) {
                return val().length ? val() : f;
            }
            return val();
        };

        // save state
        $.save = function(k, v) {
            return S[k] = v, $;
        };

        // restore state
        $.restore = function(k, f) {
            if (!is_set(k)) return S; // read all storage with `$.restore()`
            return is_set(S[k]) ? S[k] : (is_set(f) ? f : "");
        };

        // focus the editor
        $.focus = function(x, y) {
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
            return target.focus(), $;
        };

        // blur the editor
        $.blur = function() {
            return target.blur(), $;
        };

        // get selection
        $.$ = function(O) {
            var v = val(),
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
        $.select = function() {
            var arg = arguments,
                count = arg.length,
                D = 'scrollTop',
                s = $.$(),
                id = 'TE.scroll', z;
            $.save(id, [html[D], body[D], target[D]]).focus();
            if (count === 0) { // restore selection with `$.select()`
                arg[0] = s.start;
                arg[1] = s.end;
            } else if (count === 1) { // move caret position with `$.select(7)`
                if (arg[0] === true) { // select all with `$.select(true)`
                    return target.select(), $;
                }
                arg[1] = arg[0];
            }
            target.setSelectionRange(arg[0], arg[1]); // default `$.select(7, 100)`
            z = $.restore(id, [0, 0, 0]);
            html[D] = z[0];
            body[D] = z[1];
            target[D] = z[2];
            return $; // `select` method does not populate history data
        };

        // match selection
        $.match = function(a, b) {
            var m = $.$().value.match(a);
            return is_function(b) ? b(m || []) : !!m; // `match` method does not populate history data
        };

        // replace at selection
        $.replace = function(f, t, x) {
            var s = $.$(),
                a = s.before,
                b = s.after,
                c = s.value, d, e;
            if (x === 0) { // replace before
                a = a.replace(f, t);
            } else if (x === 1) { // replace after
                b = b.replace(f, t);
            } else {
                c = c.replace(f, t);
            }
            d = a.length;
            e = d + c.length;
            return $.set(a + c + b).select(d, e).record();
        };

        // replace before selection
        $.replaceBefore = function(f, t) {
            return $.replace(f, t, 0);
        };

        // replace after selection
        $.replaceAfter = function(f, t) {
            return $.replace(f, t, 1);
        };

        // insert/replace at caret
        $.insert = function(s, x, clear) {
            var f = /^[\s\S]*?$/;
            if (clear) {
                $.replace(f, "").loss(); // force to delete selection on insert before/after?
            }
            if (x === 0) { // insert before
                f = /$/;
            } else if (x === 1) { // insert after
                f = /^/;
            }
            return $.replace(f, s, x);
        };

        // insert before selection
        $.insertBefore = function(s, clear) {
            return $.insert(s, 0, clear);
        };

        // insert after selection
        $.insertAfter = function(s, clear) {
            return $.insert(s, 1, clear);
        };

        // wrap selection
        $.wrap = function(O, C, wrap) {
            var s = $.$(),
                a = s.before,
                b = s.after,
                c = s.value;
            if (wrap) {
                return $.replace(/^([\s\S]*?)$/, O + '$1' + C);
            }
            return $.set(a + O + c + C + b).select((a + O).length, (a + O + c).length).record();
        };

        // unwrap selection
        $.unwrap = function(O, C, wrap) {
            var s = $.$(),
                a = s.before,
                b = s.after,
                c = s.value,
                A, B, before, after;
            O = get_pattern(O);
            C = get_pattern(C);
            before = pattern(O + '$');
            after = pattern('^' + C);
            if (wrap) {
                return $.replace(pattern('^' + O + '([\\s\\S]*?)' + C + '$'), '$1');
            }
            if (before.test(a) && after.test(b)) {
                A = a.replace(before, "");
                B = b.replace(after, "");
                return $.set(A + c + B).select(A.length, (A + c).length).record();
            }
            return $.select();
        };

        // indent
        $.indent = function(B, e) {
            var s = $.$();
            B = is_set(B) ? B : tab;
            if (s.length) {
                return $.replace(pattern('^' + (e ? "" : '(?!$)'), 'gm'), B);
            }
            return $.insert(B, 0);
        };

        // outdent
        $.outdent = function(B) {
            var s = $.$(), a;
            B = is_set(B) ? B : tab;
            B = get_pattern(B);
            if (s.length) {
                return $.replace(pattern('^' + B, 'gm'), "");
            }
            return $.replace(pattern(B + '$'), "", 0);
        };

        // trim white-space before and after selection range
        $.trim = function(O, C, B, E) {
            if (O !== false) O = O || "";
            if (C !== false) C = C || "";
            if (B !== false) B = B || "";
            if (E !== false) E = E || "";
            var s = $.$(),
                a = s.before,
                b = s.after,
                c = s.value,
                aa = O !== false ? trim(a, 1) + O : a,
                bb = C !== false ? C + trim(b, 0) : b,
                cc = (B !== false ? B : "") + trim(c) + (E !== false ? E : "");
            return $.set(aa + cc + bb).select(aa.length, (aa + cc).length); // `trim` method does not populate history data
        };

        // toggle state
        $.toggle = function(a, b) {
            if (!is_set(b)) {
                return $.select();
            }
            if (a === true) {
                a = 0;
            } else if (a === false) {
                a = 1;
            }
            return is_function(b[a]) ? (b[a]($, a), $) : $.select();
        };

        // save state to history
        $.record = function(a, i) {
            if (F) return $;
            var o = H[I],
                s = $.$(),
                v = val(),
                w = s.start,
                x = s.end,
                a = is_set(a) ? a : [v, w, x, $.scroll()[0]];
            if (o && is_object(o) && (
                o[0] === v &&
                o[1] === w &&
                o[2] === x
            )) return $; // prevent duplicate history data
            I++;
            H[is_set(i) ? i : I] = a;
            return _ = H.length, $;
        };

        // remove state from history
        $.loss = function(i) {
            if (i === true) { // clear all history with `$.loss(true)`
                H = [H[0]];
                I = 0;
                return $;
            }
            i = is_set(i) ? i : I;
            if (i <= I) {
                I--;
            }
            H.splice(i, 1);
            return _ = H.length, $;
        };

        // read history
        $.records = function(i, f) {
            if (!is_set(i)) return H; // read all history with `$.records()`
            return is_set(H[i]) ? H[i] : (is_set(f) ? f : false);
        };

        // undo
        $.undo = function() {
            I--;
            I = edge(I, 0, _ - 1);
            var a = H[I];
            return $.set(a[0]).select(a[1], a[2]).scroll(a[3]);
        };

        // redo
        $.redo = function() {
            I++;
            I = edge(I, 0, _ - 1);
            var a = H[I];
            return $.set(a[0]).select(a[1], a[2]).scroll(a[3]);
        };

        // disable the history feature
        $[0] = function() {
            return F = 1, $;
        };

        // enable the history feature
        $[1] = function(x) {
            return F = 0, (x === false ? $ : $.record());
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
        }, i;

        for (i in check) $.is[i] = check[i];

        // utility ...
        $._ = {
            // escape regex character(s)
            x: esc,
            // extend object ...
            extend: extend,
            // iterate ...
            each: each,
            // other(s) ...
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