/*!
 * ==========================================================
 *  TABLE GRID PLUGIN FOR USER INTERFACE MODULE 1.0.2
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var busy = 0,
        uniq = Date.now(),
        config = $.config,
        states = config.states,
        classes = config.classes,
        ui = $.ui,
        _ = $._,
        _hook = _.hook,
        _event = _.event,
        _el = _.el,
        _css = _.css,
        _dom = _.dom,
        _prepend = _dom.prepend,
        _class = _dom.classes,
        _data = _dom.data,
        $el = $.ui.el,
        $container = $el.container,
        $modal = $el.modal,
        save_id = 'TE.grid',
        grid_id = 'grid-id',
        q = 'querySelector',
        s = classes[""],
        prefix = '.' + s + '-grid',
        style = _el('style'),
        css, i, j, k, l, m;

    function fire_tool_with_prompt(id, data, $) {
        busy = 1;
        // [1]. trigger the tool item to show the modal prompt
        ui.tools[id].click(null, $);
        // [2]. access the visible modal prompt HTML through `$.ui.el.modal`
        for (i in data) {
            if (j = $modal[q]('[name=data]')) {
                // [3]. set value to the prompt field
                j.value = data[i];
                // [4]. trigger click event to the submit button
                if (k = $modal[q]('[name=y]')) {
                    _event.fire("click", k);
                }
            }
        }
        busy = 0;
    }

    _prepend(document.head, style);

    _data.set($container, grid_id, uniq);
    _hook.set('enter.modal.prompt:table>td', function($) {
        if (busy) return;
        l = prefix.slice(1);
        uniq = '-' + _data.get($container, grid_id);
        ui.drop(l + ' ' + l + uniq, function(drop) {
            var container = _el('div'),
                rows = states.tr,
                columns = states.td,
                c = 'children',
                x = ' \u00D7 ',
                color = _css($container[q]('a'), 'color'),
                border = _css($container, 'border-top-color') || _css($container, 'border-bottom-color'),
                background = _css($container, 'background-color'),
                data, results, tr, td, tr_index, td_index, i, j;
            // if normal state color is the same as the hover state ...
            if (color === border) {
                color = '#39f'; // ... force hover color to `#39f`
            }
            m = prefix + uniq;
            _el(style, m + ' div{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;background:' + border + ';border:1px solid ' + background + ';overflow:hidden}' + m + ' div>div{border-width:0}' + m + '>div>div+div{border-top-width:1px}' + m + '>div>div>div{width:1em;height:1em;float:left;border-width:0;cursor:pointer}' + m + '>div>div>div+div{border-left-width:1px}' + m + '>div>div>.active{background:' + color + '}', {
                'id': s + ':style-grid' + uniq
            });
            function do_over() {
                data = this.title.split(x);
                results = [+data[0], +data[1]];
                $.save(save_id, results);
                tr_index = container[c].length;
                while (tr_index--) {
                    td_index = container[c][tr_index][c].length;
                    while (td_index--) {
                        _class[tr_index <= results[1] - 1 && td_index <= results[0] - 1 ? 'set' : 'reset'](container[c][tr_index][c][td_index], 'active');
                    }
                }
            }
            function do_click() {
                fire_tool_with_prompt('table', $.restore(save_id), $);
            }
            i = rows[1]; // number of rows
            while (i--) {
                tr = _el('div');
                j = columns[1]; // number of columns
                while (j--) {
                    td = _el('div', "", {
                        'title': (j + 1) + x + (i + 1)
                    });
                    _event.set("mouseover touchstart", td, do_over);
                    _event.set("click", td, do_click);
                    _prepend(tr, td);
                }
                _prepend(container, tr);
            }
            _prepend(drop, container);
        });
    }, 'table-grid');
}, 250);