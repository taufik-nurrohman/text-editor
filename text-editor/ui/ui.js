/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 1.10.2
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.ui = function(target, o) {

    var _u2318 = '\u2318', // command sign
        _u2026 = '\u2026', // horizontal ellipsis
        _u2325 = '\u2325', // option sign
        _u21E5 = '\u21E5', // indent sign
        _u21E7 = '\u21E7', // shift sign

        win = window,
        doc = document,
        $ = new TE(target),

        _ = $._,
        _css = _.css,
        _edge = _.edge,
        _esc = _.x,
        _extend = _.extend,
        _pattern = _.pattern,
        _timer_reset = _.timer.reset,
        _timer_set = _.timer.set,
        _trim = _.trim,

        hooks = {}, // hook(s)
        noop = function() {}, // just a function placeholder

        is = TE.is,
        is_dom = is.e,
        is_array = is.a,
        is_function = is.f,
        is_number = is.i,
        is_object = is.o,
        is_pattern = is.r,
        is_set = function(x) {
            return !is.x(x);
        },
        is_string = is.s,

        html = doc.documentElement,
        head = doc.head,
        body = doc.body,

        config = _extend({
            tab: '  ',
            direction: 'ltr',
            path: TE.path,
            resize: 1,
            keys: 1,
            tools: 'indent outdent | undo redo',
            attributes: {
                'spellcheck': 'false'
            },
            union: [
                [
                    ['\\u003C', '\\u003E', '\\u002F'],
                    ['\\u003D', '\\u0022', '\\u0022', '\\u0020']
                ],
                [
                    ['\u003C', '\u003E', '\u002F'],
                    ['\u003D', '\u0022', '\u0022', '\u0020']
                ]
            ],
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
                    tools: ['Focus Tools', 'F10'],
                    undo: ['Undo', _u2318 + '+Z'],
                    redo: ['Redo', _u2318 + '+Y'],
                    indent: ['Indent',  _u21E5],
                    outdent: ['Outdent',  _u21E7 + '+' + _u21E5]
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
                labels: {},
                others: {}
            },
            classes: {
                "": 'text-editor',
                i: 'text-editor-i text-editor-i-%1 text-editor-i-%2'
            }
        }, o),

        maps = {}, // capture keyboard key(s) here ...

        a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z,

        _BLUR = 'blur',
        _CLICK = 'click',
        _COPY = 'copy',
        _CUT = 'cut',
        _FOCUS = 'focus',
        _INPUT = 'input',
        _KEYDOWN = 'keydown',
        _KEYUP = 'keyup',
        _MOUSEDOWN = 'touchstart mousedown',
        _MOUSEMOVE = 'touchmove mousemove',
        _MOUSEUP = 'touchend mouseup',
        _PASTE = 'paste',
        _RESIZE = 'orientationchange resize',

        auto_close = config.auto_close,
        auto_tab = config.auto_tab,
        i18n = config.languages,
        tab = config.tab,

        data = config.union[1][1],
        unit = config.union[1][0],

        esc_data = config.union[0][1],
        esc_unit = config.union[0][0],

        js = 'javascript:;',
        px = 'px';

    function str_lower(s) {
        return s.toLowerCase();
    }

    function str_split(s) {
        return is_string(s) ? _trim(s).split(/\s+/) : s;
    }

    function str_join(s) {
        return is_object(s) ? s.join(' ') : s;
    }

    function str_has(str, s) {
        return str.indexOf(s) !== -1;
    }

    function object_keys(x) {
        return Object.keys(x);
    }

    function count(s) {
        return s.length;
    }

    function count_object(x) {
        return count(object_keys(x));
    }

    function hook_set(ev, fn, id) {
        if (!is_set(ev)) return hooks;
        if (!is_set(fn)) return hooks[ev];
        if (!is_set(hooks[ev])) hooks[ev] = {};
        if (!is_set(id)) id = count_object(hooks[ev]);
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
            for (i in hooks[ev]) {
                hooks[ev][i].apply($, a);
            }
        } else {
            if (is_set(hooks[ev][id])) {
                hooks[ev][id].apply($, a);
            }
        }
        return $;
    }

    function attr_set(node, a, b) {
        if (is_object(a)) {
            for (i in a) {
                attr_set(node, i, a[i]);
            }
        } else {
            node[(b === null ? 'remove' : 'set') + 'Attribute'](a, b);
        }
    }

    function attr_get(node, a, b) {
        if (!a) {
            o = {};
            for (i = 0, j = node.attributes, k = count(j); i < k; ++i) {
                l = j[i];
                o[l.name] = l.value;
            }
            return count_object(o) ? o : (is_set(b) ? b : {});
        }
        if (is_string(a)) {
            return attr_get(node, [a], [is_set(b) ? b : ""])[0];
        }
        o = [];
        for (i in a) {
            i = a[i];
            i = node.getAttribute(i) || "";
            o.push(i);
        }
        return count(o) ? o : (is_set(b) ? b : []);
    }

    function attr_reset(node, a) {
        if (is_object(a)) {
            for (i in a) {
                attr_reset(node, a[i]);
            }
        } else {
            if (!is_set(a)) {
                attr_reset(node, 'class'); // :(
                for (i = 0, j = node.attributes, k = count(j); i < k; ++i) {
                    if (j[i]) attr_reset(node, j[i].name);
                }
            } else {
                node.removeAttribute(a);
            }
        }
    }

    function data_set(node, a, b) {
        if (is_object(a)) {
            for (i in a) {
                data_set(node, i, a[i]);
            }
        } else {
            attr_set(node, 'data-' + a, b);
        }
    }

    function data_get(node, a, b) {
        if (!a) {
            o = {};
            for (i = 0, j = node.attributes, k = count(j); i < k; ++i) {
                l = j[i];
                if (l.name.slice(0, 5) === 'data-') {
                    o[l.name] = l.value;
                }
            }
            return count_object(o) ? o : (is_set(b) ? b : {});
        }
        if (is_string(a)) {
            return data_get(node, [a], [is_set(b) ? b : ""])[0];
        }
        o = [];
        for (i in a) {
            i = a[i];
            i = attr_get(node, 'data-' + i);
            o.push(i);
        }
        return count(o) ? o : (is_set(b) ? b : []);
    }

    function data_reset(node, a) {
        if (is_object(a)) {
            for (i in a) {
                attr_reset(node, 'data-' + a[i]);
            }
        } else {
            if (!is_set(a)) {
                for (i = 0, j = node.attributes, k = count(j); i < k; ++i) {
                    if (j[i] && j[i].name.slice(0, 5) === 'data-') {
                        attr_reset(node, j[i].name);
                    }
                }
            } else {
                attr_reset(node, 'data-' + a);
            }
        }
    }

    function event_exit(e) {
        if (e) e.preventDefault();
        return false;
    }

    function event_set(id, node, fn) {
        if (!node) return;
        id = str_split(id);
        for (i = 0, j = count(id); i < j; ++i) {
            node.addEventListener(id[i], fn, false);
            hook_set('on:' + id[i], fn, dom_id(node));
        }
        return $;
    }

    function event_reset(id, node, fn) {
        if (!node) return;
        id = str_split(id);
        for (i = 0, j = count(id); i < j; ++i) {
            node.removeEventListener(id[i], fn, false);
            hook_reset('on:' + id[i], dom_id(node));
        }
        if (is_dom(node) && node.id.split(':')[0] === _prefix + '-dom') {
            attr_reset(node, 'id');
        }
        return $;
    }

    function event_fire(id, node, data) {
        id = str_split(id);
        var has_event = 'createEvent' in doc, e;
        for (i = 0, j = count(id); i < j; ++i) {
            if (has_event) {
                e = doc.createEvent('HTMLEvents');
                e.data = data;
                e.initEvent(id[i], true, false);
                node.dispatchEvent(e);
            } else {
                hook_fire('on:' + id[i], data, dom_id(node));
            }
        }
        return $;
    }

    function sanitize(s, from, to) {
        for (i = 0, j = count(from), k; i < j; ++i) {
            k = from[i];
            s = s.replace(is_pattern(k) ? k : _pattern(_esc(k), 'g'), (to && to[i]) || "");
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
        return _trim(sanitize(str_lower(s), [/[^ \/a-z\d-]/g, /([ -])+/g, /^-|-$/g], ['-', '$1', ""]));
    }

    function pointer(node, e) {
        var x = !!e.touches ? e.touches[0].pageX : e.pageX,
            y = !!e.touches ? e.touches[0].pageY : e.pageY,
            o = offset(node);
        return {
            x: x - o.l,
            y: y - o.t
        };
    }

    function offset(node) {
        l = node.offsetLeft;
        t = node.offsetTop;
        while (node = node.offsetParent) {
            l += node.offsetLeft;
            t += node.offsetTop;
        }
        return {
            l: l,
            t: t
        };
    }

    function size(node) {
        return node === win ? {
            w: node.innerWidth,
            h: node.innerHeight
        } : {
            w: node.offsetWidth,
            h: node.offsetHeight
        };
    }

    function closest(a, b) {
        while ((a = dom_parent(a)) && a !== b);
        return a;
    }

    function class_set(node, s) {
        s = str_split(s);
        for (i in s) {
            node.classList.add(s[i]);
        }
    }

    function class_get(node, s, b) {
        if (!s) {
            o = str_split(node.className);
            return count(o) ? o : (is_set(b) ? b : []);
        }
        if (is_string(s)) {
            return class_get(node, [s], [is_set(b) ? b : ""])[0];
        }
        o = [];
        for (i in s) {
            i = s[i];
            if (node.classList.contains(i)) {
                o.push(i);
            }
        }
        return count(o) ? o : (is_set(b) ? b : []);
    }

    function class_reset(node, s) {
        if (!is_set(s)) {
            attr_reset(node, 'class');
        } else {
            s = str_split(s);
            for (i in s) {
                node.classList.remove(s[i]);
            }
        }
    }

    function class_toggle(node, s) {
        s = str_split(s);
        for (i in s) {
            node.classList.toggle(s[i]);
        }
    }

    function el(em, node, attr) {
        em = em || 'div';
        em = is_string(em) ? doc.createElement(em) : em;
        if (is_object(attr)) {
            if (!node) {
                if (is_set(attr.html)) {
                    node = attr.html;
                    delete attr.html;
                } else if (is_set(attr.text)) {
                    node = attr.text;
                    delete attr.text;
                }
            }
            for (i in attr) {
                v = attr[i];
                if (i === 'classes') {
                    class_set(em, v);
                } else if (i === 'data') {
                    for (j in v) {
                        v = v[j];
                        if (v === null) {
                            data_reset(em, j);
                        } else {
                            data_set(em, j, v);
                        }
                    }
                } else if (i === 'css') {
                    if (is_string(v)) {
                        attr_set(em, 'style', v);
                    } else if (v === null) {
                        attr_reset(em, 'style');
                    } else {
                        _css(em, v);
                    }
                } else {
                    if (is_function(v)) {
                        em[i] = v;
                    } else {
                        if (v === null) {
                            attr_reset(em, i);
                        } else {
                            attr_set(em, i, is_array(v) ? v.join(' ') : "" + v);
                        }
                    }
                }
            }
        }
        if (is_dom(node)) {
            dom_set(em, node);
        } else if (is_object(node)) {
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
        return em;
    }

    function dom_id(node) {
        var id = node.id;
        if (!id) {
            id = _prefix + '-dom:' + Math.floor(Date.now() * Math.random());
            node.id = id;
        }
        return id;
    }

    function content_set(node, s) {
        node.innerHTML = s;
    }

    function content_get(node, s) {
        return node.innerHTML || (is_set(s) ? s : "");
    }

    function content_reset(node, deep) {
        if ((!is_set(deep) || deep) && (c = dom_children(node))) {
            for (i = 0, j = count(c); i < j; ++i) {
                content_reset(c[i]);
            }
        }
        content_set(node, "");
    }

    function dom_array(a) {
        return Array.prototype.slice.call(a);
    }

    function dom_parent(node) {
        return node && node.parentNode;
    }

    function dom_children(node) {
        return node && dom_array(node.children || []);
    }

    function dom_closest(node, s) {
        if (!is_set(s)) {
            return dom_parent(node);
        }
        return is_string(s) ? node.closest(s) : closest(node, s);
    }

    function dom_next(node) {
        return node && node.nextElementSibling;
    }

    function dom_previous(node) {
        return node && node.previousElementSibling;
    }

    function dom_index(node) {
        i = 0;
        while (node = dom_previous(node)) ++i;
        return i;
    }

    function dom_is(node, s) {
        if (node && is_string(s)) {
            return str_lower(node.nodeName) === str_lower(s);
        } else if (node && is_function(s)) {
            return node === s(node);
        }
        return node === s;
    }

    function dom_get(s, parent) {
        if (!(parent = is_set(parent) ? parent : doc)) {
            return [];
        }
        if (is_string(s)) {
            if (/^[#.]?(?:\\.|[\w-]|[^\x00-\xa0])+$/.test(s)) {
                // `#foo`
                if (s[0] === '#' && (s = parent.getElementById(s.slice(1)))) {
                    return [s];
                // `.foo` or `foo`
                } else if ((s[0] === '.' && (s = parent.getElementsByClassName(s.slice(1)))) || (s = parent.getElementsByTagName(s))) {
                    return dom_array(s);
                }
                return [];
            } else {
                // `#foo .bar [baz=qux]`
                return dom_array(parent.querySelectorAll(s));
            }
        }
        return dom_exist(s) ? [s] : [];
    }

    function dom_exist(node, dom) {
        var parent = dom_parent(node);
        if (count(arguments) === 1) {
            return parent || false;
        }
        return node && parent === node ? parent : false;
    }

    function dom_before(node, dom) {
        p = dom_parent(node);
        if (!p) return;
        p.insertBefore(dom, node);
    }

    function dom_after(node, dom) {
        p = dom_parent(node);
        if (!p) return;
        p.insertBefore(dom, dom_next(node));
    }

    function dom_begin(node, dom) {
        c = node.firstChild;
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
        var parent = dom_parent(node);
        if (parent) {
            if (!is_set(deep) || deep) {
                c = node.firstChild;
                while (c) dom_reset(c);
            }
            parent.removeChild(node);
        }
    }

    function dom_copy(node, deep) {
        return node.cloneNode(!is_set(deep) ? true : !!deep);
    }

    function dom_replace(node, s) {
        dom_parent(node).replaceChild(s, node);
        return s;
    }

    function dom_content_reset(node) {
        content_reset(el(node, false, {
            'style': ""
        }));
        dom_reset(node);
    }

    function el_set(a, b, c) {
        return el(b, c, {
            'class': a
        });
    }

    // add `ui` method to `TE`
    var ui = $.ui = {};

    // add `tidy` method to `TE`
    $.tidy = function(a, b) {
        var s = $.$(),
            B = _trim(s.before) ? a : "",
            A = _trim(s.after) ? (is_set(b) ? b : a) : "";
        return $.trim(B, A); // `tidy` method does not populate history data
    };

    // helper: force inline
    $.i = function() {
        return _trim($.replace(/\s+/g, ' '));
    };

    // add `format` method to `TE`
    $.format = function(node, wrap, gap_1, gap_2) {
        if (!is_object(node)) node = [node];
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var current = $.h,
            s = $[0]().$(),
            node_o = node[0].split(_pattern('(' + esc_data[3] + ')+'))[0],
            a = (node[0] ? unit[0] + node[0] + unit[1] : "") + gap_2,
            b = gap_2 + (node[0] ? unit[0] + unit[2] + (node[1] || node_o) + unit[1] : ""),
            A = _esc(node[0] ? unit[0] + node_o + unit[1] : ""),
            B = _esc(b),
            m = _pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = _pattern(A + '$'),
            m_B = _pattern('^' + B),
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
                    $.unwrap(a, b, 1).tidy(_pattern(esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + esc_unit[2] + ']+?' + esc_unit[1] + '$').test(before) ? "" : gap_1, _pattern('^' + esc_unit[0] + esc_unit[2] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1]).test(after) ? "" : gap_1).wrap(a, b, wrap);
                },
                // second toggle (the reset state)
                function($) {
                    $.unwrap(a, b, wrap);
                }
            ]
        )[current]();
    };

    var _c = config.classes,
        _prefix = _c[""],
        _i18n_tools = i18n.tools,
        _i18n_buttons = i18n.buttons,
        _i18n_labels = i18n.labels,
        _class = _prefix + '-textarea ' + _prefix + '-content block',
        _sizer_s = el_set(_prefix + '-sizer s'),
        _sizer_se = el_set(_prefix + '-sizer se'),
        _container = el_set(_prefix),
        _header = el_set(_prefix + '-header'),
        _body = el_set(_prefix + '-body'),
        _footer = el_set(_prefix + '-footer'),
        _tool = el_set(_prefix + '-tool'),
        _content = el(target, false, config.attributes),
        _description = el_set(_prefix + '-description'),
        _panel = el(),
        _overlay = el(),
        _modal = el(),
        _drop = el(),
        _bubble = el(),
        _message = el(),
        _description_left = el_set('left', 'span'),
        _description_right = el_set('right', 'span'),
        _p = 0,
        _button, _icon;

    // create an icon
    ui.i = function(id, alt, el) {
        id = slug(id).replace(/[\/\s]/g, '-');
        s = format(_c.i, [id, alt || id]);
        if (el) {
            class_reset(el);
            class_set(el, s);
            return el;
        }
        return '<i class="' + s + '"></i>';
    };

    if (!is_set(config.suffix)) {
        config.suffix = unit[1];
    }

    function is_disabled_tool(x) {
        return !x || (is_set(x.active) && !x.active);
    }

    function do_attributes(tool, k, tools) {
        if (is_function(tool)) {
            tool = {
                click: tool
            };
        }
        if (is_string(tool.click)) {
            tool.click = (tools[tool.click] || {}).click;
        }
        tool.title = _i18n_tools[k] || "";
        if (!is_set(tool.attributes)) {
            tool.attributes = {};
        }
        return tools[k] && (tools[k] = tool), tool;
    }

    function do_click_tool(e) {
        ui.exit(0, 0, 0);
        var id = data_get(this, 'tool-id'),
            tools = ui.tools,
            tool = tools[id];
        ui.drop.target = e.currentTarget || e.target;
        if (!is_disabled_tool(tool) && is_function(j = tool.click)) {
            j = j(e, $, id);
            hook_fire('on:change', [e, $, id]);
            if (j === false) return event_exit(e);
        }
        return $.select(), event_exit(e);
    }

    function do_key_tool(e) {
        t = this;
        k = e.TE.key;
        if (k(['escape', 'f10'])) {
            ui.exit(1);
        } else if (k('enter') || k('down') && data_get(t, 'ui-drop')) {
            ui.drop.target = t;
            event_fire(_CLICK, t, [e]);
        } else if (k('right') && (l = dom_next(t))) {
            while (!dom_is(l, 'a')) {
                if (!l) break;
                l = dom_next(l);
            }
            l && l.focus();
        } else if (k('left') && (l = dom_previous(t))) {
            while (!dom_is(l, 'a')) {
                if (!l) break;
                l = dom_previous(l);
            }
            l && l.focus();
        }
        return event_exit(e);
    }

    var drop_data = 'ui-drop-data';

    function do_update_tools() {
        content_reset(_tool, 0);
        var tools = ui.tools,
            tools_array = str_split(config.tools),
            button = _prefix + '-button',
            separator = _prefix + '-separator',
            id, tool, icon, is_button, s, i, v;
        config.tools = tools_array;
        for (i in tools_array) {
            v = tools_array[i];
            tool = tools[v];
            if (!(tool || tool === {})) continue;
            tool = do_attributes(tool, v, tools);
            icon = tool.i || v;
            if (icon !== '|' && !str_has(icon, '<')) {
                icon = slug(icon);
            }
            is_button = icon !== '|';
            s = slug(v).replace(/[\/\s]/g, '-');
            _button = el_set(is_button ? button + ' ' + button + '-' + s : separator + ' ' + separator + '-' + i, is_button ? 'a' : 'span');
            if (is_button) {
                _button = tool.target || _button;
                id = button + ':' + s;
                attr_set(_button, {
                    'href': js,
                    'id': id,
                    'tabindex': -1
                });
                data_set(_button, 'tool-id', v);
                icon = str_has(icon, '<') ? icon : ui.i(s, icon);
                if (is_disabled_tool(tool)) {
                    class_set(_button, 'x');
                } else {
                    class_reset(_button, 'x');
                }
                if (tool.on) {
                    class_set(_button, 'on');
                } else {
                    class_reset(_button, 'on');
                }
                if (tool.text) {
                    icon = format('<span class="' + _prefix + '-text">' + tool.text + '</span>', [icon]);
                    class_set(_button, 'text');
                }
                content_set(_button, icon);
                el(_button, false, tool.attributes);
                if (!tool.attributes.title && (j = tool.title)) {
                    _button.title = is_object(j) ? j[0] + (j[1] ? ' (' + j[1] + ')' : "") : j;
                }
                event_set(_CLICK, _button, do_click_tool);
                event_set(_KEYDOWN, _button, do_key_tool);
            } else {
                _button.id = separator + ':' + i;
            }
            tool.target = _button;
            if (s = data_get(_button, drop_data)) {
                ui.menu.set(v, s); // refresh `$.ui.menu` state
            }
            dom_set(_tool, _button);
        }
        hook_fire('update.tools', [$]);
    }

    function do_update_keys() {
        // sort keyboard shortcut(s) ...
        ui.keys = (function() {
            var input = object_keys(ui.keys).sort().reverse(),
                output = {}, v;
            for (i = 0, j = count(input); i < j; ++i) {
                v = input[i];
                output[v] = ui.keys[v];
            }
            return output;
        })();
        do_keys_reset();
        hook_fire('update.keys', [$]);
    }

    function do_keys(e) {
        var s = $.$(),
            before = s.before,
            after = s.after,
            b = before.slice(-1),
            a = after[0],
            length = s.length,
            keys = ui.keys,
            keys_a = TE.keys_a,
            keys_controls = {
                'control': 0,
                'shift': 0,
                'option': 'alt',
                'meta': 0
            },
            dent = (before.match(/(?:^|\n)([\t ]*).*$/) || [""]).pop();
        for (i in keys_controls) {
            if (e.TE[i]()) {
                maps[keys_controls[i] || i] = 1;
            }
        }
        n = e.TE.key();
        maps[n] = 1;
        o = count_object(maps);
        function explode(s) {
            return s.replace(/\+/g, '\n').replace(/\n\n/g, '\n+').split('\n');
        }
        _timer_set(function() {
            $.record();
        });
        for (i in keys) {
            k = explode(i);
            c = 0;
            for (j in k) {
                j = k[j];
                if (maps[keys_a[j] || j]) {
                    ++c;
                }
            }
            k = count(k);
            if (c === k && o === k) {
                if (is_string(keys[i])) {
                    keys[i] = ui.tools[keys[i]].click;
                }
                l = is_function(keys[i]) && keys[i](e, $);
                if (l === false) return event_exit(e);
            }
        }
        if (auto_close) {
            for (i in auto_close) {
                m = auto_close[i];
                if (m === false) continue;
                if (n === m && a === m) {
                    if (b === '\\') {
                        $.insert(n, 0);
                        return event_exit(e);
                    }
                    return $.select(s.end + 1), event_exit(e);
                }
                if (i === n) {
                    return $.wrap(i, m), event_exit(e);
                }
                if (b === i && a === m) {
                    if (n === 'backspace' && before.slice(-2) !== '\\' + i) {
                        return $.unwrap(i, m), event_exit(e);
                    } else if (auto_tab && n === 'enter' && i !== m && !length) {
                        return $.tidy('\n' + dent + tab, '\n' + dent).scroll(1), event_exit(e);
                    }
                }
            }
        }
        if (auto_tab && !length) {
            if (n === 'backspace' && _pattern(_esc(tab) + '$').test(before)) {
                return $.outdent(tab), event_exit(e);
            } else if (n === 'enter' && _pattern('(^|\\n)(' + _esc(tab) + ')+.*$').test(before)) {
                return $.insert('\n' + dent, 0, 1).scroll(1), event_exit(e);
            }
        }
    }

    function do_keys_reset(e) {
        if (e && e.TE && e.TE.key) {
            delete maps[e.TE.key()];
        } else {
            maps = {};
        }
    }

    var drag = 0,
        x = 0,
        y = 0,
        w = 0,
        h = 0,
        W = 0,
        H = 0,
        O = {};

    function do_resize_down(e) {
        drag = _sizer_s;
        s = size(_footer);
        return event_exit(e);
    }

    function do_resize_move(e) {
        if (drag === _sizer_s) {
            _css(_content, {
                'height': pointer(_body, e).y - s.h + px
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
        return event_fire(_CLICK, _overlay, [e]), event_exit(e);
    }

    function do_modal_down(e) {
        drag = e.target;
        o = pointer(_modal, e);
        x = o.x;
        y = o.y;
        do_modal_size();
    }

    function do_modal_move(e) {
        var header = O.header,
            sizer = O.sizer;
        if (drag === header || closest(drag, header) === header) {
            o = pointer(_body, e);
            l = o.x - x;
            t = o.y - y;
            _css(_modal, {
                'left': (w > W ? l : _edge(l, 0, W - w)) + px,
                'top': (h > H ? t : _edge(t, 0, H - h)) + px
            });
        } else if (drag === sizer) {
            o = pointer(_modal, e);
            s = size(sizer);
            _css(_modal, {
                'width': (o.x + (s.w / 4)) + px,
                'height': (o.y + (s.h / 4)) + px
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
        a = ui.drop.target;
        b = _drop;
        c = (e && e.target) || 0;
        if (!c || (c !== a && closest(c, a) !== a)) {
            ui.drop.target = 0;
            ui.exit(c === _content);
        }
    }

    // create
    $.create = function(o, hook) {
        if ($.is.create) return $; // reject if already created
        $.is.create = true;
        if (is_object(o)) {
            config = _extend(config, o);
        }
        var _parent = dom_exist(_content);
        class_set(_container, _prefix + '-is-can-update');
        class_set(_container, _prefix + '-is-can-copy');
        class_set(_content, _class);
        if (_parent && dom_is(_parent, 'p')) {
            dom_before(_parent, _container);
            _p = _parent;
            dom_reset(_parent, false);
        } else {
            dom_before(_content, _container);
        }
        _container.dir = config.direction;
        dom_set(_container, _header);
        dom_set(_container, _body);
        dom_set(_container, _footer);
        dom_set(_body, _content);
        if (config.tools) {
            dom_set(_header, _tool);
            dom_set(_footer, _description);
            dom_set(_description, _description_left);
            dom_set(_description, _description_right);
        }
        event_set(_KEYDOWN, _content, do_keys);
        event_set(_KEYUP + ' ' + _BLUR, _content, do_keys_reset);
        n  = _prefix + '-is-can-resize';
        if (config.resize) {
            dom_set(_container, _sizer_s);
            class_set(_container, n);
            event_set(_MOUSEDOWN, _sizer_s, do_resize_down);
            event_set(_MOUSEMOVE, doc, do_resize_move);
            event_set(_MOUSEUP, doc, do_resize_up);
        } else {
            class_reset(_container, n);
        }
        do_update_tools();
        do_update_keys();
        return hook !== 0 ? hook_fire('create', [$]) : $;
    };

    // update
    $.update = function(o, hook) {
        if ($.is.create) {
            $.destroy(0); // destroy if already created
        }
        return (hook !== 0 ? hook_fire('update', [$]) : $).create(o, 0);
    };

    // destroy
    $.destroy = function(hook) {
        if (!$.is.create) return $; // reject if already destroyed
        $.is.create = false;
        ui.exit(0, 0, 0);
        class_reset(_content, _class);
        config.tools = str_join(config.tools);
        if (config.keys) {
            event_reset(_KEYDOWN, _content, do_keys);
            event_reset(_KEYUP, _content, do_keys_reset);
        }
        if (config.resize) {
            event_reset(_MOUSEDOWN, _sizer_s, do_resize_down);
            event_reset(_MOUSEMOVE, doc, do_resize_move);
            event_reset(_MOUSEUP, doc, do_resize_up);
        }
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

    // enable
    $.enable = function(hook) {
        _content.disabled = _content.readOnly = false;
        class_set(_container, _prefix + '-is-can-update');
        class_set(_container, _prefix + '-is-can-copy');
        return hook !== 0 ? hook_fire('enable', [$]) : $;
    };

    // disable
    $.disable = function(hook) {
        _content.disabled = true;
        class_reset(_container, _prefix + '-is-can-update');
        class_reset(_container, _prefix + '-is-can-copy');
        return hook !== 0 ? hook_fire('disable', [$]) : $;
    };

    // freeze
    $.freeze = function(hook) {
        _content.disabled = false;
        _content.readOnly = true;
        class_reset(_container, _prefix + '-is-can-update');
        class_set(_container, _prefix + '-is-can-copy');
        return hook !== 0 ? hook_fire('freeze', [$]) : $;
    };

    ui.exit = function(select, k, hook) {
        f = {
            panel: function() {
                dom_content_reset(_panel);
            },
            overlay: function() {
                event_reset(_CLICK, _overlay, do_overlay_exit);
                dom_content_reset(_overlay);
            },
            modal: function() {
                event_reset(_CLICK + ' ' + _KEYDOWN, O.x, do_modal_exit);
                event_reset(_MOUSEDOWN, _body, do_modal_down);
                event_reset(_MOUSEMOVE, _body, do_modal_move);
                event_reset(_MOUSEUP, doc, do_modal_up);
                dom_content_reset(_modal);
            },
            drop: function() {
                event_reset(_CLICK, doc, do_drop_exit);
                event_reset(_RESIZE, win, do_drop_exit);
                dom_content_reset(_drop);
            },
            bubble: function() {
                dom_content_reset(_bubble);
            }
        };
        do_keys_reset();
        if (!k) {
            for (i in f) f[i]();
        } else {
            if (is_object(k)) {
                for (i in k) {
                    i = k[i];
                    f[i] && f[i]();
                    if (hook !== 0) hook_fire('exit.' + i, [$]);
                }
            } else {
                f[k] && f[k]();
                if (hook !== 0) hook_fire('exit.' + i, [$]);
            }
        }
        if (select) {
            $.select();
        }
        if (hook !== 0) hook_fire('exit', [$]);
        return $;
    };

    ui.panel = function(id, s, fn, hook) {
        ui.exit(0, 0, 0);
        l = slug(id);
        t = 0;
        if (hook) {
            l += ' ' + l + '--' + slug(hook);
        }
        if (is_object(s) && !is_dom(s)) {
            t = el_set(_prefix + '-panel-header ' + l, 0, s.header);
            s = s.body;
        }
        u = el_set(_prefix + '-panel-body ' + l, 0, el_set(_prefix + '-panel-content ' + l, 0, !is_function(s) ? s : ""));
        is_function(s) && s(u);
        x = el('a', false, {
            'href': js,
            'class': _prefix + '-a ' + _prefix + '-x ' + l
        });
        x.title = _i18n_buttons.close;
        el(_panel, false, {
            'class': _prefix + '-panel ' + l
        });
        function do_panel_exit(e) {
            event_reset(_CLICK + ' ' + _KEYDOWN, x, do_panel_exit);
            return ui.panel.exit(1), event_exit(e);
        }
        event_set(_CLICK + ' ' + _KEYDOWN, x, do_panel_exit);
        content_reset(_panel, 0);
        if (t) dom_set(_panel, t);
        dom_set(_body, el(_panel, [u, x]));
        if (is_function(fn)) {
            fn(_panel);
        } else if (is_string(fn)) {
            el(_panel, fn);
        }
        a = [$, _panel];
        if (hook) {
            hook_fire('enter.panel.' + id + ':' + hook, a);
        }
        hook_fire('enter.panel.' + id, a);
        hook_fire('enter.panel', a);
        hook_fire('enter', a);
        return x.focus(), $;
    };

    ui.panel.fit = function() {}; // TODO

    ui.overlay = function(id, x, fn, hook) {
        ui.exit(0, 0, 0);
        l = slug(id);
        if (hook) {
            l += ' ' + l + '--' + slug(hook);
        }
        dom_set(_body, el(_overlay, false, {
            'class': _prefix + '-overlay ' + l
        }));
        if (x) event_set(_CLICK, _overlay, do_overlay_exit);
        if (is_function(fn)) {
            fn(_overlay);
        } else if (is_string(fn)) {
            el(_overlay, fn);
        }
        a = [$, _overlay];
        if (hook) {
            hook_fire('enter.overlay.' + id + ':' + hook, a);
        }
        hook_fire('enter.overlay.' + id, a);
        hook_fire('enter.overlay', a);
        hook_fire('enter', a);
        return $;
    };

    ui.overlay.fit = function() {}; // TODO

    ui.message = function(id, s, t, fn, hook) {
        var k;
        l = slug(id);
        if (hook) {
            l += ' ' + l + '--' + slug(hook);
        }
        x = el('a', false, {
            'href': js,
            'class': _prefix + '-a ' + _prefix + '-x ' + l
        });
        x.title = _i18n_buttons.close;
        el(_message, is_function(s) ? s(_message) : s, {
            'class': _prefix + '-message ' + l
        });
        function do_message_exit(e) {
            event_reset(_CLICK + ' ' + _KEYDOWN, x, do_message_exit);
            return _timer_reset(k), ui.overlay.exit(1), event_exit(e);
        }
        event_set(_CLICK + ' ' + _KEYDOWN, x, do_message_exit);
        ui.overlay('message message-' + l, 0, function(overlay) {
            dom_set(_message, x);
            if (t) {
                k = _timer_set(function() {
                    do_message_exit();
                }, t);
            }
            dom_set(overlay, _message);
        }, hook);
        if (is_function(fn)) {
            fn(_message);
        } else if (is_string(fn)) {
            el(_message, fn);
        }
        return $;
    };

    ui.modal = function() {
        var arg = arguments,
            id = arg[0],
            o = arg[1],
            fn = arg[2],
            hook = arg[3],
            F = _prefix + '-modal',
            footer = o.footer,
            button, buttons;
        if (is_object(id)) {
            id = 'default';
            o = arg[0];
            fn = arg[1];
            hook = arg[2];
        }
        ui.overlay(id, 1, 0, hook).blur();
        l = slug(id);
        if (hook) {
            l += ' ' + l + '--' + slug(hook);
        }
        el(_modal, false, {
            'class': F + ' ' + l
        });
        if (is_set(o.body)) {
            o.body = el('div', o.body, {
                'class': F + '-content ' + l
            });
        }
        if (is_set(footer) && is_object(footer) && !is_dom(footer)) {
            buttons = [];
            for (i in footer) {
                j = footer[i];
                if (!is_dom(j)) {
                    j = do_attributes(j, i, footer);
                    k = i.text || _i18n_buttons[i] || i;
                    button = el('button', k, _extend({
                        'name': 'y[' + i + ']',
                        'type': 'button',
                        'class': _prefix + '-button',
                        'data': {
                            'button-id': i
                        }
                    }, j.attributes));
                    event_set(_CLICK, button, function(e) {
                        k = footer[data_get(this, 'button-id')].click(e, $);
                        if (k === false) return event_exit(e);
                    });
                    buttons.push(button);
                } else {
                    buttons.push(j);
                }
            }
            o.footer = buttons;
        }
        for (i in o) {
            F[1] = i;
            O[i] = el_set(F + '-' + format(i, F) + ' ' + l, 0, o[i]);
        }
        O.x = el('a', false, {
            'href': js,
            'class': _prefix + '-a ' + _prefix + '-x ' + l
        }); // add `close` button
        O.sizer = _sizer_se; // add `resize` button
        content_reset(_modal, 0);
        O.x.title = _i18n_buttons.close;
        dom_set(_body, el(_modal, O, {
            'style': ""
        }));
        ui.modal.fit();
        // put overlay next to the modal, that way we can use `+` CSS selector
        // to style or hide the overlay based on the modal ID easily
        // like `.text-editor-modal.alert + .text-editor-overlay {display:none}`
        dom_after(_modal, _overlay);
        event_set(_CLICK + ' ' + _KEYDOWN, O.x, do_modal_exit);
        event_set(_MOUSEDOWN, O.header, event_exit);
        event_set(_MOUSEDOWN, O.sizer, event_exit);
        event_set(_MOUSEDOWN, _body, do_modal_down);
        event_set(_MOUSEMOVE, _body, do_modal_move);
        event_set(_MOUSEUP, doc, do_modal_up);
        if (is_function(fn)) fn(O);
        a = [$, _modal, O];
        if (hook) {
            hook_fire('enter.modal.' + id + ':' + hook, a);
        }
        hook_fire('enter.modal.' + id, a);
        hook_fire('enter.modal', a);
        hook_fire('enter', a);
        return O.x.focus(), $;
    };

    ui.modal.fit = function(center) {
        do_modal_size();
        l = (W / 2) - (w / 2);
        t = (H / 2) - (h / 2);
        if (is_object(center)) {
            is_set(center[0]) && (l = center[0]);
            is_set(center[1]) && (t = center[1]);
        } else {
            l = _edge(l, 0);
            t = _edge(t, 0);
        }
        _css(_modal, {
            'left': l + px,
            'top': t + px,
            'min-width': w + px,
            'min-height': h + px,
            'visibility': 'visible'
        });
        a = [$, _modal, O];
        hook_fire('fit.modal', a);
        hook_fire('fit', a);
        return $;
    };

    var button_attributes = {
        'class': _prefix + '-button',
        'name': 'y'
    };

    ui.alert = function(title, content, y, fn, hook) {
        var okay = el('button', _i18n_buttons.okay, button_attributes),
            id = 'alert';
        y = y || noop;
        if (is_object(title)) {
            id += ':' + title[0];
            title = title[1] || title[0];
        }
        event_set(_CLICK, okay, function(e) {
            return y(e, $), do_modal_exit(e, id + '.y');
        });
        event_set(_KEYDOWN, okay, function(e) {
            var key = e.TE.key;
            if (key(['enter', 'escape'])) {
                event_fire(_CLICK, okay, [e]);
            }
            return event_exit(e);
        });
        ui.modal(id, do_modal_dom_set(title, content, okay), fn, hook);
        return okay.focus(), $;
    };

    ui.confirm = function(title, content, y, n, fn, hook) {
        var okay = el('button', _i18n_buttons.okay, button_attributes),
            cancel = el('button', _i18n_buttons.cancel, button_attributes),
            id = 'confirm', key;
        cancel.name = 'n';
        function yep(e) {
            if (is_function(y)) y(e, $);
            return do_modal_exit(e, id + '.y');
        }
        function nope(e) {
            if (is_function(n)) n(e, $);
            return do_modal_exit(e, id + '.n');
        }
        event_set(_CLICK, okay, yep);
        event_set(_CLICK, cancel, nope);
        event_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('right')) {
                cancel.focus();
            } else if (key('enter')) {
                yep(e);
            } else if (key('escape')) {
                do_modal_exit(e, id + '.y');
            }
            return event_exit(e);
        });
        event_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key('left')) {
                okay.focus();
            } else if (key('enter')){
                nope(e);
            } else if (key('escape')) {
                do_modal_exit(e, id + '.n');
            }
            return event_exit(e);
        });
        ui.modal(id, do_modal_dom_set(title, content, [okay, cancel]), fn, hook);
        return cancel.focus(), $;
    };

    ui.prompt = function(title, value, required, y, type, fn, hook) {
        var okay = el('button', _i18n_buttons.okay, button_attributes),
            cancel = el('button', _i18n_buttons.cancel, button_attributes),
            input = el('input', false, {
                'type': 'text',
                'value': value,
                'placeholder': value,
                'spellcheck': 'false',
                'class': _prefix + '-input block'
            }),
            id = 'prompt',
            options = [], s, key, control;
        type = type || 0;
        if (type === 1) {
            input = el('textarea', value, {
                'placeholder': value.split('\n')[0],
                'class': _prefix + '-textarea block',
                'spellcheck': 'false'
            });
        } else if (type === 2) {
            for (i in value) {
                options.push(el('option', value[i], {
                    'value': i,
                    'selected': i === required || null
                }));
            }
            input = el('select', options, {
                'class': _prefix + '-select block'
            });
        }
        y = y || noop;
        input.name = 'data';
        cancel.name = 'n';
        function prepare() {
            input.focus();
            ('placeholder' in input) && input.select();
        }
        function yep(e) {
            s = input.value;
            if (is_function(required) && !required(s)) {
                prepare();
            } else if (required && (!_trim(s) || s === value)) {
                prepare();
            } else {
                do_modal_exit(e, id + '.y'), y(e, $, s !== value ? s : "", value);
            }
            return event_exit(e);
        }
        function nope(e) {
            return do_modal_exit(e, id + '.n');
        }
        event_set(_KEYDOWN, input, function(e) {
            key = e.TE.key;
            control = e.TE.control;
            if (key('enter') && type === 0 || control('enter')) return yep(e);
            if (key('escape') || (key('back') && !this.value)) return nope(e);
            if (key('down') && type === 0 || key('enter') && type === 2 || control('down')) return okay.focus(), event_exit(e);
        });
        event_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('enter')) {
                yep(e);
            } else if (key('escape')) {
                nope(e);
            } else if (key('up')) {
                input.focus();
            } else if (key('right')) {
                cancel.focus();
            }
            return event_exit(e);
        });
        event_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key(['enter', 'escape'])) {
                nope(e);
            } else if (key('up')) {
                input.focus();
            } else if (key('left')) {
                okay.focus();
            }
            return event_exit(e);
        });
        event_set(_CLICK, okay, yep);
        event_set(_CLICK, cancel, nope);
        ui.modal(id, do_modal_dom_set(title, input, [okay, cancel]), fn, hook);
        return prepare(), $;
    };

    ui.drop = function() {
        ui.exit(0, 0, 0);
        var arg = arguments,
            id = arg[0],
            fn = arg[1],
            exit = arg[2];
        if (count(arg) === 1) {
            id = 'default';
            fn = arg[0];
            exit = arg[1];
        }
        l = slug(id);
        content_reset(_drop, 0);
        dom_set(body, el(_drop, false, {
            'class': _prefix + '-drop ' + l
        }));
        if (is_function(fn)) {
            fn(_drop);
        } else {
            el(_drop, fn);
        }
        ui.drop.fit();
        if (exit === false) {
            // TODO
        } else {
            event_set(_CLICK, doc, do_drop_exit);
            event_set(_RESIZE, win, do_drop_exit);
        }
        a = [$, _drop];
        hook_fire('enter.drop.' + id, a);
        hook_fire('enter.drop', a);
        return $;
    };

    ui.drop.fit = function(center) {
        a = size(html);
        b = size(_drop);
        c = ui.drop.target;
        l = (a.w / 2) - (b.w / 2);
        t = (a.h / 2) - (b.h / 2);
        if (!is_set(center) && c) {
            o = offset(c);
            l = o.l;
            t = o.t + size(c).h; // drop!
        }
        if (is_object(center)) {
            is_set(center[0]) && (l = center[0]);
            is_set(center[1]) && (t = center[1]);
        } else {
            l = _edge(l, 0, /* Math.max(a.w, win.innerWidth) */ a.w - b.w);
            t = _edge(t, 0, Math.max(a.h, size(win).h) - b.h);
        }
        _css(_drop, {
            'left': l + px,
            'top': t + px,
            'visibility': 'visible'
        });
        a = [$, _drop];
        hook_fire('fit.drop', a);
        hook_fire('fit', a);
        return $;
    };

    ui.menu = function(id, str, data, i) {
        var tools = ui.tools,
            index = 0, v;
        if (str === false) {
            return ui.tool(id, str);
        }
        // process data ...
        for (i in data) {
            w = i[0] === '%';
            v = data[i];
            v = is_string(v) && !w ? tools[v] : v;
            if (!v) continue;
            v = do_attributes(v, i, tools);
            data[i] = v;
        }
        ui.tool(id, {
            i: is_object(str) ? str[0] : 0,
            text: is_object(str) ? str[1] || 0 : (str && data[str] && data[str].text) || str,
            click: function(e) {
                var a = ui.drop.target = tools[id].target;
                return ui.drop('menu menu-' + slug(id), function(drop) {
                    function _do_click(e) {
                        t = this;
                        o = data_get(t, 'tool-id');
                        m = data[o];
                        m = is_string(m) ? tools[m] : (m || {});
                        n = content_get(t);
                        if (!is_disabled_tool(m) && is_function(i = m.click)) {
                            i = i(e, $);
                            m.i && (tools[id].i = m.i);
                            ui.menu.set(id, is_object(m.text) ? [m.text[0], o] : (is_object(str) ? [str[0], o] : o));
                            if (i === false) return $.select(), event_exit(e);
                        }
                        return $.select(), event_exit(e);
                    }
                    function _do_key(e) {
                        t = this;
                        k = e.TE.key;
                        if (k('escape')) {
                            ui.exit(1);
                        } else if (k('enter')) {
                            event_fire(_CLICK, t, [e]);
                        } else if (k('f10') && a) {
                            a.focus();
                        } else if (k('down') && (l = dom_next(t))) {
                            while (!dom_is(l, 'a')) {
                                if (!l) break;
                                l = dom_next(l);
                            }
                            l && l.focus();
                        } else if (k('up') && (l = dom_previous(t))) {
                            while (!dom_is(l, 'a')) {
                                if (!l) break;
                                l = dom_previous(l);
                            }
                            if (!l && a) {
                                ui.exit();
                                a.focus();
                            } else {
                                l && l.focus();
                            }
                        } else if (k('up') && a) {
                            ui.exit();
                            a.focus();
                        }
                        return event_exit(e);
                    }
                    for (i in data) {
                        v = data[i];
                        w = i[0] === '%';
                        if (!v) continue;
                        var attributes = {
                            'href': w ? null : js,
                            'class': _prefix + '-' + (w ? 'label' : 'button')
                        };
                        if (w) {
                            j = _i18n_labels[id] && _i18n_labels[id][+i.slice(1) - 1] || i;
                        } else {
                            attributes['data'] = {};
                            attributes['data']['tool-id'] = i;
                            j = _i18n_tools[i] || i;
                        }
                        r = v.text;
                        r = is_object(r) ? (r[1] || "") : r;
                        j = is_object(j) ? j[0] : j;
                        s = el(w ? 'span' : 'a', '<span>' + (w ? (j || '%' + index) : (r || j)) + '</span>', _extend(attributes, v.attributes || {}));
                        class_set(s, 'menu-' + slug(i).replace(/[\/\s]/g, '-'));
                        if (!attributes.title && (t = v.title)) {
                            s.title = is_object(t) ? t[0] + (t[1] ? ' (' + t[1] + ')' : "") : t;
                        }
                        if (w) {
                            attr_set(s, {
                                'id': _prefix + '-label:' + index
                            });
                        } else {
                            if (is_disabled_tool(v)) {
                                class_set(s, 'x');
                            } else {
                                class_reset(s, 'x');
                            }
                            if (v.on) {
                                class_set(s, 'on');
                            } else {
                                class_reset(s, 'on');
                            }
                            event_set(_CLICK, s, _do_click);
                            event_set(_KEYDOWN, s, _do_key);
                        }
                        dom_set(drop, s);
                        ++index;
                    }
                    _timer_set(function() {
                        (dom_get('[data-tool-id="' + data_get(a, drop_data) + '"]', drop)[0] || dom_get('a', drop)[0]).focus();
                    }, 1);
                }), false;
            }
        }, i);
        return data_set(tools[id].target, {
            'ui-drop': id
        }), (tools[id].data = data), ui.menu.set(id, str);
    };

    ui.menu.set = function(id, str) {
        var tool = ui.tools[id] || {},
            target = tool.target,
            data = tool.data, node, icon;
        if (!target) return $;
        if (is_object(str)) {
            data_set(target, drop_data, str[1] || "");
        } else {
            data_set(target, drop_data, str);
            str = (data[str] && data[str].text) || str;
        }
        if (is_object(str)) {
            icon = str[0];
            icon = str_has(icon, '<') ? icon : ui.i(icon, tool.i);
            str = is_set(str[1]) ? str[1] : 0;
            str = (str && data[str] && data[str].text) || str;
            str = icon + (str !== 0 ? '<span>' + (is_object(str) ? (str[1] || str) : str) + '</span>' : "");
        } else {
            icon = ui.i(id, tool.i);
        }
        if (node = dom_get('.' + _prefix + '-text', target)[0]) {
            class_set(target, 'text');
            content_set(node, str);
        } else {
            class_reset(target, 'text');
            content_set(target, icon);
        }
        return $;
    };

    ui.bubble = function() {
        ui.exit(0, 0, 0);
        var arg = arguments,
            id = arg[0],
            fn = arg[1];
        if (count(arg) === 1) {
            id = 'default';
            fn = arg[0];
        }
        l = slug(id);
        content_reset(_bubble, 0);
        dom_set(body, el(_bubble, false, {
            'class': _prefix + '-bubble ' + l
        }));
        if (is_function(fn)) {
            fn(_bubble);
        } else {
            el(_bubble, fn);
        }
        ui.bubble.fit();
        a = [$, _bubble];
        hook_fire('enter.bubble.' + id, a);
        hook_fire('enter.bubble', a);
        return $;
    };

    ui.bubble.fit = function(center) {
        s = $.$(1);
        o = offset(_content);
        h = _css(_content, 'line-height');
        var border = 'border-',
            width = '-width';
        l = s.caret[0].x + o.l - _content.scrollLeft;
        t = s.caret[1].y + o.t + h - _content.scrollTop;
        b = _css(_body, [
            border + 'top' + width,
            border + 'bottom' + width,
            border + 'left' + width,
            border + 'right' + width
        ]);
        var size_body = size(_body),
            size_bubble = size(_bubble),
            size_border_v = b[0] + b[1],
            size_border_h = b[2] + b[3];
        if (is_object(center)) {
            is_set(center[0]) && (l = center[0]);
            is_set(center[1]) && (t = center[1]);
        } else {
            l = _edge(l, o.l, o.l + size_body.w - size_bubble.w - size_border_h);
            t = _edge(t, o.t, o.t + size_body.h - size_bubble.h - size_border_v);
        }
        _css(_bubble, {
            'left': l + px,
            'top': t + px,
            'visibility': 'visible'
        });
        a = [$, _bubble];
        hook_fire('fit.bubble', a);
        hook_fire('fit', a);
        return $;
    };

    ui.panel.exit = function(select) {
        return ui.exit(select, 'panel');
    };

    ui.overlay.exit = function(select) {
        return ui.exit(select, 'overlay');
    };

    ui.modal.exit = function(select) {
        return ui.exit(select, 'modal');
    };

    ui.drop.exit = function(select) {
        return ui.exit(select, 'drop');
    };

    ui.bubble.exit = function(select) {
        return ui.exit(select, 'bubble');
    };

    ui.tool = function(id, data, i) {
        var tools = ui.tools;
        j = "";
        k = is_set(tools[id]) ? 'update' : 'create';
        if (id !== '|') {
            config.tools = str_split(config.tools || "").filter(function(v, i) {
                if (v === id) {
                    j = i;
                    return false;
                } else {
                    return true;
                }
            });
        }
        if (data === false) {
            delete tools[id];
            k = 'destroy';
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
                tools[id] = _extend((tools[id] || {}), data);
                if (!is_set(i) && j !== "") {
                    i = j;
                }
            }
            if (is_number(i)) {
                config.tools.splice(i, 0, id);
            } else {
                config.tools.push(id);
            }
        }
        return hook_fire(k + '.tool.' + id, [$, tools[id]]), do_update_tools(), $;
    };

    ui.separator = function(attributes, i) {
        return ui.tool('|', attributes !== false ? {
            attributes: attributes || {}
        } : false, i);
    };

    ui.key = function(id, data) {
        var keys = ui.keys;
        k = is_set(keys[id]) ? 'update' : 'create';
        if (data === false) {
            delete keys[id];
            k = 'destroy';
        } else {
            keys[id] = data;
        }
        return hook_fire(k + '.key.' + id, [$, keys[id]]), do_update_keys(), $;
    };

    ui.key.set = function(k) {
        maps[k] = 1;
    };

    ui.key.reset = function(k) {
        if (k) {
            delete maps[k];
        } else {
            maps = {};
        }
    };

    // default tool(s)
    ui.tools = {
        '|': {}, // separator
        undo: {
            click: function(e, $) {
                return $.undo(), false;
            }
        },
        redo: {
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
    ui.keys = {
        'control+y': 'redo',
        'control+z': 'undo',
        // next focus
        'escape': function(e, $) {
            r = ':not([tabindex]):not([disabled])';
            if (s = dom_get('input' + r + ',button' + r + ',select' + r + ',textarea' + r + ',a[href]' + r + ',[contenteditable]' + r + ',[tabindex]:not([tabindex="-1"])', doc, 0)) {
                if ((t = s.indexOf(_content)) !== -1) {
                    return (s[t + 1] || doc).focus(), false;
                }
            }
        },
        // tools focus
        'f10': function(e, $) {
            return dom_get('a', _tool)[0].focus(), false;
        },
        'tab': auto_tab ? 'indent' : 0,
        'shift+tab': auto_tab ? 'outdent' : 0
    };

    ui.el = {
        container: _container,
        header: _header,
        body: _body,
        footer: _footer,
        panel: _panel,
        overlay: _overlay,
        modal: _modal,
        drop: _drop,
        bubble: _bubble
    };

    $.config = config;

    // utility ...
    _extend(TE._, {
        time: function(i) {
            var time = new Date(is_set(i) ? i : Date.now()),
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
        dom: {
            set: dom_set,
            reset: dom_reset,
            get: dom_get,
            id: dom_id,
            copy: dom_copy,
            replace: dom_replace,
            classes: {
                set: class_set,
                reset: class_reset,
                toggle: class_toggle,
                get: class_get
            },
            attributes: {
                set: attr_set,
                reset: attr_reset,
                get: attr_get
            },
            data: {
                set: data_set,
                reset: data_reset,
                get: data_get
            },
            is: dom_is,
            offset: offset,
            pointer: pointer,
            size: size,
            content: {
                set: content_set,
                reset: content_reset,
                get: content_get
            },
            closest: closest,
            parent: dom_parent,
            children: dom_children,
            closest: dom_closest,
            next: dom_next,
            previous: dom_previous,
            index: dom_index,
            before: dom_before,
            after: dom_after,
            prepend: dom_begin,
            append: dom_end
        },
        el: el,
        events: {
            set: event_set,
            reset: event_reset,
            fire: event_fire,
            x: event_exit
        }
    });

    _extend($._, TE._);
    _extend($._, {
        hooks: {
            set: hook_set,
            reset: hook_reset,
            fire: hook_fire
        }
    });

    return $.create();

};