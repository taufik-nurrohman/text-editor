/*!
 * ==========================================================
 *  EXPAND PLUGIN FOR USER INTERFACE MODULE 1.2.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc) {

    var once = 1;

    TE.each(function($) {

        var uniq = '-' + Date.now(),
            html = doc.documentElement,
            head = doc.head,

            ui = $.ui,
            target = $.target,
            container = ui.el.container,

            _ = $._,
            _dom = _.dom,
            _dom_class_set = _dom.classes.set,
            _dom_class_reset = _dom.classes.reset,
            _dom_append = _dom.append,
            _dom_prepend = _dom.prepend,
            _el = _.el,
            _extend = _.extend,

            expand = 'expand',
            min = 'minimize',
            max = 'maximize',

            config = $.config,
            config_resize = config.resize,
            i18n = config.languages.tools,
            s = config.classes[""],
            s_i = config.classes.i.split(' ')[0],
            prefix = '.' + s,
            suffix = '-is-' + expand + 'ed',
            prefix_base = prefix + suffix + prefix + uniq + suffix,

            $$ = $.target.style, is_max;

        if (once) {
            _dom_append(head, _el('style', '@font-face{font-family:' + s_i + '-' + expand + ';src:url(data:application/octet-stream;base64,d09GRgABAAAAAATMAAsAAAAACEAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIwleU9TLzIAAAFEAAAAQgAAAFZAiUo9Y21hcAAAAYgAAABPAAABfmBD5KlnbHlmAAAB2AAAAKgAAAFAfJsbd2hlYWQAAAKAAAAALwAAADYPH5/vaGhlYQAAArAAAAAdAAAAJA0DBgNobXR4AAAC0AAAAAwAAAAMEv4AAGxvY2EAAALcAAAACAAAAAgAUACgbWF4cAAAAuQAAAAeAAAAIAEPAD1uYW1lAAADBAAAAZ4AAANFGLm2/HBvc3QAAASkAAAAJgAAAD17UW+1eJxjYGRgYOBiMGCwY2DKSSzJY+BzcfMJYZBiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCAClZBUgAeJxjYGQLZZzAwMrAwFLI8oyBgeEXhGaOYQhnPMfAwMTAysyAFQSkuaYwODxgeMDIxvCfgWEhGwMjSBhMAAASyAtIAAB4nO2QsQ2AMAwEz4mhQIxBQcEwVMzPJsnbZgxeupP+5crAAnRxCQd7MCK3Vsu9s+XuHHnjsb82hkxY3dNNWvmzp8+vtfhTUZ8raBO26AstAHicY2BiYPjfwMbA2sAgwWDAwMAows4oLibCpqyopGYqaGJmJM/ICCLEGAVF2JT0GRlBhJqJOaO6momZsaKRGNNnrn9bJgirSf1zkFJTMxGewOjDJcVVxMXMC+L82wLmcDH6gJQwHpBSY3zAC9ZgogbhgzWA1AeDDADrAPKkwDqAahhA7utl/cxazCAOdh8OZ+B0NzMDdnfgcjeTA1Z3MLVhdzYAojdCeHicY2BkYGAA4kjXNWvj+W2+MnCzM4DAlQbtSgT9v4GdgbUByOVgYAKJAgAaWgmwAHicY2BkYGBj+M/AwMAOxP//A0mgCApgBgBLFAMXAAAABwAAAAX/AAAF/wAAAAAAAABQAKB4nGNgZGBgYGYwZGBiAAEQyQWEDAz/wXwGAA2SAU0AAHicjZDNSsNAFIVP2qpowYWC61mIVCTpD6jgqlKwOxcuunFjbCbJlDRTJlOxCx9BfBa3voArX8EX8CU8SQcRi9AMM/PNuT+59wLYwyc8LL9T7iV71E8d17CFoeM69WvHDfKd4w00YRxvUn9yvIMTvDhuYh9vzOA1tvma4MOxh0Pv3HENu96t4zp15bhBfna8gQPv1fEm9XfHOxh5X46bOKpdDvRsYVSSWtEaHItep3sm7hdCU1J5mIlwblNtCtEXsc6tzDIdjPXUykfry0hZbXzlxyqPbmQyz0KzalhVRtIUSueiG3RWjUOZSxNaGZVVFA9Jz9pYxEZPxZX7v5gZPZFjG6TWzi7a7d91YQCNGRYcs0KCFBYCLarHvHvooIsz0j09BD2XXgo5QmRUQswZkVaWgu8+d8xXTlXSIyMHGPOcVsojT593xBy2ivJJPmPKnBFuaEuYM2Nms1bEOj4j2sr6VFWZYE8BO1snckhbXkWHlX/0M4sCD6y0R9XSu+zaVF0KXP3pX3C+pW1CZUw9qKZsqV6gzfXPvL4B17+jHAAAeJxjYGKAAEEG7ICZkYmRmZGFgSO1oiAxL0XXEMYwYGAAAEifBe4AAA==)format(\'woff\')}.' + s_i + '-' + expand + ':before{content:\'\\e000\';font-family:' + s_i + '-' + expand + '}.' + s_i + '-' + expand + '-1:before{content:\'\\e001\'}', {
                'id': s + ':style-' + expand
            }));
            once = 0;
        }

        prefix = prefix_base + ' ' + prefix + '-' + expand + uniq + ' ' + prefix;

        _dom_class_set(container, s + '-' + expand + uniq + ' ' + s + '-is-can-expand');

        _extend(i18n, {
            maximize: ['Maximize', 'F11'],
            minimize: ['Minimize', 'F11']
        });

        _dom_append(head, _el('style', prefix + '-description .left,' + prefix + '-footer+.' + s + '-resize{display:none}' + prefix_base + ',' + prefix_base + ' body{position:static;overflow:hidden}' + prefix_base + ' .' + s + '-expand' + uniq + '{border-width:0;position:fixed;top:0;right:0;bottom:0;left:0;margin:0;padding:0;z-index:9998;width:100%;height:100%}' + prefix + '-body,' + prefix + '-content{border-width:0;width:100%;height:100%;position:absolute;top:0;right:0;bottom:0;left:0}' + prefix + '-content{font-size:1.5em;padding:2.5em 1em 1em;resize:none}' + prefix + '-footer,' + prefix + '-header{position:absolute;top:0;left:0;margin:.5em;z-index:9999;background:inherit;border:1px solid;border-color:inherit;box-shadow:0 0 2px rgba(0,0,0,.2)}' + prefix + '-footer{position:absolute;top:auto;bottom:0;left:0}' + prefix + '-description{padding:.4em .8em}', {
            'id': s + '-style:' + expand + uniq
        }));

        function do_max(e) {
            is_max = 1;
            i18n[expand] = i18n[min];
            _dom_class_set(html, s + suffix + ' ' + s + uniq + suffix);
            ui.tool(expand, {
                i: expand + '-1',
                click: do_min
            }).update({resize: 0}).select();
            $$.height = $$.width = $$.minHeight = $$.minWidth = "";
            return false;
        }

        function do_min(e) {
            is_max = 0;
            i18n[expand] = i18n[max];
            _dom_class_reset(html, s + suffix + ' ' + s + uniq + suffix);
            ui.tool(expand, {
                i: expand + '-0',
                click: do_max
            }).update({resize: config_resize});
            if (e) $.select();
            return false;
        } do_min();

        // press `f11` to maximize/minimize
        ui.key('f11', function(e, $) {
            return is_max ? do_min(e) : do_max(e), false;
        });

    });

})(window, document);