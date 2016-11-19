/*!
 * ==========================================================
 *  BUBBLE TOOLS PLUGIN FOR USER INTERFACE MODULE 1.0.5
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var config = $.config,
        c = config.classes[""],
        icon = config.classes.i,
        ui = $.ui,
        tools = ui.tools,
        tools_alt,
        tools_alt_default = [
            'b i a img pre,code',
            'p blockquote,q p,h1,h2,h3,h4,h5,h6 ol ul hr'
        ],
        tools_class = 'tool ' + c + '-tool',

        $modal = ui.el.modal,
        $bubble = ui.el.bubble,
        $target = $.target,

        _ = $._,
        _css = _.css,
        _dom = _.dom,
        _dom_append = _dom.append,
        _dom_data_get = _dom.data.get,
        _dom_get = _dom.get,
        _dom_is = _dom.is,
        _dom_next = _dom.next,
        _dom_previous = _dom.previous,
        _edge = _.edge,
        _el = _.el,
        _event = _.event,
        _extend = _.extend,
        _format = _.format,
        _hook = _.hook,
        _timer_set = _.timer.set,
        _trim = _.trim,
        _refresh = function() {
            _timer_set(function() {
                ui.bubble.fit(); // refresh bubble position ...
            });
        },

        block, d, e, f, g, h, i, j, k, l, m;

    function do_modals(id, data, $) {
        ui.tools[id].click(null, $);
        for (i in data) {
            if (j = _dom_get('[name=data]', $modal)[0]) {
                j.value = data[i];
                if (k = _dom_get('[name=y]', $modal)[0]) {
                    _event.fire("click", k);
                }
            }
        }
    }

    function do_tools(f, id, bubble) {
        e = config.languages.tools[id];
        f = (tools[id] && tools[id].i) || id;
        g = _el('a', f[0] === '<' ? f : '<i class="' + _format(icon, [f]) + '"></i>', {
            'class': c + '-button',
            'href': 'javascript:;',
            'title': typeof e === "object" ? e[0] + (e[1] ? ' (' + e[1] + ')' : "") : e,
            'data': {
                'tool-id': id
            }
        });
        _event.set("keydown", g, function(e) {
            j = this;
            k = e.TE.key;
            l = $.$();
            if (k('arrowdown')) {
                return $.select(l.end + (l.after[0] === '\n' ? 1 : 0)), _event.x(e);
            }
            if (k(/^(arrowup|escape)$/)) return $.select(), _event.x(e);
            if (k('arrowright') && (m = _dom_next(j))) {
                while (!_dom_is(m, 'a')) {
                    if (!m) break;
                    m = _dom_next(m);
                }
                m.focus();
            } else if (k('arrowleft') && (m = _dom_previous(j))) {
                while (!_dom_is(m, 'a')) {
                    if (!m) break;
                    m = _dom_previous(m);
                }
                m.focus();
            }
        });
        _event.set("click", g, function(e) {
            h = _dom_data_get(this, 'tool-id');
            tools[h].click(e, $, h);
            if (k = _dom_get('[name=data]', $modal)[0]) {
                ui.bubble(tools_class, function(bubble) {
                    _css(bubble, {
                        'font-size': '80%'
                    });
                    l = k.value;
                    m = _el('input', false, {
                        'type': 'text',
                        'value': l,
                        'placeholder': l,
                        'class': c + '-input'
                    });
                    _event.set("keydown", m, function(e) {
                        k = e.TE.key;
                        l = this.value;
                        if (k('escape') || (k(/^(backspace|enter)$/) && !l)) {
                            return ui.bubble.exit(1), _event.x(e);
                        }
                        if (k('enter')) {
                            return do_modals(h, [l, "", ""], $), _event.x(e);
                        }
                    });
                    _dom_append(bubble, m);
                    _timer_set(function() {
                        m.focus();
                        m.select();
                    });
                });
            }
            return _refresh(), _event.x(e);
        });
        _dom_append(bubble, g);
    }

    _event.set("keydown", $target, function(e) {
        k = e.TE.key;
        l = !e.TE.shift() && _dom_get($bubble)[0];
        m = $.$();
        if (l && k('arrowup')) {
            return $.select(m.start - (m.before.slice(-1) === '\n' ? 1 : 0)), _event.x(e);
        }
        if (l && k('arrowdown')) {
            return _dom_get('a', $bubble)[0].focus(), _event.x(e);
        }
    });

    _event.set("copy cut keyup mouseup paste scroll", $target, function(e) {
        k = $.$();
        block = $.get(0) && /(^|\n)$/.test(k.before) && /(\n|$)$/.test(k.after);
        if (k.length || block) {
            ui.bubble(tools_class, function(bubble) {
                _css(bubble, {
                    'padding': 0,
                    'font-size': '80%'
                });
                tools_alt = config.tools_alt || tools_alt_default;
                if (typeof tools_alt === "string") {
                    tools_alt = [tools_alt, tools_alt];
                } else {
                    tools_alt = _extend(tools_alt, tools_alt_default);
                }
                d = _trim(tools_alt[block ? 1 : 0]).split(/\s+/);
                for (j in d) {
                    j = d[j];
                    if (!(f = tools[j])) continue;
                    do_tools(f, j, bubble);
                }
            });
        } else {
            ui.bubble.exit();
        }
    });

    _hook.set('enter.bubble', _refresh);

});