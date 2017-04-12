/*!
 * ==========================================================
 *  TABLE GRID PLUGIN FOR USER INTERFACE MODULE 1.1.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var busy = 0,
        uniq = Date.now(),

        config = $.config,

        classes = config.classes,
        states = config.states,

        table = 'table',
        grid_id = 'grid-id',

        ui = $.ui,

        _ = $._,
        _css = _.css,
        _dom = _.dom,
        _dom_children = _dom.children,
        _dom_class = _dom.classes,
        _dom_data = _dom.data,
        _dom_get = _dom.get,
        _dom_index = _dom.index,
        _dom_next = _dom.next,
        _dom_parent = _dom.parent,
        _dom_prepend = _dom.prepend,
        _dom_previous = _dom.previous,
        _el = _.el,
        _events = _.events,
        _hooks_set = _.hooks.set,
        _timer_set = _.timer.set,

        $el = $.ui.el,
        $container = $el.container,
        $modal = $el.modal,

        s = classes[""],
        prefix = '.' + s + '-grid',
        style = _el('style'),
        results, i, j, k, l, m;

    if (!ui.tools[table]) return;

    function do_modals(id, data, $) {
        busy = 1;
        // [1]. trigger the tool item to show the modal prompt
        ui.tools[id].click(null, $);
        // [2]. access the visible modal prompt HTML through `$.ui.el.modal`
        for (i in data) {
            if (j = _dom_get('[name=data]', $modal)[0]) {
                // [3]. set value to the prompt field
                j.value = data[i];
                // [4]. trigger click event to the submit button
                if (k = _dom_get('[name=y]', $modal)[0]) {
                    _events.fire("click", k);
                }
            }
        }
        busy = 0;
    }

    _dom_prepend(document.head, style);

    _dom_data.set($container, grid_id, uniq);
    _events.set("keydown", ui.tools[table].target, function(e) {
        if (e.TE.key('down')) {
            return _timer_set(function() {
                _dom_get('a', $el.drop)[0].focus();
            }), _events.fire("click", this, [e]), _events.x(e);
        }
    });
    _hooks_set('enter.modal.prompt:table>td', function($) {
        if (busy) return;
        l = prefix.slice(1);
        uniq = '-' + _dom_data.get($container, grid_id);
        ui.drop(l + ' ' + l + uniq, function(drop) {
            var container = _el('div'),
                rows = states.tr,
                columns = states.td,
                c = 'children',
                x = ' \u00D7 ',
                container_css = _css($container, [
                    'border-top-color',
                    'border-bottom-color',
                    'background-color'
                ]),
                color = _css(_dom_get('a', $container)[0], 'color'),
                border = container_css[0] || container_css[1],
                background = container_css[2],
                data, tr, td, tr_index, td_index, i, j;
            // if normal state color is the same as the hover state ...
            if (color === border) {
                color = '#39f'; // ... force hover color to `#39f`
            }
            m = prefix + uniq;
            _el(style, m + ' div,' + m + ' a{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;background:' + border + ';border:1px solid ' + background + ';overflow:hidden}' + m + ' div div{border-width:0}' + m + ' div+div{border-top-width:1px}' + m + ' a{width:1em;height:1em;float:left;border:0 solid;border-color:inherit;cursor:pointer}' + m + ' a+a{border-left-width:1px}' + m + ' a:focus,' + m + ' .active{background:' + color + '}', {
                'id': s + '-style:grid' + uniq
            });
            function do_over() {
                j = this;
                data = j.title.split(x);
                results = [+data[0], +data[1]];
                tr_index = container[c].length;
                while (tr_index--) {
                    td_index = container[c][tr_index][c].length;
                    while (td_index--) {
                        _dom_class[tr_index <= results[1] - 1 && td_index <= results[0] - 1 ? 'set' : 'reset'](container[c][tr_index][c][td_index], 'active');
                    }
                }
                j.focus();
            }
            function do_click(e) {
                return do_modals(table, results, $), _events.x(e);
            }
            function do_key(e) {
                j = this;
                k = e.TE.key;
                if (k('escape')) {
                    ui.exit(1);
                } else if (k('enter')) {
                    _events.fire("click", j, [e]);
                } else if (
                    (k('right') && (l = _dom_next(j))) ||
                    (k('left') && (l = _dom_previous(j)))
                ) {
                    _events.fire("mouseover", l, [e]) && l.focus();
                } else if (
                    (k('down') && (l = _dom_next(_dom_parent(j)))) ||
                    (k('up') && (l = _dom_previous(_dom_parent(j))))
                ) {
                    l = _dom_children(l)[_dom_index(j)];
                    l && _events.fire("mouseover", l, [e]) && l.focus();
                } else if (k('up')) {
                    ui.exit();
                    ui.tools[table].target.focus();
                }
                return _events.x(e);
            }
            i = rows[1]; // number of rows
            while (i--) {
                tr = _el('div');
                j = columns[1]; // number of columns
                while (j--) {
                    td = _el('a', "", {
                        'href': 'javascript:;',
                        'title': (j + 1) + x + (i + 1)
                    });
                    _events.set("mouseover", td, do_over);
                    _events.set("keydown", td, do_key);
                    _events.set("click", td, do_click);
                    _dom_prepend(tr, td);
                }
                _dom_prepend(container, tr);
            }
            _dom_prepend(drop, container);
        });
    }, 'table-grid');
}, 250);