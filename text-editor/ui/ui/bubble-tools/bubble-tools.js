/*!
 * ==========================================================
 *  BUBBLE TOOLS PLUGIN FOR USER INTERFACE MODULE 1.0.10
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var config = $.config,
        c = config.classes[""],
        ui = $.ui,
        tools = ui.tools,
        tools_alt,
        tools_alt_default = [
            'b i a img pre,code',
            'p blockquote,q p,h1,h2,h3,h4,h5,h6 ul ol hr'
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
        _events = _.events,
        _extend = _.extend,
        _format = _.format,
        _hooks = _.hooks,
        _timer_set = _.timer.set,
        _trim = _.trim,
        _refresh = function() {
            _timer_set(function() {
                ui.bubble.fit(); // refresh bubble position ...
            });
        },

        block, d, e, f, g, h, i, j, k, l, m;

    if (!config.tools_alt) return;

    function do_modals(id, data, $) {
        ui.tools[id].click(null, $);
        for (i in data) {
            if (j = _dom_get('[name=data]', $modal)[0]) {
                j.value = data[i];
                if (k = _dom_get('[name=y]', $modal)[0]) {
                    _events.fire("click", k);
                }
            }
        }
    }

    function do_tools(f, id, bubble) {
        e = config.languages.tools[id];
        i = tools[id];
        f = (i && i.i) || id;
        g = id === '|';
        h = _el(g ? 'span' : 'a', g ? false : (f.indexOf('<') !== -1 ? f : ui.i(id, i.i)), g ? {
            'class': c + '-separator'
        } : {
            'class': c + '-button',
            'href': 'javascript:;',
            'title': typeof e === "object" ? e[0] + (e[1] ? ' (' + e[1] + ')' : "") : e,
            'data': {
                'tool-id': id
            }
        });
        _events.set("keydown", h, function(e) {
            j = this;
            k = e.TE.key;
            l = $.$();
            if (k('down')) {
                return $.select(l.end + (l.after[0] === '\n' ? 1 : 0)), _events.x(e);
            }
            if (k(['up', 'escape'])) return $.select(), _events.x(e);
            if (k('right') && (m = _dom_next(j))) {
                while (!_dom_is(m, 'a')) {
                    if (!m) break;
                    m = _dom_next(m);
                }
                m.focus();
            } else if (k('left') && (m = _dom_previous(j))) {
                while (!_dom_is(m, 'a')) {
                    if (!m) break;
                    m = _dom_previous(m);
                }
                m.focus();
            }
        });
        _events.set("click", h, function(e) {
            i = _dom_data_get(this, 'tool-id');
            tools[i].click(e, $, i);
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
                        'class': c + '-input',
                        'spellcheck': 'false'
                    });
                    _events.set("keydown", m, function(e) {
                        k = e.TE.key;
                        l = this.value;
                        if (k('escape') || (k(['back', 'enter']) && !l)) {
                            return ui.bubble.exit(1), _events.x(e);
                        }
                        if (k('enter')) {
                            return do_modals(i, [l, "", ""], $), _events.x(e);
                        }
                    });
                    _dom_append(bubble, m);
                    _timer_set(function() {
                        m.focus();
                        m.select();
                    });
                });
            }
            return _refresh(), _events.x(e);
        });
        _dom_append(bubble, h);
    }

    _events.set("keydown", $target, function(e) {
        k = e.TE.key;
        l = !e.TE.shift() && _dom_get($bubble)[0];
        m = $.$();
        if (l && k('up')) {
            return $.select(m.start - (m.before.slice(-1) === '\n' ? 1 : 0)), _events.x(e);
        } else if (l && k('down')) {
            return _dom_get('a', $bubble)[0].focus(), _events.x(e);
        }
    });

    _events.set("copy cut keyup mouseup paste scroll", $target, function(e) {
        k = $.$();
        block = $.get(0) && /(^|\n)$/.test(k.before) && /(\n|$)$/.test(k.after);
        if (k.length || block) {
            ui.bubble(tools_class, function(bubble) {
                _css(bubble, {
                    'padding': 0,
                    'font-size': '80%'
                });
                tools_alt = config.tools_alt;
                tools_alt = tools_alt === true ? tools_alt_default : tools_alt;
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

    _hooks.set('enter.bubble', _refresh);

});