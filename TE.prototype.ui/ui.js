/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 0.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

var TE_ui = function(o, editor) {

    var _u2318 = '\u2318',

        win = window,
        doc = document,
        r = this,
        html = doc.documentElement,
        head = doc.head,
        body = doc.body,
        hooks = {},
        target = editor.target,
        noop = function() {},
        extend = editor._.extend,
        each = editor._.each,
        config = extend({
            tools: 'undo redo',
            languages: {
                tools: {
                    undo: 'Undo (' + _u2318 + '+Z)',
                    redo: 'Redo (' + _u2318 + '+Y)'
                },
                buttons: {
                    okay: 'OK',
                    cancel: 'Cancel',
                    yes: 'Yes',
                    no: 'No',
                    enter: 'Enter',
                    exit: 'Exit',
                    open: 'Open',
                    close: 'Close',
                    ignore: 'Ignore'
                },
                others: {
                    preview: 'Preview',
                    _words: '%1 Words'
                }
            },
            classes: {
                editor: 'text-editor',
                i: 'fa fa-%1'
            },
            tab: '  '
        }, o),
        _KEYDOWN = 'keydown',
        _KEYUP = 'keyup',
        _COPY = 'copy',
        _CUT = 'cut',
        _PASTE = 'paste',
        _MOUSEDOWN = 'mousedown',
        _MOUSEUP = 'mouseup',
        _MOUSEMOVE = 'mousemove',
        _CLICK = 'click',
        _FOCUS = 'focus',
        _BLUR = 'blur',
        _INPUT = 'input',
        target_events = _BLUR + ' ' + _COPY + ' ' + _CUT + ' ' + _FOCUS + ' ' + _INPUT + ' ' + _KEYDOWN + ' ' + _PASTE;

    // add `gap` method to `TE`
    editor.gap = function(a, b) {
        var $ = editor.$(),
            B = $.before.length ? a : "",
            A = $.after.length ? (is_set(b) ? b : a) : "";
        return editor.trim(B, A);
    };

    // add `format` method to `TE`
    editor.format = function(node, wrap, gap_1, gap_2) {
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var $ = editor.$(),
            a = '<' + node + '>' + gap_2,
            b = gap_2 + '</' + node.split(' ')[0] + '>',
            A = editor._.esc(a),
            B = editor._.esc(b),
            m = pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = pattern(A + '$'),
            m_B = pattern('^' + B),
            gap_11 = gap_1,
            gap_12 = gap_1;
        if (/<[^\/<>]+?>$/.test($.before)) gap_11 = "";
        if (/^<\/[^<>]+?>/.test($.after)) gap_12 = "";
        return editor.toggle(
            // when ...
            wrap ? !m.test($.value) : (!m_A.test($.before) && !m_B.test($.after)),
            // do ...
            [
                // first toggle
                function(r) {
                    r[0]().unwrap(a, b, 1).gap(gap_11, gap_12).wrap(a, b, wrap)[1]();
                },
                // second toggle (the reset state)
                function(r) {
                    r[0]().unwrap(a, b, wrap).gap(gap_11, gap_12)[1]();
                }
            ]
        );
    };

    function is_node(x) {
        return x instanceof HTMLElement;
    }

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_function(x) {
        return typeof x === "function";
    }

    function is_string(x) {
        return typeof x === "string";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function hook_set(ev, fn, id) {
        if (!is_set(ev)) return hooks;
        if (!is_set(fn)) return hooks[ev];
        if (!is_set(hooks[ev])) hooks[ev] = {};
        if (!is_set(id)) id = Object.keys(hooks[ev]).length;
        return hooks[ev][id] = fn, r;
    }

    function hook_reset(ev, id) {
        if (!is_set(ev)) return hooks = {}, r;
        if (!is_set(id) || !is_set(hooks[ev])) return hooks[ev] = {}, r;
        return delete hooks[ev][id], r;
    }

    function hook_fire(ev, a, id) {
        if (!is_set(hooks[ev])) return r;
        if (!is_set(id)) {
            for (var i in hooks[ev]) {
                hooks[ev][i].apply(r, a);
            }
        } else {
            if (is_set(hooks[ev][id])) {
                hooks[ev][id].apply(r, a);
            }
        }
        return r;
    }

    function event_exit(e) {
        if (e) e.preventDefault();
        return false;
    }

    function event_set(id, node, fn) {
        node.addEventListener(id, fn, false);
        hook_set('on:' + id, fn, dom_id(node));
    }

    function event_reset(id, node, fn) {
        node.removeEventListener(id, fn, false);
        hook_reset('on:' + id, dom_id(node));
    }

    function event_fire(id, data, node) {
        hook_fire('on:' + id, data, dom_id(node));
    }

    function events_set(ids, node, fn) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_set(ids[i], node, fn);
        }
    }

    function events_reset(ids, node, fn) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_reset(ids[i], node, fn);
        }
    }

    function events_fire(ids, node, data) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_fire(ids[i], node, data);
        }
    }

    function timer_set(fn, i) {
        win.setTimeout(fn, i);
    }

    function timer_reset(timer_set_fn) {
        win.clearTimeout(timer_set_fn);
    }

    function trim(s) {
        return s.replace(/^\s*|\s*$/g, "");
    }

    function trim_left(s) {
        return s.replace(/^\s+/, "");
    }

    function trim_right(s) {
        return s.replace(/\s+$/, "");
    }

    function edge(a, b, c) {
        if (a < b) return b;
        if (a > c) return c;
        return a;
    }

    function format(s, data) {
        return s.replace(/%(\d+)/g, function(a, b) {
            --b;
            return is_set(data[b]) ? data[b] : a;
        });
    }

    function slug(s) {
        return trim(s
            .toLowerCase()
            .replace(/[^ \/a-z\d-]/g, '-')
            .replace(/([ -])+/g, '$1')
            .replace(/^-|-$/g, "")
        );
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function point(node, e) {
        var x = !!e.touches ? e.touches[0].pageX : e.pageX,
            y = !!e.touches ? e.touches[0].pageY : e.pageY,
            left = offset(node).l,
            top = offset(node).t;
        while (node = node.offsetParent) {
            left += offset(node).l;
            top += offset(node).t;
        }
        return {
            x: x - left,
            y: y - top
        };
    }

    function offset(node) {
        return {
            l: node.offsetLeft,
            t: node.offsetTop
        };
    }

    function size(node) {
        return {
            w: node.offsetWidth,
            h: node.offsetHeight
        };
    }

    function closest(a, b) {
        while ((a = a.parentElement) && a !== b);
        return a;
    }

    var c = config.classes,
        prefix = c.editor,
        i18n = config.languages,
        i18n_tools = i18n.tools,
        i18n_buttons = i18n.buttons,
        i18n_others = i18n.others,
        C = prefix + '-textarea ' + prefix + '-content',
        _container = el_set(prefix),
        _header = el_set(prefix + '-header'),
        _body = el_set(prefix + '-body'),
        _footer = el_set(prefix + '-footer'),
        _tool = el_set(prefix + '-tool'),
        _content = target,
        _description = el_set(prefix + '-description'),
        _overlay = el_set(prefix + '-overlay'),
        _modal = el_set(prefix + '-modal'),
        _drop = el_set(prefix + '-drop'),
        _bubble = el_set(prefix + '-bubble'),
        _description_left = el_set('left', 'span'),
        _description_right = el_set('right', 'span'),
        _preview = el_set(prefix + '-preview', 'span'),
        _p = null,
        _button, _icon;

    event_set(_CLICK, _preview, function(e) {
        var v = editor.get();
        if (!dom_exist(_overlay) && v.length) {
            r.overlay(v, 0, function() {
                event_set(_CLICK, _overlay, do_overlay_exit);
                hook_fire('on:preview', [v, _overlay.firstChild]);
            });
        } else {
            do_overlay_exit();
        }
        return event_exit(e);
    });

    function dom_id(node) {
        var id = node.id;
        if (!id) {
            id = prefix + '-dom:' + (new Date()).getTime();
            node.id = id;
        }
        return id;
    }

    function el(em, node, attr) {
        em = is_string(em) ? doc.createElement(em) : em;
        if (is_object(attr)) {
            each(attr, function(v, i) {
                if (i === 'style') {
                    if (is_string(v)) {
                        em.setAttribute(i, v);
                    } else if (v === null) {
                        em.removeAttribute(i);
                    } else {
                        em = el_style(em, v);
                    }
                } else {
                    if (is_function(v)) {
                        em[i] = v;
                    } else {
                        if (v === null) {
                            em.removeAttribute(i);
                        } else {
                            em.setAttribute(i, is_object(v) ? v.join(' ') : "" + v);
                        }
                    }
                }
            });
        }
        if (is_node(node)) {
            em.appendChild(node);
        } else {
            if (is_object(node)) {
                each(node, function(v, i) {
                    if (is_node(v)) {
                        em.appendChild(v);
                    } else {
                        if (v !== false) em.innerHTML = v;
                    }
                });
            } else {
                if (is_set(node) && node !== false) em.innerHTML = node;
            }
        }
        return em;
    }

    function el_style(em, prop) {
        em = el(em);
        each(prop, function(v, i) {
            em.style[i.replace(/\-([a-z])/g, function(a, b) {
                return b.toUpperCase();
            })] = v;
        });
        return em;
    }

    function class_exist(node, s) {
        return pattern('(^|\\s)' + s + '(\\s|$)').test(node.className);
    }

    function class_set(node, s) {
        if (!class_exist(node, s)) {
            node.className = trim(node.className + ' ' + s);
        }
    }

    function class_reset(node, s) {
        node.className = trim(node.className.replace(pattern('(^|\\s)' + s + '(\\s|$)'), '$1$2'));
    }

    function content_set(node, s) {
        node.innerHTML = s;
    }

    function content_reset(node, deep) {
        if (deep !== false) {
            var c = node.children;
            each(c, function(v) {
                content_reset(v);
            });
        }
        content_set(node, "");
    }

    function dom_exist(node, dom) {
        if (arguments.length === 1) {
            return node.parentNode || false;
        }
        return node && dom.parentNode === node ? dom.parentNode : false;
    }

    function dom_before(node, dom) {
        node.parentNode.insertBefore(dom, node);
    }

    function dom_after(node, dom) {
        node.parentNode.insertBefore(dom, node.nextElementSibling || node.nextSibling);
    }

    function dom_begin(node, dom) {
        var c = node.firstChild;
        if (c) {
            dom_before(c, dom);
        } else {
            dom_set(node, dom);
        }
    }

    function dom_end(node, dom) {
        dom_set(node, dom);
    }

    function dom_set(node, dom) {
        node.appendChild(dom);
    }

    function dom_reset(node, deep) {
        var parent = dom_exist(node);
        if (parent) {
            if (deep !== false) {
                var c = node.firstChild;
                while (c) dom_reset(c);
            }
            parent.removeChild(node);
        }
    }

    function dom_content_reset(node) {
        content_reset(el(node, false, {
            style: ""
        }));
        dom_reset(node);
    }

    function el_set(a, b, c) {
        return el(b || 'div', c, {
            'class': a
        });
    }

    function do_word_count() {
        var v = (_content.value || "").replace(/<[^<>]+?>/g, "");
        content_set(_description_right, format(i18n_others._words, [(v.match(/(\w+)/g) || []).length]));
    }

    function do_update_source(e) {
        do_word_count(), hook_fire('change', [e, r]);
    }

    var maps = {},
        bounce = null;

    function do_keys(e) {
        var key = e.TE.key,
            keys = r.keys,
            keys_a = TE.keys_alt,
            i, j, k, l;
        function explode(s) {
            return s.replace(/\+/g, '\n').replace(/\n\n/g, '\n+').split('\n');
        }
        maps[key()] = 1;
        timer_set(function() {
            editor.record();
        }, 1);
        for (i in keys) {
            var counts = 0;
            k = explode(i);
            for (j in k) {
                j = k[j];
                if (maps[keys_a[j] || j]) {
                    ++counts;
                }
            }
            if (counts === k.length) {
                if (is_string(keys[i])) {
                    keys[i] = r.tools[keys[i]].click;
                }
                l = keys[i](e, editor);
                if (l === false) event_exit(e);
            }
        }
    }

    function do_keys_reset(e) {
        if (!is_object(e)) {
            maps = {};
        } else {
            maps[e.TE.key()] = 0;
        }
    }

    function do_update_source_debounce() {
        timer_reset(bounce);
        bounce = timer_set(do_update_source, 1000);
    }

    function do_button_click(e) {
        var id = this.hash.replace('#', "");
        if (r.tools[id] && r.tools[id].click) {
            r.tools[id].click(e, editor, id);
            hook_fire('change', [e, r, id]);
            return event_exit(e);
        }
    }

    editor.create = function(o, hook) {
        if (is_object(o)) {
            config = extend(config, o);
        }
        class_set(_content, C);
        var tools = is_string(config.tools) ? trim(config.tools).split(/\s+/) : config.tools,
            parent = dom_exist(_content),
            c_button = prefix + '-button',
            c_separator = prefix + '-separator',
            button_id, tool, icon, is_button;
        // re-order hotkey(s) ...
        r.keys = (function() {
            var a = Object.keys(r.keys).sort().reverse(),
                b = {}, i;
            for (i = 0, len = a.length; i < len; ++i) {
                b[a[i]] = r.keys[a[i]];
            }
            return b;
        })();
        if (parent && parent.tagName.toLowerCase() === 'p') {
            dom_before(parent, _container);
            _p = parent;
            dom_reset(parent, false);
        } else {
            dom_before(_content, _container);
        }
        dom_set(_container, _header);
        dom_set(_container, _body);
        dom_set(_container, _footer);
        dom_set(_header, _tool);
        dom_set(_body, _content);
        dom_set(_footer, _description);
        dom_set(_description, _description_left);
        dom_set(_description, _description_right);
        each(tools, function(v, i) {
            if (!r.tools[v]) return true;
            tool = r.tools[v];
            if (is_function(tool)) {
                r.tools[v].click = tool;
            }
            if ((icon = tool.i || v) !== '|') {
                icon = slug(icon);
            }
            is_button = icon !== '|';
            _button = el_set(is_button ? c_button : c_separator, is_button ? 'a' : 'span');
            if (is_button) {
                button_id = c_button + ':' + v;
                _button.href = '#' + v;
                _button.id = button_id;
                content_set(_button, '<i class="' + format(c.i, [icon]) + ' ' + button_id + '"></i>');
                if (tool.title) {
                    _button.title = tool.title;
                }
                event_set(_CLICK, _button, do_button_click);
            }
            dom_set(_tool, _button);
        });
        event_set(_KEYDOWN, _content, do_keys);
        event_set(_KEYUP, _content, do_keys_reset);
        events_set(target_events, _content, do_update_source_debounce);
        dom_set(_description_left, _preview);
        content_set(_preview, i18n_others.preview);
        do_update_source();
        return hook !== null ? (hook_fire('create', [r]), editor) : editor;
    };

    editor.refresh = function(o) {
        if (class_exist(_content, C)) {
            editor.destroy(null); // destroy if already created
        }
        return hook_fire('refresh', [r]), editor.create(o, null);
    };

    editor.destroy = function(hook) {
        if (!class_exist(_content, C)) return r;
        class_reset(_content, C);
        events_reset(target_events, _content, do_update_source_debounce);
        if (_p) {
            dom_before(_container, _p);
            dom_set(_p, _content);
            _p = null;
        } else {
            dom_before(_container, _content);
        }
        dom_content_reset(_container);
        return hook !== null ? (hook_fire('destroy', [r]), editor) : editor;
    };

    var drag = 0,
        x = 0,
        y = 0,
        w = 0,
        h = 0,
        W = 0,
        H = 0,
        O = {},
        o;

    r.exit = function(select, k) {
        var fn = {
            overlay: do_overlay_exit,
            modal: function() {
                event_reset(_MOUSEDOWN, _body, do_modal_down);
                event_reset(_MOUSEMOVE, _body, do_modal_move);
                event_reset(_MOUSEUP, body, do_modal_up);
                event_reset(_CLICK, O.x, do_modal_exit);
                dom_content_reset(_modal);
            },
            drop: function() {
                dom_content_reset(_drop);
            },
            bubble: function() {
                dom_content_reset(_bubble);
            }
        }, i;
        if (!k) {
            for (i in fn) fn[i]();
        } else {
            if (is_object(k)) {
                for (i in k) fn[k[i]] && fn[k[i]]();
            } else {
                fn[k] && fn[k]();
            }
        }
        if (select) {
            editor.select();
        }
    };

    function do_overlay_exit() {
        dom_content_reset(_overlay);
        event_reset(_CLICK, _overlay, do_overlay_exit);
        editor.select();
    }

    r.overlay = function(s, x, fn) {
        do_keys_reset(1);
        dom_set(_body, el(_overlay, s.length ? el_set(prefix + '-overlay-content', 'div', s) : ""));
        if (x) {
            function exit() {
                r.exit(1);
                event_reset(_CLICK, _overlay, exit);
            }
            event_set(_CLICK, _overlay, exit);
        }
        if (is_function(fn)) fn(_overlay);
    };

    function do_modal_size() {
        o = size(_modal);
        w = o.w;
        h = o.h;
        o = size(_overlay);
        W = o.w;
        H = o.h;
    }

    function do_modal_exit() {
        event_fire(_CLICK, [], _overlay);
    }

    function do_modal_down(e) {
        drag = e.target;
        o = point(_modal, e);
        x = o.x;
        y = o.y;
        do_modal_size();
    }

    function do_modal_move(e) {
        var header = O.header,
            resize = O.resize,
            left, top;
        if (drag === header || closest(drag, header) === header) {
            o = point(_body, e);
            left = o.x - x;
            top = o.y - y;
            el_style(_modal, {
                left: edge(left, 0, W - w) + 'px',
                top: edge(top, 0, H - h) + 'px'
            });
        }
        if (drag === resize || closest(drag, resize) === resize) {
            o = point(_modal, e);
            el_style(_modal, {
                width: o.x + 'px',
                height: o.y + 'px'
            });
        }
    }

    function do_modal_up() {
        drag = 0;
    }

    function do_modal_content(header, body, footer) {
        return {
            header: header,
            body: body,
            footer: footer
        };
    }

    r.modal = function() {
        var arg = arguments,
            k = arg[0],
            o = arg[1],
            fn = arg[2],
            F = prefix + '-modal',
            i, j;
        if (is_object(k)) {
            k = 'default';
            o = arg[0];
            fn = arg[1];
        }
        class_set(_modal, k);
        if (is_set(o.body)) {
            o.body = el('div', o.body, {
                'class': F + '-content ' + k
            });
        }
        for (i in o) {
            F[1] = i;
            O[i] = el_set(F + '-' + format(i, F) + ' ' + k, 0, o[i]);
        }
        O.x = el_set(F + '-x ' + k); // add `close` button
        O.resize = el_set(F + '-resize ' + k); // add `resize` button
        content_reset(_modal);
        dom_set(_body, el(_modal, O, {
            style: ""
        }));
        r.overlay("", 1);
        do_modal_size();
        var top = (H / 2) - (h / 2),
            left = (W / 2) - (w / 2);
        el_style(_modal, {
            top: top + 'px',
            left: left + 'px'
        });
        event_set(_CLICK, O.x, do_modal_exit);
        event_set(_MOUSEDOWN, O.header, event_exit);
        event_set(_MOUSEDOWN, O.resize, event_exit);
        event_set(_MOUSEDOWN, _body, do_modal_down);
        event_set(_MOUSEMOVE, _body, do_modal_move);
        event_set(_MOUSEUP, body, do_modal_up);
        if (is_function(fn)) {
            O.overlay = _overlay;
            O.modal = _modal;
            fn(O);
        }
        return r;
    };

    var button_attrs = {
        'class': prefix + '-button'
    }

    r.alert = function(title, content) {
        var okay = el('button', i18n_buttons.okay, button_attrs);
        event_set(_CLICK, okay, do_modal_exit);
        event_set(_KEYDOWN, okay, function(e) {
            var key = e.TE.key;
            if (key(/^escape|enter$/)) {
                return do_modal_exit(), event_exit(e);
            }
        });
        timer_set(function() {
            okay.focus();
        }, 1);
        return r.modal('alert', do_modal_content(title, content, okay));
    };

    r.confirm = function(title, content, y, n) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            cancel = el('button', i18n_buttons.cancel, button_attrs),
            key;
        function yep(e) {
            if (is_function(y)) y(e, editor);
            return do_modal_exit(), event_exit(e);
        }
        function nope(e) {
            if (is_function(n)) n(e, editor);
            return do_modal_exit(), event_exit(e);
        }
        event_set(_CLICK, okay, yep);
        event_set(_CLICK, cancel, nope);
        event_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key('arrowleft')) return event_exit(e);
            if (key(/^escape|enter$/)) return yep(e), event_exit(e);
        });
        event_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return event_exit(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
            if (key(/^escape|enter$/)) return nope(e), event_exit(e);
        });
        timer_set(function() {
            cancel.focus();
        }, 1);
        return r.modal('confirm', do_modal_content(title, content, [okay, cancel]));
    };

    r.prompt = function(title, value, required, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            cancel = el('button', i18n_buttons.cancel, button_attrs),
            input = el('input', false, {
                type: 'text',
                value: value,
                'class': prefix + '-input block'
            }), key;
        fn = fn || noop;
        function prepare() {
            input.focus();
            input.select();
        }
        function yep(e) {
            if (required && (!trim(input.value).length || input.value === value)) {
                return prepare(), freeze(e);
            }
            return nope(e), fn(e, editor, input.value);
        }
        function nope(e) {
            return do_modal_exit(), event_exit(e);
        }
        function freeze(e) {
            return event_exit(e);
        }
        event_set(_KEYDOWN, input, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape')) return nope(e);
            if (key('arrowup')) return freeze(e);
            if (key('arrowdown')) return okay.focus(), event_exit(e);
        });
        event_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape')) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key(/arrow(down|left)/)) return freeze(e);
        });
        event_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key(/^enter|escape$/)) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key(/arrow(right|down)/)) return freeze(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
        });
        event_set(_CLICK, okay, yep);
        event_set(_CLICK, cancel, nope);
        timer_set(prepare, 1);
        return r.modal('prompt', do_modal_content(title, input, [okay, cancel]));
    };

    r.drop = function(s, fn) {
        dom_set(body, el(_drop, s));
        r.overlay("", 1);
        if (is_function(fn)) {
            fn(_drop);
        }
    };

    r.bubble = function(s, fn) {
        dom_set(body, el(_bubble, s));
        r.overlay("", 1);
        if (is_function(fn)) {
            fn(_bubble);
        }
    };

    // default toolbar(s)
    r.tools = {
        undo: {
            i: 'undo',
            title: i18n_tools.undo,
            click: function(e, $) {
                return $.undo(), false;
            }
        },
        redo: {
            i: 'repeat',
            title: i18n_tools.redo,
            click: function(e, $) {
                return $.redo(), false;
            }
        },
        '|': 1 // toolbar button separator
    };

    // default hotkey(s)
    r.keys = {
        'control+y': 'redo',
        'control+z': 'undo'
    };

    r.parent = editor;
    r.dom = {
        container: _container,
        header: _header,
        body: _body,
        footer: _footer,
        overlay: _overlay,
        modal: _modal,
        drop: _drop,
        bubble: _bubble
    };

    editor.config = config;
    editor.ui = r;

    // utility ...
    extend(editor._, {
        format: format,
        el: el,
        event: {
            set: events_set,
            reset: events_reset,
            fire: events_fire
        },
        hooks: hooks,
        hook: {
            set: hook_set,
            reset: hook_reset,
            fire: hook_fire
        }
    });

    return editor.create(), r;

};

TE.prototype.create = function(o) {
    return new TE_ui(o, this);
};