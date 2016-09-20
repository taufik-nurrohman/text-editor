/*!
 * ==========================================================
 *  HTML EDITOR PLUGIN 0.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.HTML = function(target, o) {

    var _u2013 = '\u2013', // N-dash
        _u2026 = '\u2026', // horizontal ellipsis
        _u2190 = '\u2190', // leftwards arrow
        _u2192 = '\u2192', // rightwards arrow
        _u2191 = '\u2191', // upwards arrow
        _u2193 = '\u2193', // downwards arrow
        _u21B5 = '\u21B5', // carriage return arrow
        _u2318 = '\u2318', // command sign
        _u2718 = '\u2718', // delete sign

        win = window,
        doc = document,
        editor = new TE(target),
        extend = editor._.extend,
        each = editor._.each,
        esc = editor._.x,
        ui = editor.create(extend({
            suffix: '>',
            auto_encode_html: 1,
            tools: 'clear | b i u s | sub sup | a img | p | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | align-left align-center align-right align-justify | hr | undo redo',
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
                    sup: 'Subscript (' + _u2318 + '+' + _u2191 + ')',
                    p: 'Paragraph (' + _u2318 + '+' + _u21B5 + ')',
                    'p,h1,h2,h3,h4,h5,h6': 'H1 ' + _u2013 + ' H6 (' + _u2318 + '+H)',
                    'blockquote,q': 'Quote (' + _u2318 + '+Q)',
                    'pre,code': 'Code (' + _u2318 + '+K)',
                    ul: 'Unordered List (' + _u2318 + '+-)',
                    li: 'Ordered List (' + _u2318 + '++)',
                    'align-left': 'Align Left',
                    'align-center': 'Align Center',
                    'align-right': 'Align Right',
                    'align-justify': 'Align Justify',
                    'align-top': 'Align Top',
                    'align-middle': 'Align Middle',
                    'align-bottom': 'Align Bottom',
                    hr: 'Horizontal Rule (' + _u2318 + '+R)'
                },
                modals: {
                    a: {
                        title: ['URL', 'Title'],
                        placeholder: ['http://', 'link title here' + _u2026]
                    },
                    img: {
                        title: ['Source URL', 'Caption'],
                        placeholder: ['http://', 'image caption here' + _u2026]
                    }
                }
            },
            classes: {
                formats: {
                    left: 'align-left',
                    center: 'align-center',
                    right: 'align-right',
                    justify: 'align-justify',
                    top: 'align-top',
                    middle: 'align-middle',
                    bottom: 'align-bottom'
                }
            },
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
                hr: 'hr'
                
            }
        }, o)),
        format = editor._.format,
        config = editor.config,
        languages = config.languages,
        formats = config.formats,
        classes = config.classes,
        tab = config.tab,
        suffix = config.suffix,
        attrs = '(?:\\s[^<>]*?)?',
        attrs_capture = '(|\\s[^<>]*?)',
        placeholder = languages.others.placeholder,
        tree_parent;

    function is_node(x) {
        return x instanceof HTMLElement;
    }

    function is_function(x) {
        return typeof x === "function";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function get_o(s) {
        return s.split(/\s+/)[0];
    }

    function get_indent(s) {
        var dent = s.match(/(?:^|\n)([\t ]*).*$/);
        return (dent && dent[1]) || "";
    }

    function tree(parent, child) {
        var s = editor.$(),
            before = s.before,
            ul = formats[parent],
            li = formats[child] || child,
            ul_o = get_o(ul),
            li_o = get_o(li),
            dent = get_indent(before);
        tree_parent = ul;
        if (!s.length) {
            var match = before.match(pattern('<' + li_o + attrs_capture + '>.*$'));
            if (match) {
                if (!/>\s*$/.test(before)) {
                    editor.insert('</' + li_o + '>\n' + dent + '<' + li + '>', -1);
                } else {
                    if (!pattern('<\\/' + li_o + '>\\s*$').test(before)) {
                        editor.wrap('\n' + dent + tab + '<' + ul + '>\n' + dent + tab + tab + '<' + li_o + match[1] + '>', '</' + li_o + '>\n' + dent + tab + '</' + ul_o + '>\n' + dent);
                    }
                }
            } else {
                editor.gap('\n\n', "").wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>');
            }
        } else {
            editor[0]()
                .gap('\n\n', "")
                .replace(/\n/g, '</' + li_o + '>\n' + tab + '<' + li + '>')
                .wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>\n\n', 1)
                .replace(pattern('\\n' + tab + '<' + li + '>\\s*<\\/' + li_o + '>\\n', 'g'), '\n</' + ul_o + '>\n\n<' + ul + '>\n')
                .select(editor.$().end)
            [1]();
        }
        return editor;
    }

    function align(e, $, id) {
        var s = $.$(),
            formats = classes.formats,
            aligns = [], a, b;
        each(formats, function(v) {
            if (v.slice(0, 6) === 'align-') {
                aligns.push(v);
            }
        });
        a = pattern('<div class="(?:' + aligns.join('|') + ')">\\s*');
        b = pattern('\\s*<\\/div>');
        $[0]()
            .unwrap(a, b)
            .unwrap(a, b, 1)
            .format('div class="' + id + '"', 0, '\n\n', '\n')
        [1]();
    }

    function start_p(e, $) {
        if (!$.get(0)) {
            ui.tools.p.click(e, $);
        }
        return $;
    }

    extend(ui.tools, {
        clear: {
            i: 'eraser',
            click: function(e, $) {
                var v = $.$().value;
                if (!v.length) return;
                $[0]().replace(/<[^<>]+?>/g, "").unwrap(/<[^\/<>]+?>/, /<\/[^<>]+?>/);
                if ($.$().value === v) {
                    $.insert("");
                }
                $[1]();
                return false;
            }
        },
        b: {
            i: 'bold',
            click: function(e, $) {
                return start_p(e, $).format(formats.b), false;
            }
        },
        i: {
            i: 'italic',
            click: function(e, $) {
                return start_p(e, $).format(formats.i), false;
            }
        },
        u: {
            i: 'underline',
            click: function(e, $) {
                return start_p(e, $).format(formats.u), false;
            }
        },
        s: {
            i: 'strikethrough',
            click: function(e, $) {
                return start_p(e, $).format(format(formats.s, $._.time())), false;
            }
        },
        a: {
            i: 'link',
            click: function(e, $) {
                var a = formats.a,
                    i18n = languages.modals.a,
                    href, title;
                return start_p(e, $).record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    href = v;
                    // automatic `rel="nofollow"` attribute
                    var host = win.location.host,
                        x, extra;
                    if (href.indexOf('://') !== -1) x = 1;
                    if (host !== "" && href.indexOf('://' + host) !== -1) x = 0;
                    if (/^([.\/?&#]|javascript:)/.test(href)) x = 0;
                    $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = v.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        if (!$.$().length) {
                            $.insert(placeholder);
                        }
                        extra = x ? ' rel="nofollow" target="_blank"' : "";
                        $.format(a + ' href="' + href + '"' + (title ? ' title="' + title + '"' : "") + extra);
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
                    alt = s.value.replace(/<.*?>/g, ""),
                    i18n = languages.modals.img,
                    src, title;
                return start_p(e, $).record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    src = v;
                    $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = v;
                        if (!alt.length) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        $[0]().insert("");
                        if (!title) {
                            $.gap(/<[^\/<>]+?>\s*$/.test(s.before) ? "" : ' ', "").insert('<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + ' ', -1);
                        } else {
                            $.gap('\n\n', "").insert('<' + figure + '>\n' + tab + '<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + '\n' + tab + '<' + figcaption + '>' + title + '</' + get_o(figcaption) + '>\n</' + get_o(figure) + '>\n\n', -1);
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
                return start_p(e, $)[0]()
                    .unwrap(pattern('<' + sup_o + attrs + '>'), '</' + sup_o + '>')
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
                return start_p(e, $)[0]()
                    .unwrap(pattern('<' + sub_o + attrs + '>'), '</' + sub_o + '>')
                    .format(sup)
                [1](), false;
            }
        },
        p: {
            i: 'paragraph',
            click: function(e, $) {
                var s = $.$(),
                    p = formats.p,
                    br = formats.br,
                    p_o = get_o(p),
                    br_o = get_o(br),
                    before = s.before,
                    after = s.after,
                    dent = get_indent(before);
                if (!s.length || s.value.indexOf('\n') === -1) {
                    if (pattern('^\\s*<\\/' + p_o + '>').test(after)) {
                        if (pattern('<' + p_o + attrs + '>\\s*$').test(before)) {
                            $[0]()
                                .unwrap(pattern('\\s*<' + p_o + attrs + '>\\s*'), pattern('\\s*<\\/' + p_o + '>'))
                                .gap('\n')
                            [1]();
                        } else if (match = before.match(pattern('<' + p_o + attrs_capture + '>.*$'))) {
                            $.wrap('</' + p_o + '>\n' + dent + '<' + p_o + match[1] + '>', "");
                        }
                    } else {
                        $[0]().format(p, 0, '\n\n')[1]();
                    }
                } else {
                    var par = pattern('^(?:\\s*<' + p_o + attrs + '>\\s*)+([\\s\\S]*?)(?:\\s*<\\/' + p_o + '>\\s*)+$');
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
                            .gap('\n')
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
                    o = '\\s*<(' + tags + ')' + attrs_capture + '>\\s*',
                    w_o = pattern('\\s*<(?:' + tags + ')' + attrs + '>\\s*'),
                    w_c = pattern('\\s*<\\/(?:' + tags_o + ')>\\s*'),
                    match = s.value.match(pattern('^' + o));
                if (!match) {
                    match = s.before.match(pattern(o + '$')) || [];
                }
                var attr = match[2] || "",
                    i = +((match[1] || 'h0').slice(1));
                return $[0]()
                    .replace(/\s+/g, ' ')
                    .unwrap(w_o, w_c)
                    .unwrap(w_o, w_c, 1)
                    .format(i > 5 ? H_o[0] + attr : H_o[i + 1] + attr, 0, '\n\n')
                [1](), false;
            }
        },
        'blockquote,q': {
            i: 'quote-left',
            click: function(e, $) {
                var s = $.$(),
                    blockquote = formats.blockquote,
                    q = formats.q,
                    p = formats.p;
                // block
                if (/(^|\n)$/.test(s.before)) {
                    $.format(blockquote, 0, '\n\n', '\n');
                // span
                } else {
                    $.format(q);
                }
                return false;
            }
        },
        'pre,code': {
            i: 'code',
            click: function(e, $) {
                var s = $.$(),
                    x = config.auto_encode_html,
                    pre = formats.pre,
                    code = formats.code,
                    pre_o = get_o(pre),
                    code_o = get_o(code),
                    B = '<' + pre_o + attrs + '>\\s*<' + code_o + attrs + '>\\s*',
                    A = '\\s*<\\/' + code_o + '>\\s*<\\/' + pre_o + '>',
                    before = pattern(B + '\\s*$'),
                    after = pattern('^\\s*' + A),
                    any = /^[\s\S]*?$/;
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
                        $[0]().gap('\n\n').wrap('<' + pre + '><' + code + '>', '</' + code_o + '></' + pre_o + '>').insert(s.length ? s.value : placeholder).replace(any, encode)[1]();
                    }
                // span
                } else {
                    $.format(code);
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
                if ($.match(pattern('<' + s + attrs + '>([\\s\\S]*?)<\\/' + s + '>'))) {
                    $[0]()
                        .replace(pattern('<' + ol_o + attrs_capture + '>', 'g'), '<' + ul_o + '$1>')
                        .replace(pattern('</' + ol_o + '>', 'g'), '</' + ul_o + '>')
                    [1]();
                } else {
                    tree(ul, formats.li);
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
                if ($.match(pattern('<' + s + attrs + '>([\\s\\S]*?)<\\/' + s + '>'))) {
                    $[0]()
                        .replace(pattern('<' + ul_o + attrs_capture + '>', 'g'), '<' + ol_o + '$1>')
                        .replace(pattern('</' + ul_o + '>', 'g'), '</' + ol_o + '>')
                    [1]();
                } else {
                    tree(ol, formats.li);
                }
                return false;
            }
        },
        'align-left': align,
        'align-center': align,
        'align-right': align,
        'align-justify': align,
        hr: {
            i: 'ellipsis-h',
            click: function(e, $) {
                var dent = get_indent($.$().before);
                return $.gap('\n\n', "").insert(dent + '<' + formats.hr + suffix + '\n\n', -1), false;
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
            return $.gap('\n', "").insert(dent + '<' + formats.br + suffix + '\n', -1), false;
        },
        'enter': function(e, $) {
            var s = $.$(),
                p = formats.p,
                li = formats.li,
                p_o = get_o(p),
                li_o = get_o(li),
                dent = get_indent(s.before), m;
            if (!s.length) {
                if (match = s.after.match(pattern('^\\s*<\\/(' + p_o + '|' + li_o + ')>'))) {
                    m = match[1];
                    ui.tools[m === 'li' ? tree_parent : m].click(e, $);
                } else {
                    if (dent.length) {
                        $.insert('\n' + dent, -1).scroll('+');
                    } else {
                        return; // normal action ...
                    }
                }
                return false;
            }
        },
        'control+h': 'p,h1,h2,h3,h4,h5,h6',
        'control+q': 'blockquote,q',
        'control+k': 'pre,code',
        'control+-': 'ul',
        'control++': 'ol',
        'control+r': 'hr'
    });

    return editor.update();

};