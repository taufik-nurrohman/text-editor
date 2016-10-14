/*!
 * ==========================================================
 *  HTML TEXT EDITOR PLUGIN 1.0.0
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
            tools: 'clear | b i u s | sub sup | a img | p | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | align-left align-center align-right align-justify | hr | undo redo',
            css: 'html,body{background:#fff;color:#000}.align-left{text-align:left}.align-center{text-align:center}.align-right{text-align:right}.align-justify{text-align:justify}',
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
                        title: ['Link URL', 'Link Title'],
                        placeholder: ['http://', 'link title here' + _u2026]
                    },
                    img: {
                        title: ['Image URL', 'Image Caption'],
                        placeholder: ['http://', 'image caption here' + _u2026]
                    }
                }
            },
            classes: {
                formats: {
                    align: ['left', 'center', 'right', 'justify', 'top', 'middle', 'bottom', ""]
                }
            },
            formats: {
                align: 'div class="%1-%2"',
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
        content = '([\\s\\S]*?)',
        placeholder = languages.others.placeholder,
        auto_p = config.auto_p,
        tree_parent;

    TE.HTML.__instance__.push(editor);

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

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function trim(s) {
        return s.replace(/^\s*|\s*$/g, "");
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
        return editor;
    }

    function align(e, $, id) {
        var s = $.$(),
            div = formats.align,
            div_o = get_o(div),
            a, b;
        id = id.split('-');
        a = pattern('<' + format(esc(div), [id[0], '(?:' + classes.formats.align.join('|') + ')']) + '>\\s*');
        b = pattern('\\s*<\\/' + div_o + '>');
        $[0]()
            .unwrap(a, b)
            .unwrap(a, b, 1)
            .format(format(div, id), 0, '\n\n', '\n')
        [1]();
    }

    function auto_p_(e, $) {
        if (!$.get(0) && auto_p) {
            ui.tools.p.click(e, $);
        }
        return $;
    }

    function attr_value(s) {
        return s.replace(/<.*?>/g, "").replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    extend(ui.tools, {
        clear: {
            i: 'eraser',
            click: function(e, $) {
                var s = $[0]().$(),
                    v = s.value;
                if (!v.length) return;
                if (!/<[^<>]+?>/.test(v) && (s.before.slice(-1) !== '>' && s.after.slice(0, 1) !== '<')) {
                    $.insert("");
                } else {
                    $.replace(/<[^<>]+?>/g, "").unwrap(/<[^\/<>]+?>/, /<\/[^<>]+?>/);
                }
                $[1]();
                return false;
            }
        },
        b: {
            i: 'bold',
            click: function(e, $) {
                return auto_p_(e, $).format(formats.b), false;
            }
        },
        i: {
            i: 'italic',
            click: function(e, $) {
                return auto_p_(e, $).format(formats.i), false;
            }
        },
        u: {
            i: 'underline',
            click: function(e, $) {
                return auto_p_(e, $).format(formats.u), false;
            }
        },
        s: {
            i: 'strikethrough',
            click: function(e, $) {
                return auto_p_(e, $).format(format(formats.s, $._.time())), false;
            }
        },
        a: {
            i: 'link',
            click: function(e, $) {
                var a = formats.a,
                    i18n = languages.modals.a,
                    href, title;
                return $.record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
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
                    alt = s.value,
                    i18n = languages.modals.img,
                    src, title;
                return $.record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    src = v;
                    $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = v;
                        if (!alt.length) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        alt = attr_value(alt);
                        $[0]().insert("");
                        if (!title) {
                            auto_p_(e, $).tidy(/<[^\/<>]+?>\s*$/.test($.$().before) ? "" : ' ', "").insert('<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + ' ', -1);
                        } else {
                            $.tidy('\n\n', "").insert('<' + figure + '>\n' + tab + '<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + '\n' + tab + '<' + figcaption + '>' + title + '</' + get_o(figcaption) + '>\n</' + get_o(figure) + '>\n\n', -1);
                            if (auto_p) {
                                ui.tools.p.click(e, editor);
                            }
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
                        if (!s.length || $.match(/^[^<\n]*?[^>]$/)) {
                            $.wrap(tab + '<' + p + '>', '</' + p_o + '>');
                        } else {
                            $[pattern('((^|\\n)' + tab + ')+').test(s.value) ? 'outdent' : 'indent'](tab);
                        }
                    }
                    $[1]();
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
                        $[0]().tidy('\n\n').wrap('<' + pre + '><' + code + '>', '</' + code_o + '></' + pre_o + '>').insert(s.length ? s.value : placeholder).replace(any, encode)[1]();
                    }
                // span
                } else {
                    $[0]().format(code).loss().replace(any, function(a) {
                        return pattern('^<\\/' + code_o + '>').test($.$().after) ? encode(a) : decode(a);
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
        'align-left': align,
        'align-center': align,
        'align-right': align,
        'align-justify': align,
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
                    v = $.get(),
                    p = formats.p,
                    li = formats.li,
                    p_o = get_o(p),
                    li_o = get_o(li),
                    dent = get_indent(s.before), m, n;
                if (!s.length) {
                    if (match = s.after.match(pattern('^\\s*<\\/(' + p_o + '|' + li_o + ')>'))) {
                        m = match[1];
                        ui.tools[m === 'li' ? tree_parent : m].click(e, $);
                    } else if (auto_p && trim(v).length && s.end === v.length && /^\s*[^<\n]*?[^>]\s*$/.test(v)) {
                        v = '<' + p + '>' + v + '</' + p_o + '>\n<' + p + '>';
                        n = '</' + p_o + '>';
                        $.set(v + n).select(v.length);
                    } else {
                        return; // normal enter key ...
                    }
                    return false;
                }
            },
            'backspace': function(e, $) {
                var s = $.$(), tag,
                    before = s.before,
                    after = s.after,
                    end = '<[^<>]+?>';
                if (!s.length) {
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
            'control+r': 'hr'
        });
    }

    return editor.update({}, 0);

};

// Collect all editor instance(s)
TE.HTML.__instance__ = [];