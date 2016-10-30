/*!
 * ==========================================================
 *  EXPAND PLUGIN FOR USER INTERFACE MODULE 1.0.2
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function() {
    var once = 1;
    TE.each(function($) {
        var doc = document,
            html = doc.documentElement,
            head = doc.head,
            body = doc.body,
            ui = $.ui,
            i18n = $.config.languages.tools,
            s = $.config.classes[""],
            prefix = '.' + s,
            prefix_base = prefix + '-is-expanded',
            style = doc.createElement('style'),
            ss = prefix_base.slice(1),
            $$ = $.target.style, is_max;
        prefix = prefix_base + ' ' + prefix;
        style.textContent = '' + prefix + '-description .left,' + prefix + '-footer+.' + s + '-resize{display:none}' + prefix_base + ',' + prefix_base + ' body{position:static;overflow:hidden}' + prefix + '{border-width:0;position:fixed;top:0;right:0;bottom:0;left:0;z-index:9998;width:100%;height:100%}' + prefix + '-body,' + prefix + '-content{border-width:0;width:100%;height:100%;position:absolute;top:0;right:0;bottom:0;left:0}' + prefix + '-content{font-size:1.5em;padding:2.5em 1em 1em}' + prefix + '-footer,' + prefix + '-header{position:absolute;top:0;left:0;margin:.5em;z-index:9999;background:inherit;border:1px solid;border-color:inherit;box-shadow:0 0 2px rgba(0,0,0,.2)}' + prefix + '-footer{position:absolute;top:auto;bottom:0;left:0}' + prefix + '-description{padding:.4em .8em}' + prefix + '-description .right{padding-right:0}';
        $.config.css += '</style><style>body{padding-top:2.5em}';
        $._.extend(i18n, {
            maximize: ['Maximize', 'F11'],
            minimize: ['Minimize', 'F11']
        });
        if (once) {
            head.appendChild(style);
            once = 0;
        }
        function do_max() {
            is_max = 1;
            html.classList.add(ss);
            i18n.expand = i18n.minimize;
            ui.tool('expand', {
                i: 'compress',
                click: do_min
            }).select();
            $$.height = $$.width = $$.minHeight = $$.minWidth = "";
            return false;
        }
        function do_min(e) {
            is_max = 0;
            html.classList.remove(ss);
            i18n.expand = i18n.maximize;
            ui.tool('expand', {
                i: 'expand',
                click: do_max
            });
            if (e) $.select();
            return false;
        }
        do_min();
        // Press `F11` to maximize/minimize
        ui.key('f11', function(e, $) {
            return is_max ? do_min(e, $) : do_max(e, $), false;
        });
    });
})();