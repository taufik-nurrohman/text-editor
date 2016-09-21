/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 0.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

var TE_ui = function(o, editor) {

    var _u2318 = '\u2318', // command sign
        _u2026 = '\u2026', // horizontal ellipsis

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
        config = extend({
            tab: '  ',
            dir: 'ltr',
            keys: 1,
            tools: 'undo redo',
            css: 'html,body{background:#fff;color:#000}',
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
                    placeholder: 'text here' + _u2026,
                    preview: 'Preview',
                    _word: '%1 Word',
                    _words: '%1 Words'
                }
            },
            classes: {
                editor: 'text-editor',
                i: 'fa fa-%1'
            }
        }, o),
        _KEYDOWN = 'keydown',
        _KEYUP = 'keyup',
        _COPY = 'copy',
        _CUT = 'cut',
        _PASTE = 'paste',
        _MOUSEDOWN = 'mousedown touchstart',
        _MOUSEUP = 'mouseup touchend',
        _MOUSEMOVE = 'mousemove touchmove',
        _CLICK = 'click',
        _FOCUS = 'focus',
        _BLUR = 'blur',
        _INPUT = 'input',
        target_events = _BLUR + ' ' + _COPY + ' ' + _CUT + ' ' + _FOCUS + ' ' + _INPUT + ' ' + _KEYDOWN + ' ' + _PASTE,
        i18n = config.languages;

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
        var s = editor[0]().$(),
            a = '<' + node + '>' + gap_2,
            b = gap_2 + '</' + node.split(' ')[0] + '>',
            A = editor._.x(a),
            B = editor._.x(b),
            m = pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = pattern(A + '$'),
            m_B = pattern('^' + B),
            gap_11 = gap_1,
            gap_12 = gap_1,
            before = s.before,
            after = s.after;
        if (/<[^\/<>]+?>$/.test(before)) gap_11 = "";
        if (/^<\/[^<>]+?>/.test(after)) gap_12 = "";
        if (!s.length) {
            editor.insert(i18n_others.placeholder);
        }
        return editor.toggle(
            // when ...
            wrap ? !m.test(s.value) : (!m_A.test(before) && !m_B.test(after)),
            // do ...
            [
                // first toggle
                function($) {
                    $.unwrap(a, b, 1).gap(gap_11, gap_12).wrap(a, b, wrap)[1]();
                },
                // second toggle (the reset state)
                function($) {
                    $.unwrap(a, b, wrap)[1]();
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

    function is_number(x) {
        return typeof x === "number";
    }

    function hook_set(ev, fn, id) {
        if (!is_set(ev)) return hooks;
        if (!is_set(fn)) return hooks[ev];
        if (!is_set(hooks[ev])) hooks[ev] = {};
        if (!is_set(id)) id = Object.keys(hooks[ev]).length;
        return hooks[ev][id] = fn, editor;
    }

    function hook_reset(ev, id) {
        if (!is_set(ev)) return hooks = {}, editor;
        if (!is_set(id) || !is_set(hooks[ev])) return hooks[ev] = {}, editor;
        return delete hooks[ev][id], editor;
    }

    function hook_fire(ev, a, id) {
        if (!is_set(hooks[ev])) return editor;
        if (!is_set(id)) {
            for (var i in hooks[ev]) {
                hooks[ev][i].apply(editor, a);
            }
        } else {
            if (is_set(hooks[ev][id])) {
                hooks[ev][id].apply(editor, a);
            }
        }
        return editor;
    }

    function event_exit(e) {
        if (e) e.preventDefault();
        return false;
    }

    function event_set(id, node, fn) {
        if (!node) return;
        node.addEventListener(id, fn, false);
        hook_set('on:' + id, fn, dom_id(node));
    }

    function event_reset(id, node, fn) {
        if (!node) return;
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
        if (is_set(b) && a < b) return b;
        if (is_set(c) && a > c) return c;
        return a;
    }

    function format(s, data) {
        return s.replace(/%(\d+)/g, function(a, b) {
            --b;
            return is_set(data[b]) ? data[b] : a;
        });
    }

    function slug(s) {
        // exclude ` ` and `/`
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
            o = offset(node);
        return {
            x: x - o.l,
            y: y - o.t
        };
    }

    function offset(node) {
        var left = node.offsetLeft,
            top = node.offsetTop;
        while (node = node.offsetParent) {
            left += node.offsetLeft;
            top += node.offsetTop;
        }
        return {
            l: left,
            t: top
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
        _resize = el_set(prefix + '-resize s'),
        _description = el_set(prefix + '-description'),
        _overlay = el_set(prefix + '-overlay'),
        _modal = el('div'),
        _drop = el('div'),
        _bubble = el('div'),
        _description_left = el_set('left', 'span'),
        _description_right = el_set('right', 'span'),
        _preview = el_set(prefix + '-preview', 'span'),
        _p = 0,
        _drop_target = 0,
        _button, _icon;

    events_set(_CLICK, _preview, function(e) {
        var v = editor.get();
        if (!dom_exist(_overlay) && v.length) {
            if (v.indexOf('</html>') === -1) {
                v = '<!DOCTYPE html><html dir="' + config.dir + '"><head><meta charset="utf-8"><style>' + config.css + '</style></head><body>' + v + '</body></html>';
            }
            var frame = el('iframe', false, {
                'class': prefix + '-portal',
                src: 'data:text/html,' + encodeURIComponent(v)
            });
            r.overlay(frame, 1, function() {
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
            var v, i;
            for (i in attr) {
                v = attr[i];
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
            }
        }
        if (is_node(node)) {
            em.appendChild(node);
        } else {
            if (is_object(node)) {
                var v, i;
                for (i in node) {
                    v = node[i];
                    if (is_node(v)) {
                        em.appendChild(v);
                    } else {
                        if (v !== false) em.innerHTML = v;
                    }
                }
            } else {
                if (is_set(node) && node !== false) em.innerHTML = node;
            }
        }
        return em;
    }

    function el_style(em, prop) {
        em = el(em);
        for (var i in prop) {
            em.style[i.replace(/\-([a-z])/g, function(a, b) {
                return b.toUpperCase();
            })] = prop[i];
        }
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
            var c = node.children, i;
            for (i in c) {
                content_reset(c[i]);
            }
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
        var v = (_content.value || "").replace(/<[^<>]+?>/g, ""),
            i = (v.match(/(\w+)/g) || []).length;
        content_set(_description_right, format(i18n_others['_word' + (i === 1 ? "" : 's')], [i]));
    }

    function do_update_tools() {
        content_reset(_tool, false);
        var tools = is_string(config.tools) ? trim(config.tools).split(/\s+/) : config.tools,
            c_button = prefix + '-button',
            c_separator = prefix + '-separator',
            _button_id, tool, icon, is_button, i, v;
        config.tools = tools;
        for (i in tools) {
            v = tools[i];
            if (!r.tools[v]) continue;
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
                _button_id = c_button + ':' + slug(v).replace(/\s/g, "");
                _button.href = 'javascript:;';
                _button.id = _button_id;
                _button.setAttribute('data-tool-id', v);
                icon = '<i class="' + format(c.i, [icon]) + ' ' + _button_id + '"></i>';
                if (!is_set(tool.active)) {
                    tool.active = 1;
                } else if (!tool.active) {
                    class_set(_button, 'x');
                }
                if (tool.text) {
                    icon = format(tool.text, [icon]);
                }
                content_set(_button, icon);
                if (tool.title) {
                    _button.title = tool.title;
                }
                if (is_object(tool.attributes)) {
                    el(_button, false, tool.attributes);
                }
                events_set(_CLICK, _button, do_click_tool);
            }
            dom_set(_tool, _button);
        }
    }

    function do_update_keys() {
        // sort keyboard shortcut(s) ...
        r.keys = (function() {
            var a = Object.keys(r.keys).sort().reverse(),
                b = {}, i;
            for (i = 0, len = a.length; i < len; ++i) {
                b[a[i]] = r.keys[a[i]];
            }
            return b;
        })();
        do_keys_reset(1);
    }

    function do_update_contents(e) {
        do_word_count(), hook_fire('change', [e, editor]);
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
            k = k.length;
            if (counts === k && Object.keys(maps).length === k) {
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
            delete maps[e.TE.key()];
        }
    }

    function do_update_contents_debounce(e) {
        if (/^focus|blur$/.test(e.type)) {
            do_keys_reset(1);
        }
        timer_reset(bounce);
        bounce = timer_set(do_update_contents, 1000);
    }

    function do_click_tool(e) {
        var id = this.getAttribute('data-tool-id'),
            tools = r.tools;
        _drop_target = e.currentTarget || e.target;
        if (tools[id] && tools[id].click && tools[id].active) {
            tools[id].click(e, editor, id);
            hook_fire('change', [e, editor, id]);
        } else {
            editor.select();
        }
        return event_exit(e);
    }

    editor.create = function(o, hook) {
        if (is_object(o)) {
            config = extend(config, o);
        }
        class_set(_content, C);
        var parent = dom_exist(_content);
        if (parent && parent.tagName.toLowerCase() === 'p') {
            dom_before(parent, _container);
            _p = parent;
            dom_reset(parent, false);
        } else {
            dom_before(_content, _container);
        }
        _container.dir = config.dir;
        dom_set(_container, _header);
        dom_set(_container, _body);
        dom_set(_container, _footer);
        dom_set(_container, _resize);
        dom_set(_body, _content);
        if (config.tools) {
            dom_set(_header, _tool);
            dom_set(_footer, _description);
            dom_set(_description, _description_left);
            dom_set(_description, _description_right);
        }
        if (config.keys) {
            events_set(_KEYDOWN, _content, do_keys);
            events_set(_KEYUP, _content, do_keys_reset);
        }
        events_set(target_events, _content, do_update_contents_debounce);
        events_set(_MOUSEDOWN, _resize, do_r_down);
        events_set(_MOUSEMOVE, body, do_r_move);
        events_set(_MOUSEUP, body, do_r_up);
        dom_set(_description_left, _preview);
        content_set(_preview, i18n_others.preview);
        do_update_contents();
        do_update_tools();
        do_update_keys();
        return hook !== 0 ? hook_fire('create', [editor]) : editor;
    };

    editor.update = function(o, hook) {
        if (class_exist(_content, C)) {
            editor.destroy(0); // destroy if already created
        }
        return (hook !== 0 ? hook_fire('update', [editor]) : editor).create(o, 0);
    };

    editor.destroy = function(hook) {
        if (!class_exist(_content, C)) return editor;
        r.exit();
        class_reset(_content, C);
        config.tools = config.tools.join(' ');
        if (config.keys) {
            events_reset(_KEYDOWN, _content, do_keys);
            events_reset(_KEYUP, _content, do_keys_reset);
        }
        events_reset(_MOUSEDOWN, _resize, do_r_down);
        events_reset(_MOUSEMOVE, body, do_r_move);
        events_reset(_MOUSEUP, body, do_r_up);
        events_reset(target_events, _content, do_update_contents_debounce);
        if (_p) {
            dom_before(_container, _p);
            dom_set(_p, _content);
            _p = 0;
        } else {
            dom_before(_container, _content);
        }
        dom_content_reset(_container);
        return hook !== 0 ? hook_fire('destroy', [editor]) : editor;
    };

    var drag = 0,
        x = 0,
        y = 0,
        w = 0,
        h = 0,
        W = 0,
        H = 0,
        O = {},
        o, s;

    function do_r_down(e) {
        drag = _resize;
        s = size(_footer);
        return event_exit(e);
    }

    function do_r_move(e) {
        if (drag === _resize) {
            el_style(_content, {
                height: (point(_body, e).y - s.h) + 'px'
            });
        }
    }

    function do_r_up() {
        drag = 0;
    }

    function do_overlay_exit() {
        r.exit(1);
    }

    function do_modal_size() {
        o = size(_modal);
        w = o.w;
        h = o.h;
        o = size(_overlay);
        W = o.w;
        H = o.h;
    }

    function do_modal_exit() {
        events_fire(_CLICK, [], _overlay);
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
                left: (w > W ? left : edge(left, 0, W - w)) + 'px',
                top: (h > H ? top : edge(top, 0, H - h)) + 'px'
            });
        } else if (drag === resize) {
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

    function do_modal_dom_set(header, body, footer) {
        return {
            header: header,
            body: body,
            footer: footer
        };
    }

    function do_drop_exit(e) {
        var a = _drop_target,
            b = _drop,
            c = (e && e.target) || 0;
        if (!c || (c !== a && closest(c, a) !== a)) {
            _drop_target = 0;
            dom_content_reset(_drop);
            events_reset(_CLICK, body, do_drop_exit);
            r.exit(1);
        }
    }

    r.exit = function(select, k) {
        var fn = {
            overlay: function() {
                events_reset(_CLICK, _overlay, do_overlay_exit);
                dom_content_reset(_overlay);
            },
            modal: function() {
                events_reset(_MOUSEDOWN, _body, do_modal_down);
                events_reset(_MOUSEMOVE, _body, do_modal_move);
                events_reset(_MOUSEUP, body, do_modal_up);
                events_reset(_CLICK, O.x, do_modal_exit);
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
        return editor;
    };

    r.overlay = function(s, x, fn) {
        r.exit(0, 'bubble');
        do_keys_reset(1);
        dom_set(_body, el(_overlay, s.length || is_node(s) ? el_set(prefix + '-overlay-content', 'div', s) : ""));
        if (x) events_set(_CLICK, _overlay, do_overlay_exit);
        if (is_function(fn)) {
            fn(_overlay);
        } else {
            el(_overlay, fn);
        }
        return editor;
    };

    r.modal = function() {
        r.exit();
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
        el(_modal, false, {
            'class': F + ' ' + k
        });
        if (is_set(o.body)) {
            o.body = el('div', o.body, {
                'class': F + '-content ' + k
            });
        }
        for (i in o) {
            F[1] = i;
            O[i] = el_set(F + '-' + format(i, F) + ' ' + k, 0, o[i]);
        }
        O.x = el_set(prefix + '-x ' + k); // add `close` button
        O.resize = el_set(prefix + '-resize se ' + k); // add `resize` button
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
        events_set(_CLICK, O.x, do_modal_exit);
        events_set(_MOUSEDOWN, O.header, event_exit);
        events_set(_MOUSEDOWN, O.resize, event_exit);
        events_set(_MOUSEDOWN, _body, do_modal_down);
        events_set(_MOUSEMOVE, _body, do_modal_move);
        events_set(_MOUSEUP, body, do_modal_up);
        if (is_function(fn)) {
            O.overlay = _overlay;
            O.modal = _modal;
            fn(O);
        }
        return editor;
    };

    var button_attrs = {
        'class': prefix + '-button'
    }

    r.alert = function(title, content, y, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs);
        y = y || noop;
        events_set(_CLICK, okay, function(e) {
            return y(e, editor), do_modal_exit(), event_exit(e);
        });
        events_set(_KEYDOWN, okay, function(e) {
            var key = e.TE.key;
            if (key(/^escape|enter$/)) {
                return events_fire(_CLICK, [e, editor], okay);
            }
        });
        timer_set(function() {
            okay.focus();
        }, 1);
        return r.modal('alert', do_modal_dom_set(title, content, okay), fn);
    };

    r.confirm = function(title, content, y, n, fn) {
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
        events_set(_CLICK, okay, yep);
        events_set(_CLICK, cancel, nope);
        events_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key('arrowleft')) return event_exit(e);
            if (key('enter')) return yep(e), event_exit(e);
            if (key('escape')) return do_modal_exit(), event_exit(e);
        });
        events_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key(/^escape|arrowright$/)) return event_exit(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
            if (key('enter')) return nope(e), event_exit(e);
            if (key('escape')) return do_modal_exit(), event_exit(e);
        });
        timer_set(function() {
            cancel.focus();
        }, 1);
        return r.modal('confirm', do_modal_dom_set(title, content, [okay, cancel]), fn);
    };

    r.prompt = function(title, value, required, y, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            cancel = el('button', i18n_buttons.cancel, button_attrs),
            input = el('input', false, {
                type: 'text',
                value: value,
                placeholder: value,
                'class': prefix + '-input block'
            }), key;
        y = y || noop;
        function prepare() {
            input.focus();
            input.select();
        }
        function yep(e) {
            if (required && (!trim(input.value).length || input.value === value)) {
                return prepare(), freeze(e);
            }
            return nope(e), y(e, editor, input.value);
        }
        function nope(e) {
            return do_modal_exit(), event_exit(e);
        }
        function freeze(e) {
            return event_exit(e);
        }
        events_set(_KEYDOWN, input, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape')) return nope(e);
            if (key('arrowup')) return freeze(e);
            if (key('arrowdown')) return okay.focus(), event_exit(e);
        });
        events_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape')) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key(/arrow(down|left)/)) return freeze(e);
        });
        events_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key(/^enter|escape$/)) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key(/arrow(right|down)/)) return freeze(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
        });
        events_set(_CLICK, okay, yep);
        events_set(_CLICK, cancel, nope);
        timer_set(prepare, .4);
        return r.modal('prompt', do_modal_dom_set(title, input, [okay, cancel]), fn);
    };

    r.drop = function(k, fn) {
        r.exit();
        dom_set(body, el(_drop, false, {
            'class': prefix + '-drop ' + k
        }));
        if (is_function(fn)) {
            fn(_drop);
        } else {
            el(_drop, fn);
        }
        var a = size(html),
            b = size(_drop),
            left = (a.w / 2) - (b.w / 2),
            top = (a.h / 2) - (b.h / 2), o;
        if (_drop_target) {
            o = offset(_drop_target);
            left = o.l;
            top = o.t + size(_drop_target).h; // drop!
        }
        if (left + b.w > a.w) {
            left = edge(a.w - b.w, 0);
        }
        if (top + b.h > a.h) {
            top = edge(a.h - b.h, 0);
        }
        el_style(_drop, {
            left: left + 'px',
            top: top + 'px'
        });
        events_set(_CLICK, body, do_drop_exit);
        return editor;
    };

    r.bubble = function(k, fn) {
        r.exit();
        var s = editor.$(true),
            o = offset(_content),
            h = parseInt(editor._.css(_content, 'line-height'), 10),
            top;
        if (is_function(fn)) {
            fn(_bubble);
        } else {
            el(_bubble, fn);
        }
        dom_set(body, el(_bubble, false, {
            'class': prefix + '-bubble ' + k
        }));
        top = s.caret[1].y + o.t + h - _content.scrollTop;
        if (top > o.t + size(_content).h - h) {
            top = offset(_footer).t - size(_bubble).h;
        } else if (top < o.t) {
            top = o.t;
        }
        el_style(_bubble, {
            left: (s.caret[0].x + o.l) + 'px',
            top: top + 'px'
        });
        return editor;
    };

    r.tool = function(id, data, i) {
        var ii = "";
        config.tools = config.tools.filter(function(v, i) {
            if (v === id) {
                ii = i;
                return false;
            } else {
                return true;
            }
        });
        if (data === false) {
            delete r.tools[id];
        } else {
            r.tools[id] = extend((r.tools[id] || {}), data);
            if (!is_set(i) && ii !== "") {
                i = ii;
            }
            if (is_number(i)) {
                config.tools.splice(i, 0, id);
            } else {
                config.tools.push(id);
            }
        }
        return do_update_tools(), editor;
    };

    r.key = function(keys, data) {
        if (data === false) {
            delete r.keys[keys];
        } else {
            r.keys[keys] = data;
        }
        return do_update_keys(), editor;
    };

    // default tool(s)
    r.tools = {
        '|': 1, // separator
        undo: {
            i: 'undo',
            click: function(e, $) {
                return editor.undo(), false;
            }
        },
        redo: {
            i: 'repeat',
            click: function(e, $) {
                return editor.redo(), false;
            }
        }
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