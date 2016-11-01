/*!
 * ==========================================================
 *  HTML TEXT EDITOR PLUGIN 1.2.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.HTML = TE.html = function(target, o) {

    var _u2013 = '\u2013', // N-dash
        _u2026 = '\u2026', // horizontal ellipsis
        _u2191 = '\u2191', // upwards arrow
        _u2193 = '\u2193', // downwards arrow
        _u21B5 = '\u21B5', // carriage return arrow
        _u2318 = '\u2318', // command sign
        _u2718 = '\u2718', // delete sign
        _u21E7 = '\u21E7', // shift sign

        win = window,
        doc = document,
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
            suffix: '>',
            auto_encode_html: 1,
            auto_p: 1,
            tools: 'clear | b i u s | sub sup | abbr | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            states: {
                tr: [1, 20], // minimum and maximum table row(s)
                td: [1, 20], // minimum and maximum table column(s)
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
            classes: {},
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
        config = $.config,
        states = config.states,
        languages = config.languages,
        formats = config.formats,
        classes = config.classes,
        tab = config.tab,
        suffix = config.suffix,
        attrs = '(?:\\s[^<>]*?)?',
        attrs_capture = '(|\\s[^<>]*?)',
        content = '([\\s\\S]*?)',
        placeholders = languages.placeholders,
        auto_p = config.auto_p,
        tree_parent;

    // define editor type
    $.type = 'html';

    function get_o(s) {
        return s.split(/\s+/)[0];
    }

    function get_indent(s) {
        var dent = s.match(/(?:^|\n)([\t ]*).*$/);
        return (dent && dent[1]) || "";
    }

    function tree(e, parent, child) {
        var s = $.$(),
            v = s.value,
            before = s.before,
            ul = formats[parent],
            li = formats[child] || child,
            ul_o = get_o(ul),
            li_o = get_o(li),
            dent = get_indent(before),
            placeholder = placeholders[""], match;
        tree_parent = ul;
        $[0]();
        if (!v || v === placeholder) {
            if (match = before.match(pattern('(?:^|\\n)[\\t ]+<(\\/?)(?:' + get_o(formats.ul) + '|' + get_o(formats.ol) + ')' + attrs + '>\\s*$'))) {
                $.insert('\n' + dent + (match[1] ? "" : tab), -1);
            } else if (match = before.match(pattern('<' + li_o + attrs_capture + '>.*?$'))) {
                if (pattern('<\\/' + li_o + '>\\s*$').test(before)) {
                    $.tidy('\n' + dent, false).insert(placeholder).wrap('<' + li_o + match[1] + '>', '</' + li_o + '>');
                } else {
                    if (!/>\s*$/.test(before)) {
                        $.insert('</' + li_o + '>\n' + dent + '<' + li_o + match[1] + '>', -1).insert(placeholder);
                    } else {
                        $.insert(placeholder).wrap('\n' + dent + tab + '<' + ul + '>\n' + dent + tab + tab + '<' + li_o + match[1] + '>', '</' + li_o + '>\n' + dent + tab + '</' + ul_o + '>\n' + dent);
                    }
                }
            } else {
                if (pattern('<\\/' + li_o + '>\\s*$').test(before)) {
                    $.insert(placeholder).wrap('\n' + dent + '<' + li + '>', '</' + li_o + '>');
                } else {
                    $.tidy('\n\n').insert(placeholder).wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>');
                }
            }
        } else {
            $.tidy('\n\n', "")
                .replace(/[\t ]*\n[\t ]*/g, '</' + li_o + '>\n' + tab + '<' + li + '>')
                .wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>\n\n', 1)
                .replace(pattern('\\n' + tab + '<' + li + '>\\s*<\\/' + li_o + '>\\n', 'g'), '\n</' + ul_o + '>\n\n<' + ul + '>\n')
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

    function attr_title(s) {
        return force_i(s).replace(/<.*?>/g, "").replace(/"/g, '&#34;').replace(/'/g, '&#39;').replace(/\(/g, '&#40;').replace(/\)/g, '&#41;');
    }

    function attr_url(s) {
        return force_i(s).replace(/<.*?>/g, "").replace(/\s/g, '%20').replace(/"/g, '%22').replace(/\(/g, '%28').replace(/\)/g, '%29');
    }

    function force_i(s) {
        return trim(s.replace(/\s+/g, ' '));
    }

    extend(ui.tools, {
        clear: {
            i: 'eraser',
            click: function(e, $) {
                var s = $[0]().$(),
                    v = s.value;
                if (!/<[^<>]+?>/.test(v) && (s.before.slice(-1) !== '>' && s.after[0] !== '<')) {
                    $.insert("");
                } else {
                    $.replace(/<[^<>]+?>/g, "").unwrap(/<[^\/<>]+?>/, /<\/[^<>]+?>/);
                }
                return $[1](), !!s.after;
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
                    var host = win.location.host,
                        x, extra;
                    if (href.indexOf('://') !== -1) x = 1;
                    if (host !== "" && href.indexOf('://' + host) !== -1) x = 0;
                    if (/^([.\/?&#]|javascript:)/.test(href)) x = 0;
                    $.blur().ui.prompt(['a[title]', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v) {
                        title = attr_title(v);
                        if (!auto_p_(e, $).$().length) {
                            $.insert(placeholders[""]);
                        }
                        extra = config.advance_a && x ? ' rel="nofollow" target="_blank"' : "";
                        $.i().format(a + ' href="' + href + '"' + (title ? ' title="' + title + '"' : "") + extra);
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
                return $.ui.prompt(['img[src]', i18n.title[0]], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    src = v;
                    $.blur().ui.prompt(['img[title]', i18n.title[advance ? 2 : 1]], i18n.placeholder[advance ? 2 : 1], 0, function(e, $, v) {
                        title = attr_title(v);
                        if (!alt) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        alt = attr_title(alt);
                        $[0]();
                        if (advance && title) {
                            $.tidy('\n\n', "").insert('<' + figure + '>\n' + tab + '<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + '\n' + tab + '<' + figcaption + '>' + title + '</' + get_o(figcaption) + '>\n</' + get_o(figure) + '>\n\n', -1, 1);
                            if (auto_p) {
                                ui.tools.p.click(e, $);
                            }
                        } else {
                            auto_p_(e, $).tidy(/<[^\/<>]+?>\s*$/.test($.$().before) ? "" : ' ', "").insert('<' + img + ' alt="' + alt + '" src="' + src + '"' + (title ? ' title="' + title + '"' : "") + suffix + ' ', -1, 1);
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
                    .unwrap(pattern('<' + sup_o + attrs + '>'), '</' + sup_o + '>')
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
                    .unwrap(pattern('<' + sub_o + attrs + '>'), '</' + sub_o + '>')
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
                    abbr_begin = '<' + esc(abbr) + attrs_capture + '>',
                    abbr_begin_alt = '<' + esc(abbr) + attrs + '>',
                    abbr_end = '<\\/' + abbr_o + '>',
                    abbr_html = pattern(abbr_begin + content + abbr_end), state, i;
                g.replace(abbr_html, function(a, b, c) {
                    if (c = trim(c)) states.abbr[c] = (b.match(/\s+title="\s*(.*?)\s*"/i) || ["", ""])[1];
                });
                state = states.abbr;
                if (x && state[x]) {
                    return $.i().format(abbr + ' title="' + state[x] + '"'), false;
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
                    auto_p_(e, $).unwrap(pattern(abbr_begin_alt), pattern(abbr_end)).unwrap(pattern(abbr_begin_alt), pattern(abbr_end), 1).i().format(abbr + ' title="' + v + '"')[1]();
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
                    placeholder = placeholders[""];
                $[0]();
                if (!v || v.indexOf('\n') === -1) {
                    if (pattern('^\\s*<\\/' + p_o + '>').test(after)) {
                        if (pattern('<' + p_o + attrs + '>\\s*$').test(before)) {
                            $.unwrap(pattern('\\s*<' + p_o + attrs + '>\\s*'), pattern('\\s*<\\/' + p_o + '>')).replace(placeholder, "").tidy('\n', '\n' + dent);
                        } else if (match = before.match(pattern('<' + p_o + attrs_capture + '>.*?$'))) {
                            $.wrap('</' + p_o + '>\n' + dent + '<' + p_o + match[1] + '>', "").insert(placeholder);
                        }
                    } else {
                        $.format(p, 0, '\n\n');
                    }
                } else {
                    var par = pattern('^(?:\\s*<' + p_o + attrs + '>\\s*)+' + content + '(?:\\s*<\\/' + p_o + '>\\s*)+$');
                    if (par.test(s.value)) {
                        $.replace(par, '$1')
                            .replace(pattern('\\s*<\\/' + p_o + '>\\s*<' + p_o + attrs + '>\\s*', 'g'), '\n\n')
                            .replace(pattern('\\s*<' + br_o + attrs + '>\\s*', 'g'), '\n');
                    } else {
                        $.replace(/\n/g, '\n<' + br + suffix + '\n')
                            .replace(pattern('(\\s*<' + br_o + attrs + suffix + '\\s*){2,}', 'g'), '</' + p_o + '>\n<' + p + '>')
                            .wrap('<' + p + '>', '</' + p_o + '>', 1)
                            .replace(pattern('(<' + p_o + attrs + '>)+', 'g'), '$1')
                            .replace(pattern('(<\\/' + p_o + '>)+', 'g'), '$1')
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
                    o = '\\s*<(' + tags_o + ')' + attrs_capture + '>\\s*',
                    w_o = pattern('\\s*<(?:' + tags_o + ')' + attrs + '>\\s*'),
                    w_c = pattern('\\s*<\\/(?:' + tags_o + ')>\\s*'),
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
                    para = '<' + p_o + attrs + '>';
                // block
                if (pattern('(^|\\n|' + para + ')$').test(s.before)) {
                    if (auto_p && (s.value === placeholders[""] || pattern('(' + para + ')$').test(s.before))) {
                        return $.select(), false;
                    }
                    $[0]().format(blockquote, 0, '\n\n', '\n');
                    if (auto_p) {
                        if (!v || $.match(/^[^<\n]*?[^>]$/)) {
                            $.wrap(tab + '<' + p + '>', '</' + p_o + '>');
                        } else {
                            $[pattern('((^|\\n)' + tab + ')+').test(s.value) ? 'outdent' : 'indent'](tab);
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
                    B = '<' + pre_o + attrs + '>\\s*<' + code_o + attrs + '>\\s*',
                    A = '\\s*<\\/' + code_o + '>\\s*<\\/' + pre_o + '>',
                    before = pattern(B + '\\s*$'),
                    after = pattern('^\\s*' + A),
                    any = pattern('^' + content + '$');
                function encode(a) {
                    return x ? a.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : a;
                }
                function decode(a) {
                    return x ? a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : a;
                }
                // block
                if (pattern('(^|\\n|' + B + ')$').test(s.before)) {
                    if (before.test(s.before) && after.test(s.after)) {
                        $[0]().unwrap(pattern(before), pattern(after)).replace(any, decode)[1]();
                    } else {
                        $[0]().tidy('\n\n').wrap('<' + pre + '><' + code + '>', '</' + code_o + '></' + pre_o + '>').insert(v || placeholders[""]).replace(any, encode)[1]();
                    }
                // span
                } else {
                    $[0]().format(code).loss().replace(any, function(a) {
                        return force_i(pattern('^<\\/' + code_o + '>').test($.$().after) ? encode(a) : decode(a));
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
                if ($.match(pattern('<' + s + attrs + '>' + content + '<\\/' + s + '>'))) {
                    $[0]()
                        .replace(pattern('<' + ol_o + attrs_capture + '>', 'g'), '<' + ul_o + '$1>')
                        .replace(pattern('</' + ol_o + '>', 'g'), '</' + ul_o + '>')
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
                if ($.match(pattern('<' + s + attrs + '>' + content + '<\\/' + s + '>'))) {
                    $[0]()
                        .replace(pattern('<' + ul_o + attrs_capture + '>', 'g'), '<' + ol_o + '$1>')
                        .replace(pattern('</' + ul_o + '>', 'g'), '</' + ol_o + '>')
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
            if ($.$().value === q) return $.select(), false;
            return $[0]().ui.prompt(['table>td', i18n.title[0]], i18n.placeholder[0], 0, function(e, $, v, w) {
                c = edge(num(v) || w, std[0], std[1]);
                $.blur().ui.prompt(['table>tr', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v, w) {
                    r = edge(num(v) || w, str[0], str[1]);
                    $.blur().ui.prompt(['table>caption', i18n.title[2]], i18n.placeholder[2], 0, function(e, $, v) {
                        var tfoot_html = "",
                            i, j, k, l, m, n;
                        title = force_i(v);
                        for (i = 0; i < r; ++i) {
                            s = advance + tab + '<' + tr + '>\n';
                            for (j = 0; j < c; ++j) {
                                s += advance + tab + tab + '<' + td + '>' + trim(format(p[1], [i + 1, j + 1])) + '</' + td_o + '>\n';
                            }
                            s += advance + tab + '</' + tr_o + '>';
                            o.push(s);
                        }
                        o = o.join('\n');
                        s = tab + (advance ? '<' + thead + '>\n' + tab + tab + '<' + tr + '>' : '<' + tr_o + '>') + '\n';
                        for (k = 0; k < c; ++k) {
                            s += advance + tab + tab + '<' + th + '>' + trim(format(p[0], [1, k + 1])) + '</' + th_o + '>\n';
                        }
                        if (advance) {
                            tfoot_html += tab + '<' + tfoot + '>\n';
                            tfoot_html += tab + tab + '<' + tr + '>\n';
                            for (k = 0; k < c; ++k) {
                                tfoot_html += tab + tab + tab + '<' + td + '>' + trim(format(p[2], [1, k + 1])) + '</' + td_o + '>\n';
                            }
                            tfoot_html += tab + tab + '</' + tr + '>\n';
                            tfoot_html += tab + '</' + tfoot_o + '>\n';
                        }
                        s += advance + tab + '</' + tr_o + '>' + (advance ? '\n' + tab + '</' + thead_o + '>\n' + tfoot_html + tab + '<' + tbody + '>' : "") + '\n';
                        o = s + o + (advance ? '\n' + tab + '</' + tbody_o + '>' : "") + '\n';
                        $.tidy('\n\n').insert('<' + table + '>\n' + (title ? tab + '<' + caption + '>' + title + '</' + caption_o + '>\n' : "") + o + '</' + table_o + '>', 0);
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
                return $.tidy('\n\n', "").insert(dent + '<' + formats.hr + suffix + '\n\n', -1), false;
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
                return $.tidy('\n', "").insert(dent + '<' + formats.br + suffix + '\n', -1), false;
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
                    placeholder = placeholders[""], m, n;
                if (!v || v === placeholder) {
                    if (match = s.after.match(pattern('^\\s*<\\/(' + p_o + '|' + li_o + ')>'))) {
                        m = match[1];
                        ui.tools[m === 'li' ? tree_parent : m].click(e, $);
                    } else if (auto_p && trim(w) && s.end === w.length && /^\s*[^<\n]*?[^>]\s*$/.test(w)) {
                        w = '<' + p + '>' + w + '</' + p_o + '>\n<' + p + '>';
                        n = placeholder + '</' + p_o + '>';
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
                if (pattern('<\\/' + li + '>').test(s.after)) {
                    return $[0]().wrap('\n' + dent + tab + '<' + (formats[tree_parent] || tree_parent) + '>\n' + dent + tab + tab + '<' + li + '>', '</' + li_o + '>\n' + dent + tab + '</' + tree_parent + '>\n' + dent).insert(placeholders[""])[1](), false;
                }
                return $.ui.tools.indent.click(e, $);
            },
            'backspace': function(e, $) {
                var s = $.$(),
                    v = s.value, tag,
                    before = s.before,
                    after = s.after,
                    end = '<[^<>]+?>';
                if (!v && pattern(end + '$').test(before)) {
                    tag = before.split('<').pop().match(/^([^\/\s]+).*?>$/);
                    tag = (tag && tag[1]) || 0;
                    if (tag && pattern('^\\s*<\\/' + tag + '>').test(after)) {
                        $.unwrap(pattern('<' + tag + attrs + '>'), pattern('\\s*<\\/' + tag + '>'));
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