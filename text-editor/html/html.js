/*!
 * ==========================================================
 *  HTML TEXT EDITOR PLUGIN 1.2.4
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.HTML = function(target, o) {

    var _u2013 = '\u2013', // N-dash
        _u2026 = '\u2026', // horizontal ellipsis
        _u2191 = '\u2191', // upwards arrow
        _u2193 = '\u2193', // downwards arrow
        _u21B5 = '\u21B5', // carriage return arrow
        _u2318 = '\u2318', // command sign
        _u2718 = '\u2718', // delete sign
        _u21E7 = '\u21E7', // shift sign

        $ = new TE(target),
        _ = $._,
        extend = _.extend,
        each = _.each,
        esc = _.x,
        trim = _.trim,
        edge = _.edge,
        pattern = _.pattern,
        num = _.i,
        ui = $.ui(extend({
            auto_encode_html: 1,
            auto_p: 1,
            tools: 'clear | b i u s | sub sup | abbr | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            states: {
                tr: [1, 10], // minimum and maximum table row(s)
                td: [1, 10], // minimum and maximum table column(s)
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
        }, o)),
        format = _.format,
        replace = _.replace,
        config = $.config,
        states = config.states,
        languages = config.languages,
        formats = config.formats,
        classes = config.classes,
        tab = config.tab,
        unit = config.unit[0][0],
        data = config.unit[0][1],
        esc_unit = config.unit[1][0],
        esc_data = config.unit[1][1],
        suffix = config.suffix,
        attrs = '(?:' + esc_data[3] + '[^' + esc_unit[0] + esc_unit[1] + ']*?)?',
        attrs_capture = '(|' + esc_data[3] + '[^' + esc_unit[0] + esc_unit[1] + ']*?)',
        content = '([\\s\\S]*?)',
        placeholders = languages.placeholders,
        auto_p = config.auto_p,
        tree_parent;

    // define editor type
    $.type = 'HTML';

    function get_o(s) {
        return s.split(pattern('(' + esc_data[3] + ')+'))[0];
    }

    function get_indent(s) {
        var dent = s.match(/(?:^|\n)([\t ]*).*$/);
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
            if (match = before.match(pattern('(?:^|\\n)[\\t ]+' + esc_unit[0] + '(' + esc_unit[2] + '?)(?:' + esc(get_o(formats.ul)) + '|' + esc(get_o(formats.ol)) + ')' + attrs + esc_unit[1] + '\\s*$'))) {
                $.insert('\n' + dent + (match[1] ? "" : tab), 0);
            } else if (match = before.match(pattern(esc_unit[0] + esc(li_o) + attrs_capture + esc_unit[1] + '.*?$'))) {
                if (pattern(esc_unit[0] + esc_unit[2] + esc(li_o) + esc_unit[1] + '\\s*$').test(before)) {
                    $.tidy('\n' + dent, false).insert(placeholder).wrap(unit[0] + li_o + match[1] + unit[1], unit[0] + unit[2] + li_o + unit[1]);
                } else {
                    if (!pattern(esc_unit[1] + '\\s*$').test(before)) {
                        $.insert(unit[0] + unit[2] + li_o + unit[1] + '\n' + dent + unit[0] + li_o + match[1] + unit[1], 0).insert(placeholder);
                    } else {
                        $.insert(placeholder).wrap('\n' + dent + tab + unit[0] + ul + unit[1] + '\n' + dent + tab + tab + unit[0] + li_o + match[1] + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + dent + tab + unit[0] + unit[2] + ul_o + unit[1] + '\n' + dent);
                    }
                }
            } else {
                if (pattern(esc_unit[0] + esc_unit[2] + esc(li_o) + esc_unit[1] + '\\s*$').test(before)) {
                    $.insert(placeholder).wrap('\n' + dent + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1]);
                } else {
                    $.tidy('\n\n').insert(placeholder).wrap(unit[0] + ul + unit[1] + '\n' + tab + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + unit[0] + unit[2] + ul_o + unit[1]);
                }
            }
        } else {
            $.tidy('\n\n', "")
                .replace(/[\t ]*\n[\t ]*/g, unit[0] + unit[2] + li_o + unit[1] + '\n' + tab + unit[0] + li + unit[1])
                .wrap(unit[0] + ul + unit[1] + '\n' + tab + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + unit[0] + unit[2] + ul_o + unit[1] + '\n\n', 1)
                .replace(pattern('\\n' + esc(tab) + esc_unit[0] + esc(li) + esc_unit[1] + '\\s*' + esc_unit[0] + esc_unit[2] + esc(li_o) + esc_unit[1] + '\\n', 'g'), '\n' + unit[0] + unit[2] + ul_o + unit[1] + '\n\n' + unit[0] + ul + unit[1] + '\n')
                .select($.$().end);
            if (auto_p) {
                ui.tools.p.click(e, $);
            }
            return $[1](), false;
        }
    }

    function auto_p_(e, $) {
        if (!$.get(0) && auto_p) {
            ui.tools.p.click(e, $);
        }
        return $;
    }

    function force_i(s) {
        return trim(s.replace(/\s+/g, ' '));
    }

    function attr_title(s) {
        return replace(force_i(s), [pattern(esc_unit[0] + '.*?' + esc_unit[1], 'g'), '"', "'"], ["", '&#34;', '&#39;']);
    }

    function attr_url(s) {
        return replace(force_i(s), [pattern(esc_unit[0] + '.*?' + esc_unit[1], 'g'), /\s/g, '"'], ["", '%20', '%22']);
    }

    extend(ui.tools, {
        clear: {
            i: 'eraser',
            click: function(e, $) {
                var s = $[0]().$(),
                    b = s.before,
                    a = s.after,
                    v = s.value, w,
                    tag_any = esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1],
                    tag_open = esc_unit[0] + '[^' + esc_unit[2] + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1],
                    tag_close = esc_unit[0] + esc_unit[2] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1];
                if (!v && a && (w = pattern('^' + tag_any)).test(a)) {
                    return $.replace(w, "", 1), false;
                } else if (!pattern(tag_any).test(v) && (b.slice(-1) !== unit[1] && a[0] !== unit[0])) {
                    $.insert("");
                } else {
                    $.replace(pattern(tag_any, 'g'), "").unwrap(pattern(tag_open), pattern(tag_close));
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
            i: 'strikethrough',
            click: function(e, $) {
                return auto_p_(e, $).i().format(format(formats.s, $._.time())), false;
            }
        },
        a: {
            i: 'link',
            click: function(e, $) {
                var a = formats.a,
                    i18n = languages.modals.a,
                    href, title;
                return $.record().ui.prompt(['a[href]', i18n.title[0]], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    href = v;
                    // automatic `rel="nofollow"` attribute
                    var host = location.host,
                        x, extra;
                    if (href.indexOf('://') !== -1) x = 1;
                    if (host !== "" && href.indexOf('://' + host) !== -1) x = 0;
                    if (/^([.\/?&#]|javascript:)/.test(href)) x = 0;
                    ui.prompt(['a[title]', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v) {
                        title = attr_title(v);
                        if (!auto_p_(e, $).$().length) {
                            $.insert(placeholders[""]);
                        }
                        extra = config.advance_a && x ? format('%4rel%1%2nofollow%3%4target%1%2_blank%3', data) : "";
                        $.i().format(format(a + '%4href%1%2' + href + '%3', data) + (title ? format('%4title%1%2' + title + '%3', data) : "") + extra);
                    });
                }), false;
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
                return ui.prompt(['img[src]', i18n.title[0]], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    src = v;
                    ui.prompt(['img[title]', i18n.title[advance ? 2 : 1]], i18n.placeholder[advance ? 2 : 1], 0, function(e, $, v) {
                        title = attr_title(v);
                        if (!alt) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        alt = attr_title(alt);
                        $[0]();
                        if (advance && title) {
                            $.tidy('\n\n', "").insert(unit[0] + figure + unit[1] + '\n' + tab + unit[0] + img + format('%4alt%1%2' + alt + '%3%4src%1%2' + src + '%3', data) + suffix + '\n' + tab + unit[0] + figcaption + unit[1] + title + unit[0] + unit[2] + get_o(figcaption) + unit[1] + '\n' + unit[0] + unit[2] + get_o(figure) + unit[1] + '\n\n', 0, 1);
                            if (auto_p) {
                                ui.tools.p.click(e, $);
                            }
                        } else {
                            auto_p_(e, $).tidy(pattern(esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + esc_unit[2] + ']+?' + esc_unit[1] + '\\s*$').test($.$().before) ? "" : ' ', "").insert(unit[0] + img + format('%4alt%1%2' + alt + '%3%4src%1%2' + src + '%3', data) + (title ? format('%4title%1%2' + title + '%3', data) : "") + suffix + ' ', 0, 1);
                        }
                        $[1]();
                    });
                }), false;
            }
        },
        sub: {
            i: 'subscript',
            click: function(e, $) {
                var sub = formats.sub,
                    sup = formats.sup,
                    sup_o = get_o(sup);
                return auto_p_(e, $)[0]()
                    .unwrap(pattern(esc_unit[0] + esc(sup_o) + attrs + esc_unit[1]), unit[0] + unit[2] + sup_o + unit[1])
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
                    .unwrap(pattern(esc_unit[0] + esc(sub_o) + attrs + esc_unit[1]), unit[0] + unit[2] + sub_o + unit[1])
                    .i()
                    .format(sup)
                [1](), false;
            }
        },
        abbr: {
            i: 'question',
            click: function(e, $) {
                var s = $.$(),
                    x = trim(s.value),
                    i18n = languages.modals.abbr,
                    g = $.get(),
                    abbr_content = trim(x || placeholders[""]),
                    abbr = formats.abbr,
                    abbr_o = get_o(abbr),
                    abbr_begin = esc_unit[0] + esc(abbr) + attrs_capture + esc_unit[1],
                    abbr_begin_alt = esc_unit[0] + esc(abbr) + attrs + esc_unit[1],
                    abbr_end = esc_unit[0] + esc_unit[2] + esc(abbr_o) + esc_unit[1],
                    abbr_html = pattern(abbr_begin + content + abbr_end), state, i;
                g.replace(abbr_html, function(a, b, c) {
                    if (c = trim(c)) states.abbr[c] = (b.match(pattern(format('%4+title%1%2\\s*(.*?)\\s*%3', esc_data))) || ["", ""])[1];
                });
                state = states.abbr;
                if (x && state[x]) {
                    return $.i().format(abbr + format('%4title%1%2' + state[x] + '%3', data)), false;
                }
                return $.record().ui.prompt(['abbr[title]', i18n.title], state[abbr_content] || i18n.placeholder, !state[x], function(e, $, v, w) {
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
                    auto_p_(e, $).unwrap(pattern(abbr_begin_alt), pattern(abbr_end)).unwrap(pattern(abbr_begin_alt), pattern(abbr_end), 1).i().format(abbr + format('%4title%1%2' + v + '%3', data))[1]();
                }), false;
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
                    if (pattern('^\\s*' + esc_unit[0] + esc_unit[2] + esc(p_o) + esc_unit[1]).test(after)) {
                        if (pattern(esc_unit[0] + esc(p_o) + attrs + esc_unit[1] + '\\s*$').test(before)) {
                            $.unwrap(pattern('\\s*' + esc_unit[0] + esc(p_o) + attrs + esc_unit[1] + '\\s*'), pattern('\\s*' + esc_unit[0] + esc_unit[2] + esc(p_o) + esc_unit[1])).replace(placeholder, "").tidy('\n', '\n' + dent);
                        } else if (match = before.match(pattern(esc_unit[0] + esc(p_o) + attrs_capture + esc_unit[1] + '.*?$'))) {
                            $.wrap(unit[0] + unit[2] + p_o + unit[1] + '\n' + dent + unit[0] + p_o + match[1] + unit[1], "").insert(placeholder);
                        }
                    } else {
                        $.format(p, 0, '\n\n');
                    }
                } else {
                    var par = pattern('^(?:\\s*' + esc_unit[0] + esc(p_o) + attrs + esc_unit[1] + '\\s*)+' + content + '(?:\\s*' + esc_unit[0] + esc_unit[2] + esc(p_o) + esc_unit[1] + '\\s*)+$');
                    if (par.test(v)) {
                        $.replace(par, '$1')
                            .replace(pattern('\\s*' + esc_unit[0] + esc_unit[2] + esc(p_o) + esc_unit[1] + '\\s*' + esc_unit[0] + esc(p_o) + attrs + esc_unit[1] + '\\s*', 'g'), '\n\n')
                            .replace(pattern('\\s*' + esc_unit[0] + esc(br_o) + attrs + esc_unit[1] + '\\s*', 'g'), '\n');
                    } else {
                        $.replace(/\n/g, '\n' + unit[0] + br + suffix + '\n')
                            .replace(pattern('(\\s*' + esc_unit[0] + esc(br_o) + attrs + suffix + '\\s*){2,}', 'g'), unit[0] + unit[2] + p_o + unit[1] + '\n' + unit[0] + p + unit[1])
                            .wrap(unit[0] + p + unit[1], unit[0] + unit[2] + p_o + unit[1], 1)
                            .replace(pattern('(' + esc_unit[0] + esc(p_o) + attrs + esc_unit[1] + ')+', 'g'), '$1')
                            .replace(pattern('(' + esc_unit[0] + esc_unit[2] + esc(p_o) + esc_unit[1] + ')+', 'g'), '$1')
                            .tidy('\n');
                    }
                }
                return $[1](), false;
            }
        },
        'p,h1,h2,h3,h4,h5,h6': {
            i: 'header',
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
                    H_o = [];
                each(H, function(v, i) {
                    H_o[i] = get_o(v);
                });
                var tags = esc(H).join('|'),
                    tags_o = esc(H_o).join('|'),
                    o = '\\s*' + esc_unit[0] + '(' + tags_o + ')' + attrs_capture + esc_unit[1] + '\\s*',
                    w_o = pattern('\\s*' + esc_unit[0] + '(?:' + tags_o + ')' + attrs + esc_unit[1] + '\\s*'),
                    w_c = pattern('\\s*' + esc_unit[0] + esc_unit[2] + '(?:' + tags_o + ')' + esc_unit[1] + '\\s*'),
                    match = s.value.match(pattern('^' + o));
                if (!match) {
                    match = s.before.match(pattern(o + '$')) || [];
                }
                var attr = match[2] || "",
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
            i: 'quote-right',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    blockquote = formats.blockquote,
                    q = formats.q,
                    p = formats.p,
                    p_o = get_o(p),
                    para = esc_unit[0] + esc(p_o) + attrs + esc_unit[1];
                // block
                if (pattern('(^|\\n|' + para + ')$').test(s.before)) {
                    if (auto_p && (v === placeholders[""] || pattern('(' + para + ')$').test(s.before))) {
                        return $.select(), false;
                    }
                    $[0]().format(blockquote, 0, '\n\n', '\n');
                    if (auto_p) {
                        if (!v || $.match(pattern('^[^' + esc_unit[0] + '\\n]*?[^' + esc_unit[1] + ']$'))) {
                            $.wrap(tab + unit[0] + p + unit[1], unit[0] + unit[2] + p_o + unit[1]);
                        } else {
                            $[pattern('((^|\\n)' + esc(tab) + ')+').test(v) ? 'outdent' : 'indent'](tab);
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
                    B = esc_unit[0] + esc(pre_o) + attrs + esc_unit[1] + '\\s*' + esc_unit[0] + esc(code_o) + attrs + esc_unit[1] + '\\s*',
                    A = '\\s*' + esc_unit[0] + esc_unit[2] + esc(code_o) + esc_unit[1] + '\\s*' + esc_unit[0] + esc_unit[2] + esc(pre_o) + esc_unit[1],
                    before = pattern(B + '\\s*$'),
                    after = pattern('^\\s*' + A),
                    any = pattern('^' + content + '$');
                function encode(a) {
                    return x ? replace(a, ['&', '<', '>'], ['&amp;', '&lt;', '&gt;']) : a;
                }
                function decode(a) {
                    return x ? replace(a, ['&amp;', '&lt;', '&gt;'], ['&', '<', '>']) : a;
                }
                // block
                if (pattern('(^|\\n|' + B + ')$').test(s.before)) {
                    if (before.test(s.before) && after.test(s.after)) {
                        $[0]().unwrap(pattern(before), pattern(after)).replace(any, decode)[1]();
                    } else {
                        $[0]().tidy('\n\n').wrap(unit[0] + pre + unit[1] + unit[0] + code + unit[1], unit[0] + unit[2] + code_o + unit[1] + unit[0] + unit[2] + pre_o + unit[1]).insert(v || placeholders[""]).replace(any, encode)[1]();
                    }
                // span
                } else {
                    $[0]().format(code).loss().replace(any, function(a) {
                        return force_i(pattern('^\\s*' + esc_unit[0] + esc_unit[2] + esc(code_o) + esc_unit[1]).test($.$().after) ? encode(a) : decode(a));
                    })[1]();
                }
                return false;
            }
        },
        ul: {
            i: 'list-ul',
            click: function(e, $) {
                var ol = formats.ol,
                    ul = formats.ul,
                    ol_o = get_o(ol),
                    ul_o = get_o(ul),
                    s = '(' + esc(ul_o) + '|' + esc(ol_o) + ')';
                if ($.match(pattern(esc_unit[0] + s + attrs + esc_unit[1] + content + esc_unit[0] + esc_unit[2] + s + esc_unit[1]))) {
                    $[0]()
                        .replace(pattern(esc_unit[0] + esc(ol_o) + attrs_capture + esc_unit[1], 'g'), unit[0] + ul_o + '$1' + unit[1])
                        .replace(pattern(esc_unit[0] + esc_unit[2] + esc(ol_o) + esc_unit[1], 'g'), unit[0] + unit[2] + ul_o + unit[1])
                    [1]();
                } else {
                    tree(e, ul, formats.li);
                }
                return false;
            }
        },
        ol: {
            i: 'list-ol',
            click: function(e, $) {
                var ol = formats.ol,
                    ul = formats.ul,
                    ol_o = get_o(ol),
                    ul_o = get_o(ul),
                    s = '(' + esc(ul_o) + '|' + esc(ol_o) + ')';
                if ($.match(pattern(esc_unit[0] + s + attrs + esc_unit[1] + content + esc_unit[0] + esc_unit[2] + s + esc_unit[1]))) {
                    $[0]()
                        .replace(pattern(esc_unit[0] + esc(ul_o) + attrs_capture + esc_unit[1], 'g'), unit[0] + ol_o + '$1' + unit[1])
                        .replace(pattern(esc_unit[0] + esc_unit[2] + esc(ul_o) + esc_unit[1], 'g'), unit[0] + unit[2] + ol_o + unit[1])
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
                q = trim(format(p[0], [1, 1])),
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
            return ui.prompt(['table>td', i18n.title[0]], i18n.placeholder[0], 0, function(e, $, v, w) {
                c = edge(num(v) || w, std[0], std[1]);
                ui.prompt(['table>tr', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v, w) {
                    r = edge(num(v) || w, str[0], str[1]);
                    ui.prompt(['table>caption', i18n.title[2]], i18n.placeholder[2], 0, function(e, $, v) {
                        var tfoot_html = "",
                            i, j, k, l, m, n;
                        title = force_i(v);
                        for (i = 0; i < r; ++i) {
                            s = advance + tab + unit[0] + tr + unit[1] + '\n';
                            for (j = 0; j < c; ++j) {
                                s += advance + tab + tab + unit[0] + td + unit[1] + trim(format(p[1], [i + 1, j + 1])) + unit[0] + unit[2] + td_o + unit[1] + '\n';
                            }
                            s += advance + tab + unit[0] + unit[2] + tr_o + unit[1];
                            o.push(s);
                        }
                        o = o.join('\n');
                        s = tab + (advance ? unit[0] + thead + unit[1] + '\n' + tab + tab + unit[0] + tr + unit[1] : unit[0] + tr_o + unit[1]) + '\n';
                        for (k = 0; k < c; ++k) {
                            s += advance + tab + tab + unit[0] + th + unit[1] + trim(format(p[0], [1, k + 1])) + unit[0] + unit[2] + th_o + unit[1] + '\n';
                        }
                        if (advance) {
                            tfoot_html += tab + unit[0] + tfoot + unit[1] + '\n';
                            tfoot_html += tab + tab + unit[0] + tr + unit[1] + '\n';
                            for (k = 0; k < c; ++k) {
                                tfoot_html += tab + tab + tab + unit[0] + td + unit[1] + trim(format(p[2], [1, k + 1])) + unit[0] + unit[2] + td_o + unit[1] + '\n';
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
                    });
                });
            }), false;
        },
        hr: {
            i: 'ellipsis-h',
            click: function(e, $) {
                var dent = get_indent($.$().before);
                return $.tidy('\n\n', "").insert(dent + unit[0] + formats.hr + suffix + '\n\n', 0), false;
            }
        }
    });

    if (config.keys) {
        extend(ui.keys, {
            'delete': 'clear',
            'control+delete': 's',
            'control+b': 'b',
            'control+i': 'i',
            'control+u': 'u',
            'control+l': 'a',
            'control+g': 'img',
            'control+arrowdown': 'sub',
            'control+arrowup': 'sup',
            'control+shift+?': 'abbr',
            'control+enter': 'p',
            'shift+enter': function(e, $) {
                var dent = get_indent($.$().before);
                return $.tidy('\n', "").insert(dent + unit[0] + formats.br + suffix + '\n', 0), false;
            },
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
                    if (match = s.after.match(pattern('^\\s*' + esc_unit[0] + esc_unit[2] + '(' + esc(p_o) + '|' + esc(li_o) + ')' + esc_unit[1]))) {
                        m = match[1];
                        (tools[m === li_o ? tree_parent : m] || tools.ul).click(e, $);
                    } else if (auto_p && p && trim(w) && s.end === w.length && pattern('^\\s*[^' + esc_unit[0] + '\\n]*?[^' + esc_unit[1] + ']\\s*$').test(w)) {
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
                if (pattern(esc_unit[0] + esc_unit[2] + esc(li_o) + esc_unit[1]).test(s.after)) {
                    return $[0]().wrap('\n' + dent + tab + unit[0] + (formats[tree_parent] || tree_parent) + unit[1] + '\n' + dent + tab + tab + unit[0] + li + unit[1], unit[0] + unit[2] + li_o + unit[1] + '\n' + dent + tab + unit[0] + unit[2] + tree_parent + unit[1] + '\n' + dent).insert(placeholders[""])[1](), false;
                }
                return ui.tools.indent.click(e, $);
            },
            'backspace': function(e, $) {
                var s = $.$(),
                    v = s.value, tag,
                    before = s.before,
                    after = s.after,
                    end = esc_unit[0] + '[^' + esc_unit[0] + esc_unit[1] + ']+?' + esc_unit[1];
                if (!v && pattern(end + '$').test(before)) {
                    tag = before.split(unit[0]).pop().match(pattern('^([^' + esc_unit[2] + '\\s]+).*?' + esc_unit[1] + '$'));
                    tag = (tag && tag[1]) || 0;
                    if (tag && pattern('^\\s*' + esc_unit[0] + esc_unit[2] + esc(tag) + esc_unit[1]).test(after)) {
                        $.unwrap(pattern(esc_unit[0] + esc(tag) + attrs + esc_unit[1]), pattern('\\s*' + esc_unit[0] + esc_unit[2] + esc(tag) + esc_unit[1]));
                    } else {
                        $.outdent(pattern(end));
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

    return $.update({}, 0);

};