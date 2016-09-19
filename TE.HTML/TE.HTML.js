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

        win = window,
        doc = document,
        editor = new TE(target),
        extend = editor._.extend,
        each = editor._.each,
        esc = editor._.esc,
        ui = editor.create(extend({
            suffix: '>',
            tools: 'clear | bold italic underline strike | link image | subscript superscript | paragraph | header | quote code | bullet list | align-left align-center align-right align-justify | horizontal | undo redo',
            languages: {
                tools: {
                    clear: 'Clear Format (Delete)',
                    bold: 'Bold (' + _u2318 + '+B)',
                    italic: 'Italic (' + _u2318 + '+I)',
                    underline: 'Underline (' + _u2318 + '+U)',
                    strike: 'Strike (' + _u2318 + '+Delete)',
                    link: 'Link (' + _u2318 + '+L)',
                    image: 'Image (' + _u2318 + '+G)',
                    subscript: 'Subscript (' + _u2318 + '+' + _u2193 + ')',
                    superscript: 'Subscript (' + _u2318 + '+' + _u2191 + ')',
                    paragraph: 'Paragraph (' + _u2318 + '+' + _u21B5 + ')',
                    header: 'H1 ' + _u2013 + ' H6 (' + _u2318 + '+H)',
                    quote: 'Quote (' + _u2318 + '+Q)',
                    code: 'Code (' + _u2318 + '+K)',
                    bullet: 'Unordered List (' + _u2318 + '+-)',
                    list: 'Ordered List (' + _u2318 + '++)',
                    'align-left': 'Align Left',
                    'align-center': 'Align Center',
                    'align-right': 'Align Right',
                    'align-justify': 'Align Justify',
                    'align-top': 'Align Top',
                    'align-middle': 'Align Middle',
                    'align-bottom': 'Align Bottom',
                    horizontal: 'Horizontal Rule (' + _u2318 + '+R)'
                },
                modals: {
                    link: {
                        title: ['URL', 'Title'],
                        placeholder: ['http://', ""],
                        text: 'link text'
                    },
                    image: {
                        title: ['Source URL', 'Caption'],
                        placeholder: ['http://', ""]
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
        parent_tree;

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

    editor.tree = function(parent, child) {
        parent_tree = parent;
        var s = editor.$(),
            before = s.before,
            ul = formats[parent] || parent_tree,
            li = formats[child] || child,
            ul_o = get_o(ul),
            li_o = get_o(li),
            dent = get_indent(before);
        if (!s.length) {
            var match = before.match(pattern('<' + li_o + attrs_capture + '>.*$'));
            if (match) {
                if (!/>\s*$/.test(before)) {
                    editor.insert('</li>\n' + dent + '<li>', -1);
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
                .wrap('<' + ul + '>\n' + tab + '<' + li + '>', '</' + li_o + '>\n</' + ul_o + '>\n\n', true)
                .replace(pattern('\\n' + tab + '<' + li + '>\\s*<\\/' + li_o + '>\\n', 'g'), '\n</' + ul_o + '>\n\n<' + ul + '>\n')
                .select(editor.$().end)
            [1]();
        }
        return editor;
    };

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
            .unwrap(a, b, true)
            .format('div class="' + id + '"', 0, '\n\n', '\n')
        [1]();
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
        bold: function(e, $) {
            return $.format(formats.b), false;
        },
        italic:  function(e, $) {
            return $.format(formats.i), false;
        },
        underline: function(e, $) {
            return $.format(formats.u), false;
        },
        strike: {
            i: 'strikethrough',
            click: function(e, $) {
                return $.format(format(formats.s, $._.time())), false;
            }
        },
        link: {
            click: function(e, $) {
                var a = formats.a,
                    i18n = languages.modals.link,
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
                        title = v.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        if (!$.$().length) {
                            $.insert(i18n.text);
                        }
                        extra = x ? ' rel="nofollow" target="_blank"' : "";
                        $.gap(' ').wrap('<' + a + ' href="' + href + '"' + (title ? ' title="' + title + '"' : "") + extra + '>', '</' + get_o(a) + '>');
                    });
                }), false;
            }
        },
        image: {
            click: function(e, $) {
                var img = formats.img,
                    figure = formats.figure,
                    figcaption = formats.figcaption,
                    alt = $.$().value.replace(/<.*?>/g, ""),
                    i18n = languages.modals.image,
                    src, title;
                return $.record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    src = v;
                    $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = v;
                        if (!alt.length) {
                            alt = src.split(/[\/\\\\]/).pop();
                        }
                        $[0]().insert("");
                        if (!title) {
                            $.gap(' ', "").insert('<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + ' ', -1);
                        } else {
                            $.gap('\n\n', "").insert('<' + figure + '>\n' + tab + '<' + img + ' alt="' + alt + '" src="' + src + '"' + suffix + '\n' + tab + '<' + figcaption + '>' + title + '</' + get_o(figcaption) + '>\n</' + get_o(figure) + '>\n\n', -1);
                        }
                        $[1]();
                    }), false;
                });
            }
        },
        subscript: function(e, $) {
            var sub = formats.sub,
                sup = formats.sup,
                sup_o = get_o(sup);
            return $[0]()
                .unwrap(pattern('<' + sup_o + attrs + '>'), '</' + sup_o + '>')
                .format(sub)
            [1](), false;
        },
        superscript: function(e, $) {
            var sub = formats.sub,
                sup = formats.sup,
                sub_o = get_o(sub);
            return $[0]()
                .unwrap(pattern('<' + sub_o + attrs + '>'), '</' + sub_o + '>')
                .format(sup)
            [1](), false;
        },
        paragraph: function(e, $) {
            var s = $.$(),
                p = formats.p,
                br = formats.br,
                p_o = get_o(p),
                br_o = get_o(br),
                dent = get_indent(s.before);
            if (!s.length || s.value.indexOf('\n') === -1) {
                if (pattern('^\\s*<\\/' + p_o + '>').test(s.after)) {
                    if (pattern('<' + p_o + attrs + '>\\s*$').test(s.before)) {
                        $[0]()
                            .unwrap(pattern('\\s*<' + p_o + attrs + '>\\s*'), pattern('\\s*<\\/' + p_o + '>'))
                            .insert('\n', -1)
                        [1]();
                    } else {
                        var match = s.before.match(pattern('<' + p_o + attrs_capture + '>.*$'));
                        $.wrap('</' + p_o + '>\n' + dent + '<' + p_o + match[1] + '>', "");
                    }
                } else {
                    $.format(p, 0, '\n\n');
                }
            } else {
                var para = pattern('^(?:\\s*<' + p_o + attrs + '>\\s*)+([\\s\\S]*?)(?:\\s*<\\/' + p_o + '>\\s*)+$');
                if (para.test(s.value)) {
                    $[0]()
                        .replace(para, '$1')
                        .replace(pattern('\\s*<\\/' + p_o + '>\\s*<' + p_o + attrs + '>\\s*', 'g'), '\n\n')
                        .replace(pattern('\\s*<' + br_o + attrs + '>\\s*', 'g'), '\n')
                    [1]();
                } else {
                    $[0]()
                        .replace(/\n/g, '\n<' + br + suffix + '\n')
                        .replace(pattern('(\\s*<' + br_o + attrs + suffix + '\\s*){2,}', 'g'), '</' + p_o + '>\n<' + p + '>')
                        .wrap('<' + p + '>', '</' + p_o + '>', true)
                        .replace(pattern('(<' + p_o + attrs + '>)+', 'g'), '$1')
                        .replace(pattern('(<\\/' + p_o + '>)+', 'g'), '$1')
                        .gap('\n')
                    [1]();
                }
            }
            return false;
        },
        header: function(e, $) {
            var attr = "",
                level = 0,
                s = $.$(),
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
            attr = match[2] || "";
            level = +((match[1] || 'h0').slice(1));
            return $[0]()
                .replace(/\s+/g, ' ')
                .unwrap(w_o, w_c)
                .unwrap(w_o, w_c, true)
                .format(level > 5 ? H_o[0] + attr : H_o[level + 1] + attr, 0, '\n\n')
            [1](), false;
        },
        quote: {
            i: 'quote-left',
            click: function(e, $) {
                var s = $.$(),
                    blockquote = formats.blockquote,
                    q = formats.q;
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
        code: function(e, $) {
            var s = $.$(),
                pre = formats.pre,
                code = formats.code,
                pre_o = get_o(pre),
                code_o = get_o(code),
                B = '<' + pre_o + attrs + '>\\s*<' + code_o + attrs + '>\\s*',
                A = '\\s*<\\/' + code_o + '>\\s*<\\/' + pre_o + '>',
                before = pattern(B + '\\s*$'),
                after = pattern('^\\s*' + A),
                all = /^[\s\S]*?$/;
            // block
            if (pattern('(^|\\n|' + B + ')$').test(s.before)) {
                if (before.test(s.before) && after.test(s.after)) {
                    $[0]().unwrap(pattern(before), pattern(after)).replace(all, function(a) {
                        return a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
                    })[1]();
                } else {
                    $[0]().gap('\n\n').wrap('<' + pre + '><' + code + '>', '</' + code_o + '></' + pre_o + '>').replace(all, function(a) {
                        return a.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    })[1]();
                }
            // span
            } else {
                $.format(code);
            }
            return false;
        },
        bullet: {
            i: 'list-ul',
            click: function(e, $) {
                var s = $.$(),
                    ol = formats.ol,
                    ul = formats.ul,
                    ol_o = get_o(ol),
                    ul_o = get_o(ul);
                if ($.match(pattern('<' + (ul_o + '|' + ol_o) + attrs + '>([\\s\\S]*?)<\\/' + (ul_o + '|' + ol_o) + '>'))) {
                    $[0]()
                        .replace(pattern('<' + ol_o + attrs_capture + '>', 'g'), '<' + ul_o + '$1>')
                        .replace(pattern('</' + ol_o + '>', 'g'), '</' + ul_o + '>')
                    [1]();
                } else {
                    $.tree(formats.ul, formats.li);
                }
                return false;
            }
        },
        list: {
            i: 'list-ol',
            click: function(e, $) {
                    ol = formats.ol,
                    ul = formats.ul,
                    ol_o = get_o(ol),
                    ul_o = get_o(ul);
                if ($.match(pattern('<' + (ul_o + '|' + ol_o) + attrs + '>([\\s\\S]*?)<\\/' + (ul_o + '|' + ol_o) + '>'))) {
                    $[0]()
                        .replace(pattern('<' + ul_o + attrs_capture + '>', 'g'), '<' + ol_o + '$1>')
                        .replace(pattern('</' + ul_o + '>', 'g'), '</' + ol_o + '>')
                    [1]();
                } else {
                    $.tree(formats.ol, formats.li);
                }
                return false;
            }
        },
        'align-left': align,
        'align-center': align,
        'align-right': align,
        'align-justify': align,
        horizontal: {
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
        'control+b': 'bold',
        'control+i': 'italic',
        'control+u': 'underline',
        'control+delete': 'strike',
        'control+l': 'link',
        'control+g': 'image',
        'control+arrowdown': 'subscript',
        'control+arrowup': 'superscript',
        'control+enter': 'paragraph',
        'shift+enter': function(e, $) {
            var dent = get_indent($.$().before);
            return $.gap('\n', "").insert(dent + '<br' + suffix + '\n', -1), false;
        },
        'enter': function(e, $) {
            if (e.TE.key(/^control|shift|alt$/)) return;
            var s = $.$(),
                p = formats.p,
                li = formats.li,
                p_o = get_o(p),
                li_o = get_o(li),
                dent = get_indent(s.before);
            if (s.length) {
                $[0].replace("").insert('\n', -1).scroll($.scroll() + 1)[1]();
            } else {
                if (match = s.after.match(pattern('\\s*<\\/(' + p_o + '|' + li_o + ')>'))) {
                    ui.tools[match[1] === p_o ? 'paragraph' : (parent_tree === 'ol' ? 'list' : 'bullet')].click(e, $);
                } else {
                    if (dent.length) {
                        $.insert('\n' + dent, -1);
                    } else {
                        return; // normal action ...
                    }
                }
            }
            return false;
        },
        'control+h': 'header',
        'control+q': 'quote',
        'control+-': 'bullet',
        'control++': 'list',
        'control+r': 'horizontal'
    });

    return editor.refresh();

};