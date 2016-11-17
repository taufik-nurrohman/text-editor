/*!
 * ==========================================================
 *  EXPAND PLUGIN FOR USER INTERFACE MODULE 1.0.8
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {
    var uniq = '-' + Date.now(),
        doc = document,
        html = doc.documentElement,
        head = doc.head,
        body = doc.body,
        ui = $.ui,
        target = $.target,
        _ = $._,
        _extend = _.extend,
        _el = _.el,
        _dom = _.dom,
        _class_set = _dom.classes.set,
        _class_reset = _dom.classes.reset,
        _prepend = _dom.prepend,
        expand = 'expand',
        min = 'minimize',
        max = 'maximize',
        i18n = $.config.languages.tools,
        s = $.config.classes[""],
        prefix = '.' + s,
        suffix = '-is-' + expand + 'ed',
        prefix_base = prefix + suffix + prefix + uniq + suffix,
        $$ = $.target.style,
        is_max;
    prefix = prefix_base + ' ' + prefix + '-' + expand + uniq + ' ' + prefix;
    _class_set(ui.el.container, s + '-' + expand + uniq);
    $.config.css += 'body{padding-top:2em}';
    _extend(i18n, {
        maximize: ['Maximize', 'F11'],
        minimize: ['Minimize', 'F11']
    });
    _prepend(head, _el('style', prefix + '-description .left,' + prefix + '-footer+.' + s + '-resize{display:none}' + prefix_base + ',' + prefix_base + ' body{position:static;overflow:hidden}' + prefix_base + ' .' + s + '-expand' + uniq + '{border-width:0;position:fixed;top:0;right:0;bottom:0;left:0;margin:0;padding:0;z-index:9998;width:100%;height:100%}' + prefix + '-body,' + prefix + '-content{border-width:0;width:100%;height:100%;position:absolute;top:0;right:0;bottom:0;left:0}' + prefix + '-content{font-size:1.5em;padding:2.5em 1em 1em;resize:none}' + prefix + '-footer,' + prefix + '-header{position:absolute;top:0;left:0;margin:.5em;z-index:9999;background:inherit;border:1px solid;border-color:inherit;box-shadow:0 0 2px rgba(0,0,0,.2)}' + prefix + '-footer{position:absolute;top:auto;bottom:0;left:0}' + prefix + '-description{padding:.4em .8em}' + prefix + '-description .right{padding-right:0}', {
        'id': s + '-style:' + expand + uniq
    }));
    function do_max() {
        is_max = 1;
        _class_set(html, s + suffix + ' ' + s + uniq + suffix);
        i18n[expand] = i18n[min];
        ui.tool(expand, {
            i: 'compress',
            click: do_min
        }).select();
        $$.height = $$.width = $$.minHeight = $$.minWidth = "";
        return false;
    }
    function do_min(e) {
        is_max = 0;
        _class_reset(html, s + suffix + ' ' + s + uniq + suffix);
        i18n[expand] = i18n[max];
        ui.tool(expand, {
            i: 'expand',
            click: do_max
        });
        if (e) $.select();
        return false;
    }
    do_min();
    // press `f11` to maximize/minimize
    ui.key('f11', function(e, $) {
        return is_max ? do_min(e, $) : do_max(e, $), false;
    });
});