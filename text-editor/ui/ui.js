/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 1.2.5
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.prototype.ui = function(o) {

    var _u2318 = '\u2318', // command sign
        _u2026 = '\u2026', // horizontal ellipsis
        _u2325 = '\u2325', // option sign
        _u21E5 = '\u21E5', // indent sign
        _u21E7 = '\u21E7', // shift sign

        win = window,
        doc = document,
        $ = this,
        _ = $._,
        esc = _.x,
        extend = _.extend,
        css = _.css,
        edge = _.edge,
        pattern = _.pattern,
        trim = _.trim,
        is = $.is,
        is_dom = is.e,
        is_function = is.f,
        is_number = is.i,
        is_object = is.o,
        is_pattern = is.r,
        is_string = is.s,
        is_set = function(x) {
            return !is.x(x);
        },
        html = doc.documentElement,
        head = doc.head,
        body = doc.body,
        hooks = {},
        noop = function() {},
        config = extend({
            tab: '  ',
            dir: 'ltr',
            keys: 1,
            tools: 'indent outdent | undo redo',
            attributes: {
                'spellcheck': 'false'
            },
            css: 'html,body{background:#fff;color:#000}',
            unit: [
                [
                    ['\u003C', '\u003E', '\u002F'],
                    ['\u003D', '\u0022', '\u0022', '\u0020']
                ],
                [
                    ['\\u003C', '\\u003E', '\\u002F'],
                    ['\\u003D', '\\u0022', '\\u0022', '\\u0020']
                ]
            ],
            suffix: 0,
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
                    undo: ['Undo', _u2318 + '+Z'],
                    redo: ['Redo', _u2318 + '+Y'],
                    indent: ['Indent',  _u21E5],
                    outdent: ['Outdent',  _u21E7 + '+' + _u21E5],
                    preview: ['Preview', 'F5']
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
                placeholders: {
                    "": 'text here' + _u2026
                },
                others: {
                    preview: 'Preview',
                    _word: '%1 Word',
                    _words: '%1 Words'
                }
            },
            classes: {
                "": 'text-editor',
                i: 'icon icon-%1 fa fa-%1'
            }
        }, o),
        _KEYDOWN = 'keydown',
        _KEYUP = 'keyup',
        _COPY = 'copy',
        _CUT = 'cut',
        _PASTE = 'paste',
        _MOUSEDOWN = 'touchstart mousedown',
        _MOUSEUP = 'touchend mouseup',
        _MOUSEMOVE = 'touchmove mousemove',
        _CLICK = 'click',
        _FOCUS = 'focus',
        _BLUR = 'blur',
        _INPUT = 'input',
        _RESIZE = 'orientationchange resize',
        target_events = _BLUR + ' ' + _COPY + ' ' + _CUT + ' ' + _FOCUS + ' ' + _INPUT + ' ' + _KEYDOWN + ' ' + _PASTE,
        i18n = config.languages,
        tab = config.tab,
        auto_tab = config.auto_tab,
        auto_close = config.auto_close,
        unit = config.unit[0][0],
        data = config.unit[0][1],
        esc_unit = config.unit[1][0],
        esc_data = config.unit[1][1],
        data_tool_id = 'data-tool-id';

    function hook_set(ev, fn, id) {
        if (!is_set(ev)) return hooks;
        if (!is_set(fn)) return hooks[ev];
        if (!is_set(hooks[ev])) hooks[ev] = {};
        if (!is_set(id)) id = Object.keys(hooks[ev]).length;
        return hooks[ev][id] = fn, $;
    }

    function hook_reset(ev, id) {
        if (!is_set(ev)) return hooks = {}, $;
        if (!is_set(id) || !is_set(hooks[ev])) return hooks[ev] = {}, $;
        return delete hooks[ev][id], $;
    }

    function hook_fire(ev, a, id) {
        if (!is_set(hooks[ev])) {
            return hooks[ev] = {}, $;
        }
        if (!is_set(id)) {
            for (var i in hooks[ev]) {
                hooks[ev][i].apply($, a);
            }
        } else {
            if (is_set(hooks[ev][id])) {
                hooks[ev][id].apply($, a);
            }
        }
        return $;
    }

    function event_exit(e) {
        if (e) e.preventDefault();
        return false;
    }

    function event_set(id, node, fn) {
        if (!node) return;
        node.addEventListener(id, fn, false);
        hook_set('on:' + id, fn, dom_id(node));
        return $;
    }

    function event_reset(id, node, fn) {
        if (!node) return;
        node.removeEventListener(id, fn, false);
        hook_reset('on:' + id, dom_id(node));
        return $;
    }

    function event_fire(id, node, data) {
        if ('createEvent' in doc) {
            var e = doc.createEvent('HTMLEvents');
            e.data = data;
            e.initEvent(id, true, false);
            node.dispatchEvent(e);
        } else {
            hook_fire('on:' + id, data, dom_id(node));
        }
        return $;
    }

    function events_set(ids, node, fn) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_set(ids[i], node, fn);
        }
        return $;
    }

    function events_reset(ids, node, fn) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_reset(ids[i], node, fn);
        }
        return $;
    }

    function events_fire(ids, node, data) {
        ids = trim(ids).split(/\s+/);
        for (var i = 0, len = ids.length; i < len; ++i) {
            event_fire(ids[i], node, data);
        }
        return $;
    }

    function timer_set(fn, i) {
        return setTimeout(fn, i);
    }

    function timer_reset(timer_set_fn) {
        return clearTimeout(timer_set_fn);
    }

    function sanitize(s, from, to) {
        for (var i = 0, j = from.length, k; i < j; ++i) {
            k = from[i];
            s = s.replace(is_pattern(k) ? k : pattern(esc(k), 'g'), (to && to[i]) || "");
        }
        return s;
    }

    function format(s, data) {
        return s.replace(/%(\d+)/g, function(a, b) {
            --b;
            return is_set(data[b]) ? data[b] : a;
        });
    }

    function slug(s) {
        // exclude ` ` and `/`
        return trim(sanitize(s, [/[^ \/a-z\d-]/g, /([ -])+/g, /^-|-$/g], ['-', '$1', ""]));
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
        while ((a = dom_parent(a)) && a !== b);
        return a;
    }

    // add `ui` method to `TE`
    var ui = $.ui = {};

    // add `tidy` method to `TE`
    $.tidy = function(a, b) {
        var s = $.$(),
            B = trim(s.before) ? a : "",
            A = trim(s.after) ? (is_set(b) ? b : a) : "";
        return $.trim(B, A);
    };

    // helper: force inline
    $.i = function() {
        return trim($.replace(/\s+/g, ' '));
    };

    // add `format` method to `TE`
    $.format = function(node, wrap, gap_1, gap_2) {
        if (!is_object(node)) node = [node];
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var s = $[0]().$(),
            a = (node[0] ? unit[0] + node[0] + unit[1] : "") + gap_2,
            b = gap_2 + (node[0] ? unit[0] + unit[2] + (node[1] || node[0].split(pattern('(' + esc_data[3] + ')+'))[0]) + unit[1] : ""),
            A = esc(a),
            B = esc(b),
            m = pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = pattern(A + '$'),
            m_B = pattern('^' + B),
            before = s.before,
            after = s.after;
        if (!s.length) {
            $.insert(i18n.placeholders[""]);
        } else {
            gap_1 = false;
        }
        return $.toggle(
            // when ...
            wrap ? !m.test(s.value) : (!m_A.test(before) && !m_B.test(after)),
            // do ...
            [
                // first toggle
                function($) {
                    $.unwrap(a, b, 1).tidy(pattern(esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + esc_unit[2] + ']+?' + esc_unit[1] + '$').test(before) ? "" : gap_1, pattern('^' + esc_unit[0] + esc_unit[2] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1]).test(after) ? "" : gap_1).wrap(a, b, wrap)[1]();
                },
                // second toggle (the reset state)
                function($) {
                    $.unwrap(a, b, wrap)[1]();
                }
            ]
        );
    };

    var c = config.classes,
        prefix = c[""],
        i18n_tools = i18n.tools,
        i18n_buttons = i18n.buttons,
        i18n_others = i18n.others,
        C = prefix + '-textarea ' + prefix + '-content block',
        _container = el_set(prefix),
        _header = el_set(prefix + '-header'),
        _body = el_set(prefix + '-body'),
        _footer = el_set(prefix + '-footer'),
        _tool = el_set(prefix + '-tool'),
        _content = el($.target, false, config.attributes),
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

    if (!config.suffix) {
        config.suffix = unit[1];
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
                        em = dom_css(em, v);
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
        if (is_dom(node)) {
            dom_set(em, node);
        } else {
            if (is_object(node)) {
                var v, i;
                for (i in node) {
                    v = node[i];
                    if (is_dom(v)) {
                        dom_set(em, v);
                    } else {
                        if (v !== false) content_set(em, v);
                    }
                }
            } else {
                if (is_set(node) && node !== false) content_set(em, node);
            }
        }
        return em;
    }

    function dom_id(node) {
        var id = node.id;
        if (!id) {
            id = prefix + '-dom:' + (new Date()).getTime();
            node.id = id;
        }
        return id;
    }

    function dom_css(em, prop) {
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
        if (!is_set(s)) return node.innerHTML;
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

    function dom_parent(node) {
        return node.parentElement || node.parentNode;
    }

    function dom_children(node) {
        return node.children || [];
    }

    function dom_next(node) {
        return node.nextElementSibling || node.nextSibling;
    }

    function dom_previous(node) {
        return node.previousElementSibling || node.previousSibling;
    }

    function dom_exist(node, dom) {
        var parent = dom_parent(node);
        if (arguments.length === 1) {
            return parent || false;
        }
        return node && parent === node ? parent : false;
    }

    function dom_before(node, dom) {
        dom_parent(node).insertBefore(dom, node);
    }

    function dom_after(node, dom) {
        dom_parent(node).insertBefore(dom, dom_next(node));
    }

    function dom_begin(node, dom) {
        var c = dom_children(node)[0];
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
                var c = dom_children(node)[0];
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
        if (!i18n_others._word || !i18n_others._words) return;
        var v = (_content.value || "").replace(pattern(esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1], 'g'), ""),
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
            tool = ui.tools[v];
            if (!tool) continue;
            if (is_function(tool)) {
                tool.click = tool;
            }
            tool.title = i18n_tools[v] || "";
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
                _button.setAttribute(data_tool_id, v);
                icon = '<i class="' + format(c.i, [icon]) + ' ' + _button_id + '"></i>';
                if (!is_set(tool.active)) {
                    tool.active = 1;
                } else if (!tool.active) {
                    class_set(_button, 'x');
                }
                if (tool.text) {
                    icon = format('<span class="' + prefix + '-text">' + tool.text + '</span>', [icon]);
                    class_set(_button, 'text');
                }
                content_set(_button, icon);
                if (tool.title) {
                    var t = tool.title;
                    _button.title = is_object(t) ? t[0] + (t[1] ? ' (' + t[1] + ')' : "") : t;
                }
                if (is_object(tool.attributes)) {
                    el(_button, false, tool.attributes);
                }
                events_set(_CLICK, _button, do_click_tool);
            }
            dom_set(_tool, _button);
        }
        hook_fire('update.tools', [$]);
    }

    function do_update_keys() {
        // sort keyboard shortcut(s) ...
        ui.keys = (function() {
            var a = Object.keys(ui.keys).sort().reverse(),
                b = {}, i;
            for (i = 0, len = a.length; i < len; ++i) {
                b[a[i]] = ui.keys[a[i]];
            }
            return b;
        })();
        do_keys_reset(1);
        hook_fire('update.keys', [$]);
    }

    function do_update_contents(e) {
        do_word_count(), hook_fire('on:change', [e, $]);
    }

    var maps = {},
        bounce = null;

    function do_keys(e) {
        var s = $.$(),
            s_before = s.before,
            s_after = s.after,
            before = s_before.slice(-1),
            after = s_after[0],
            length = s.length,
            keys = ui.keys,
            keys_a = TE.keys_alias,
            dent = (s_before.match(/(?:^|\n)([\t ]*).*$/) || [""]).pop(),
            i, j, k, l, m, n = e.TE.key(), o;
        maps[n] = 1;
        o = Object.keys(maps).length;
        function explode(s) {
            return s.replace(/\+/g, '\n').replace(/\n\n/g, '\n+').split('\n');
        }
        timer_set(function() {
            $.record();
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
            if (counts === k && o === k) {
                if (is_string(keys[i])) {
                    keys[i] = ui.tools[keys[i]].click;
                }
                l = keys[i] && keys[i](e, $);
                if (l === false) return event_exit(e);
            }
        }
        if (auto_close) {
            for (i in auto_close) {
                m = auto_close[i];
                if (m === false) continue;
                if (n === m && after === m) {
                    if (before === '\\') {
                        $.insert(n, 0);
                        return event_exit(e);
                    }
                    return $.select(s.end + 1), event_exit(e);
                }
                if (i === n) {
                    return $.wrap(i, m), event_exit(e);
                }
                if (before === i && after === m) {
                    if (n === 'backspace' && s_before.slice(-2) !== '\\' + i) {
                        return $.unwrap(i, m), event_exit(e);
                    } else if (auto_tab && n === 'enter' && i !== m) {
                        return $.tidy('\n' + dent + tab, '\n' + dent).scroll(true), event_exit(e);
                    }
                }
            }
        }
        if (auto_tab && !length) {
            if (n === 'backspace' && pattern(esc(tab) + '$').test(s_before)) {
                return $.outdent(tab).scroll(true), event_exit(e);
            } else if (n === 'enter' && pattern('(^|\\n)(' + esc(tab) + ')+.*$').test(s_before)) {
                return $.insert('\n' + dent, 0, 1).scroll(true), event_exit(e);
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
        bounce = timer_set(function() {
            do_update_contents(e);
        }, 250);
    }

    function do_click_tool(e) {
        ui.exit(0, 0, 0);
        var id = this.getAttribute(data_tool_id),
            tools = ui.tools;
        _drop_target = e.currentTarget || e.target;
        if (tools[id] && tools[id].click && tools[id].active) {
            tools[id].click(e, $, id);
            hook_fire('on:change', [e, $, id]);
        } else {
            $.select();
        }
        return event_exit(e);
    }

    $.create = function(o, hook) {
        if (is_object(o)) {
            config = extend(config, o);
        }
        var _parent = dom_exist(_content);
        class_set(_content, C);
        if (_parent && _parent.nodeName === 'P') {
            dom_before(_parent, _container);
            _p = _parent;
            dom_reset(_parent, false);
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
        events_set(_KEYDOWN, _content, do_keys);
        events_set(_KEYUP, _content, do_keys_reset);
        events_set(target_events, _content, do_update_contents_debounce);
        events_set(_MOUSEDOWN, _resize, do_resize_down);
        events_set(_MOUSEMOVE, body, do_resize_move);
        events_set(_MOUSEUP, body, do_resize_up);
        if (i18n_others.preview) {
            var t = i18n_tools.preview;
            _preview.href = "";
            _preview.title = is_object(t) ? t[0] + (t[1] ? ' (' + t[1] + ')' : "") : t;
            dom_set(_description_left, _preview);
            content_set(_preview, i18n_others.preview);
        }
        do_update_contents(null);
        do_update_tools();
        do_update_keys();
        return hook !== 0 ? hook_fire('create', [$]) : $;
    };

    $.update = function(o, hook) {
        if (class_exist(_content, C)) {
            $.destroy(0); // destroy if already created
        }
        return (hook !== 0 ? hook_fire('update', [$]) : $).create(o, 0);
    };

    $.destroy = function(hook) {
        if (!class_exist(_content, C)) return $;
        ui.exit(0, 0, 0);
        class_reset(_content, C);
        if (is_object(config.tools)) config.tools = config.tools.join(' ');
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
        return hook !== 0 ? hook_fire('destroy', [$]) : $;
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
            dom_css(_content, {
                height: (point(_body, e).y - s.h) + 'px'
            });
        }
    }

    function do_resize_up() {
        drag = 0;
    }

    function do_overlay_exit() {
        ui.exit(1);
    }

    function do_modal_size() {
        o = size(_modal);
        w = o.w;
        h = o.h;
        o = size(_overlay);
        W = o.w;
        H = o.h;
    }

    function do_modal_exit(e, id) {
        if (id) {
            hook_fire('exit.modal.' + id, [$]);
        }
        events_fire(_CLICK, _overlay, [e]);
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
            dom_css(_modal, {
                left: (w > W ? left : edge(left, 0, W - w)) + 'px',
                top: (h > H ? top : edge(top, 0, H - h)) + 'px'
            });
        } else if (drag === resize) {
            o = point(_modal, e);
            s = size(resize);
            dom_css(_modal, {
                width: (o.x + (s.w / 4)) + 'px',
                height: (o.y + (s.h / 4)) + 'px'
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
            ui.exit(1);
        }
    }

    ui.exit = function(select, k, hook) {
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
                    if (hook !== 0) hook_fire('exit.' + i, [$]);
                }
            } else {
                fn[k] && fn[k]();
                if (hook !== 0) hook_fire('exit.' + i, [$]);
            }
        }
        if (select) {
            $.select();
        }
        if (hook !== 0) hook_fire('exit', [$]);
        return $;
    };

    ui.overlay = function(s, x, fn) {
        ui.exit(0, 'bubble', 0);
        do_keys_reset(1);
        dom_set(_body, el(_overlay, s.length || is_dom(s) ? el_set(prefix + '-overlay-content', 'div', s) : ""));
        if (x) events_set(_CLICK, _overlay, do_overlay_exit);
        if (is_function(fn)) {
            fn(_overlay);
        } else {
            el(_overlay, fn);
        }
        return hook_fire('enter.overlay', [$]);
    };

    ui.modal = function() {
        ui.exit(0, 0, 0).blur();
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
        ui.overlay("", 1);
        do_modal_size();
        var top = (H / 2) - (h / 2),
            left = (W / 2) - (w / 2);
        dom_css(_modal, {
            top: edge(top, 0) + 'px',
            left: edge(left, 0) + 'px',
            'min-width': w + 'px',
            'min-height': h + 'px',
            visibility: 'visible'
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
        hook_fire('enter.modal.' + k, [$]);
        hook_fire('enter.modal', [$]);
        return $;
    };

    var button_attrs = {
        'class': prefix + '-button'
    }

    ui.alert = function(title, content, y, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            id = 'alert';
        y = y || noop;
        if (is_object(title)) {
            id += ':' + title[0];
            title = title[1] || title[0];
        }
        events_set(_CLICK, okay, function(e) {
            return y(e, $), do_modal_exit(e, id + '.y'), event_exit(e);
        });
        events_set(_KEYDOWN, okay, function(e) {
            var key = e.TE.key;
            if (key(/^escape|enter$/)) {
                return events_fire(_CLICK, okay, [e, $]);
            }
        });
        timer_set(function() {
            okay.focus();
        }, 1);
        return ui.modal(id, do_modal_dom_set(title, content, okay), fn);
    };

    ui.confirm = function(title, content, y, n, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            cancel = el('button', i18n_buttons.cancel, button_attrs),
            id = 'confirm', key;
        if (is_object(title)) {
            id += ':' + title[0];
            title = title[1] || title[0];
        }
        function yep(e) {
            if (is_function(y)) y(e, $);
            return do_modal_exit(e, id + '.y'), event_exit(e);
        }
        function nope(e) {
            if (is_function(n)) n(e, $);
            return do_modal_exit(e, id + '.n'), event_exit(e);
        }
        events_set(_CLICK, okay, yep);
        events_set(_CLICK, cancel, nope);
        events_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key('arrowleft')) return event_exit(e);
            if (key('enter')) return yep(e), event_exit(e);
            if (key('escape')) return do_modal_exit(e, id + '.y'), event_exit(e);
        });
        events_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return event_exit(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
            if (key('enter')) return nope(e), event_exit(e);
            if (key('escape')) return do_modal_exit(e, id + '.n'), event_exit(e);
        });
        timer_set(function() {
            cancel.focus();
        }, 1);
        return ui.modal(id, do_modal_dom_set(title, content, [okay, cancel]), fn);
    };

    ui.prompt = function(title, value, required, y, type, fn) {
        var okay = el('button', i18n_buttons.okay, button_attrs),
            cancel = el('button', i18n_buttons.cancel, button_attrs),
            input = el('input', false, {
                type: 'text',
                value: value,
                placeholder: value,
                spellcheck: 'false',
                'class': prefix + '-input block'
            }),
            id = 'prompt', key, options = [], i, j;
        if (is_object(title)) {
            id += ':' + title[0];
            title = title[1] || title[0];
        }
        if (is_function(type)) {
            fn = type;
            type = 0;
        }
        if (type === 1) {
            input = el('textarea', value, {
                placeholder: value.split('\n')[0],
                'class': prefix + '-textarea block'
            });
        } else if (type === 2) {
            for (i in value) {
                options.push(el('option', value[i], {
                    value: i,
                    selected: i === required || null
                }));
            }
            input = el('select', options, {
                'class': prefix + '-select block'
            });
        }
        y = y || noop;
        function prepare() {
            input.focus();
            if ('placeholder' in input) input.select();
        }
        function yep(e) {
            j = input.value;
            if (required && (!trim(j) || j === value)) {
                return prepare(), freeze(e);
            }
            return do_modal_exit(e, id + '.y'), event_exit(e), y(e, $, j !== value ? j : "", value);
        }
        function nope(e) {
            return do_modal_exit(e, id + '.n'), event_exit(e);
        }
        function freeze(e) {
            return event_exit(e);
        }
        events_set(_KEYDOWN, input, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape') || key('backspace') && !this.value) return nope(e);
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
        return ui.modal(id, do_modal_dom_set(title, input, [okay, cancel]), fn);
    };

    ui.drop = function() {
        ui.exit(0, 0, 0);
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
        dom_css(_drop, {
            left: edge(left, 0, a.w - b.w) + 'px',
            top: edge(top, 0, a.h - b.h) + 'px',
            visibility: 'visible'
        });
        events_set(_CLICK, body, do_drop_exit);
        hook_fire('enter.drop.' + k, [$]);
        hook_fire('enter.drop', [$]);
        return $;
    };

    ui.menu = function(id, str, data, i) {
        var current = '<span class="' + prefix + '-current menu">%1</span>',
            icon = "";
        if (str === false) {
            return ui.tool(id, str);
        } else if (is_object(str)) {
            icon = str[0];
            str = str[1];
            current = '<i class="' + format(c.i, [icon]) + '"></i> ' + current;
        }
        return ui.tool(id, {
            i: icon,
            text: format(current, [str, icon]),
            click: function(e) {
                var attr = {
                    'class': prefix + '-button'
                }, h, i, j, k;
                ui.drop('menu', function(drop) {
                    content_reset(drop);
                    for (i in data) {
                        attr[data_tool_id] = i;
                        h = el('span', i, attr);
                        if (data[i]) {
                            events_set(_CLICK, h, function(e) {
                                k = data[this.getAttribute(data_tool_id)];
                                if (is_string(k)) {
                                    k = ui.tools[k].click;
                                }
                                j = k && k(e, $);
                                if (_drop_target) {
                                    content_set(dom_children(_drop_target)[0] || _drop_target, format(current, [content_set(this), icon]));
                                }
                                if (j === false) return event_exit(e);
                            });
                            events_set(_KEYDOWN, h, function(e) {
                                
                            });
                        }
                        dom_set(drop, h);
                        
                    }
                });
            }
        }, i), hook_fire('update.menus', [$]), $;
    };

    ui.bubble = function() {
        ui.exit(0, 0, 0);
        var arg = arguments,
            k = arg[0],
            fn = arg[1],
            s = $.$(1),
            o = offset(_content),
            h = css(_content, 'line-height'),
            left, top, ts, bs, tb_v, tb_h,
            border = 'border-',
            width = '-width';
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
        left = s.caret[0].x + o.l - _content.scrollLeft;
        top = s.caret[1].y + o.t + h - _content.scrollTop;
        ts = size(_body);
        bs = size(_bubble);
        tb_v = css(_body, border + 'top' + width) + css(_body, border + 'bottom' + width);
        tb_h = css(_body, border + 'left' + width) + css(_body, border + 'right' + width);
        dom_css(_bubble, {
            left: edge(left, o.l, o.l + ts.w - bs.w - tb_h) + 'px',
            top: edge(top, o.t, o.t + ts.h - bs.h - tb_v) + 'px',
            visibility: 'visible'
        });
        hook_fire('enter.bubble.' + k, [$]);
        hook_fire('enter.bubble', [$]);
        return $;
    };

    ui.tool = function(id, data, i) {
        var ii = "";
        if (id !== '|') {
            config.tools = config.tools.filter(function(v, i) {
                if (v === id) {
                    ii = i;
                    return false;
                } else {
                    return true;
                }
            });
        }
        if (data === false) {
            delete ui.tools[id];
        } else {
            // separator detected
            if (id === '|') {
                i = data;
                data = {};
            } else {
                if (is_function(data)) {
                    data = {
                        click: data
                    };
                }
                ui.tools[id] = extend((ui.tools[id] || {}), data);
                if (!is_set(i) && ii !== "") {
                    i = ii;
                }
            }
            if (is_number(i)) {
                config.tools.splice(i, 0, id);
            } else {
                config.tools.push(id);
            }
        }
        return do_update_tools(), $;
    };

    ui.key = function(keys, data) {
        if (!config.keys) return $;
        if (data === false) {
            delete ui.keys[keys];
        } else {
            ui.keys[keys] = data;
        }
        return do_update_keys(), $;
    };

    // default tool(s)
    ui.tools = {
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

    function do_click_preview(e) {
        var v = $.get(),
            w = "", frame;
        if (v.indexOf('</html>') === -1) {
            w = '<!DOCTYPE html><html dir="' + config.dir + '"><head><meta charset="utf-8"><style>' + config.css + '</style></head><body>' + v + '</body></html>';
        }
        frame = el('iframe', false, {
            'class': prefix + '-portal',
            src: 'data:text/html,' + encodeURIComponent(w)
        });
        function frame_resize() {
            var o = dom_children(_overlay)[0], p;
            if (o) {
                p = size(o);
                dom_css(frame, {
                    width: p.w + 'px',
                    height: p.h + 'px'
                });
            }
        }
        if (!dom_exist(_overlay) && v) {
            ui.overlay(frame, 1, function() {
                frame_resize();
                events_set(_RESIZE, win, frame_resize);
                hook_fire('enter.overlay.preview', [e, $, [v, w], o]);
            });
        } else {
            events_reset(_RESIZE, win, frame_resize);
            do_overlay_exit();
        }
        return event_exit(e);
    }

    events_set(_CLICK, _preview, do_click_preview);

    // default hotkey(s)
    ui.keys = {
        'control+y': 'redo',
        'control+z': 'undo',
        'f5': function(e, $) {
            return do_click_preview(e), false;
        },
        'shift+tab': auto_tab ? 'outdent' : 0,
        'tab': auto_tab ? 'indent' : 0,
        'escape': function(e, $) {
            return _preview.focus(), false;
        }
    };

    ui.el = {
        container: _container,
        header: _header,
        body: _body,
        footer: _footer,
        overlay: _overlay,
        modal: _modal,
        drop: _drop,
        bubble: _bubble
    };

    $.config = config;

    // utility ...
    extend($._, {
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
        replace: sanitize,
        format: format,
        el: el,
        event: {
            set: events_set,
            reset: events_reset,
            fire: events_fire,
            x: event_exit
        },
        hooks: hooks,
        hook: {
            set: hook_set,
            reset: hook_reset,
            fire: hook_fire
        }
    });

    return ui;

};