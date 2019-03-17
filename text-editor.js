/*!
 * ==========================================================
 *  TEXT EDITOR 3.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var __instance__ = '__instance__',
        blur = 'blur',
        focus = 'focus',
        insert = 'insert',
        replace = 'replace',
        scroll = 'scroll',
        scrollLeft = scroll + 'Left',
        scrollTop = scroll + 'Top',
        select = 'select',
        substring = 'substring',
        selection = 'selection',
        selectionStart = selection + 'Start',
        selectionEnd = selection + 'End';

    function count(x) {
        return x.length;
    }

    function is_array(x) {
        return x instanceof Array;
    }

    function is_boolean(x) {
        return typeof x === "boolean";
    }

    function is_function(x) {
        return typeof x === "function";
    }

    function is_html(x) {
        return x instanceof HTMLElement;
    }

    function is_number(x) {
        return typeof x === "number";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function is_object_plain(x) {
        return (is_array(x) || is_object(x)) && !is_html(x) && x.toString() === '[object Object]';
    }

    function is_pattern(x) {
        return x instanceof RegExp ? (x.source || true) : false;
    }

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_string(x) {
        return typeof x === "string";
    }

    function edge(a, b, c) {
        if (is_set(b) && a < b) return b;
        if (is_set(c) && a > c) return c;
        return a;
    }

    function esc(x) {
        if (is_array(x)) {
            var o = [], i;
            for (i in x) {
                o[i] = esc(x[i]);
            }
            return o;
        }
        return x[replace](pattern('[' + win[NS].x[replace](/./g, '\\$&') + ']', 'g'), '\\$&');
    }

    function number(x) {
        return parseFloat(x);
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function trim(s, x) {
        return s['trim' + (x === -1 ? 'Left' : x === 1 ? 'Right' : "")]();
    }

    (function($) {

        $.is = {
            a: is_array,
            b: is_boolean,
            f: is_function,
            i: is_number,
            o: is_object,
            O: is_object_plain,
            r: is_pattern,
            s: is_string,
            h: is_html,
            x: function(x) {
                return typeof x === "undefined";
            },
            v: is_set
        };

        $._ = $.prototype; // Plugin prototype
        $.version = '3.0.0'; // Plugin version
        $[__instance__] = {}; // Plugin instance(s)
        $.each = function(fn, t) { // Plugin instance(s) plugger
            var i, j;
            return setTimeout(function() {
                j = $[__instance__];
                for (i in j) {
                    fn.call(j[i], i);
                }
            }, t === 0 ? 0 : (t || 1)), $;
        };

        $.x = '!$^*()-=+[]{}\\|:<>,./?'; // Escape character(s)

        $.esc = esc;
        $.edge = edge;
        $.i = number;
        $.r = pattern;
        $.t = trim;
      
        // Get current script path…
        var s = doc.currentScript;
        $.path = ((s && s.src) || win.location.href).split('/').slice(0, -1).join('/');

    })(win[NS] = function(self, dent) {

        var $ = win[NS],
            $$ = this, // Self
            bin = {}, // Storage
            pattern_any = /^([\s\S]*?)$/, // Any character(s),

            body = doc.body,
            html = body.parentNode;

        if (!is_set(dent)) {
            dent = '\t';
        }

        $$._dent = dent;

        // Return a new instance of `TE` if `TE` was called without the `new` operator
        if (!($$ instanceof $)) {
            return new $(self);
        }

        // Store editor instance to `TE.__instance__`
        $[__instance__][self.id || self.name || count(Object.keys($[__instance__]))] = $$;

        function val() {
            return self.value[replace](/\r/g, "");
        }

        // The `<textarea>` element
        $$.self = self;

        // The initial value
        $$.value = val();

        // Set value ($value)
        $$.set = function(v) {
            if (self.disabled || self.readOnly) {
                return $$;
            }
            return (self.value = v), $$;
        };

        // Restore to the initial value
        $$.reset = function() {
            return (self.value = $$.value), $$;
        };

        // Get value {$default = ""}
        $$.get = function(def) {
            if (!is_set(def)) {
                def = "";
            }
            return !self.disabled && trim(self.value) || def;
        };

        function _$$(a, b, c) {
            var t = this, d;
            t.start = a;
            t.end = b;
            t.value = (d = c[substring](a, b));
            t.before = c[substring](0, a);
            t.after = c[substring](b);
            t.toString = function() {
                return d;
            };
        }

        // Get selection {$key, $default}
        $$.$ = function(k, def) {
            var o = new _$$(self[selectionStart], self[selectionEnd], val());
            o.length = count(o.value);
            return k ? (is_set(o[k]) && o[k] ? o[k] : def) : o;
        };

        // Save state {$key = 0}
        $$.save = function(k) {
            return (bin[k || 0] = $$.$()), $$;
        };

        // Restore state {$key = 0}
        $$.restore = function(k, def) {
            if (k === true) {
                return bin; // Read all storage with `$$.restore(true)`
            } else if (!is_set(k)) {
                k = 0;
            }
            if (is_set(bin[k])) {
                var s = bin[k];
                return $$.set(s.before + s.value + s.after)[select](s.start, s.end), s;
            }
            return $$[select](), def;
        };

        // Focus to the editor {$mode}
        $$[focus] = function(x) {
            var y;
            if (x === -1) {
                x = y = 0; // Put caret at the start of the editor, scroll to the start of the editor
            } else if (x === 1) {
                x = count(val()); // Put caret at the end of the editor
                y = self[scroll + 'Height']; // Scroll to the end of the editor
            }
            if (is_set(x)) {
                self[selectionStart] = self[selectionEnd] = x;
                self[scrollTop] = y;
            }
            return self[focus](), $$;
        };

        // Blur from the editor
        $$[blur] = function() {
            return self[blur](), $$;
        };

        // Select value {} or {true} or {$caret} or {$start, $end}
        $$[select] = function() {
            var arg = arguments,
                counts = count(arg),
                s = $$.$(),
                x, y, z;
            x = win.pageXOffset || html[scrollLeft] || body[scrollLeft];
            y = win.pageYOffset || html[scrollTop] || body[scrollTop];
            z = self[scrollTop];
            if (counts === 0) { // Restore selection with `$.select()`
                arg[0] = s.start;
                arg[1] = s.end;
            } else if (counts === 1) { // Move caret position with `$.select(7)`
                if (arg[0] === true) { // Select all with `$.select(true)`
                    return self[select](), $$;
                }
                arg[1] = arg[0];
            }
            if (self.disabled) return $$;
            self[focus]();
            self.setSelectionRange(arg[0], arg[1]); // Default `$.select(7, 100)`
            self[scrollTop] = z, win.scroll(x, y);
            return $$;
        };

        // Match at selection {$pattern, $fn}
        $$.match = function(pattern, fn) {
            if (is_array(pattern)) {
                var s = $$.$(),
                    m = [s.before.match(pattern[0]), s.value.match(pattern[1]), s.after.match(pattern[2])];
                return is_function(fn) ? fn.call($$, m[0] || [], m[1] || [], m[2] || []) : [!!m[0], !!m[1], !!m[2]];
            }
            var m = $$.$().value.match(pattern);
            return is_function(fn) ? fn.call($$, m || []) : !!m;
        };

        // Replace at selection {$from, $to, $mode}
        $$[replace] = function(f, t, x) {
            var s = $$.$(),
                b = s.before,
                a = s.after,
                v = s.value;
            if (x === -1) { // Replace before
                b = b[replace](f, t);
            } else if (x === 1) { // Replace after
                a = a[replace](f, t);
            } else { // Replace value
                v = v[replace](f, t);
            }
            return $$.set(b + v + a)[select](b = count(b), b + count(v));
        };

        // Insert/replace at caret {$value, $mode, $clear = false}
        $$[insert] = function(v, x, clear) {
            var f = pattern_any;
            if (clear) {
                $$[replace](f, ""); // Force to delete selection on insert before/after?
            }
            if (x === -1) { // Insert before
                f = /$/;
            } else if (x === 1) { // Insert after
                f = /^/;
            }
            return $$[replace](f, v, x);
        };

        // Wrap current selection {$open, $close, $wrap = false}
        $$.wrap = function(o, c, wrap) {
            var s = $$.$(),
                b = s.before,
                a = s.after,
                v = s.value;
            if (wrap) {
                return $$[replace](pattern_any, o + '$1' + c);
            }
            return $$.set(b + o + v + c + a)[select](b = count(b + o), b + count(v));
        };

        // Unwrap current selection {$open, $close, $wrap = false}
        $$.peel = function(o, c, wrap) {
            var s = $$.$(),
                b = s.before,
                a = s.after,
                v = s.value;
            o = is_pattern(o) || esc(o);
            c = is_pattern(c) || esc(c);
            var O = pattern(o + '$'),
                C = pattern('^' + c);
            if (wrap) {
                return $$[replace](pattern('^' + o + '([\\s\\S]*?)' + c + '$'), '$1');
            }
            if (O.test(b) && C.test(a)) {
                b = b[replace](O, "");
                a = a[replace](C, "");
                return $$.set(b + v + a)[select](b = count(b), b + count(v));
            }
            return $$[select]();
        };

        // Indent {$by = '\t', $include_empty_lines = false}
        function indent(by, e) {
            var s = $$.$();
            by = by || dent;
            if (count(s)) {
                return $$[replace](pattern('^' + (e ? "" : '(?!$)'), 'gm'), by);
            }
            return $$[insert](by, -1);
        }

        // Outdent {$by = '\t'}
        function outdent(by) {
            var s = $$.$();
            by = by || dent;
            by = is_pattern(by) || esc(by);
            if (count(s)) {
                return $$[replace](pattern('^' + by, 'gm'), "");
            }
            return $$[replace](pattern(by + '$'), "", -1);
        }

        // Dent {$mode, $by = '\t', $include_empty_lines = false}
        $$.dent = function(x, by, e) {
            if (x === 1) {
                return indent(by, e);
            } else if (x === -1) {
                return outdent(by);
            }
            return indent(by, e);
        };

        // Trim white-space before and after selection range {$open = "", $close = "", $start = "", $end = "", $tidy = true}
        $$.trim = function(o, c, s, e, tidy) {
            if (!is_set(tidy)) {
                tidy = true;
            }
            if (o !== false) o = o || "";
            if (c !== false) c = c || "";
            if (s !== false) s = s || "";
            if (e !== false) e = e || "";
            var S = $$.$(),
                b = S.before,
                a = S.after,
                v = S.value,
                B = trim(b, 1),
                A = trim(a, -1);
            b = o !== false ? trim(b, 1) + (B || !tidy ? o : "") : b;
            a = c !== false ? (A || !tidy ? c : "") + trim(a, -1) : a;
            if (s !== false) v = trim(v, -1);
            if (e !== false) v = trim(v, 1);
            return $$.set(b + v + a)[select](b = count(b), b + count(v));
        };

    });

})(window, document, 'TE');