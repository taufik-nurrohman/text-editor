/*!
 * ==========================================================
 *  EXPAND PLUGIN FOR USER INTERFACE MODULE 1.0.1
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
            s = $.config.classes[""],
            prefix = '.' + s,
            base = prefix + '-is-expanded',
            style = doc.createElement('style');
        prefix = base + ' ' + prefix;
        style.textContent = '' + prefix + '-description .left,' + prefix + '-footer+.' + s + '-resize{display:none}' + base + ',' + base + ' body{position:static;overflow:hidden}' + prefix + '{border-width:0;position:fixed;top:0;right:0;bottom:0;left:0;z-index:9998;width:100%;height:100%}' + prefix + '-body,' + prefix + '-content{border-width:0;width:100%;height:100%;position:absolute;top:0;right:0;bottom:0;left:0}' + prefix + '-content{font-size:1.5em;padding:2.5em 1em 1em}' + prefix + '-footer,' + prefix + '-header{position:absolute;top:0;left:0;margin:.5em;z-index:9999;background:inherit;border:1px solid;border-color:inherit;box-shadow:0 0 2px rgba(0,0,0,.2)}' + prefix + '-footer{position:absolute;top:auto;bottom:0;left:0}' + prefix + '-description{padding:.4em .8em}' + prefix + '-description .right{padding-right:0}';
        $.config.css += '</style><style>body{padding-top:2.5em}';
        $._.extend($.config.languages.tools, {
            maximize: ['Maximize', 'F11'],
            minimize: ['Minimize', 'F11']
        });
        if (once) {
            head.appendChild(style);
            once = 0;
        }
        function do_max() {
            html.classList.add(base.slice(1));
            ui.tool('maximize', false).select();
            return do_min_tool(), false;
        }
        function do_min() {
            html.classList.remove(base.slice(1));
            ui.tool('minimize', false).select();
            return do_max_tool(), false;
        }
        function do_max_tool() {
            ui.key('f11', 'maximize');
            ui.tool('maximize', {
                i: 'expand',
                click: do_max
            });
        }
        function do_min_tool() {
            ui.key('f11', 'minimize');
            ui.tool('minimize', {
                i: 'compress',
                click: do_min
            });
        }
        do_max_tool();
    });
})();