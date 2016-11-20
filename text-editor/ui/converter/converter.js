/*!
 * ==========================================================
 *  STRING CONVERTER PLUGIN FOR USER INTERFACE MODULE 1.0.6
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var w = window,
        ui = $.ui,
        config = $.config,
        any = /^[\s\S]*$/,
        converter = 'converter',
        from = ' \u2190 ',
        to = ' \u2192 ',
        modals, menus, a,

        _ = $._,
        _dom = _.dom,
        _dom_content_get = _dom.content.get,
        _el = _.el,
        _extend = _.extend,
        _replace = _.replace,
        _timer_set = _.timer.set;

    if (!config[converter + 's']) return;

    function check(a, b) {
        if (!$.$().length) {
            return _timer_set(function() {
                modals = config.languages.modals[converter];
                ui.alert(a || modals.title, b || modals.description);
            }, 1), false;
        }
        return true;
    }

    _extend(config.languages, {
        tools: {
            converter: ['Converter', '\u2318+\u21e7+C'],
            html_encode: ['HTML Encode', '&' + to + '&amp;'],
            html_encode_hex: ['HTML Encode: HEX', '&' + to + '&#x26;'],
            html_encode_dec: ['HTML Encode: DEC', '&' + to + '&#38;'],
            js_encode: ['JavaScript Encode'],
            js_encode_hex: ['JavaScript Encode: HEX', '&' + to + '\u005c\u00750026'],
            js_encode_dec: ['JavaScript Encode: DEC'],
            url_encode: ['URL Encode', '&' + to + '%26'],
            base64_encode: ['Base64 Encode', '&' + to + 'Jg=='],
            html_decode: ['HTML Decode', '&' + from + '&amp;'],
            js_decode: ['JavaScript Decode', '&' + from + '\u005c\u00750026'],
            url_decode: ['URL Decode', '&' + from + '%26'],
            base64_decode: ['Base64 Decode', '&' + from + 'Jg==']
        },
        modals: {
            converter: {
                title: 'Empty Selection',
                description: 'Please select some text.'
            }
        },
        labels: {
            converter: ['Encode', 'Decode', 'Custom']
        }
    });

    menus = {
        '%1': 1, // label
        html_encode: function(e, $) {
            return check() && $.record().replace(/[&<>]/g, function(a) {
                return _replace(a, ['&', '<', '>'], ['&amp;', '&lt;', '&gt;']);
            }), false;
        },
        html_encode_hex: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                var o = "",
                    i, j, k;
                for (i = 0, j = a.length; i < j; ++i) {
                    k = a[i];
                    k = k.charCodeAt(0).toString(16);
                    o += '\u0026\u0023\u0078' + k + '\u003b';
                }
                return o;
            }), false;
        },
        html_encode_dec: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                var o = "",
                    i, j, k;
                for (i = 0, j = a.length; i < j; ++i) {
                    k = a[i];
                    k = k.charCodeAt(0).toString();
                    o += '\u0026\u0023' + k + '\u003b';
                }
                return o;
            }), false;
        },
        js_encode_hex: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                var o = "",
                    i, j, k;
                for (i = 0, j = a.length; i < j; ++i) {
                    k = a[i];
                    k = k.charCodeAt(0).toString(16);
                    while (k.length < 4) k = '0' + k;
                    o += '\u005c\u0075' + k;
                }
                return o;
            }), false;
        },
        url_encode: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                return encodeURIComponent(a);
            }), false;
        },
        base64_encode: w.btoa ? function(e, $) {
            return check() && $.record().replace(any, function(a) {
                return btoa(a);
            }), false;
        } : 0,
        '%2': 1, // label
        html_decode: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                return _replace(_dom_content_get(_el('div', a)), ['&amp;', '&lt;', '&gt;'], ['&', '<', '>']);
            }), false;
        },
        js_decode: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                return _replace(_dom_content_get(_el('div', a.replace(/\\u([a-f\d]{4})/gi, '&#x$1;'))), ['&amp;', '&lt;', '&gt;'], ['&', '<', '>']);
            }), false;
        },
        url_decode: function(e, $) {
            return check() && $.record().replace(any, function(a) {
                return decodeURIComponent(a);
            }), false;
        },
        base64_decode: w.atob ? function(e, $) {
            return check() && $.record().replace(any, function(a) {
                try {
                    return atob(a);
                } catch(e) {
                    return a;
                }
            }), false;
        } : 0
    };

    a = config[converter + 's'];
    a = typeof a === "object" ? a : {};

    if (a && Object.keys(a).length) {
        menus['%3'] = 1;
        _extend(menus, a);
    }

    ui.menu(converter, ['filter'], menus);

    // add `$.ui.tools.converter.check()` method
    ui.tools[converter].check = check;

    // press `control+shift+c` for "converter"
    ui.key('control+shift+c', converter);

});