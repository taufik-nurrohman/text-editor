/*!
 * ==========================================================
 *  MARKDOWN TEXT EDITOR PLUGIN 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.Markdown = function(target, o) {

    var _u2026 = '\u2026', // horizontal ellipsis
        _u2193 = '\u2193', // downwards arrow
        _u2318 = '\u2318', // command sign

        win = window,
        doc = document,
        editor = new TE.HTML(target, {
            auto_p: 0, // disable automatic paragraph feature from `TE.HTML` by default
            auto_close: {
                '`': '`'
            },
            languages: {
                tools: {
                    footnote: 'Footnote (' + _u2318 + '+' + _u2193 + ')'
                },
                modals: {
                    img: {
                        title: ['Image URL', 'Image Title'],
                        placeholder: ['http://', 'image title here' + _u2026]
                    },
                    footnote: {
                        title: 'Footnote ID'
                    }
                }
            },
            enable_setext_header: 1,
            enable_closed_atx_header: 0,
            enable_fenced_code_block: 0, // replace with `~~~` to enable fenced code block syntax in Markdown Extra
            enable_hard_break: 1, // press `Shift + Enter` to do a hard break
            formats: {
                b: '**',
                i: '_',
                s: '~~',
                h1: ['=', '#'],
                h2: ['-', '##'],
                h3: '###',
                h4: '####',
                h5: '#####',
                h6: '######',
                blockquote: '>',
                code: '`',
                ul: '-',
                ol: '%1.',
                hr: '---'
            }
        }),
        ui = editor.ui,
        extend = editor._.extend,
        each = editor._.each,
        esc = editor._.x,
        format = editor._.format,
        attrs = '(?:\\s[^<>]*?)?',
        attrs_capture = '(|\\s[^<>]*?)',
        content = '([\\s\\S]*?)';

    TE.Markdown.__instance__.push(editor);

    var config = editor.config,
        languages = config.languages,
        formats = config.formats,
        classes = config.classes,
        tab = config.tab,
        suffix = config.suffix,
        placeholder = languages.others.placeholder,
        header_step = 0;

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_node(x) {
        return x instanceof HTMLElement;
    }

    function is_string(x) {
        return typeof x === "string";
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

    function attr_value(s) {
        return s.replace(/<.*?>/g, "").replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    editor.mark = function(str, wrap, gap_1, gap_2) {
        if (!is_object(str)) str = [str];
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var s = editor[0]().$(),
            a = str[0] + gap_2,
            b = gap_2 + (is_set(str[1]) ? str[1] : str[0]),
            A = esc(a),
            B = esc(b),
            m = pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = pattern(A + '$'),
            m_B = pattern('^' + B),
            before = s.before,
            after = s.after;
        if (!s.length) {
            editor.insert(placeholder);
        }
        return editor.toggle(
            // when ...
            wrap ? !m.test(s.value) : (!m_A.test(before) && !m_B.test(after)),
            // do ...
            [
                // first toggle
                function($) {
                    $.unwrap(a, b, 1).tidy(/<[^\/<>]+?>$/.test(before) ? "" : gap_1, /^<\/[^<>]+?>/.test(after) ? "" : gap_1).wrap(a, b, wrap)[1]();
                },
                // second toggle (the reset state)
                function($) {
                    $.unwrap(a, b, wrap)[1]();
                }
            ]
        );
    };

    extend(ui.tools, {
        b: {
            i: 'bold',
            click: function(e, $) {
                return $.mark(formats.b), false;
            }
        },
        i: {
            i: 'italic',
            click: function(e, $) {
                return $.mark(formats.i), false;
            }
        },
        u: 0,
        s: {
            i: 'strikethrough',
            click: function(e, $) {
                return $.mark(formats.s), false;
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
                    $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = attr_value(v);
                        if (!$.$().length) {
                            $.insert(placeholder);
                        }
                        $.mark(['[', '](' + href + (title ? ' "' + title + '"' : "") + ')']);
                    });
                }), false;
            }
        },
        img: {
            i: 'image',
            click: function(e, $) {
                var s = $.$(),
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
                        $.tidy('\n\n', "").insert('![' + alt + '](' + src + (title ? ' "' + title + '"' : "") + ')\n\n', -1);
                    });
                }), false;
            }
        },
        footnote: {
            i: 'thumb-tack',
            click: function(e, $) {
                var s = $.$(),
                    i18n = languages.modals.footnote,
                    g = $.get(),
                    n = /^ \[\^.*?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    notes = g.match(/^ \[\^.*?\]:/gm) || [],
                    i = notes.length + 1;
                if (!s.before.length) return;
                return $.ui.prompt(i18n.title, i18n.placeholder || i, 1, function(e, $, v) {
                    var index = notes.indexOf(' [^' + v + ']:');
                    if (index !== -1) {
                        i = g.indexOf(notes[index]) + 3;
                        $.select(i, i + v.length);
                    } else {
                        $.trim(' ', !s.after.length || /^\n/.test(s.after) ? false : ' ').insert('[^' + v + ']').set($.get() + n + ' [^' + v + ']: ').focus(true).insert(placeholder);
                    }
                }), false;
            }
        },
        sub: 0,
        sup: 0,
        p: {
            i: 'paragraph',
            click: function(e, $) {
                return $.tidy('\n\n').insert(placeholder), false;
            }
        },
        'p,h1,h2,h3,h4,h5,h6': {
            i: 'header',
            click: function(e, $) {
                if (header_step > 5) {
                    header_step = 0;
                } else {
                    header_step++;
                }
                var s = $.$(),
                    setext = config.enable_setext_header,
                    setext_esc = esc(formats.h1[0] + formats.h2[0]),
                    clean_B = s.before.replace(/[#\s]+$/, ""),
                    clean_V = s.length ? s.value.replace(/\s+/g, ' ').replace(/^[#\s]+|[#\s]+$/g, "").replace(pattern('\\s?[' + setext_esc + ']+\\s*$'), "") : placeholder,
                    clean_A = s.after.replace(/^[#\s]+/, "").replace(pattern('^\\s?[' + setext_esc + ']+\\s*'), ""),
                    H = [
                        "",
                        formats.h1[setext ? 0 : 1],
                        formats.h2[setext ? 0 : 1],
                        formats.h3,
                        formats.h4,
                        formats.h5,
                        formats.h6
                    ];
                $[0]().set(clean_B + clean_V + clean_A).select(clean_B.length, (clean_B + clean_V).length).tidy('\n\n');
                if (header_step === 0) {
                    // do nothing ...
                } else if (header_step < 3 && setext) {
                    $.wrap("", '\n' + clean_V.replace(/./g, H[header_step]));
                } else {
                    $.wrap(H[header_step] + ' ', config.enable_closed_atx_header ? ' ' + H[header_step] : "");
                }
                return $[1](), false;
            }
        },
        'blockquote,q': {
            i: 'quote-left',
            click: function(e, $) {
                var s = $.$(),
                    blockquote = formats.blockquote;
                if (s.value === placeholder) {
                    return $.select(), false;
                }
                if (!s.length) {
                    return $[0]().tidy('\n\n').insert(blockquote + ' ', -1).insert(placeholder)[1](), false;
                }
                return $.tidy('\n\n')[pattern('^' + blockquote).test(s.value) ? 'outdent' : 'indent'](blockquote + ' '), false;
            }
        },
        'pre,code': {
            i: 'code',
            click: function(e, $) {
                var s = $.$(),
                    pre = config.enable_fenced_code_block,
                    code = formats.code, attr;
                if (!is_string(pre) && pre) pre = '~~~';
                // block
                if (/(^|\n)$/.test(s.before)) {
                    if (pre) {
                        return $.mark([pre, pre.split(/\s+/)[0]], 0, '\n\n', '\n'), false;
                    }
                    if (!s.length) {
                        $.insert(placeholder);
                    }
                    return $.tidy('\n\n')[/^(\t| {4})/.test(s.value) ? 'outdent' : 'indent'](tab === '\t' ? '\t' : '    '), false;
                }
                // span
                return $.mark(code), false;
            }
        },
        ul: {
            i: 'list-ul',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    b = s.before, B,
                    a = s.after,
                    ul = formats.ul,
                    ol = formats.ol,
                    esc_ul = esc(ul),
                    esc_ol = format(esc(ol), ['\\d+']),
                    bullet = pattern('(^|\\n)([\\t ]*) ' + esc_ul + ' (.*)$'),
                    bullet_s = pattern('^(.*) ' + esc_ul + ' ', 'gm'),
                    list = pattern('(^|\\n)([\\t ]*) ' + esc_ol + ' (.*)$'),
                    list_s = pattern('^(.*) ' + esc_ol + ' ', 'gm');
                if (!s.length) {
                    if (b.length && a.length) {
                        // ordered list detected
                        if (list.test(b)) {
                            B = b.replace(list, '$1$2 ' + ul + ' $3');
                        // unordered list detected
                        } else if (bullet.test(b)) {
                            B = b.replace(bullet, '$1$2$3');
                        // plain text detected
                        } else {
                            B = b.replace(/(^|\n)(\s*)([^\n]*)$/, '$1$2 ' + ul + ' $3');
                        }
                        return $.set(B + a).select(B.length), false;
                    }
                    return $[0]().tidy('\n\n').insert(' ' + ul + ' ', -1).insert(placeholder)[1](), false;
                } else {
                    // start ...
                    if (v === placeholder) {
                        $.select();
                    // ordered list detected
                    } else if (list_s.test(v)) {
                        $.replace(list_s, '$1 ' + ul + ' ');
                    // unordered list detected
                    } else if (bullet_s.test(v)) {
                        $[0]().replace(bullet_s, '$1');
                    // plain text detected
                    } else {
                        $.replace(/^(\s*)(\S+)$/gm, '$1 ' + ul + ' $2');
                    }
                    return false;
                }
            }
        },
        ol: {
            i: 'list-ol',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    b = s.before, B,
                    a = s.after,
                    ul = formats.ul,
                    ol = formats.ol,
                    ol_first = format(ol, [1]),
                    esc_ul = esc(ul),
                    esc_ol = format(esc(ol), ['\\d+']),
                    bullet = pattern('(^|\\n)([\\t ]*) ' + esc_ul + ' (.*)$'),
                    bullet_s = pattern('^(.*) ' + esc_ul + ' ', 'gm'),
                    list = pattern('(^|\\n)([\\t ]*) ' + esc_ol + ' (.*)$'),
                    list_s = pattern('^(.*) ' + esc_ol + ' ', 'gm'),
                    i = 0;
                if (!s.length) {
                    if (b.length && a.length) {
                        // unordered list detected
                        if (bullet.test(b)) {
                            B = b.replace(bullet, '$1$2 ' + ol_first + ' $3');
                        // ordered list detected
                        } else if (list.test(b)) {
                            B = b.replace(list, '$1$2$3');
                        // plain text detected
                        } else {
                            B = b.replace(/(^|\n)(\s*)([^\n]*)$/, '$1$2 ' + ol_first + ' $3');
                        }
                        return $.set(B + a).select(B.length), false;
                    }
                    return $[0]().tidy('\n\n').insert(' ' + ol_first + ' ', -1).insert(placeholder)[1](), false;
                } else {
                    // start ...
                    if (v === placeholder) {
                        $.select();
                    // unordered list detected
                    } else if (bullet_s.test(v)) {
                        $.replace(bullet_s, function(a, b, c) {
                            return ++i, b + ' ' + format(ol, [i]) + ' ';
                        });
                    // ordered list detected
                    } else if (list_s.test(v)) {
                        $[0]().replace(list_s, '$1');
                    // plain text detected
                    } else {
                        $.replace(/^(\s*)(\S+)$/gm, function(a, b, c) {
                            return ++i, b + ' ' + format(ol, [i]) + ' ' + c;
                        });
                    }
                    return false;
                }
            }
        },
        'align-left': 0,
        'align-center': 0,
        'align-right': 0,
        'align-justify': 0,
        hr: {
            i: 'ellipsis-h',
            click: function(e, $) {
                return $.tidy('\n\n', "").insert(formats.hr + '\n\n', -1), false;
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
        'control+u': 0,
        'control+arrowup': 0,
        'control+arrowdown': 'footnote',
        'shift+enter': function(e, $) {
            var br = config.enable_hard_break;
            if (!is_string(br) && br) {
                br = '  \n';
            }
            return $.trim().insert(br || '\n', -1), false;
        },
        'enter': function(e, $) {
            var s = $.$(),
                blockquote = formats.blockquote,
                ul = formats.ul,
                ol = formats.ol,
                esc_ol = format(esc(ol), ['\\d+']),
                regex = '((?:' + esc(blockquote) + ' *)+| +(?:' + esc(ul) + '|' + esc_ol + ') )',
                match = pattern('^' + regex + '.*$', 'gm').exec(s.before.split('\n').pop());
            if (match) {
                if (match[0] === match[1]) {
                    return $.outdent(pattern(regex)), false;
                } else if (pattern('\\s*' + esc_ol + '\\s*').test(match[1])) {
                    var i = parseInt(trim(match[1]), 10);
                    return $.insert('\n' + match[1].replace(/\d+/, i + 1), -1).scroll('+1'), false;
                }
                return $.insert('\n' + match[1], -1).scroll('+1'), false;
            }
        }
    });

    return editor.update(extend({
        tools: 'b i u | a img footnote | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | hr | undo redo'
    }, o), 0);

};

// Collect all editor instance(s)
TE.Markdown.__instance__ = [];