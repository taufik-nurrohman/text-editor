/*!
 * ==========================================================
 *  HTML TEXT EDITOR PLUGIN 1.1.1
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
        _u21E5 = '\u21E5', // indent sign
        _u21E7 = '\u21E7', // shift sign

        win = window,
        doc = document,
        editor = new TE(target),
        extend = editor._.extend,
        each = editor._.each,
        esc = editor._.x,
        ui = editor.create(extend({
            suffix: '>',
            auto_encode_html: 1,
            auto_p: 1,
            tools: 'clear | b i u s | sub sup | a img | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            states: {
                tr: [1, 20], // minimum and maximum table row(s)
                td: [1, 20] // minimum and maximum table column(s)
            },
            languages: {
                tools: {
                    clear: 'Clear Format (' + _u2718 + ')',
                    b: 'Bold (' + _u2318 + '+B)',
                    i: 'Italic (' + _u2318 + '+I)',
                    u: 'Underline (' + _u2318 + '+U)',
                    s: 'Strike (' + _u2318 + '+' + _u2718 + ')',
                    a: 'Link (' + _u2318 + '+L)',
                    img: 'Image (' + _u2318 + '+G)',
                    sub: 'Subscript (' + _u2318 + '+' + _u2193 + ')',
                    sup: 'Superscript (' + _u2318 + '+' + _u2191 + ')',
                    p: 'Paragraph (' + _u2318 + '+' + _u21B5 + ')',
                    'p,h1,h2,h3,h4,h5,h6': 'H1 ' + _u2013 + ' H6 (' + _u2318 + '+H)',
                    'blockquote,q': 'Quote (' + _u2318 + '+Q)',
                    'pre,code': 'Code (' + _u2318 + '+K)',
                    ul: 'Unordered List (' + _u2318 + '+-)',
                    ol: 'Ordered List (' + _u2318 + '++)',
                    indent: 'Indent (' + _u21E5 + ')',
                    outdent: 'Outdent (' + _u21E7 + '+' + _u21E5 + ')',
                    table: 'Table (' + _u2318 + '+T)',
                    hr: 'Horizontal Rule (' + _u2318 + '+R)'
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
        format = editor._.format,
        config = editor.config,
        states = config.states,
        languages = config.languages,
        formats = config.formats,
        classes = config.classes,
        tab = config.tab,
        suffix = config.suffix,
        attrs = '(?:\\s[^<>]*?)?',
        attrs_capture = '(|\\s[^<>]*?)',
        content = '([\\s\\S]*?)',
        placeholder = languages.placeholders[""],
        auto_p = config.auto_p,
        tree_parent;

    // define editor type
    editor.type = 'HTML';

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_node(x) {
        return x instanceof HTMLElement;
    }

    function is_function(x) {
        return typeof x === "function";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function is_number(x) {
        return typeof x === "number";
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function trim(s) {
        return s.replace(/^\s*|\s*$/g, "");
    }

    function edge(a, b, c) {
        if (a < b) return b;
        if (a > c) return c;
        return a;
    }

    function get_o(s) {
        return s.split(/\s+/)[0];
    }

    function get_indent(s) {
        var dent = s.match(/(?:^|\n)([\t ]*).*$/);
        return (dent && dent[1]) || "";
    }

    function tree(e, parent, child) {
        var s = editor.$(),
            v = s.value,
            before = s.before,
            ul = formats[parent],
            li = formats[child] || child,
            ul_o = get_o(ul),
            li_o = get_o(li),
            dent = get_indent(before);
        tree_parent = ul;
        if (!v) {
            var match = before.match(pattern('<' + li_o + attrs_capture + '>.*$'));
            if (match) {
                if (pattern('<\\/' + li_o + '>\\s*$').test(before)) {
                    editor.tidy('\n' + dent, false).wrap('<' + li_o + match[1] + '>', '</' + li_o + '>');
                } else {
                    if (!/>\s*$/.test(before)) {
                        editor.insert('</' + li_o + '>\n' + dent + '<' + li_o + match[1] + '>', -1);
                    } else {
                        if (!pattern('<\\/' + li_o + '>\\s*$').test(before)) {
                            editor.wrap('\n' + dent + tab + '<' + ul + '>\n' + dent + tab + tab + '<' + li_o + match[1] + '>', '</' + li_o + '>\n' + dent + tab + '</' + ul_o + '>\n' + dent);
                        }
                    }
                }
            } else {
                editor.tidy('\n\n', "").wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>');
            }
        } else {
            editor[0]()
                .tidy('\n\n', "")
                .replace(/\n/g, '</' + li_o + '>\n' + tab + '<' + li + '>')
                .wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>\n\n', 1)
                .replace(pattern('\\n' + tab + '<' + li + '>\\s*<\\/' + li_o + '>\\n', 'g'), '\n</' + ul_o + '>\n\n<' + ul + '>\n')
                .select(editor.$().end);
            if (auto_p) {
                ui.tools.p.click(e, editor);
            }
            editor[1]();
        }
    }

    function auto_p_(e, $) {
        if (!$.get(0) && auto_p) {
            ui.tools.p.click(e, $);
        }
        return $;
    }

    function attr_value(s) {
        return force_i(s).replace(/<.*?>/g, "").replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    function force_i(s) {
        return trim(s.replace(/\s+/g, ' '));
    }

    editor.i = function() {
        return editor.replace(/\s+/g, ' ');
    };

    extend(ui.tools, {
        clear: {
            i: 'eraser',
            click: function(e, $) {
                var s = $[0]().$(),
                    v = s.value;
                if (!v) return $.select(), false;
                if (!/<[^<>]+?>/.test(v) && (s.before.slice(-1) !== '>' && s.after.slice(0, 1) !== '<')) {
                    $.insert("");
                } else {
                    $.replace(/<[^<>]+?>/g, "").unwrap(/<[^\/<>]+?>/, /<\/[^<>]+?>/);
                }
                return $[1](), false;
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
                return $.record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = force_i(v);
                    href = v;
                    // automatic `rel="nofollow"` attribute
                    var host = win.location.host,
                        x, extra;
                    if (href.indexOf('://') !== -1) x = 1;
                    if (host !== "" && href.indexOf('://' + host) !== -1) x = 0;
                    if (/^([.\/?&#]|javascript:)/.test(href)) x = 0;
                    $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = attr_value(v);
                        if (!auto_p_(e, $).$().length) {
                            $.insert(placeholder);
                        }
                        extra = x ? ' rel="nofollow" target="_blank"' : "";
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
                return $.ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = force_i(v);
                    src = v;
                    $.blur().ui.prompt(i18n.title[advance ? 2 : 1], i18n.placeholder[advance ? 2 : 1], 0, function(e, $, v) {
                        title = attr_value(v);
                        if (!alt) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        alt = attr_value(alt);
                        $[0]().insert("");
                        if (advance && title) {
                            $.tidy('\n\n', "").insert('<' + figure + '>\n' + tab + '<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + '\n' + tab + '<' + figcaption + '>' + title + '</' + get_o(figcaption) + '>\n</' + get_o(figure) + '>\n\n', -1);
                            if (auto_p) {
                                ui.tools.p.click(e, editor);
                            }
                        } else {
                            auto_p_(e, $).tidy(/<[^\/<>]+?>\s*$/.test($.$().before) ? "" : ' ', "").insert('<' + img + ' alt="' + alt + '" src="' + src + '"' + (title ? ' title="' + title + '"' : "") + suffix + ' ', -1);
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
                    dent = get_indent(before);
                if (!v || v.indexOf('\n') === -1) {
                    if (pattern('^\\s*<\\/' + p_o + '>').test(after)) {
                        if (pattern('<' + p_o + attrs + '>\\s*$').test(before)) {
                            $[0]()
                                .unwrap(pattern('\\s*<' + p_o + attrs + '>\\s*'), pattern('\\s*<\\/' + p_o + '>'))
                                .tidy('\n', '\n' + dent)
                            [1]();
                        } else if (match = before.match(pattern('<' + p_o + attrs_capture + '>.*$'))) {
                            $.wrap('</' + p_o + '>\n' + dent + '<' + p_o + match[1] + '>', "");
                        }
                    } else {
                        $[0]().format(p, 0, '\n\n')[1]();
                    }
                } else {
                    var par = pattern('^(?:\\s*<' + p_o + attrs + '>\\s*)+' + content + '(?:\\s*<\\/' + p_o + '>\\s*)+$');
                    if (par.test(s.value)) {
                        $[0]()
                            .replace(par, '$1')
                            .replace(pattern('\\s*<\\/' + p_o + '>\\s*<' + p_o + attrs + '>\\s*', 'g'), '\n\n')
                            .replace(pattern('\\s*<' + br_o + attrs + '>\\s*', 'g'), '\n')
                        [1]();
                    } else {
                        $[0]()
                            .replace(/\n/g, '\n<' + br + suffix + '\n')
                            .replace(pattern('(\\s*<' + br_o + attrs + suffix + '\\s*){2,}', 'g'), '</' + p_o + '>\n<' + p + '>')
                            .wrap('<' + p + '>', '</' + p_o + '>', 1)
                            .replace(pattern('(<' + p_o + attrs + '>)+', 'g'), '$1')
                            .replace(pattern('(<\\/' + p_o + '>)+', 'g'), '$1')
                            .tidy('\n')
                        [1]();
                    }
                }
                return false;
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
                    .format(i > 5 ? H_o[0] + attr : H_o[i + 1] + attr, 0, '\n\n')
                [1](), false;
            }
        },
        'blockquote,q': {
            i: 'quote-left',
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
                    if (auto_p && (s.value === placeholder || pattern('(' + para + ')$').test(s.before))) {
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
                        $[0]().tidy('\n\n').wrap('<' + pre + '><' + code + '>', '</' + code_o + '></' + pre_o + '>').insert(v || placeholder).replace(any, encode)[1]();
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
                    s = ul_o + '|' + ol_o;
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
                    s = ul_o + '|' + ol_o;
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
                q = format(p[0], [1, 1]),
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
            return $[0]().insert("").ui.prompt(i18n.title[0], i18n.placeholder[0], 0, function(e, $, v, w) {
                c = edge(parseInt(v, 10) || w, std[0], std[1]);
                $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v, w) {
                    r = edge(parseInt(v, 10) || w, str[0], str[1]);
                    $.blur().ui.prompt(i18n.title[2], i18n.placeholder[2], 0, function(e, $, v) {
                        var tfoot_html = "",
                            i, j, k, l, m, n;
                        title = force_i(v);
                        for (i = 0; i < r; ++i) {
                            s = advance + tab + '<' + tr + '>\n';
                            for (j = 0; j < c; ++j) {
                                s += advance + tab + tab + '<' + td + '>' + format(p[1], [i + 1, j + 1]) + '</' + td_o + '>\n';
                            }
                            s += advance + tab + '</' + tr_o + '>';
                            o.push(s);
                        }
                        o = o.join('\n');
                        s = tab + (advance ? '<' + thead + '>\n' + tab + tab + '<' + tr + '>' : '<' + tr_o + '>') + '\n';
                        for (k = 0; k < r; ++k) {
                            s += advance + tab + tab + '<' + th + '>' + format(p[0], [1, k + 1]) + '</' + th_o + '>\n';
                        }
                        if (advance) {
                            tfoot_html += tab + '<' + tfoot + '>\n';
                            for (k = 0; k < r; ++k) {
                                tfoot_html += tab + tab + '<' + td + '>' + format(p[2], [1, k + 1]) + '</' + td_o + '>\n';
                            }
                            tfoot_html += tab + '</' + tfoot_o + '>\n';
                        }
                        s += advance + tab + '</' + tr_o + '>' + (advance ? '\n' + tab + '</' + thead_o + '>\n' + tfoot_html + tab + '<' + tbody + '>' : "") + '\n';
                        o = s + o + (advance ? '\n' + tab + '</' + tbody_o + '>' : "") + '\n';
                        $.tidy('\n\n').insert('<' + table + '>\n' + (title ? tab + '<' + caption + '>' + title + '</' + caption_o + '>\n' : "") + o + '</' + table_o + '>', 1);
                        m = $.$();
                        n = m.start + m.after.indexOf(q);
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

    each(ui.tools, function(v, i) {
        var title = languages.tools[i] || "";
        if (is_function(v)) {
            ui.tools[i] = {
                title: title,
                click: v
            }
        } else {
            if (!v.title) v.title = title;
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
                    dent = get_indent(s.before), m, n;
                if (!v) {
                    if (match = s.after.match(pattern('^\\s*<\\/(' + p_o + '|' + li_o + ')>'))) {
                        m = match[1];
                        ui.tools[m === 'li' ? tree_parent : m].click(e, $);
                    } else if (auto_p && trim(w) && s.end === w.length && /^\s*[^<\n]*?[^>]\s*$/.test(w)) {
                        w = '<' + p + '>' + w + '</' + p_o + '>\n<' + p + '>';
                        n = '</' + p_o + '>';
                        $.set(w + n).select(w.length);
                    } else {
                        return; // normal enter key ...
                    }
                    return false;
                }
            },
            'backspace': function(e, $) {
                var s = $.$(),
                    v = s.value, tag,
                    before = s.before,
                    after = s.after,
                    end = '<[^<>]+?>';
                if (!v) {
                    if (pattern(end + '$').test(before)) {
                        tag = before.split('<').pop().match(/^([^\/\s]+).*?>$/);
                        tag = (tag && tag[1]) || 0;
                        if (tag && pattern('^\\s*<\\/' + tag + '>').test(after)) {
                            $.unwrap(pattern('<' + tag + attrs + '>'), pattern('\\s*<\\/' + tag + '>'));
                        } else {
                            $.outdent(pattern(end));
                        }
                        return false;
                    }
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

    return editor.update({}, 0);

};