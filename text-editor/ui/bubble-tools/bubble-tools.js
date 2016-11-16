/*!
 * ==========================================================
 *  BUBBLE TOOLS PLUGIN FOR USER INTERFACE MODULE 0.0.9
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
        _append = _dom.append,
        _timer = setTimeout,
        d, e, f, g, h, i, j, k, l, m;

    function fire_tool_with_prompt(id, data, $) {
        // [1]. trigger the tool item to show the modal prompt
        ui.tools[id].click(null, $);
        // [2]. access the visible modal prompt HTML through `$.ui.el.modal`
        for (i in data) {
            if (j = _get('[name=data]', modal)[0]) {
                // [3]. set value to the prompt field
                j.value = data[i];
                // [4]. trigger click event to the submit button
                if (k = _get('[name=y]', modal)[0]) {
                    _event.fire("click", k);
                }
            }
        }
    }

    _event.set("copy cut focus input keyup mouseup paste scroll", target, function(e) {
        k = $.$();
        if (k.length && !busy) {
            ui.bubble(tools_class, function(bubble) {
                _css(bubble, {
                    'padding': 0,
                    'font-size': '80%'
                });
                d = _trim(tools_alt).split(/\s+/);
                for (j in d) {
                    if (!(f = tools[d[j]])) continue;
                    _event.set("click", (g = _dom.copy(f.target)), function(e) {
                        h = _data(this, 'tool-id');
                        tools[h].click(e, $, h);
                        if (/^(a|img|table)$/.test(h) && (k = _get('[name=data]', modal)[0])) {
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
                                        // return fire_tool_with_prompt(h, [l, "", ""], $), _event.x(e);
                                    }
                                });
                                _append(bubble, m);
                                _timer(function() {
                                    m.focus();
                                    m.select();
                                }, 1);
                            });
                        }
                        k = $.$(1);
                        l = [_edge(k.caret[0].x - target.scrollLeft, 0), _edge(k.caret[1].y - target.scrollTop, 0)];
                        ui.modal.fit(l);
                        ui.drop.fit(l);
                        return _event.x(e);
                    });
                    _append(bubble, g);
                }
            });
        } else {
            ui.bubble.exit();
            busy = 0;
        }
    });
    _hook.set('enter.bubble', function() {
        _timer(function() {
            ui.bubble.fit(); // refresh bubble position ...
        }, 1);
    });
});