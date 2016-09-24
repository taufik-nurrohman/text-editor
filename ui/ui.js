/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 0.0.9
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.prototype.create = function(o) {

    var _u2318 = '\u2318', // command sign
        _u2026 = '\u2026', // horizontal ellipsis
        _u2325 = '\u2325', // option sign

        win = window,
        doc = document,
        r = this,
        html = doc.documentElement,
        head = doc.head,
        body = doc.body,
        hooks = {},
        target = r.target,
        noop = function() {},
        esc = r._.x,
        extend = r._.extend,
        css = r._.css,
        config = extend({
            tab: '  ',
            dir: 'ltr',
            keys: 1,
            tools: 'indent outdent | undo redo',
            css: 'html,body{background:#fff;color:#000}',
            auto_tab: 1,
            auto_close: {
                '"': '"',
                "'": "'",
                '(': ')',
                '{': '}',
                '[': ']',
                '<': '>'
            },
            languages: {
                tools: {
                    undo: 'Undo (' + _u2318 + '+Z)',
                    redo: 'Redo (' + _u2318 + '+Y)',
                    preview: 'Preview (' + _u2318 + '+' + _u2325 + '+V)'
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
        i18n = config.languages,
        tab = config.tab,
        auto_tab = config.auto_tab,
        auto_close = config.auto_close;

    // add `ui` method to `TE`
    r.ui = {};

    // add `tidy` method to `TE`
    r.tidy = function(a, b) {
        var $ = r.$(),
            B = $.before.length ? a : "",
            A = $.after.length ? (is_set(b) ? b : a) : "";
        return r.trim(B, A);
    };

    // add `format` method to `TE`
    r.format = function(node, wrap, gap_1, gap_2) {
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var s = r[0]().$(),
            a = '<' + node + '>' + gap_2,
            b = gap_2 + '</' + node.split(' ')[0] + '>',
            A = esc(a),
            B = esc(b),
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
            r.insert(i18n_others.placeholder);
        }
        return r.toggle(
            // when ...
            wrap ? !m.test(s.value) : (!m_A.test(before) && !m_B.test(after)),
            // do ...
            [
                // first toggle
                function($) {
                    $.unwrap(a, b, 1).tidy(gap_11, gap_12).wrap(a, b, wrap)[1]();
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
        if (!node) return;
        node.addEventListener(id, fn, false);
        hook_set('on:' + id, fn, dom_id(node));
        return r;
    }

    function event_reset(id, node, fn) {
        if (!node) return;
        node.removeEventListener(id, fn, false);
        hook_reset('on:' + id, dom_id(node));
        return r;
    }

    function event_fire(id, data, node) {
        hook_fire('on:' + id, data, dom_id(node));
        return r;
    }

    function events_set(ids, node, fn) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_set(ids[i], node, fn);
        }
        return r;
    }

    function events_reset(ids, node, fn) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_reset(ids[i], node, fn);
        }
        return r;
    }

    function events_fire(ids, node, data) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_fire(ids[i], node, data);
        }
        return r;
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
        _preview = el_set(prefix + '-preview', 'a'),
        _p = 0,
        _drop_target = 0,
        _button, _icon;

    _preview.href = "";
    _preview.title = i18n_tools.preview;

    function do_click_preview(e) {
        var v = r.get();
        if (!dom_exist(_overlay) && v.length) {
            if (v.indexOf('</html>') === -1) {
                v = '<!DOCTYPE html><html dir="' + config.dir + '"><head><meta charset="utf-8"><style>' + config.css + '</style></head><body>' + v + '</body></html>';
            }
            var frame = el('iframe', false, {
                'class': prefix + '-portal',
                src: 'data:text/html,' + encodeURIComponent(v)
            });
            r.ui.overlay(frame, 1, function() {
                hook_fire('enter.overlay.preview', [e, r, v, _overlay.firstChild]);
            });
        } else {
            do_overlay_exit();
        }
        return event_exit(e);
    }

    events_set(_CLICK, _preview, do_click_preview);

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
            if (!r.ui.tools[v]) continue;
            tool = r.ui.tools[v];
            if (is_function(tool)) {
                r.ui.tools[v].click = tool;
            }
            if ((icon = tool.i || v) !== '|') {
                icon = slug(icon);
            }
            is_button = icon !== '|';
            _button = el_set(is_button ? c_button : c_separator, is_button ? 'a' : 'span');
            if (is_button) {
                _button_id = c_button + ':' + slug(v).replace(/\s/g, "");
                _button.href = "";
                _button.id = _button_id;
                _button.tabIndex = -1;
                _button.setAttribute('data-tool-id', v);
                icon = '<i class="' + format(c.i, [icon]) + ' ' + _button_id + '"></i>';
                if (!is_set(tool.active)) {
                    tool.active = 1;
                } else if (!tool.active) {
                    class_set(_button, 'x');
                }
                if (tool.text) {
                    icon = format(tool.text, [icon]);
                    class_set(_button, 'text');
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
        hook_fire('update.tools', [r]);
    }

    function do_update_keys() {
        // sort keyboard shortcut(s) ...
        r.ui.keys = (function() {
            var a = Object.keys(r.ui.keys).sort().reverse(),
                b = {}, i;
            for (i = 0, len = a.length; i < len; ++i) {
                b[a[i]] = r.ui.keys[a[i]];
            }
            return b;
        })();
        do_keys_reset(1);
        hook_fire('update.keys', [r]);
    }

    function do_update_contents(e) {
        do_word_count(), hook_fire('on:change', [e, r]);
    }

    var maps = {},
        bounce = null;

    function do_keys(e) {
        var s = r.$(),
            before = s.before.slice(-1),
            after = s.after[0],
            length = s.length,
            key = e.TE.key,
            keys = r.ui.keys,
            keys_a = TE.keys_alt,
            dent = (s.before.match(/(?:^|\n)([\t ]*).*$/) || [""]).pop(),
            i, j, k, l, m, n = key();
        function explode(s) {
            return s.replace(/\+/g, '\n').replace(/\n\n/g, '\n+').split('\n');
        }
        maps[key()] = 1;
        timer_set(function() {
            r.record();
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
                    keys[i] = r.ui.tools[keys[i]].click;
                }
                l = keys[i](e, r);
                if (l === false) event_exit(e);
            }
        }
        if (auto_tab && !length) {
            if (n === 'backspace' && pattern(esc(tab) + '$').test(s.before)) {
                r.outdent(tab);
                return event_exit(e);
            }
        }
        if (auto_close) {
            for (i in auto_close) {
                m = auto_close[i];
                if (!m) continue;
                if (after === n) {
                    if (before === '\\') {
                        r.insert(n, -1);
                        return event_exit(e);
                    }
                    r.select(s.end + 1);
                    return event_exit(e);
                }
                if (i === n) {
                    r.wrap(i, m);
                    return event_exit(e);
                }
                if (before === i && after === m) {
                    if (n === 'backspace' && s.before.slice(-2) !== '\\' + i) {
                        r.unwrap(i, m);
                        return event_exit(e);
                    } else if (n === 'enter' && auto_tab) {
                        r.tidy('\n' + dent + tab, '\n' + dent);
                        return event_exit(e);
                    }
                }
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
        r.ui.exit(0, 0, 0);
        var id = this.getAttribute('data-tool-id'),
            tools = r.ui.tools;
        _drop_target = e.currentTarget || e.target;
        if (tools[id] && tools[id].click && tools[id].active) {
            tools[id].click(e, r, id);
            hook_fire('on:change', [e, r, id]);
        } else {
            r.select();
        }
        return event_exit(e);
    }

    r.create = function(o, hook) {
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
        events_set(_MOUSEDOWN, _resize, do_resize_down);
        events_set(_MOUSEMOVE, body, do_resize_move);
        events_set(_MOUSEUP, body, do_resize_up);
        dom_set(_description_left, _preview);
        content_set(_preview, i18n_others.preview);
        do_update_contents();
        do_update_tools();
        do_update_keys();
        return hook !== 0 ? hook_fire('create', [r]) : r;
    };

    r.update = function(o, hook) {
        if (class_exist(_content, C)) {
            r.destroy(0); // destroy if already created
        }
        return (hook !== 0 ? hook_fire('update', [r]) : r).create(o, 0);
    };

    r.destroy = function(hook) {
        if (!class_exist(_content, C)) return r;
        r.ui.exit(0, 0, 0);
        class_reset(_content, C);
        config.tools = config.tools.join(' ');
        if (config.keys) {
            events_reset(_KEYDOWN, _content, do_keys);
            events_reset(_KEYUP, _content, do_keys_reset);
        }
        events_reset(_MOUSEDOWN, _resize, do_resize_down);
        events_reset(_MOUSEMOVE, body, do_resize_move);
        events_reset(_MOUSEUP, body, do_resize_up);
        events_reset(target_events, _content, do_update_contents_debounce);
        if (_p) {
            dom_before(_container, _p);
            dom_set(_p, _content);
            _p = 0;
        } else {
            dom_before(_container, _content);
        }
        dom_content_reset(_container);
        return hook !== 0 ? hook_fire('destroy', [r]) : r;
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

    function do_resize_down(e) {
        drag = _resize;
        s = size(_footer);
        return event_exit(e);
    }

    function do_resize_move(e) {
        if (drag === _resize) {
            el_style(_content, {
                height: (point(_body, e).y - s.h) + 'px'
            });
        }
    }

    function do_resize_up() {
        drag = 0;
    }

    function do_overlay_exit() {
        r.ui.exit(1);
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
            r.ui.exit(1);
        }
    }

    r.ui.exit = function(select, k, hook) {
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
                for (i in k) {
                    i = k[i];
                    fn[i] && fn[i]();
                    if (hook !== 0) hook_fire('exit.' + i, [r]);
                }
            } else {
                fn[k] && fn[k]();
                if (hook !== 0) hook_fire('exit.' + i, [r]);
            }
        }
        if (select) {
            r.select();
        }
        if (hook !== 0) hook_fire('exit', [r]);
        return r;
    };

    r.ui.overlay = function(s, x, fn) {
        r.ui.exit(0, 'bubble', 0);
        do_keys_reset(1);
        dom_set(_body, el(_overlay, s.length || is_node(s) ? el_set(prefix + '-overlay-content', 'div', s) : ""));
        if (x) events_set(_CLICK, _overlay, do_overlay_exit);
        if (is_function(fn)) {
            fn(_overlay);
        } else {
            el(_overlay, fn);
        }
        return hook_fire('enter.overlay', [r]);
    };

    r.ui.modal = function() {
        r.ui.exit(0, 0, 0);
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
        r.ui.overlay("", 1);
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
        hook_fire('enter.modal.' + k, [r]);
        hook_fire('enter.modal', [r]);
        return r;
    };

    var button_attrs = {
        'class': prefix + '-button'
    }

    r.ui.alert = function(title, content, y, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs);
        y = y || noop;
        events_set(_CLICK, okay, function(e) {
            return y(e, r), do_modal_exit(), event_exit(e);
        });
        events_set(_KEYDOWN, okay, function(e) {
            var key = e.TE.key;
            if (key(/^escape|enter$/)) {
                return events_fire(_CLICK, [e, r], okay);
            }
        });
        timer_set(function() {
            okay.focus();
        }, 1);
        return r.ui.modal('alert', do_modal_dom_set(title, content, okay), fn);
    };

    r.ui.confirm = function(title, content, y, n, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            cancel = el('button', i18n_buttons.cancel, button_attrs),
            key;
        function yep(e) {
            if (is_function(y)) y(e, r);
            return do_modal_exit(), event_exit(e);
        }
        function nope(e) {
            if (is_function(n)) n(e, r);
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
            if (key('arrowright')) return event_exit(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
            if (key('enter')) return nope(e), event_exit(e);
            if (key('escape')) return do_modal_exit(), event_exit(e);
        });
        timer_set(function() {
            cancel.focus();
        }, 1);
        return r.ui.modal('confirm', do_modal_dom_set(title, content, [okay, cancel]), fn);
    };

    r.ui.prompt = function(title, value, required, y, fn) {
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
            return nope(e), y(e, r, input.value);
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
            if (key(/^arrow(down|left)$/)) return freeze(e);
        });
        events_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key(/^enter|escape$/)) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key(/^arrow(right|down)$/)) return freeze(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
        });
        events_set(_CLICK, okay, yep);
        events_set(_CLICK, cancel, nope);
        timer_set(prepare, .4);
        return r.ui.modal('prompt', do_modal_dom_set(title, input, [okay, cancel]), fn);
    };

    r.ui.drop = function() {
        r.ui.exit(0, 0, 0);
        var arg = arguments,
            k = arg[0],
            fn = arg[1];
        if (arg.length === 1) {
            k = 'default';
            fn = arg[0];
        }
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
        el_style(_drop, {
            left: edge(left, 0, a.w - b.w) + 'px',
            top: edge(top, 0, a.h - b.h) + 'px'
        });
        events_set(_CLICK, body, do_drop_exit);
        hook_fire('enter.drop.' + k, [r]);
        hook_fire('enter.drop', [r]);
        return r;
    };

    r.ui.bubble = function() {
        r.ui.exit(0, 0, 0);
        var arg = arguments,
            k = arg[0],
            fn = arg[1],
            s = r.$(1),
            o = offset(_content),
            h = parseInt(css(_content, 'line-height'), 10),
            left, top, bs;
        if (arg.length === 1) {
            k = 'default';
            fn = arg[0];
        }
        if (is_function(fn)) {
            fn(_bubble);
        } else {
            el(_bubble, fn);
        }
        dom_set(body, el(_bubble, false, {
            'class': prefix + '-bubble ' + k
        }));
        left = s.caret[0].x + o.l;
        top = s.caret[1].y + o.t + h - _content.scrollTop;
        bs = size(_bubble);
        el_style(_bubble, {
            left: edge(left, o.l, o.l + size(_body).w - bs.w) + 'px',
            top: edge(top, o.t, offset(_footer).t - bs.h) + 'px'
        });
        hook_fire('enter.bubble.' + k, [r]);
        hook_fire('enter.bubble', [r]);
        return r;
    };

    r.ui.tool = function(id, data, i) {
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
            delete r.ui.tools[id];
        } else {
            r.ui.tools[id] = extend((r.ui.tools[id] || {}), data);
            if (!is_set(i) && ii !== "") {
                i = ii;
            }
            if (is_number(i)) {
                config.tools.splice(i, 0, id);
            } else {
                config.tools.push(id);
            }
        }
        return do_update_tools(), r;
    };

    r.ui.key = function(keys, data) {
        if (data === false) {
            delete r.ui.keys[keys];
        } else {
            r.ui.keys[keys] = data;
        }
        return do_update_keys(), r;
    };

    // default tool(s)
    r.ui.tools = {
        '|': 1, // separator
        undo: {
            i: 'undo',
            click: function(e, $) {
                return $.undo(), false;
            }
        },
        redo: {
            i: 'repeat',
            click: function(e, $) {
                return $.redo(), false;
            }
        },
        indent: function(e, $) {
            return $.indent(tab), false;
        },
        outdent: function(e, $) {
            return $.outdent(tab), false;
        }
    };

    // default hotkey(s)
    r.ui.keys = {
        'control+y': 'redo',
        'control+z': 'undo',
        'control+option+v': function(e, $) {
            return do_click_preview(e), false;
        },
        'shift+tab': auto_tab ? 'outdent' : noop,
        'tab': auto_tab ? 'indent' : noop,
        'escape': function(e, $) {
            return _preview.focus(), false;
        }
    };

    r.ui.parent = r;
    r.ui.dom = {
        container: _container,
        header: _header,
        body: _body,
        footer: _footer,
        overlay: _overlay,
        modal: _modal,
        drop: _drop,
        bubble: _bubble
    };

    r.config = config;

    // utility ...
    extend(r._, {
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

    return r.ui;

};