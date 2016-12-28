/*!
 * ==========================================================
 *  BBCODE TEXT EDITOR PLUGIN 1.2.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.ui.BBCode = function(target, o) {

    var editor = TE.ui.HTML || TE.ui,
        $ = editor(target, {
            auto_p: 0, // disable automatic paragraph feature from `TE.ui.HTML` by default
            advance_table: 0, // disable advance table feature from `TE.ui.HTML` by default
            tools: 'clear | b i u s | sub sup | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            union: [
                [
                    ['\\u005B', '\\u005D'],
                    ['\\u003D', '\\u0022', '\\u0022', '\\u0020|\\u003D']
                ],
                [
                    ['\u005B', '\u005D']
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

        ui = $.ui, k,

        _ = $._,
        _dom_get = _.dom.get,
        _esc = _.x,
        _extend = _.extend,
        _events_fire = _.events.fire,
        _hooks_set = _.hooks.set,
        _pattern = _.pattern,
        _replace = _.replace,
        _trim = _.trim,

        esc_unit = $.config.union[0][0],
        esc_data = $.config.union[0][1];

    $.update(o, 0);

    // define editor type
    $.type = 'BBCode';

    function get_o(s) {
        return s.split(_pattern('(' + esc_data[3] + ')+'))[0];
    }

    function force_i(s) {
        return _trim(s.replace(/\s+/g, ' '));
    }

    function attr_title(s) {
        return _replace(force_i(s), [/(<.*?>)|(\[.*?\])/g, '"', "'", '(', ')', '[', ']'], ["", '&#34;', '&#39;', '&#40;', '&#41;', '&#91;', '&#93;']);
    }

    function attr_url(s) {
        return _replace(force_i(s), [/(<.*?>)|(\[.*?\])/g, /\s/g, '"', '(', ')', '[', ']'], ["", '%20', '%22', '%28', '%29', '%5B', '%5D']);
    }

    var config = $.config,

        formats = config.formats,
        languages = config.languages,
        states = config.states,
        tab = config.tab,

        placeholders = languages.placeholders;

    _extend(ui.tools, {
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
                return ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    $.format(a + '=' + attr_url(v));
                }, 0, 0, 'a[href]').record(), false;
            }
        },
        img: {
            click: function(e, $) {
                var img = formats.img,
                    i18n = languages.modals.img;
                if (!$.$().length) {
                    return ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                        $[0]().format(img).insert(attr_url(v))[1]();
                    }, 0, 0, 'img[src]').record(), false;
                }
                return $.format(img), false;
            }
        },
        abbr: 0,
        p: {
            click: function(e, $) {
                if ($.$().length) {
                    return $.tidy('\n\n').replace(/([\t ]*\n[\t ]*){2,}/g, '\n\n').scroll(2), false;
                }
                return $.tidy('\n\n').insert(placeholders[""]).scroll(2), false;
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
                function enc(a) {
                    return x ? _replace(a, ['&', '<', '>'], ['&amp;', '&lt;', '&gt;']) : a;
                }
                function dec(a) {
                    return x ? _replace(a, ['&amp;', '&lt;', '&gt;'], ['&', '<', '>']) : a;
                }
                return $[0]().format(code, 0, '\n\n', '\n').replace(/^[\s\S]*?$/, function(a) {
                    return _pattern('^\\s*' + esc_unit[0] + esc_unit[2] + _esc(code_o) + esc_unit[1]).test($.$().after) ? enc(a) : dec(a);
                })[1](), false;
            }
        }
    });

    // table caption is not supported in **BBCode** so we have to remove that "add caption" modal prompt here
    _hooks_set('enter.modal.prompt:table>caption', function($) {
        if (!formats.caption && (k = _dom_get('[name=y]', ui.el.modal)[0])) {
            _events_fire("click", k); // force to click the submit button
        }
    });

    return $.update({}, 0);

};