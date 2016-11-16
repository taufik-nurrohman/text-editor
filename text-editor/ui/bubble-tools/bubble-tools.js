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
        tools = ui.tools,
        tools_alt = config.tools_alt || 'b i a blockquote,q pre,code',
        c = config.classes[""],
        target = $.target,
        _ = $._,
        _el = _.el,
        _css = _.css,
        _trim = _.trim,
        _event = _.event,
        _hook = _.hook,
        _edge = _.edge,
        _dom = _.dom,
        _data = _dom.data.get,
        _append = _dom.append,
        d, e, f, g, h, i, j, k, l;
    _event.set('copy cut focus input keyup mouseup paste scroll', target, function(e) {
        k = $.$();
        if (k.length && !busy) {
            ui.bubble('tool ' + c + '-tool', function(bubble) {
                _css(bubble, {
                    'padding': 0,
                    'font-size': '80%'
                });
                d = _trim(tools_alt).split(/\s+/);
                for (j in d) {
                    if (!(f = tools[d[j]])) continue;
                    _event.set('click', (g = _dom.copy(f.target)), function(e) {
                        h = _data(this, 'tool-id');
                        tools[h].click(e, $, h);
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
        setTimeout(function() {
            ui.bubble.fit(); // refresh bubble position ...
        }, 1);
    });
    _hook.set('enter.modal', function() {
        busy = 1;
        if (l) {
            ui.modal.fit(l); // keep custom modal offset ...
        }
    });
    _hook.set('enter.drop', function() {
        if (l) {
            ui.drop.fit(l); // keep custom drop offset ...
        }
    });
});