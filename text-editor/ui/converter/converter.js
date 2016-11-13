/*!
 * ==========================================================
 *  STRING CONVERTER PLUGIN FOR USER INTERFACE MODULE 1.0.0
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
        advance = config.advance_converter,
        modals, menus, a,

        _ = $._,
        _el = _.el,
        _dom = _.dom,
        _event = _.event,
        _replace = _.replace,
        _extend = _.extend,
        _append = _dom.append;

    function check(a, b) {
        modals = config.languages.modals[converter];
        setTimeout(function() {
            if (!$.$().length) {
                ui.alert(a || modals.title, b || modals.description);
            }
        }, 1);
    }

    _extend(config.languages, {
        tools: {
            converter: ['Converter'],
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
            return $.replace(/[&<>]/g, function(a) {
                return _replace(a, ['&', '<', '>'], ['&amp;', '&lt;', '&gt;']);
            }), check(), false;
        },
        html_encode_hex: function(e, $) {
            return $.replace(any, function(a) {
                var o = "",
                    i, j, k;
                for (i = 0, j = a.length; i < j; ++i) {
                    k = a[i];
                    k = k.charCodeAt(0).toString(16);
                    o += '\u0026\u0023\u0078' + k + '\u003b';
                }
                return o;
            }), check(), false;
        },
        html_encode_dec: function(e, $) {
            return $.replace(any, function(a) {
                var o = "",
                    i, j, k;
                for (i = 0, j = a.length; i < j; ++i) {
                    k = a[i];
                    k = k.charCodeAt(0).toString();
                    o += '\u0026\u0023' + k + '\u003b';
                }
                return o;
            }), check(), false;
        },
        js_encode_hex: function(e, $) {
            return $.replace(any, function(a) {
                var o = "",
                    i, j, k;
                for (i = 0, j = a.length; i < j; ++i) {
                    k = a[i];
                    k = k.charCodeAt(0).toString(16);
                    while (k.length < 4) k = '0' + k;
                    o += '\u005c\u0075' + k;
                }
                return o;
            }), check(), false;
        },
        url_encode: function(e, $) {
            return $.replace(any, function(a) {
                return encodeURIComponent(a);
            }), check(), false;
        },
        base64_encode: w.btoa ? function(e, $) {
            return $.replace(any, function(a) {
                return btoa(a);
            }), check(), false;
        } : 0,
        '%2': 1, // label
        html_decode: function(e, $) {
            return $.replace(any, function(a) {
                return _replace(_el('div', a).innerHTML, ['&lt;', '&gt;', '&amp;'], ['<', '>', '&']);
            }), check(), false;
        },
        js_decode: function(e, $) {
            return $.replace(any, function(a) {
                return _el('div', _replace(a, ['\\u', /^;/], [';&#x', ""])).innerHTML;
            }), check(), false;
        },
        url_decode: function(e, $) {
            return $.replace(any, function(a) {
                return decodeURIComponent(a);
            }), check(), false;
        },
        base64_decode: w.atob ? function(e, $) {
            return $.replace(any, function(a) {
                try {
                    return atob(a);
                } catch(e) {
                    return a;
                }
            }), check(), false;
        } : 0
    };

    if (a = config[converter + 's']) {
        menus['%3'] = 1;
        _extend(menus, a);
    }

    ui.menu(converter, ['filter'], menus);

    // add `$.ui.tools.converter.check()` method
    ui.tools[converter].check = check;

});