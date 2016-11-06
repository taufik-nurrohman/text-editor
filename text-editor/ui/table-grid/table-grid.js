/*!
 * ==========================================================
 *  TABLE GRID PLUGIN FOR USER INTERFACE MODULE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var busy = 0,
        config = $.config,
        states = config.states,
        classes = config.classes,
        ui = $.ui,
        _ = $._,
        hook = _.hook,
        event = _.event,
        el = _.el,
        css = _.css,
        modal = $.ui.el.modal,
        c = 'children',
        prefix = '.' + classes[""] + '-grid',
        style = el('style'),
        css, i, j, k;

    function prepend(node, dom) {
        node.insertBefore(dom, node.firstChild);
    }

    prepend(document.head, style);

    function fire_tool_with_prompt(id, data, $) {
        busy = 1;
        // [1]. trigger the tool item to show the modal prompt
        ui.tools[id].click(null, $);
        // [2]. access the visible modal prompt HTML through `$.ui.el.modal`
        for (i in data) {
            if (j = modal[c][1][c][0][c][0]) {
                // [3]. set value to the prompt field
                j.value = data[i];
                // [4]. trigger click event to the submit button
                if (k = modal[c][2][c][0]) {
                    event.fire('click', k);
                }
            }
        }
        busy = 0;
    }

    hook.set('enter.modal.prompt:table>td', function($) {
        if (busy) return;
        ui.drop(prefix.slice(1), function(drop) {
            var container = el('div'),
                rows = states.tr[1], // number of rows
                columns = states.td[1], // number of columns
                c = 'children',
                x = ' \u00D7 ',
                ui_container = ui.el.container,
                color = css(ui_container.getElementsByTagName('a')[0], 'color'),
                border = css(ui_container, 'border-top-color') || css(ui_container, 'border-bottom-color'),
                background = css(ui_container, 'background-color'),
                data, results, tr, td, tr_index, td_index, i, j;
            // if normal state color is the same as the hover state ...
            if (color === border) {
                color = '#39f'; // ... force hover color to `#39f`
            }
            el(style, prefix + ' div{background:' + border + ';border:1px solid ' + background + ';overflow:hidden}' + prefix + ' div>div{border-width:0}' + prefix + '>div>div+div{border-top-width:1px}' + prefix + '>div>div>div{width:1em;height:1em;float:left;border-width:0;cursor:pointer}' + prefix + '>div>div>div+div{border-left-width:1px}' + prefix + '>div>div>.active{background:' + color + '}');
            function do_over() {
                data = this.title.split(x);
                results = [+data[0], +data[1]];
                $.save('grid', results);
                tr_index = container[c].length;
                while (tr_index--) {
                    td_index = container[c][tr_index][c].length;
                    while (td_index--) {
                        container[c][tr_index][c][td_index].classList[tr_index <= results[1] - 1 && td_index <= results[0] - 1 ? 'add' : 'remove']('active');
                    }
                }
            }
            function do_click() {
                fire_tool_with_prompt('table', $.restore('grid'), $);
            }
            i = rows;
            while (i--) {
                tr = el('div');
                j = columns;
                while (j--) {
                    td = el('div');
                    event.set("mouseover touchstart", td, do_over);
                    event.set("click", td, do_click);
                    td.title = (j + 1) + x + (i + 1);
                    prepend(tr, td);
                }
                prepend(container, tr);
            }
            prepend(drop, container);
        });
    }, 'table-grid');
}, 1000);