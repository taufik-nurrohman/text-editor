/*!
 * ==========================================================
 *  STRING CONVERTER PLUGIN FOR USER INTERFACE MODULE 1.2.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc) {

    var once = 1;

    TE.each(function($) {

        var ui = $.ui,
            config = $.config,
            any = /^[\s\S]*$/,
            prefix_i = config.classes.i.split(' ')[0],
            converter = 'converter',
            from = ' \u2190 ',
            to = ' \u2192 ',
            modals, menus, a,

            _ = $._,
            _dom = _.dom,
            _dom_append = _dom.append,
            _dom_content_get = _dom.content.get,
            _el = _.el,
            _extend = _.extend,
            _replace = _.replace,
            _timer_set = _.timer.set;

        if (!config[converter + 's']) return;

        if (once) {
            _dom_append(doc.head, _el('style', '@font-face{font-family:' + prefix_i + '-' + converter + ';src:url(data:application/octet-stream;base64,d09GRgABAAAAAAR0AAsAAAAAB2wAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIwleU9TLzIAAAFEAAAAQgAAAFZAiUonY21hcAAAAYgAAABKAAABcOEoo6pnbHlmAAAB1AAAAFAAAABQ2W0xuGhlYWQAAAIkAAAAMAAAADYPE7apaGhlYQAAAlQAAAAgAAAAJAz3BfdobXR4AAACdAAAAAgAAAAIDID/9GxvY2EAAAJ8AAAABgAAAAYAKAAAbWF4cAAAAoQAAAAeAAAAIAENACFuYW1lAAACpAAAAakAAAOB0bY/gXBvc3QAAARQAAAAIgAAADM7+ePmeJxjYGRgYOBiMGCwY2DKSSzJY+BzcfMJYZBiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCAClZBUgAeJxjYGRzYJzAwMrAwFLI8oyBgeEXhGaOYQhnPMfAwMTAysyAFQSkuaYwODxgeMDAxvCfgWEhGwMjSBhMAAAL5gsyAAB4nO2QsQ2AMBADz8pDgRiBKjWzULG/2CT5GNgils6ST189sAAlOZMA3YiRK63sC5t9UH0Twz+09nfucKOVmd19fMu/ekEdGiYJUQAAAAH/9P+ABYwFAAAUAAABFgcBERQHBiMiJwEmNREBJjYzITIFexEf/hMnDQwbEv8AE/4THyIqBQAqBNkpHf4T/RoqEQUTAQATGgHmAe0dUAB4nGNgZGBgAOId3E8ux/PbfGXgZmcAgSsN5mIw+v+X/w3sDKwgLgcDE4gCAD5UCvh4nGNgZGBgY/jPwMDAzvD/y/8v7AwMQBEUwAQAeAAE/gcAAAAFgP/0AAAAAAAoAAB4nGNgZGBgYGIQZQDRIBYDAxcQMjD8B/MZAAqkAS8AAHiclZHNThsxFIXPhEAFkbooEt16VUDVTH4kWLBCigSLsqJS9sPE8xNN7MhzE5EFC1ZseIs+A6/BI1Sq+hTdceJYCFXKImP5+vO5xx77GsAX/EaE9XfGvuYIXzlbcwufcBN4h/rPwG3yJPAuOngMvEf9OfABvuNX4A4O8codovY+ZxP8CRwhiX4EbuFztAy8Q/0pcJv8EngXR9HfwHvU/wU+wKh1HLiDb62HoZ0tXVWUok6Gp2rQ65+ru6WylCqT1iqdS2ldoy5Vbo3ourZJZqei7yXW40qsi6s4s2ahnWh3q4t5nboN2Q3ySLumskb1k94Gx7U22qWix6uTNYtiIJKr3NmpugpnUjNnJzqTpBSZXXS7H8+KISxmWMKhQoESAoUTqqccB+ihj3PSHR2KzrWrgkGKmkqKOVeUPtNwfsmec2aoajpqcoKMceqVe8aY45h7iF8Vk2LvMFgw47zP4Zax4O41/+G2XLude+Rjw+wqo3jjhPfebo9rRuMp9cr4vWYNfQUrKWy5r47z1VC4+q9Oiu+wyk2oZNQT/xpC9QJdtg11fQONK7XTAAAAeJxjYGKAAEEG7ICJkYmRmYEzOT+vLLWoJLWIgQEAHx0D/gAA)format(\'woff\')}.' + prefix_i + '-' + converter + ':before{content:\'\\e000\';font-family:' + prefix_i + '-' + converter + '}', {
                'id': config.classes[""] + ':style-' + converter
            }));
            once = 0;
        }

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
            base64_encode: win.btoa ? function(e, $) {
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
            base64_decode: win.atob ? function(e, $) {
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

        config.tools && ui.menu(converter, [converter], menus);

        // add `$.ui.tools.converter.check()` method
        ui.tools[converter].check = check;

        // press `control+shift+c` for "converter"
        ui.key('control+shift+c', converter);

    });

})(window, document);