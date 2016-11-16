/*!
 * ==========================================================
 *  BUBBLE TOOLS PLUGIN FOR USER INTERFACE MODULE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {
    var busy = 0,
        ui = $.ui,
        config = $.config,
        c = config.classes[""],
        tools = ui.tools,
        tools_alt = config.tools_alt || 'b i a blockquote,q pre,code',
        tools_class = 'tool ' + c + '-tool',
        target = $.target,
        modal = ui.el.modal,
        _ = $._,
        _el = _.el,
        _css = _.css,
        _trim = _.trim,
        _event = _.event,
        _hook = _.hook,
        _edge = _.edge,
        _dom = _.dom,
        _data = _dom.data.get,
        _get = _dom.get,
        _next = _dom.next,
        _previous = _dom.previous,
        _is = _dom.is,
        _append = _dom.append,
        _timer = setTimeout,
        d, e, f, g, h, i, j, k, l, m;

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

    function do_tools(f, bubble) {
        g = _dom.copy(f.target);
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
            return _event.x(e);
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

    _event.set("copy cut focus input keyup mouseup paste scroll", target, function(e) {
        k = $.$();
        if (k.length) {
            ui.bubble(tools_class, function(bubble) {
                _css(bubble, {
                    'padding': 0,
                    'font-size': '80%'
                });
                d = _trim(tools_alt).split(/\s+/);
                for (j in d) {
                    if (!(f = tools[d[j]])) continue;
                    do_tools(f, bubble);
                }
            });
        } else {
            ui.bubble.exit();
        }
    });
    _hook.set('enter.bubble', function() {
        _timer(function() {
            ui.bubble.fit(); // refresh bubble position ...
        }, 1);
    });
});