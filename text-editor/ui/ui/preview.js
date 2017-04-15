/*!
 * ==========================================================
 *  PREVIEW PANEL PLUGIN FOR USER INTERFACE MODULE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var ui = $.ui,
        _ = $._,
        _is_string = $.is.s,
        _dom = _.dom,
        _dom_append = _dom.append,
        _dom_get = _dom.get,
        _events = _.events,
        _extend = _.extend,

        preview = 'preview',
        config = $.config,
        c = config.classes[""],
        i18n = config.languages.tools,
        left = _dom_get('.' + (config.direction === 'ltr' ? 'left' : 'right'), ui.el.footer)[0],
        container = _.el('span', "", {
            'class': c + '-preview'
        }), i, j, k;

    i18n = _extend({
        preview: ['Preview', '\u2325+F8']
    }, i18n);

    j = i18n[preview] || [""];
    k = _.el('a', j[0], {
        'class': c + '-a',
        'title': j[0] + (j[1] ? ' (' + j[1] + ')' : "")
    });

    _dom_append(left, container);
    _dom_append(container, k);

    function fn_preview(e) {
        if (_dom.parent(ui.el.panel)) {
            ui.panel.exit(1);
        } else {
            var css = config[preview + '_css'] || [],
                js = config[preview + '_js'] || [],
                css_s = "",
                js_s = "";
            if (_is_string(css)) css = [css];
            if (_is_string(js)) js = [js];
            for (i in css) css[i] && (css_s += '<li' + 'nk href="' + css[i] + '" rel="stylesheet">');
            for (i in js) js[i] && (js_s += '<scr' + 'ipt src="' + js[i] + '"></scr' + 'ipt>');
            ui.panel(preview, {
                header: "",
                body: '<iframe frameborder="0" style="display:block;width:100%;height:100%;margin:0;padding:0;border:0;position:absolute;top:0;right:0;bottom:0;left:0;" src="data:text/html,' + encodeURIComponent('<!DOCTYPE html><html dir="' + config.direction + '"><head><meta charset="utf-8">' + css_s + '</head><body>' + $.get() + js_s + '</body></html>') + '"></iframe>'
            }, 0, preview);
            j = 'children';
            i = ui.el.panel[j][1];
            i[j][0][j][0].style.height = _dom.size(i).h + 'px';
        }
        return $.select(), _events.x(e), false;
    }

    _events.set("click", k, fn_preview);

    // press `alternate+f8` for "preview"
    ui.key('alternate+f8', fn_preview);

});