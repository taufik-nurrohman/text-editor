/*!
 * ==========================================================
 *  BBCODE TEXT EDITOR PLUGIN 1.0.4
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.BBCode = function(target, o) {

    var $ = new TE.HTML(target, {
            auto_p: 0, // disable automatic paragraph feature from `TE.HTML` by default
            advance_table: 0, // disable advance table feature from `TE.HTML` by default
            tools: 'clear | b i u s | sub sup | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            unit: [
                [
                    ['\u005B', '\u005D']
                ],
                [
                    ['\\u005B', '\\u005D'],
                    ['\\u003D', '\\u0022', '\\u0022', '\\u0020|\\u003D']
                ]
            ],
            formats: {
                b: 'b',
                i: 'i',
                u: 'u',
                s: 's',
                a: 'url',
                email: 'email',
                p: "",
                blockquote: 'quote',
                code: 'code',

                // by default, **BBCode** parser should accept `[ol]`, `[ul]` and `[li]` markup
                // <https://www.bbcode.org/reference.php>

                /*
                ol: 'list=1',
                ul: 'list',
                li: '*', // TODO: remove the closing star tag
                */

                table: 'table=1',
                caption: ""
            }
        }),
        ui = $.ui,
        _ = $._,
        esc = _.x,
        extend = _.extend,
        trim = _.trim,
        replace = _.replace,
        pattern = _.pattern,
        hook = _.hook,
        event = _.event,
        esc_unit = $.config.unit[1][0],
        esc_data = $.config.unit[1][1];

    $.update(o, 0);

    // define editor type
    $.type = 'BBCode';

    function get_o(s) {
        return s.split(pattern('(' + esc_data[3] + ')+'))[0];
    }

    function force_i(s) {
        return trim(s.replace(/\s+/g, ' '));
    }

    function attr_title(s) {
        return replace(force_i(s), [/(<.*?>)|(\[.*?\])/g, '"', "'", '(', ')', '[', ']'], ["", '&#34;', '&#39;', '&#40;', '&#41;', '&#91;', '&#93;']);
    }

    function attr_url(s) {
        return replace(force_i(s), [/(<.*?>)|(\[.*?\])/g, /\s/g, '"', '(', ')', '[', ']'], ["", '%20', '%22', '%28', '%29', '%5B', '%5D']);
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
                    i18n = languages.modals.a,
                    v = $.$().value;
                // link text
                if (/^[a-z]+:\/\/\S+$/i.test(v)) {
                    return $.format(a), false;
                // email text
                } else if (/^[\w.-]+@[\w.-]+(?:\.[\w.-]+)?$/i.test(v)) {
                    return $.format(formats.email), false;
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
                        $[0]().format(img).insert(attr_url(v))[1]();
                    }), false;
                }
                return $.format(img), false;
            }
        },
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
                var x = config.auto_encode_html,
                    code = formats.code,
                    code_o = get_o(code);
                function encode(a) {
                    return x ? a.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : a;
                }
                function decode(a) {
                    return x ? a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : a;
                }
                return $[0]().format(code, 0, '\n\n', '\n').replace(/^[\s\S]*?$/, function(a) {
                    return pattern('^\\s*' + esc_unit[0] + esc_unit[2] + esc(code_o) + esc_unit[1]).test($.$().after) ? encode(a) : decode(a);
                })[1](), false;
            }
        }
    });

    extend(ui.keys, {
        'control+shift+?': 0
    });

    // table caption is not supported in **BBCode** so we have to remove that "add caption" modal prompt here
    hook.set('enter.modal.prompt:table>caption', function($) {
        var k;
        if (!formats.caption && (k = ui.el.modal.querySelector('[name=y]'))) {
            event.fire("click", k); // force to click the submit button
        }
    });

    return $.update({}, 0);

};