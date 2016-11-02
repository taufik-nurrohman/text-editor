/*!
 * ==========================================================
 *  BBCODE TEXT EDITOR PLUGIN 0.0.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.BBCode = function(target, o) {

    var win = window,
        doc = document,
        $ = new TE.HTML(target),
        ui = $.ui,
        _ = $._,
        extend = _.extend,
        each = _.each,
        esc = _.x,
        trim = _.trim,
        edge = _.edge,
        pattern = _.pattern,
        is = $.is,
        is_set = function(x) {
            return !is.x(x);
        };

    $.update(extend({
        auto_p: 0, // disable automatic paragraph feature from `TE.HTML` by default
        advance_table: 0, // disable advance table feature from `TE.HTML` by default
        tools: 'b i s | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | undo redo',
        union: {
            unit: ['[', ']']
        },
        union_x: {
            unit: ['\\\\\\[', '\\\\\\]']
        },
        formats: {
            b: 'b',
            i: 'i',
            u: 'u',
            s: 's',
            a: 'url',
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            blockquote: 'quote',
            q: 'quote',
            pre: 'code',
            code: 'code',
            caption: ""
        }
    }, o), 0);

    // define editor type
    $.type = 'BBCode';

    function get_o(s) {
        return s.split(/\s+|=/)[0];
    }

    function attr_title(s) {
        return force_i(s).replace(/\[.*?\]/g, "").replace(/"/g, '&#34;').replace(/'/g, '&#39;').replace(/\(/g, '&#40;').replace(/\)/g, '&#41;');
    }

    function attr_url(s) {
        return force_i(s).replace(/\[.*?\]/g, "").replace(/\s/g, '%20').replace(/"/g, '%22').replace(/\(/g, '%28').replace(/\)/g, '%29');
    }

    function force_i(s) {
        return trim(s.replace(/\s+/g, ' '));
    }

    var config = $.config,
        states = config.states,
        languages = config.languages,
        formats = config.formats,
        tab = config.tab,
        placeholders = languages.placeholders;

    extend(ui.tools, {
        a: {
            click: function(e, $) {
                var a = formats.a,
                    i18n = languages.modals.a;
                // link text
                if (/^[a-z]+:\/\/\S+$/.test($.$().value)) {
                    return $.format(a), false;
                }
                return $.record().ui.prompt(['a[href]', i18n.title[0]], i18n.placeholder[0], 1, function(e, $, v) {
                    $.format(a + '=' + attr_url(v));
                }), false;
            }
        },
        img: {
            click: function(e, $) {
                var img = formats.img,
                    i18n = languages.modals.img;
                if (!$.$().length) {
                    return $.record().ui.prompt(['img[src]', i18n.title[0]], i18n.placeholder[0], 1, function(e, $, v) {
                        $[0]().insert(attr_url(v)).format(img)[1]();
                    }), false;
                }
                return $.format(img), false;
            }
        },
        sub: 0,
        sup: 0,
        abbr: 0,
        p: {
            click: function(e, $) {
                if ($.$().length) {
                    return $.tidy('\n\n').replace(/([\t ]*\n[\t ]*){2,}/g, '\n\n'), false;
                }
                return $.tidy('\n\n').insert(placeholders[""]), false;
            }
        },
        'blockquote,q': {
            click: function(e, $) {
                return $.format(formats.blockquote, 0, '\n\n', '\n'), false;
            }
        },
        'pre,code': {
            click: function(e, $) {
                return $.format(formats.pre, 0, '\n\n', '\n'), false;
            }
        },
        hr: 0
    });

    extend(ui.keys, {
        'control+arrowup': 0,
        'control+arrowdown': 0,
        'control+shift+?': 0,
        'control+r': 0
    });

    return $.update({}, 0);

};