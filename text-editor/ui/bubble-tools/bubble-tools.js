/*!
 * ==========================================================
 *  BUBBLE TOOLS PLUGIN FOR USER INTERFACE MODULE 1.0.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {
    var ui = $.ui,
        config = $.config,
        c = config.classes[""],
        icon = config.classes.i,
        tools = ui.tools,
        tools_alt,
        tools_alt_default = [
            'b i a img pre,code',
            'p p,h1,h2,h3,h4,h5,h6 blockquote,q hr table'
        ],
        tools_class = 'tool ' + c + '-tool',
        target = $.target,
        modal = ui.el.modal,
        _ = $._,
        _el = _.el,
        _extend = _.extend,
        _css = _.css,
        _trim = _.trim,
        _event = _.event,
        _hook = _.hook,
        _edge = _.edge,
        _format = _.format,
        _dom = _.dom,
        _data = _dom.data.get,
        _get = _dom.get,
        _next = _dom.next,
        _previous = _dom.previous,
        _is = _dom.is,
        _append = _dom.append,
        _timer = setTimeout,
        _refresh = function() {
            _timer(function() {
                ui.bubble.fit(); // refresh bubble position ...
            }, 0);
        },

        block, d, e, f, g, h, i, j, k, l, m;

    function do_modals(id, data, $) {
        ui.tools[id].click(null, $);
        for (i in data) {
            if (j = _get('[name=data]', modal)[0]) {
                j.value = data[i];
                if (k = _get('[name=y]', modal)[0]) {
                    _event.fire("click", k);
                }
            }
        }
    }

    function do_tools(f, id, bubble) {
        g = f.target ? _dom.copy(f.target) : (function() {
            return _el('a', '<i class="' + _format(icon, [(tools[id] && tools[id].i) || id]) + '"></i>', {
                'class': c + '-button',
                'href': 'javascript:;',
                'data': {
                    'tool-id': id
                }
            });
        })();
        _event.set("keydown", g, function(e) {
            j = this;
            k = e.TE.key;
            if (k('arrowdown')) return _event.x(e);
            if (k('arrowup')) return $.select(), _event.x(e);
            if (k('arrowright') && (m = _next(j))) {
                while (!_is(m, 'a')) {
                    if (!m) break;
                    m = _next(m);
                }
                m.focus();
            } else if (k('arrowleft') && (m = _previous(j))) {
                while (!_is(m, 'a')) {
                    if (!m) break;
                    m = _previous(m);
                }
                m.focus();
            }
        });
        _event.set("click", g, function(e) {
            h = _data(this, 'tool-id');
            tools[h].click(e, $, h);
            if (k = _get('[name=data]', modal)[0]) {
                ui.bubble(tools_class, function(bubble) {
                    _css(bubble, {
                        'font-size': '80%'
                    });
                    m = _el('input', false, {
                        'type': 'text',
                        'value': k.value,
                        'class': c + '-input'
                    });
                    _event.set("keydown", m, function(e) {
                        k = e.TE.key;
                        l = this.value;
                        if (k('escape') || (k('backspace') && !l)) {
                            return ui.bubble.exit(1), _event.x(e);
                        }
                        if (k('enter')) {
                            return do_modals(h, [l, "", ""], $), _event.x(e);
                        }
                    });
                    _append(bubble, m);
                    _timer(function() {
                        m.focus();
                        m.select();
                    }, 1);
                });
            }
            return _refresh(), _event.x(e);
        });
        _append(bubble, g);
    }

    _event.set("keydown", target, function(e) {
        k = e.TE.key;
        if (k('arrowup')) return _event.x(e);
        if (k('arrowdown')) {
            return _get('a', ui.el.bubble)[0].focus(), _event.x(e);
        }
    });

    _event.set("copy cut keyup mouseup paste scroll", target, function(e) {
        k = $.$();
        block = target.value && /(^|\n)$/.test(k.before) && /(\n|$)$/.test(k.after);
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