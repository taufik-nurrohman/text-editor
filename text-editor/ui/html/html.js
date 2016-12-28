/*!
 * ==========================================================
 *  HTML TEXT EDITOR PLUGIN 1.5.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.ui.HTML = function(target, o) {

    var _u2013 = '\u2013', // N-dash
        _u2026 = '\u2026', // horizontal ellipsis
        _u2191 = '\u2191', // upwards arrow
        _u2193 = '\u2193', // downwards arrow
        _u21B5 = '\u21B5', // carriage return arrow
        _u2318 = '\u2318', // command sign
        _u2718 = '\u2718', // delete sign
        _u21E7 = '\u21E7', // shift sign

        $ = TE.ui(target, {
            auto_encode_html: 1,
            auto_p: 1,
            tools: 'clear | b i u s | sub sup | abbr | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            states: {
                tr: [1, 10], // minimum and maximum table row(s)
                td: [1, 10], // minimum and maximum table column(s)
                a: {},
                img: {},
                abbr: {}
            },
            languages: {
                tools: {
                    clear: ['Clear Format', _u2718],
                    b: ['Bold', _u2318 + '+B'],
                    i: ['Italic', _u2318 + '+I'],
                    u: ['Underline',  _u2318 + '+U'],
                    s: ['Strike',  _u2318 + '+' + _u2718],
                    a: ['Link',  _u2318 + '+L'],
                    img: ['Image',  _u2318 + '+G'],
                    sub: ['Subscript',  _u2318 + '+' + _u2193],
                    sup: ['Superscript',  _u2318 + '+' + _u2191],
                    abbr: ['Abbreviation',  _u2318 + '+' + _u21E7 + '+?'],
                    p: ['Paragraph',  _u2318 + '+' + _u21B5],
                    br: ['Line Break',  _u21E7 + '+' + _u21B5],
                    'p,h1,h2,h3,h4,h5,h6': ['H1 ' + _u2013 + ' H6',  _u2318 + '+H'],
                    'blockquote,q': ['Quote',  _u2318 + '+Q'],
                    'pre,code': ['Code',  _u2318 + '+K'],
                    ul: ['Unordered List',  _u2318 + '+-'],
                    ol: ['Ordered List',  _u2318 + '++'],
                    table: ['Table',  _u2318 + '+T'],
                    hr: ['Horizontal Rule',  _u2318 + '+R']
                },
                modals: {
                    a: {
                        title: ['Link URL', 'Link Title'],
                        placeholder: ['http://', 'link title here' + _u2026]
                    },
                    img: {
                        title: ['Image URL', 'Image Title', 'Image Caption'],
                        placeholder: ['http://', 'image title here' + _u2026, 'image caption here' + _u2026]
                    },
                    abbr: {
                        title: 'Abbreviation',
                        placeholder: 'meaning here' + _u2026
                    },
                    table: {
                        title: ['Number of Columns', 'Number of Rows', 'Table Caption'],
                        placeholder: ['3', '3', 'table caption here' + _u2026]
                    }
                },
                placeholders: {
                    table: ['Table Head %1.%2', 'Table Data %1.%2', 'Table Foot %1.%2']
                }
            },
            advance_a: 1, // detect external URL and automatically adds `rel="nofollow" target="_blank"` attribute to the link markup
            advance_img: 1, // insert image with a `<figure>` element if title field is defined
            advance_table: 1, // include `<thead>`, `<tbody>` and `<tfoot>` markup
            formats: {
                b: 'strong',
                i: 'em',
                u: 'u',
                s: 'del datetime="%1-%2-%3"',
                a: 'a',
                figure: 'figure',
                figcaption: 'figcaption',
                img: 'img',
                sub: 'sub',
                sup: 'sup',
                abbr: 'abbr',
                p: 'p',
                br: 'br',
                h1: 'h1',
                h2: 'h2',
                h3: 'h3',
                h4: 'h4',
                h5: 'h5',
                h6: 'h6',
                blockquote: 'blockquote',
                q: 'q',
                pre: 'pre',
                code: 'code',
                ul: 'ul',
                ol: 'ol',
                li: 'li',
                table: 'table border="1"',
                caption: 'caption',
                thead: 'thead',
                tbody: 'tbody',
                tfoot: 'tfoot',
                tr: 'tr',
                th: 'th',
                td: 'td',
                hr: 'hr'
            }
        }),

        _ = $._,
        _edge = _.edge,
        _esc = _.x,
        _extend = _.extend,
        _int = _.i,
        _pattern = _.pattern,
        _trim = _.trim,
        _format = _.format,
        _replace = _.replace,

        config = _extend($.config, o);

    var ui = $.ui,
        auto_p = config.auto_p,
        classes = config.classes,
        formats = config.formats,
        languages = config.languages,
        states = config.states,
        suffix = config.suffix,
        tab = config.tab,

        unit = config.union[1][0],
        data = config.union[1][1],

        esc_unit = config.union[0][0],
        esc_data = config.union[0][1],

        attrs = '(?:' + esc_data[3] + '[^' + esc_unit[0] + esc_unit[1] + ']*?)?',
        attrs_capture = '(|' + esc_data[3] + '[^' + esc_unit[0] + esc_unit[1] + ']*?)',
        content = '([\\s\\S]*?)',

        placeholders = languages.placeholders,
        tree_parent, dent;

    // define editor type
    $.type = 'HTML';

    function get_o(s) {
        return s.split(_pattern('(' + esc_data[3] + ')+'))[0];
    }

    function get_indent(s) {
        dent = s.match(/(?:^|\n)([\t ]*).*$/);
        return (dent && dent[1]) || "";
    }

    function tree(e, parent, child) {
        var s = $.$(),
            v = s.value,
            before = s.before,
            ul = formats[parent] || parent,
            li = formats[child] || child,
            ul_o = get_o(ul),
            li_o = get_o(li),
            dent = get_indent(before),
            placeholder = placeholders[""], match;
        tree_parent = ul;
        $[0]();
        if (!v || v === placeholder) {
            if (match = before.match(_pattern('(?:^|\\n)[\\t ]+' + esc_unit[0] + '(' + esc_unit[2] + '?)(?:' + _esc(get_o(formats.ul)) + '|' + _esc(get_o(formats.ol)) + ')' + attrs + esc_unit[1] + '\\s*$'))) {
                $.insert('\n' + dent + (match[1] ? "" : tab), 0);
            } else if (match = before.match(_pattern(esc_unit[0] + _esc(li_o) + attrs_capture + esc_unit[1] + '.*?$'))) {
                if (_pattern(esc_unit[0] + esc_unit[2] + _esc(li_o) + esc_unit[1] + '\\s*$').test(before)) {
                    $.tidy('\n' + dent, false).insert(placeholder).wrap(unit[0] + li_o + match[1] + unit[1], unit[0] + unit[2] + li_o + unit[1]);
                } else {
                    if (!_pattern(esc_unit[1] + '\\s*$').test(before)) {
                        $.insert(unit[0] + unit[2] + li_o + unit[1] + '\n' + dent + unit[0] + li_o + match[1] + unit[1], 0).insert(placeholder).scroll(1);
                    } else {
                        $.insert(placeholder).wrap('\n' + dent + tab + unit[0] + ul + unit[1] + '\n' + dent + tab + tab + unit[0] + li_o + match[1] + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + dent + tab + unit[0] + unit[2] + ul_o + unit[1] + '\n' + dent).scroll(2);
                    }
                }
            } else {
                if (_pattern(esc_unit[0] + esc_unit[2] + _esc(li_o) + esc_unit[1] + '\\s*$').test(before)) {
                    $.insert(placeholder).wrap('\n' + dent + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1]);
                } else {
                    $.tidy('\n\n').insert(placeholder).wrap(unit[0] + ul + unit[1] + '\n' + tab + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + unit[0] + unit[2] + ul_o + unit[1]);
                }
            }
        } else {
            $.tidy('\n\n', "")
                .replace(/[\t ]*\n[\t ]*/g, unit[0] + unit[2] + li_o + unit[1] + '\n' + tab + unit[0] + li + unit[1])
                .wrap(unit[0] + ul + unit[1] + '\n' + tab + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + unit[0] + unit[2] + ul_o + unit[1] + '\n\n', 1)
                .replace(_pattern('\\n' + _esc(tab) + esc_unit[0] + _esc(li) + esc_unit[1] + '\\s*' + esc_unit[0] + esc_unit[2] + _esc(li_o) + esc_unit[1] + '\\n', 'g'), '\n' + unit[0] + unit[2] + ul_o + unit[1] + '\n\n' + unit[0] + ul + unit[1] + '\n')
                .select($.$().end);
            if (auto_p) {
                ui.tools.p.click(e, $);
            }
        }
        return $[1](), false;
    }

    function auto_p_(e, $) {
        if (!$.get(0) && auto_p) {
            ui.tools.p.click(e, $);
        }
        return $;
    }

    function force_i(s) {
        return _trim(s.replace(/\s+/g, ' '));
    }

    function attr_title(s) {
        return _replace(force_i(s), [_pattern(esc_unit[0] + '.*?' + esc_unit[1], 'g'), '"', "'"], ["", '&#34;', '&#39;']);
    }

    function attr_url(s) {
        return _replace(force_i(s), [_pattern(esc_unit[0] + '.*?' + esc_unit[1], 'g'), /\s/g, '"'], ["", '%20', '%22']);
    }

    _extend(ui.tools, {
        clear: {
            i: 'remove-format',
            click: function(e, $) {
                var s = $[0]().$(),
                    b = s.before,
                    a = s.after,
                    v = s.value, w,
                    tag_any = esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1],
                    tag_open = esc_unit[0] + '[^' + esc_unit[2] + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1],
                    tag_close = esc_unit[0] + esc_unit[2] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1];
                if (!v && a && (w = _pattern('^' + tag_any)).test(a)) {
                    return $.replace(w, "", 1), false;
                } else if (!_pattern(tag_any).test(v) && (b.slice(-1) !== unit[1] && a[0] !== unit[0])) {
                    $.insert("");
                } else {
                    $.replace(_pattern(tag_any, 'g'), "").unwrap(_pattern(tag_open), _pattern(tag_close));
                }
                return $[1](), !!a;
            }
        },
        b: {
            i: 'bold',
            click: function(e, $) {
                return auto_p_(e, $).i().format(formats.b), false;
            }
        },
        i: {
            i: 'italic',
            click: function(e, $) {
                return auto_p_(e, $).i().format(formats.i), false;
            }
        },
        u: {
            i: 'underline',
            click: function(e, $) {
                return auto_p_(e, $).i().format(formats.u), false;
            }
        },
        s: {
            i: 'strike',
            click: function(e, $) {
                return auto_p_(e, $).i().format(_format(formats.s, $._.time())), false;
            }
        },
        a: {
            i: 'link',
            click: function(e, $) {
                var a = formats.a,
                    i18n = languages.modals.a,
                    href, title;
                return ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    href = v;
                    // automatic `rel="nofollow"` attribute
                    var host = location.host,
                        x, extra;
                    if (href.indexOf('://') !== -1) x = 1;
                    if (host !== "" && href.indexOf('://' + host) !== -1) x = 0;
                    if (/^([.\/?&#]|javascript:)/.test(href)) x = 0;
                    ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = attr_title(v);
                        if (!auto_p_(e, $).$().length) {
                            $.insert(placeholders[""]);
                        }
                        extra = config.advance_a && x ? data[3] + 'rel' + data[0] + data[1] + 'nofollow' + data[2] + data[3] + 'target' + data[0] + data[1] + '_blank' + data[2] : "";
                        $.i().format(a + data[3] + 'href' + data[0] + data[1] + href + data[2] + (title ? data[3] + 'title' + data[0] + data[1] + title + data[2] : "") + extra);
                    }, 0, 0, 'a[title]');
                }, 0, 0, 'a[href]').record(), false;
            }
        },
        img: {
            i: 'image',
            click: function(e, $) {
                var s = $.$(),
                    img = formats.img,
                    figure = formats.figure,
                    figcaption = formats.figcaption,
                    alt = s.value,
                    i18n = languages.modals.img,
                    advance = config.advance_img,
                    src, title;
                return ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    src = v;
                    ui.prompt(i18n.title[advance ? 2 : 1], i18n.placeholder[advance ? 2 : 1], 0, function(e, $, v) {
                        title = attr_title(v);
                        if (!alt) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        alt = attr_title(alt);
                        $[0]();
                        if (advance && title) {
                            $.tidy('\n\n', "").insert(unit[0] + figure + unit[1] + '\n' + tab + unit[0] + img + data[3] + 'alt' + data[0] + data[1] + alt + data[2] + data[3] + 'src' + data[0] + data[1] + src + data[2] + suffix + '\n' + tab + unit[0] + figcaption + unit[1] + title + unit[0] + unit[2] + get_o(figcaption) + unit[1] + '\n' + unit[0] + unit[2] + get_o(figure) + unit[1] + '\n\n', 0, 1);
                            if (auto_p) {
                                ui.tools.p.click(e, $);
                            }
                        } else {
                            auto_p_(e, $).tidy(_pattern(esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + esc_unit[2] + ']+?' + esc_unit[1] + '\\s*$').test($.$().before) ? "" : ' ', "").insert(unit[0] + img + data[3] + 'alt' + data[0] + data[1] + alt + data[2] + data[3] + 'src' + data[0] + data[1] + src + data[2] + (title ? data[3] + 'title' + data[0] + data[1] + title + data[2] : "") + suffix + ' ', 0, 1);
                        }
                        $[1]();
                    }, 0, 0, 'img[title]');
                }, 0, 0, 'img[src]'), false;
            }
        },
        sub: {
            i: 'subscript',
            click: function(e, $) {
                var sub = formats.sub,
                    sup = formats.sup,
                    sup_o = get_o(sup);
                return auto_p_(e, $)[0]()
                    .unwrap(_pattern(esc_unit[0] + _esc(sup_o) + attrs + esc_unit[1]), unit[0] + unit[2] + sup_o + unit[1])
                    .i()
                    .format(sub)
                [1](), false;
            }
        },
        sup: {
            i: 'superscript',
            click: function(e, $) {
                var sub = formats.sub,
                    sup = formats.sup,
                    sub_o = get_o(sub);
                return auto_p_(e, $)[0]()
                    .unwrap(_pattern(esc_unit[0] + _esc(sub_o) + attrs + esc_unit[1]), unit[0] + unit[2] + sub_o + unit[1])
                    .i()
                    .format(sup)
                [1](), false;
            }
        },
        abbr: {
            i: 'abbreviation',
            click: function(e, $) {
                var s = $.$(),
                    x = _trim(s.value),
                    i18n = languages.modals.abbr,
                    g = $.get(),
                    abbr_content = _trim(x || placeholders[""]),
                    abbr = formats.abbr,
                    abbr_o = get_o(abbr),
                    abbr_begin = esc_unit[0] + _esc(abbr) + attrs_capture + esc_unit[1],
                    abbr_begin_alt = esc_unit[0] + _esc(abbr) + attrs + esc_unit[1],
                    abbr_end = esc_unit[0] + esc_unit[2] + _esc(abbr_o) + esc_unit[1],
                    abbr_html = _pattern(abbr_begin + content + abbr_end), state, i;
                g.replace(abbr_html, function(a, b, c) {
                    if (c = _trim(c)) states.abbr[c] = (b.match(_pattern(esc_data[3] + '+title' + esc_data[0] + esc_data[1] + '\\s*(.*?)\\s*' + esc_data[2])) || ["", ""])[1];
                });
                state = states.abbr;
                if (x && state[x]) {
                    return $.i().format(abbr + data[3] + 'title' + data[0] + data[1] + state[x] + data[2]), false;
                }
                return ui.prompt(i18n.title, state[abbr_content] || i18n.placeholder, !state[x], function(e, $, v, w) {
                    v = attr_title(v || w);
                    $[0]();
                    if (!x) {
                        $.insert(v.replace(/[^a-z\d]/gi, ' ').replace(/([a-z\d])[^ ]* */gi, '$1').toUpperCase()); // automatic abbreviation ...
                    }
                    // find object key by value
                    for (i in state) {
                        if (attr_title(state[i]) === v) {
                            $.insert(i);
                            break;
                        }
                    }
                    auto_p_(e, $).unwrap(_pattern(abbr_begin_alt), _pattern(abbr_end)).unwrap(_pattern(abbr_begin_alt), _pattern(abbr_end), 1).i().format(abbr + data[3] + 'title' + data[0] + data[1] + v + data[2])[1]();
                }, 0, 0, 'abbr[title]').record(), false;
            }
        },
        p: {
            i: 'paragraph',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    p = formats.p,
                    br = formats.br,
                    p_o = get_o(p),
                    br_o = get_o(br),
                    before = s.before,
                    after = s.after,
                    dent = get_indent(before),
                    placeholder = placeholders[""], match;
                $[0]();
                if (!v || v.indexOf('\n') === -1) {
                    if (_pattern('^\\s*' + esc_unit[0] + esc_unit[2] + _esc(p_o) + esc_unit[1]).test(after)) {
                        if (_pattern(esc_unit[0] + _esc(p_o) + attrs + esc_unit[1] + '\\s*$').test(before)) {
                            $.unwrap(_pattern('\\s*' + esc_unit[0] + _esc(p_o) + attrs + esc_unit[1] + '\\s*'), _pattern('\\s*' + esc_unit[0] + esc_unit[2] + _esc(p_o) + esc_unit[1])).replace(placeholder, "").tidy('\n', '\n' + dent);
                        } else if (match = before.match(_pattern(esc_unit[0] + _esc(p_o) + attrs_capture + esc_unit[1] + '.*?$'))) {
                            $.wrap(unit[0] + unit[2] + p_o + unit[1] + '\n' + dent + unit[0] + p_o + match[1] + unit[1], "").insert(placeholder).scroll(1);
                        }
                    } else {
                        $.tidy('\n\n').format(p, 0, '\n\n').scroll(1);
                    }
                } else {
                    var para = _pattern('^(?:\\s*' + esc_unit[0] + _esc(p_o) + attrs + esc_unit[1] + '\\s*)+' + content + '(?:\\s*' + esc_unit[0] + esc_unit[2] + _esc(p_o) + esc_unit[1] + '\\s*)+$');
                    if (para.test(v)) {
                        $.replace(para, '$1')
                            .replace(_pattern('\\s*' + esc_unit[0] + esc_unit[2] + _esc(p_o) + esc_unit[1] + '\\s*' + esc_unit[0] + _esc(p_o) + attrs + esc_unit[1] + '\\s*', 'g'), '\n\n')
                            .replace(_pattern('\\s*' + esc_unit[0] + _esc(br_o) + attrs + esc_unit[1] + '\\s*', 'g'), '\n');
                    } else {
                        $.replace(/\n/g, '\n' + unit[0] + br + suffix + '\n')
                            .replace(_pattern('(\\s*' + esc_unit[0] + _esc(br_o) + attrs + suffix + '\\s*){2,}', 'g'), unit[0] + unit[2] + p_o + unit[1] + '\n' + unit[0] + p + unit[1])
                            .wrap(unit[0] + p + unit[1], unit[0] + unit[2] + p_o + unit[1], 1)
                            .replace(_pattern('(' + esc_unit[0] + _esc(p_o) + attrs + esc_unit[1] + ')+', 'g'), '$1')
                            .replace(_pattern('(' + esc_unit[0] + esc_unit[2] + _esc(p_o) + esc_unit[1] + ')+', 'g'), '$1')
                            .tidy('\n');
                    }
                }
                return $[1](), false;
            }
        },
        br: {
            i: 'break',
            click: function(e, $) {
                dent = get_indent($.$().before);
                return $.tidy('\n', "").insert(dent + unit[0] + formats.br + suffix + '\n', 0).scroll(1), false;
            }
        },
        'p,h1,h2,h3,h4,h5,h6': {
            i: 'headers',
            click: function(e, $) {
                var s = $.$(),
                    H = [
                        formats.p,
                        formats.h1,
                        formats.h2,
                        formats.h3,
                        formats.h4,
                        formats.h5,
                        formats.h6
                    ],
                    H_o = [], i, attr;
                for (i in H) {
                    H_o[i] = get_o(H[i]);
                }
                var tags = _esc(H).join('|'),
                    tags_o = _esc(H_o).join('|'),
                    o = '\\s*' + esc_unit[0] + '(' + tags_o + ')' + attrs_capture + esc_unit[1] + '\\s*',
                    w_o = _pattern('\\s*' + esc_unit[0] + '(?:' + tags_o + ')' + attrs + esc_unit[1] + '\\s*'),
                    w_c = _pattern('\\s*' + esc_unit[0] + esc_unit[2] + '(?:' + tags_o + ')' + esc_unit[1] + '\\s*'),
                    match = s.value.match(_pattern('^' + o));
                if (!match) {
                    match = s.before.match(_pattern(o + '$')) || [];
                }
                attr = match[2] || "";
                i = +((match[1] || 'h0').slice(1));
                return $[0]()
                    .unwrap(w_o, w_c)
                    .unwrap(w_o, w_c, 1)
                    .i()
                    .tidy('\n\n')
                    .format(i > 5 ? H_o[0] + attr : H_o[i + 1] + attr, 0, '\n\n')
                [1](), false;
            }
        },
        'blockquote,q': {
            i: 'quote',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    blockquote = formats.blockquote,
                    q = formats.q,
                    p = formats.p,
                    p_o = get_o(p),
                    esc_p_o = _esc(p_o),
                    has_p = _pattern(esc_unit[0] + esc_unit[2] + esc_p_o + esc_unit[1]),
                    placeholder = placeholders[""], start;
                // block
                if (/(^|\n)$/.test(s.before)) {
                    if (auto_p && !has_p.test(v)) {
                        ui.tools.p.click(e, $);
                    }
                    s = $.$();
                    v = s.value;
                    if (!has_p.test(v) && auto_p) { // `<p>`s are outside the selection
                        $.select(s.start - (unit[0] + p + unit[1]).length, s.end + (unit[0] + unit[2] + p_o + unit[1]).length); // include `<p>` to selection
                    }
                    if (v === placeholder || !auto_p) {
                        $[0]().format(blockquote, 0, '\n\n', '\n').loss().replace(_pattern('^(\\s*' + esc_unit[0] + ')', 'gm'), tab + '$1');
                        if (auto_p) {
                            s = $.$();
                            start = s.start + (unit[0] + p + unit[1] + tab).length;
                            $.select(start, start + placeholder.length); // exclude `<p>` from selection
                        }
                    } else {
                        $[0]().tidy('\n\n').insert(unit[0] + blockquote + unit[1] + '\n' + $.$().value.replace(_pattern('^(\\s*' + esc_unit[0] + ')', 'gm'), tab + '$1') + '\n' + unit[0] + unit[2] + get_o(blockquote) + unit[1] + '\n\n', 0, 1);
                        if (auto_p) {
                            ui.tools.p.click(e, $);
                        }
                    }
                    $[1]();
                // span
                } else {
                    $.i().format(q);
                }
                return false;
            }
        },
        'pre,code': {
            i: 'code',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    x = config.auto_encode_html,
                    pre = formats.pre,
                    code = formats.code,
                    pre_o = get_o(pre),
                    code_o = get_o(code),
                    B = esc_unit[0] + _esc(pre_o) + attrs + esc_unit[1] + '\\s*' + esc_unit[0] + _esc(code_o) + attrs + esc_unit[1] + '\\s*',
                    A = '\\s*' + esc_unit[0] + esc_unit[2] + _esc(code_o) + esc_unit[1] + '\\s*' + esc_unit[0] + esc_unit[2] + _esc(pre_o) + esc_unit[1],
                    before = _pattern(B + '\\s*$'),
                    after = _pattern('^\\s*' + A),
                    any = _pattern('^' + content + '$');
                function enc(a) {
                    return x ? _replace(a, ['&', '<', '>'], ['&amp;', '&lt;', '&gt;']) : a;
                }
                function dec(a) {
                    return x ? _replace(a, ['&amp;', '&lt;', '&gt;'], ['&', '<', '>']) : a;
                }
                // block
                if (_pattern('(^|\\n|' + B + ')$').test(s.before)) {
                    if (before.test(s.before) && after.test(s.after)) {
                        $[0]().unwrap(_pattern(before), _pattern(after)).replace(any, dec)[1]();
                    } else {
                        $[0]().tidy('\n\n').wrap(unit[0] + pre + unit[1] + unit[0] + code + unit[1], unit[0] + unit[2] + code_o + unit[1] + unit[0] + unit[2] + pre_o + unit[1]).insert(v || placeholders[""]).replace(any, enc)[1]();
                    }
                // span
                } else {
                    $[0]().format(code).replace(any, function(a) {
                        return force_i(_pattern('^\\s*' + esc_unit[0] + esc_unit[2] + _esc(code_o) + esc_unit[1]).test($.$().after) ? enc(a) : dec(a));
                    })[1]();
                }
                return false;
            }
        },
        ul: {
            i: 'list-bullet',
            click: function(e, $) {
                var ol = formats.ol,
                    ul = formats.ul,
                    ol_o = get_o(ol),
                    ul_o = get_o(ul),
                    s = '(' + _esc(ul_o) + '|' + _esc(ol_o) + ')';
                if ($.match(_pattern(esc_unit[0] + s + attrs + esc_unit[1] + content + esc_unit[0] + esc_unit[2] + s + esc_unit[1]))) {
                    $[0]()
                        .replace(_pattern(esc_unit[0] + _esc(ol_o) + attrs_capture + esc_unit[1], 'g'), unit[0] + ul_o + '$1' + unit[1])
                        .replace(_pattern(esc_unit[0] + esc_unit[2] + _esc(ol_o) + esc_unit[1], 'g'), unit[0] + unit[2] + ul_o + unit[1])
                    [1]();
                } else {
                    tree(e, ul, formats.li);
                }
                return false;
            }
        },
        ol: {
            i: 'list-number',
            click: function(e, $) {
                var ol = formats.ol,
                    ul = formats.ul,
                    ol_o = get_o(ol),
                    ul_o = get_o(ul),
                    s = '(' + _esc(ul_o) + '|' + _esc(ol_o) + ')';
                if ($.match(_pattern(esc_unit[0] + s + attrs + esc_unit[1] + content + esc_unit[0] + esc_unit[2] + s + esc_unit[1]))) {
                    $[0]()
                        .replace(_pattern(esc_unit[0] + _esc(ul_o) + attrs_capture + esc_unit[1], 'g'), unit[0] + ol_o + '$1' + unit[1])
                        .replace(_pattern(esc_unit[0] + esc_unit[2] + _esc(ul_o) + esc_unit[1], 'g'), unit[0] + unit[2] + ol_o + unit[1])
                    [1]();
                } else {
                    tree(e, ol, formats.li);
                }
                return false;
            }
        },
        table: function(e, $) {
            var str = states.tr,
                std = states.td,
                i18n = languages.modals.table,
                p = languages.placeholders.table,
                q = _trim(_format(p[0], [1, 1])),
                advance = config.advance_table ? tab : "",
                table = formats.table,
                caption = formats.caption,
                thead = formats.thead,
                tbody = formats.tbody,
                tfoot = formats.tfoot,
                tr = formats.tr,
                th = formats.th,
                td = formats.td,
                table_o = get_o(table),
                caption_o = get_o(caption),
                thead_o = get_o(thead),
                tbody_o = get_o(tbody),
                tfoot_o = get_o(tfoot),
                tr_o = get_o(tr),
                th_o = get_o(th),
                td_o = get_o(td),
                o = [], s, c, r, title;
            if ($[0]().$().value === q) return $.select(), false;
            return ui.prompt(i18n.title[0], i18n.placeholder[0], 0, function(e, $, v, w) {
                c = _edge(_int(v) || w, std[0], std[1]);
                ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v, w) {
                    r = _edge(_int(v) || w, str[0], str[1]);
                    ui.prompt(i18n.title[2], i18n.placeholder[2], 0, function(e, $, v) {
                        var tfoot_html = "",
                            i, j, k, l, m, n;
                        title = force_i(v);
                        for (i = 0; i < r; ++i) {
                            s = advance + tab + unit[0] + tr + unit[1] + '\n';
                            for (j = 0; j < c; ++j) {
                                s += advance + tab + tab + unit[0] + td + unit[1] + _trim(_format(p[1], [i + 1, j + 1])) + unit[0] + unit[2] + td_o + unit[1] + '\n';
                            }
                            s += advance + tab + unit[0] + unit[2] + tr_o + unit[1];
                            o.push(s);
                        }
                        o = o.join('\n');
                        s = tab + (advance ? unit[0] + thead + unit[1] + '\n' + tab + tab + unit[0] + tr + unit[1] : unit[0] + tr_o + unit[1]) + '\n';
                        for (k = 0; k < c; ++k) {
                            s += advance + tab + tab + unit[0] + th + unit[1] + _trim(_format(p[0], [1, k + 1])) + unit[0] + unit[2] + th_o + unit[1] + '\n';
                        }
                        if (advance) {
                            tfoot_html += tab + unit[0] + tfoot + unit[1] + '\n';
                            tfoot_html += tab + tab + unit[0] + tr + unit[1] + '\n';
                            for (k = 0; k < c; ++k) {
                                tfoot_html += tab + tab + tab + unit[0] + td + unit[1] + _trim(_format(p[2], [1, k + 1])) + unit[0] + unit[2] + td_o + unit[1] + '\n';
                            }
                            tfoot_html += tab + tab + unit[0] + unit[2] + tr + unit[1] + '\n';
                            tfoot_html += tab + unit[0] + unit[2] + tfoot_o + unit[1] + '\n';
                        }
                        s += advance + tab + unit[0] + unit[2] + tr_o + unit[1] + (advance ? '\n' + tab + unit[0] + unit[2] + thead_o + unit[1] + '\n' + tfoot_html + tab + unit[0] + tbody + unit[1] : "") + '\n';
                        o = s + o + (advance ? '\n' + tab + unit[0] + unit[2] + tbody_o + unit[1] : "") + '\n';
                        $.tidy('\n\n').insert(unit[0] + table + unit[1] + '\n' + (title && caption ? tab + unit[0] + caption + unit[1] + title + unit[0] + unit[2] + caption_o + unit[1] + '\n' : "") + o + unit[0] + unit[2] + table_o + unit[1]);
                        m = $.$();
                        n = m.start + m.value.indexOf(q);
                        $.select(n, n + q.length)[1]();
                    }, 0, 0, 'table>caption');
                }, 0, 0, 'table>tr');
            }, 0, 0, 'table>td'), false;
        },
        hr: {
            i: 'horizontal-rule',
            click: function(e, $) {
                dent = get_indent($.$().before);
                return $.tidy('\n\n', "").insert(dent + unit[0] + formats.hr + suffix + '\n\n', 0), false;
            }
        }
    });

    if (config.keys) {
        _extend(ui.keys, {
            'delete': 'clear',
            'control+delete': 's',
            'control+b': 'b',
            'control+i': 'i',
            'control+u': 'u',
            'control+l': 'a',
            'control+g': 'img',
            'control+down': 'sub',
            'control+up': 'sup',
            'control+shift+?': 'abbr',
            'control+enter': 'p',
            'shift+enter': 'br',
            'enter': function(e, $) {
                var s = $.$(),
                    v = s.value,
                    w = $.get(),
                    p = formats.p,
                    li = formats.li,
                    p_o = get_o(p),
                    li_o = get_o(li),
                    dent = get_indent(s.before),
                    placeholder = placeholders[""],
                    tools = ui.tools,
                    match, m, n;
                if (!v || v === placeholder) {
                    if (match = s.after.match(_pattern('^\\s*' + esc_unit[0] + esc_unit[2] + '(' + _esc(p_o) + '|' + _esc(li_o) + ')' + esc_unit[1]))) {
                        m = match[1];
                        (tools[m === li_o ? tree_parent : m] || tools.ul).click(e, $);
                    } else if (auto_p && p && _trim(w) && s.end === w.length && _pattern('^\\s*[^' + esc_unit[0] + '\\n]*?[^' + esc_unit[1] + ']\\s*$').test(w)) {
                        w = unit[0] + p + unit[1] + w + unit[0] + unit[2] + p_o + unit[1] + '\n' + unit[0] + p + unit[1];
                        n = placeholder + unit[0] + unit[2] + p_o + unit[1];
                        $.set(w + n).select(w.length, (w + placeholder).length);
                    } else {
                        return; // normal enter key ...
                    }
                    return false;
                }
            },
            'tab': function(e, $) {
                var s = $.$(),
                    li = formats.li,
                    li_o = get_o(li),
                    dent = get_indent(s.before);
                if (_pattern(esc_unit[0] + esc_unit[2] + _esc(li_o) + esc_unit[1]).test(s.after)) {
                    return $[0]().wrap('\n' + dent + tab + unit[0] + (formats[tree_parent] || tree_parent) + unit[1] + '\n' + dent + tab + tab + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + dent + tab + unit[0] + unit[2] + tree_parent + unit[1] + '\n' + dent).insert(placeholders[""])[1](), false;
                }
                return ui.tools.indent.click(e, $);
            },
            'back': function(e, $) {
                var s = $.$(),
                    v = s.value, tag,
                    before = s.before,
                    after = s.after,
                    end = esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1];
                if (!v && _pattern(end + '$').test(before)) {
                    tag = before.split(unit[0]).pop().match(_pattern('^([^' + esc_unit[2] + '\\s]+).*?' + esc_unit[1] + '\\s*$'));
                    tag = (tag && tag[1]) || 0;
                    if (tag && _pattern('^\\s*' + esc_unit[0] + esc_unit[2] + _esc(tag) + esc_unit[1]).test(after)) {
                        $.unwrap(_pattern(esc_unit[0] + _esc(tag) + attrs + esc_unit[1]), _pattern('\\s*' + esc_unit[0] + esc_unit[2] + _esc(tag) + esc_unit[1]));
                    } else {
                        $.outdent(_pattern(end));
                    }
                    return false;
                }
            },
            'control+h': 'p,h1,h2,h3,h4,h5,h6',
            'control+q': 'blockquote,q',
            'control+k': 'pre,code',
            'control+-': 'ul',
            'control++': 'ol',
            'control+=': 'ol', // alias for `control++`
            'control+shift++': 'ol', // alias for `control++`
            'control+t': 'table',
            'control+r': 'hr'
        });
    }

    return $.update(o, 0);

};