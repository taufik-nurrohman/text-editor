/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 1.4.3
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
        target = $.target,
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
                labels: {},
                others: {
                    preview: 'Preview',
                    _word: '%1 Word',
                    _words: '%1 Words'
                }
            },
            classes: {
                "": 'text-editor',
                i: 'icon icon-%1 fa fa-%1'
            },
            debounce: 250
        }, o),

        a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z,

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
        _KEYS = _BLUR + ' ' + _COPY + ' ' + _CUT + ' ' + _FOCUS + ' ' + _INPUT + ' ' + _KEYDOWN + ' ' + _PASTE,

        i18n = config.languages,
        tab = config.tab,
        auto_tab = config.auto_tab,
        auto_close = config.auto_close,
        unit = config.unit[0][0],
        data = config.unit[0][1],
        esc_unit = config.unit[1][0],
        esc_data = config.unit[1][1],
        data_tool_id = 'tool-id',
        js = 'javascript:;',
        px = 'px';

    function str_split(s) {
        return is_string(s) ? trim(s).split(/\s+/) : s;
    }

    function str_join(s) {
        return is_object(s) ? s.join(' ') : s;
    }

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
            node.setAttribute(a, b);
        }
    }

    function attr_get(node, a, b) {
        if (is_string(a)) {
            return attr_get(node, [a], is_set(b) ? b : "")[0];
        }
        o = [];
        for (i in a) {
            i = a[i];
            if (i = node.getAttribute(i)) {
                o.push(i);
            }
        }
        return o.length ? o : (is_set(b) ? b : []);
    }

    function attr_reset(node, a) {
        if (is_object(a)) {
            for (i in a) {
                attr_reset(node, a[i]);
            }
        } else {
            if (!is_set(a)) {
                attr_reset(node, 'class'); // :(
                for (i = 0, j = node.attributes, k = j.length; i < k; ++i) {
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
        if (is_string(a)) {
            return data_get(node, [a], is_set(b) ? b : "")[0];
        }
        o = [];
        for (i in a) {
            i = a[i];
            if (i = attr_get(node, 'data-' + i)) {
                o.push(i);
            }
        }
        return o.length ? o : (is_set(b) ? b : []);
    }

    function data_reset(node, a) {
        if (is_object(a)) {
            for (i in a) {
                attr_reset(node, 'data-' + a[i]);
            }
        } else {
            if (!is_set(a)) {
                for (i = 0, j = node.attributes, k = j.length; i < k; ++i) {
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
        for (i = 0, j = id.length; i < j; ++i) {
            node.addEventListener(id[i], fn, false);
            hook_set('on:' + id[i], fn, dom_id(node));
        }
        return $;
    }

    function event_reset(id, node, fn) {
        if (!node) return;
        id = str_split(id);
        for (i = 0, j = id.length; i < j; ++i) {
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
        for (i = 0, j = id.length; i < j; ++i) {
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

    function timer_set(fn, i) {
        return setTimeout(fn, i);
    }

    function timer_reset(timer_set_fn) {
        return clearTimeout(timer_set_fn);
    }

    function sanitize(s, from, to) {
        for (i = 0, j = from.length, k; i < j; ++i) {
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
        return {
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
        if (is_string(s)) {
            return class_get(node, [s], is_set(b) ? b : "")[0];
        }
        o = [];
        for (i in s) {
            i = s[i];
            if (node.classList.contains(i)) {
                o.push(i);
            }
        }
        return o.length ? o : (is_set(b) ? b : false);
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

    function el(em, node, attr) {
        em = is_string(em) ? doc.createElement(em) : em;
        if (is_object(attr)) {
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
                        css(em, v);
                    }
                } else {
                    if (is_function(v)) {
                        em[i] = v;
                    } else {
                        if (v === null) {
                            attr_reset(em, i);
                        } else {
                            attr_set(em, i, is_object(v) ? v.join(' ') : "" + v);
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
            id = _prefix + '-dom:' + Date.now();
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
        if (deep !== false && (c = dom_children(node))) {
            for (i = 0, j = c.length; i < j; ++i) {
                content_reset(c[i]);
            }
        }
        content_set(node, "");
    }

    function dom_parent(node) {
        return node.parentNode;
    }

    function dom_children(node) {
        return node.children || [];
    }

    function dom_next(node) {
        return node.nextSibling;
    }

    function dom_previous(node) {
        return node.previousSibling;
    }

    function dom_is(node, s) {
        if (is_string(s)) {
            return node.nodeName.toLowerCase() === s.toLowerCase();
        } else if (is_function(s)) {
            return node === s(node);
        }
        return node === s;
    }

    function dom_get(s, parent) {
        parent = parent || doc;
        o = [];
        if (is_string(s)) {
            if (/^([#.]?[\w-]+|\*)$/.test(s)) {
                if (s[0] === '#' && (s = parent.getElementById(s.slice(1)))) {
                    return [s];
                } else if ((s[0] === '.' && (s = parent.getElementsByClassName(s.slice(1)))) || (s = parent.getElementsByTagName(s))) {
                    for (i = 0, j = s.length; i < j; ++i) {
                        o.push(s[i]);
                    }
                    return o;
                }
                return [];
            } else {
                s = parent.querySelectorAll(s);
                for (i = 0, j = s.length; i < j; ++i) {
                    o.push(s[i]);
                }
                return o;
            }
        }
        return dom_exist(s) ? [s] : [];
    }

    function dom_exist(node, dom) {
        var parent = dom_parent(node);
        if (arguments.length === 1) {
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
        c = dom_children(node)[0];
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
                c = dom_children(node)[0];
                while (c) dom_reset(c);
            }
            parent.removeChild(node);
        }
    }

    function dom_content_reset(node) {
        content_reset(el(node, false, {
            'style': ""
        }));
        dom_reset(node);
    }

    function el_set(a, b, c) {
        return el(b || 'div', c, {
            'class': a
        });
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

    var _c = config.classes,
        _i = _c.i,
        _prefix = _c[""],
        _i18n_tools = i18n.tools,
        _i18n_buttons = i18n.buttons,
        _i18n_labels = i18n.labels,
        _i18n_others = i18n.others,
        _class = _prefix + '-textarea ' + _prefix + '-content block',
        _container = el_set(_prefix),
        _header = el_set(_prefix + '-header'),
        _body = el_set(_prefix + '-body'),
        _footer = el_set(_prefix + '-footer'),
        _tool = el_set(_prefix + '-tool'),
        _content = el(target, false, config.attributes),
        _resize = el_set(_prefix + '-resize s'),
        _description = el_set(_prefix + '-description'),
        _overlay = el_set(_prefix + '-overlay'),
        _modal = el('div'),
        _drop = el('div'),
        _bubble = el('div'),
        _description_left = el_set('left', 'span'),
        _description_right = el_set('right', 'span'),
        _preview = el_set(_prefix + '-preview', 'a'),
        _p = 0,
        _drop_target = 0,
        _button, _icon;

    if (!config.suffix) {
        config.suffix = unit[1];
    }

    function is_disabled_tool(x) {
        return !x || (is_set(x.active) && !s.active);
    }

    function do_word_count() {
        if (!_i18n_others._word || !_i18n_others._words) return;
        v = (_content.value || "").replace(pattern(esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1], 'g'), "");
        i = (v.match(/(\w+)/g) || []).length;
        content_set(_description_right, format(_i18n_others['_word' + (i === 1 ? "" : 's')], [i]));
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
        if (!is_set(tool.title)) {
            tool.title = _i18n_tools[k] || "";
        }
        return (tools[k] = tool), tool;
    }

    function do_update_tools() {
        content_reset(_tool, false);
        var tools = str_split(config.tools),
            button = _prefix + '-button',
            separator = _prefix + '-separator',
            id, tool, icon, is_button, i, v;
        config.tools = tools;
        for (i in tools) {
            v = tools[i];
            tool = ui.tools[v];
            if (!tool) continue;
            tool = do_attributes(tool, v, ui.tools);
            icon = tool.i || v;
            if (icon !== '|' && icon[0] !== '<') {
                icon = slug(icon);
            }
            is_button = icon !== '|';
            _button = el_set(is_button ? button : separator, is_button ? 'a' : 'span');
            if (is_button) {
                id = button + ':' + slug(v).replace(/\s/g, "");
                attr_set(_button, {
                    'href': js,
                    'id': id,
                    'tab-index': -1
                });
                data_set(_button, data_tool_id, v);
                icon = icon[0] === '<' ? icon : '<i class="' + format(_i, [icon]) + ' ' + id + '"></i>';
                if (is_disabled_tool(tool)) {
                    class_set(_button, 'x');
                }
                if (tool.text) {
                    icon = format('<span class="' + _prefix + '-text">' + tool.text + '</span>', [icon]);
                    class_set(_button, 'text');
                }
                content_set(_button, icon);
                el(_button, false, tool.attributes || {});
                if (!_button.title && (j = tool.title)) {
                    _button.title = is_object(j) ? j[0] + (j[1] ? ' (' + j[1] + ')' : "") : j;
                }
                ui.tools[v].target = _button;
                event_set(_CLICK, _button, do_click_tool);
            } else {
                _button.id = _prefix + '-separator:' + i;
            }
            dom_set(_tool, _button);
        }
        hook_fire('update.tools', [$]);
    }

    function do_update_keys() {
        // sort keyboard shortcut(s) ...
        ui.keys = (function() {
            var input = Object.keys(ui.keys).sort().reverse(),
                output = {}, v;
            for (i = 0, j = input.length; i < j; ++i) {
                v = input[i];
                output[v] = ui.keys[v];
            }
            return output;
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
            before = s.before,
            after = s.after,
            b = before.slice(-1),
            a = after[0],
            length = s.length,
            keys = ui.keys,
            keys_a = TE.keys_alias,
            dent = (before.match(/(?:^|\n)([\t ]*).*$/) || [""]).pop();
        n = e.TE.key();
        maps[n] = 1;
        o = Object.keys(maps).length;
        function explode(s) {
            return s.replace(/\+/g, '\n').replace(/\n\n/g, '\n+').split('\n');
        }
        timer_set(function() {
            $.record();
        }, 1);
        for (i in keys) {
            k = explode(i);
            c = 0;
            for (j in k) {
                j = k[j];
                if (maps[keys_a[j] || j]) {
                    ++c;
                }
            }
            k = k.length;
            if (c === k && o === k) {
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
                    } else if (auto_tab && n === 'enter' && i !== m) {
                        return $.tidy('\n' + dent + tab, '\n' + dent).scroll(true), event_exit(e);
                    }
                }
            }
        }
        if (auto_tab && !length) {
            if (n === 'backspace' && pattern(esc(tab) + '$').test(before)) {
                return $.outdent(tab).scroll(true), event_exit(e);
            } else if (n === 'enter' && pattern('(^|\\n)(' + esc(tab) + ')+.*$').test(before)) {
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
        }, config.debounce || 0);
    }

    function do_click_tool(e) {
        ui.exit(0, 0, 0);
        var id = data_get(this, data_tool_id),
            tools = ui.tools,
            tool = tools[id];
        _drop_target = e.currentTarget || e.target;
        if (!is_disabled_tool(tool) && is_function(j = tool.click)) {
            j = j(e, $, id);
            hook_fire('on:change', [e, $, id]);
            if (j === false) return event_exit(e);
        }
        return $.select(), event_exit(e);
    }

    $.create = function(o, hook) {
        if (is_object(o)) {
            config = extend(config, o);
        }
        var _parent = dom_exist(_content);
        class_set(_content, _class);
        if (_parent && dom_is(_parent, 'p')) {
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
        event_set(_KEYDOWN, _content, do_keys);
        event_set(_KEYUP, _content, do_keys_reset);
        event_set(_KEYS, _content, do_update_contents_debounce);
        event_set(_MOUSEDOWN, _resize, do_resize_down);
        event_set(_MOUSEMOVE, doc, do_resize_move);
        event_set(_MOUSEUP, body, do_resize_up);
        if (_i18n_others.preview) {
            s = _i18n_tools.preview;
            attr_set(_preview, {
                'href': js,
                'title': is_object(s) ? s[0] + (s[1] ? ' (' + s[1] + ')' : "") : s
            });
            dom_set(_description_left, _preview);
            content_set(_preview, _i18n_others.preview);
        }
        do_update_contents(null);
        do_update_tools();
        do_update_keys();
        return hook !== 0 ? hook_fire('create', [$]) : $;
    };

    $.update = function(o, hook) {
        if (class_get(_content, str_split(_class), 0)) {
            $.destroy(0); // destroy if already created
        }
        return (hook !== 0 ? hook_fire('update', [$]) : $).create(o, 0);
    };

    $.destroy = function(hook) {
        if (!class_get(_content, str_split(_class), 0)) return $;
        ui.exit(0, 0, 0);
        class_reset(_content, _class);
        config.tools = str_join(config.tools);
        if (config.keys) {
            event_reset(_KEYDOWN, _content, do_keys);
            event_reset(_KEYUP, _content, do_keys_reset);
        }
        event_reset(_MOUSEDOWN, _resize, do_resize_down);
        event_reset(_MOUSEMOVE, doc, do_resize_move);
        event_reset(_MOUSEUP, doc, do_resize_up);
        event_reset(_KEYS, _content, do_update_contents_debounce);
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
        O = {};

    function do_resize_down(e) {
        drag = _resize;
        s = size(_footer);
        return event_exit(e);
    }

    function do_resize_move(e) {
        if (drag === _resize) {
            css(_content, {
                'height': point(_body, e).y - s.h + px
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
        event_fire(_CLICK, _overlay, [e]);
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
            resize = O.resize;
        if (drag === header || closest(drag, header) === header) {
            o = point(_body, e);
            l = o.x - x;
            t = o.y - y;
            css(_modal, {
                'left': (w > W ? l : edge(l, 0, W - w)) + px,
                'top': (h > H ? t : edge(t, 0, H - h)) + px
            });
        } else if (drag === resize) {
            o = point(_modal, e);
            s = size(resize);
            css(_modal, {
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
        a = _drop_target;
        b = _drop;
        c = (e && e.target) || 0;
        if (!c || (c !== a && closest(c, a) !== a)) {
            _drop_target = 0;
            dom_content_reset(_drop);
            event_reset(_CLICK, doc, do_drop_exit);
            ui.exit(e.target === target);
        }
    }

    ui.exit = function(select, k, hook) {
        f = {
            overlay: function() {
                event_reset(_CLICK, _overlay, do_overlay_exit);
                dom_content_reset(_overlay);
            },
            modal: function() {
                event_reset(_MOUSEDOWN, _body, do_modal_down);
                event_reset(_MOUSEMOVE, _body, do_modal_move);
                event_reset(_MOUSEUP, doc, do_modal_up);
                event_reset(_CLICK, O.x, do_modal_exit);
                dom_content_reset(_modal);
            },
            drop: function() {
                dom_content_reset(_drop);
            },
            bubble: function() {
                dom_content_reset(_bubble);
            }
        };
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

    ui.overlay = function(s, x, fn) {
        ui.exit(0, 0, 0);
        do_keys_reset(1);
        dom_set(_body, el(_overlay, s.length || is_dom(s) ? el_set(_prefix + '-overlay-content', 'div', s) : ""));
        if (x) event_set(_CLICK, _overlay, do_overlay_exit);
        if (is_function(fn)) {
            fn(_overlay);
        } else {
            el(_overlay, fn);
        }
        hook_fire('enter.overlay', [$]);
        hook_fire('enter', [$]);
        return $;
    };

    ui.overlay.fit = function() {}; // TODO

    ui.modal = function() {
        ui.overlay("", 1).blur();
        var arg = arguments,
            k = arg[0],
            o = arg[1],
            fn = arg[2],
            F = _prefix + '-modal';
        if (is_object(k)) {
            k = 'default';
            o = arg[0];
            fn = arg[1];
        }
        l = slug(k);
        el(_modal, false, {
            'class': F + ' ' + l
        });
        if (is_set(o.body)) {
            o.body = el('div', o.body, {
                'class': F + '-content ' + l
            });
        }
        for (i in o) {
            F[1] = i;
            O[i] = el_set(F + '-' + format(i, F) + ' ' + l, 0, o[i]);
        }
        O.x = el_set(_prefix + '-x ' + l); // add `close` button
        O.resize = el_set(_prefix + '-resize se ' + l); // add `resize` button
        content_reset(_modal);
        dom_set(_body, el(_modal, O, {
            'style': ""
        }));
        ui.modal.fit();
        // put overlay next to the modal, that way we can use `+` CSS selector
        // to style or hide the overlay based on the modal ID easily
        // like `.text-editor-modal.alert + .text-editor-overlay {display:none}`
        dom_after(_modal, _overlay);
        event_set(_CLICK, O.x, do_modal_exit);
        event_set(_MOUSEDOWN, O.header, event_exit);
        event_set(_MOUSEDOWN, O.resize, event_exit);
        event_set(_MOUSEDOWN, _body, do_modal_down);
        event_set(_MOUSEMOVE, _body, do_modal_move);
        event_set(_MOUSEUP, doc, do_modal_up);
        if (is_function(fn)) {
            O.overlay = _overlay;
            O.modal = _modal;
            fn(O);
        }
        hook_fire('enter.modal.' + k, [$]);
        hook_fire('enter.modal', [$]);
        hook_fire('enter', [$]);
        return $;
    };

    ui.modal.fit = function(center) {
        do_modal_size();
        l = (W / 2) - (w / 2);
        t = (H / 2) - (h / 2);
        if (is_object(center)) {
            l = center[0];
            t = center[1];
        } else {
            l = edge(l, 0);
            t = edge(t, 0);
        }
        css(_modal, {
            'left': l + px,
            'top': t + px,
            'min-width': w + px,
            'min-height': h + px,
            'visibility': 'visible'
        });
        hook_fire('fit.modal', [$]);
        hook_fire('fit', [$]);
        return $;
    };

    var button_attributes = {
        'class': _prefix + '-button',
        'name': 'y'
    };

    ui.alert = function(title, content, y, fn) {
        var okay = el('button', _i18n_buttons.okay, button_attributes),
            id = 'alert';
        y = y || noop;
        if (is_object(title)) {
            id += ':' + title[0];
            title = title[1] || title[0];
        }
        event_set(_CLICK, okay, function(e) {
            return y(e, $), do_modal_exit(e, id + '.y'), event_exit(e);
        });
        event_set(_KEYDOWN, okay, function(e) {
            var key = e.TE.key;
            if (key(/^escape|enter$/)) {
                return event_fire(_CLICK, okay, [e]), event_exit(e);
            }
        });
        ui.modal(id, do_modal_dom_set(title, content, okay), fn);
        return okay.focus(), $;
    };

    ui.confirm = function(title, content, y, n, fn) {
        var okay = el('button', _i18n_buttons.okay, button_attributes),
            cancel = el('button', _i18n_buttons.cancel, button_attributes),
            id = 'confirm', key;
        cancel.name = 'n';
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
        event_set(_CLICK, okay, yep);
        event_set(_CLICK, cancel, nope);
        event_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key('arrowleft')) return event_exit(e);
            if (key('enter')) return yep(e), event_exit(e);
            if (key('escape')) return do_modal_exit(e, id + '.y'), event_exit(e);
        });
        event_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key('arrowright')) return event_exit(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
            if (key('enter')) return nope(e), event_exit(e);
            if (key('escape')) return do_modal_exit(e, id + '.n'), event_exit(e);
        });
        ui.modal(id, do_modal_dom_set(title, content, [okay, cancel]), fn);
        return cancel.focus(), $;
    };

    ui.prompt = function(title, value, required, y, type, fn) {
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
            options = [], key;
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
                'placeholder': value.split('\n')[0],
                'class': _prefix + '-textarea block'
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
            if ('placeholder' in input) input.select();
        }
        function freeze(e) {
            return event_exit(e);
        }
        function yep(e) {
            s = input.value;
            if (required && (!trim(s) || s === value)) {
                return prepare(), freeze(e);
            }
            return do_modal_exit(e, id + '.y'), event_exit(e), y(e, $, s !== value ? s : "", value);
        }
        function nope(e) {
            return do_modal_exit(e, id + '.n'), event_exit(e);
        }
        event_set(_KEYDOWN, input, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape') || key('backspace') && !this.value) return nope(e);
            if (key('arrowup')) return freeze(e);
            if (key('arrowdown')) return okay.focus(), event_exit(e);
        });
        event_set(_KEYDOWN, okay, function(e) {
            key = e.TE.key;
            if (key('enter')) return yep(e);
            if (key('escape')) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key('arrowright')) return cancel.focus(), event_exit(e);
            if (key(/^arrow(down|left)$/)) return freeze(e);
        });
        event_set(_KEYDOWN, cancel, function(e) {
            key = e.TE.key;
            if (key(/^enter|escape$/)) return nope(e);
            if (key('arrowup')) return input.focus(), event_exit(e);
            if (key(/^arrow(right|down)$/)) return freeze(e);
            if (key('arrowleft')) return okay.focus(), event_exit(e);
        });
        event_set(_CLICK, okay, yep);
        event_set(_CLICK, cancel, nope);
        ui.modal(id, do_modal_dom_set(title, input, [okay, cancel]), fn);
        return prepare(), $;
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
        l = slug(k);
        content_reset(_drop);
        dom_set(body, el(_drop, false, {
            'class': _prefix + '-drop ' + l
        }));
        if (is_function(fn)) {
            fn(_drop);
        } else {
            el(_drop, fn);
        }
        ui.drop.fit();
        event_set(_CLICK, doc, do_drop_exit);
        hook_fire('enter.drop.' + k, [$]);
        hook_fire('enter.drop', [$]);
        return $;
    };

    ui.drop.fit = function(center) {
        a = size(html);
        b = size(_drop);
        l = (a.w / 2) - (b.w / 2);
        t = (a.h / 2) - (b.h / 2);
        if (!is_set(center) && _drop_target) {
            o = offset(_drop_target);
            l = o.l;
            t = o.t + size(_drop_target).h; // drop!
        }
        if (is_object(center)) {
            l = center[0];
            t = center[1];
        } else {
            l = edge(l, 0, Math.max(a.w, win.innerWidth) - b.w);
            t = edge(t, 0, Math.max(a.h, win.innerHeight) - b.h);
        }
        css(_drop, {
            'left': l + px,
            'top': t + px,
            'visibility': 'visible'
        });
        hook_fire('fit.drop', [$]);
        hook_fire('fit', [$]);
        return $;
    };

    ui.menu = function(id, str, data, i) {
        str = (!is_object(str) && data[str] && data[str].text) || str;
        var current = '<span class="' + _prefix + '-current menu">%1</span>',
            icon = "",
            index = 0, v;
        if (str === false) {
            return ui.tool(id, str);
        } else if (is_object(str)) {
            icon = str[0];
            icon = icon[0] === '<' ? icon : '<i class="' + format(_i, [icon]) + '"></i>';
            str = is_set(str[1]) ? str[1] : 0;
            str = (str && data[str] && data[str].text) || str;
            current = icon + (str !== 0 ? ' ' + current : "");
        }
        return ui.tool(id, {
            i: icon,
            text: str ? format(current, [str, icon]) : 0,
            click: function(e) {
                return ui.drop('menu menu-' + slug(id), function(drop) {
                    function _do_click(e) {
                        v = this;
                        m = data[data_get(v, data_tool_id)];
                        m = is_string(m) ? ui.tools[m] : (m || {});
                        h = content_get(v);
                        if (!is_disabled_tool(m) && is_function(i = m.click)) {
                            i = i(e, $);
                            if (str !== false && _drop_target) {
                                s = dom_children(_drop_target)[0] || _drop_target;
                                if (!dom_is(s, 'i')) {
                                    content_set(s, format(current, [h, icon]));
                                }
                                if(is_object(m.text) && (t = dom_children(s)[0])) {
                                    if (dom_is(t, 'i')) {
                                        class_reset(t);
                                        class_set(t, format(_i, [m.text[0]]));
                                    }
                                }
                            }
                            if (i === false) return event_exit(e);
                        }
                        return $.select(), event_exit(e);
                    }
                    for (i in data) {
                        v = data[i];
                        w = i[0] === '%';
                        v = is_string(v) && !w ? ui.tools[v] : v;
                        if (!v) continue;
                        v = do_attributes(v, i, ui.tools);
                        var attributes = {
                            'href': w ? null : js,
                            'class': _prefix + '-' + (w ? 'label' : 'button')
                        };
                        if (w) {
                            j = _i18n_labels[id] && _i18n_labels[id][+i.slice(1) - 1] || i;
                        } else {
                            attributes['data'] = {};
                            attributes['data'][data_tool_id] = i;
                            j = _i18n_tools[i] || i;
                        }
                        r = v.text;
                        r = is_object(r) ? (r[1] || "") : r;
                        j = is_object(j) ? j[0] : j;
                        s = el(w ? 'span' : 'a', w ? false : (v.text || j), extend(attributes, v.attributes || {}));
                        if (!s.title && (t = v.title)) {
                            s.title = is_object(t) ? t[0] + (t[1] ? ' (' + t[1] + ')' : "") : t;
                        }
                        if (w) {
                            attr_set(s, {
                                'id': _prefix + '-label:' + index,
                                'title': j || null
                            });
                        } else {
                            if (is_disabled_tool(v)) {
                                class_set(s, 'x');
                            }
                            event_set(_CLICK, s, _do_click);
                        }
                        data[i] = v;
                        dom_set(drop, s);
                        ++index;
                    }
                }), false;
            }
        }, i), (ui.tools[id].data = data), $;
    };

    ui.bubble = function() {
        ui.exit(0, 0, 0);
        var arg = arguments,
            k = arg[0],
            fn = arg[1];
        if (arg.length === 1) {
            k = 'default';
            fn = arg[0];
        }
        l = slug(k);
        content_reset(_bubble);
        dom_set(body, el(_bubble, false, {
            'class': _prefix + '-bubble ' + l
        }));
        if (is_function(fn)) {
            fn(_bubble);
        } else {
            el(_bubble, fn);
        }
        ui.bubble.fit();
        hook_fire('enter.bubble.' + k, [$]);
        hook_fire('enter.bubble', [$]);
        return $;
    };

    ui.bubble.fit = function(center) {
        s = $.$(1);
        o = offset(_content);
        h = css(_content, 'line-height');
        var border = 'border-',
            width = '-width';
        l = s.caret[0].x + o.l - _content.scrollLeft;
        t = s.caret[1].y + o.t + h - _content.scrollTop;
        b = css(_body, [
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
            l = center[0];
            t = center[1];
        } else {
            l = edge(l, o.l, o.l + size_body.w - size_bubble.w - size_border_h);
            t = edge(t, o.t, o.t + size_body.h - size_bubble.h - size_border_v);
        }
        css(_bubble, {
            'left': l + px,
            'top': t + px,
            'visibility': 'visible'
        });
        hook_fire('fit.bubble', [$]);
        hook_fire('fit', [$]);
        return $;
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
        j = "";
        if (id !== '|') {
            config.tools = config.tools.filter(function(v, i) {
                if (v === id) {
                    j = i;
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
        v = $.get();
        w = "";
        if (v.indexOf('</html>') === -1) {
            w = '<!DOCTYPE html><html dir="' + config.dir + '"><head><meta charset="utf-8"><style>' + config.css + '</style></head><body>' + v + '</body></html>';
        }
        r = el('iframe', false, {
            'class': _prefix + '-portal',
            'src': 'data:text/html,' + encodeURIComponent(w)
        });
        function frame_resize() {
            if (o) {
                p = size(o);
                css(r, {
                    'width': p.w + px,
                    'height': p.h + px
                });
            }
        }
        if (!dom_exist(_overlay) && v) {
            ui.overlay(r, 1, function() {
                o = dom_children(_overlay)[0];
                frame_resize();
                event_set(_RESIZE, win, frame_resize);
                hook_fire('enter.overlay.preview', [e, $, [v, w], o]);
            });
        } else {
            event_reset(_RESIZE, win, frame_resize);
            do_overlay_exit();
        }
        return event_exit(e);
    }

    event_set(_CLICK, _preview, do_click_preview);

    // default hotkey(s)
    ui.keys = {
        'control+y': 'redo',
        'control+z': 'undo',
        'f5': function(e, $) {
            return do_click_preview(e);
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
        dom: {
            set: dom_set,
            reset: dom_reset,
            get: dom_get,
            id: dom_id,
            classes: {
                set: class_set,
                reset: class_reset,
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
            offset: offset,
            point: point,
            size: size,
            content: {
                set: content_set,
                reset: content_reset,
                get: content_get
            },
            closest: closest,
            parent: dom_parent,
            children: dom_children,
            next: dom_next,
            previous: dom_previous,
            before: dom_before,
            after: dom_after,
            prepend: dom_begin,
            append: dom_end
        },
        el: el,
        event: {
            set: event_set,
            reset: event_reset,
            fire: event_fire,
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