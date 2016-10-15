/*!
 * ==========================================================
 *  MARKDOWN TEXT EDITOR PLUGIN 1.1.0
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
            states: {
                a: {
                    'test': ['../foo.html', 'Test Reference Link']
                },
                img: {
                    'test': ['../foo.jpg', 'Test Reference Image']
                }
            },
            languages: {
                tools: {
                    footnote: 'Footnote (' + _u2318 + '+' + _u2193 + ')',
                    abbr: 'Abbreviation (' + _u2318 + '+?)'
                },
                modals: {
                    img: {
                        title: ['Image URL', 'Image Title'],
                        placeholder: ['http://', 'image title here' + _u2026]
                    },
                    footnote: {
                        title: 'Footnote ID'
                    },
                    abbr: {
                        title: 'Abbreviation',
                        placeholder: 'meaning here' + _u2026
                    }
                }
            },
            enable_setext_header: 1,
            enable_closed_atx_header: 0,
            enable_fenced_code_block: 1, // replace with `~~~` to enable fenced code block syntax in **Markdown Extra**
            enable_hard_break: 1, // press `⇧+↵` to do a hard break
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
        content = '([\\s\\S]*?)',
        TAB = '\t';

    TE.Markdown.__instance__.push(editor);

    var config = editor.config,
        states = config.states,
        languages = config.languages,
        formats = config.formats,
        classes = config.classes,
        tab = config.tab,
        suffix = config.suffix,
        placeholder = languages.others.placeholder,
        header_step = 0,
        bullet_any = '( +[' + esc(formats.ul + '*+-') + '] )';

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
        return force_i(s).replace(/<.*?>/g, "").replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    function force_i(s) {
        return trim(s.replace(/\s+/g, ' '));
    }

    editor.mark = function(str, wrap, gap_1, gap_2) {
        if (!is_object(str)) str = [str];
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var s = editor[0]().$(),
            a = str[0] + gap_2,
            b = gap_2 + (is_set(str[1]) ? str[1] : str[0]),
            c = s.value,
            A = esc(a),
            B = esc(b),
            m = pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = pattern(A + '$'),
            m_B = pattern('^' + B),
            before = s.before,
            after = s.after;
        if (!c) {
            editor.insert(placeholder);
        } else {
            gap_1 = false;
        }
        return editor.toggle(
            // when ...
            wrap ? !m.test(c) : (!m_A.test(before) && !m_B.test(after)),
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
                return $.i().mark(formats.b), false;
            }
        },
        i: {
            i: 'italic',
            click: function(e, $) {
                return $.i().mark(formats.i), false;
            }
        },
        u: 0,
        s: {
            i: 'strikethrough',
            click: function(e, $) {
                return $.i().mark(formats.s), false;
            }
        },
        a: {
            i: 'link',
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    x = s.value,
                    a = s.after,
                    g = $.get(),
                    n = /^ \[[^\^]*?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    links = g.match(/^ \[[^\^]*?\]:/gm) || [],
                    i18n = languages.modals.a,
                    state = states.a,
                    href, title, index, start, end;
                return $.record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = force_i(v);
                    if (state[v]) {
                        $.trim(b ? ' ' : "", false).mark(['[', '][' + v + ']'], 0, !a || /^\n/.test(a) ? false : ' ');
                        index = links.indexOf(' [' + v + ']:');
                        if (index === -1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + s.value + s.after + n + ' [' + v + ']: ' + state[v][0] + (state[v][1] ? ' "' + state[v][1] + '"' : "")).select(start, end);
                        }
                    } else {
                        href = v;
                        $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_value(v);
                            $.i().mark(['[', '](' + href + (title ? ' "' + title + '"' : "") + ')']);
                        });
                    }
                }), false;
            }
        },
        img: {
            i: 'image',
            click: function(e, $) {
                var s = $.$(),
                    alt = s.value,
                    b = s.before,
                    a = s.after,
                    g = $.get(),
                    n = /^ \[[^\^]*?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    images = g.match(/^ \[[^\^]*?\]:/gm) || [],
                    i18n = languages.modals.img,
                    state = states.img,
                    keep = /^\s* \*?\[.*?\]:/.test(a) ? ' ' : "",
                    src, title, index, start, end;
                return $.record().ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = force_i(v);
                    src = v;
                    if (!alt) {
                        alt = src.split(/[\/\\\\]/).pop();
                    }
                    alt = attr_value(alt);
                    $[0]().trim(trim(b) ? '\n\n' : "", keep).insert("");
                    if (state[v]) {
                        $.insert('![' + alt + '][' + v + ']\n\n', -1);
                        if (keep) $.select($.$().start);
                        index = images.indexOf(' [' + v + ']:');
                        if (index === -1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + s.value + s.after + n + ' [' + v + ']: ' + state[v][0] + (state[v][1] ? ' "' + state[v][1] + '"' : "")).select(start, end);
                        }
                    } else {
                        $.blur().ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_value(v);
                            $.insert('![' + alt + '](' + src + (title ? ' "' + title + '"' : "") + ')\n\n', -1);
                            if (keep) $.select($.$().start);
                        });
                    }
                    $[1]();
                }), false;
            }
        },
        footnote: {
            i: 'thumb-tack',
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    a = s.after,
                    i18n = languages.modals.footnote,
                    g = $.get(),
                    n = /^ \[\^.*?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    notes = g.match(/^ \[\^.*?\]:/gm) || [],
                    i = notes.length + 1, index;
                return $.ui.prompt(i18n.title, s.value || i18n.placeholder || i, 0, function(e, $, v) {
                    v = trim(v) || i;
                    index = notes.indexOf(' [^' + v + ']:');
                    if (index !== -1) {
                        i = g.indexOf(notes[index]) + 3;
                        $.select(i, i + v.length);
                    } else {
                        $.trim(b ? ' ' : "", !a || /^\n/.test(a) ? false : ' ').insert('[^' + v + ']').set($.get().replace(/\s+$/g, "") + n + ' [^' + v + ']: ').focus(true).insert(placeholder);
                    }
                }), false;
            }
        },
        abbr: {
            i: 'question',
            click: function(e, $) {
                var s = $.$(),
                    i18n = languages.modals.abbr,
                    g = $.get(),
                    abbr = s.value || placeholder,
                    n = /^ \*\[.*?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    abbrs = g.match(/^ \*\[.*?\]:/gm) || [],
                    i = abbrs.indexOf(' *[' + abbr + ']:');
                if (s.value && i !== -1) {
                    i = g.indexOf(abbrs[i]) + 3;
                    return $.select(i, i + abbr.length), false;
                }
                return $.ui.prompt(i18n.title, i18n.placeholder, 0, function(e, $, v) {
                    v = trim(v);
                    $.set($.get().replace(/\s+$/g, "") + (s.before || s.value ? n : "") + ' *[' + abbr + ']: ').focus(true).insert(v);
                    if (abbr === placeholder) {
                        var a = $.$().start;
                        $.select(a - 3 - abbr.length, a - 3);
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
                    setext_esc = '\\s?[' + esc(formats.h1[0] + formats.h2[0]) + ']+\\s*',
                    clean_B = s.before.replace(/[#\s]+$/, ""),
                    clean_V = force_i(s.value).replace(/^[#\s]+|[#\s]+$/g, "").replace(pattern(setext_esc + '$'), "") || placeholder,
                    clean_A = s.after.replace(/^[#\s]+/, "").replace(pattern('^' + setext_esc), ""),
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
                    v = s.value,
                    blockquote = formats.blockquote;
                if (v === placeholder) {
                    return $.select(), false;
                }
                if (!v) {
                    return $[0]().tidy('\n\n').insert(blockquote + ' ', -1).insert(placeholder)[1](), false;
                }
                return $.tidy(pattern(blockquote + ' $').test(s.before) ? false : '\n\n')[pattern('^' + blockquote).test(v) ? 'outdent' : 'indent'](blockquote + ' '), false;
            }
        },
        'pre,code': {
            i: 'code',
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    pre = config.enable_fenced_code_block,
                    code = formats.code, attr;
                if (!is_string(pre) && pre) pre = '~~~';
                // block
                if (/(^|\n)$/.test(s.before)) {
                    if (pre) {
                        return $.mark([pre, pre.split(/\s+/)[0]], 0, '\n\n', '\n'), false;
                    }
                    if (!v) {
                        $.insert(placeholder);
                    }
                    return $.tidy('\n\n')[/^(\t| {4})/.test(v) ? 'outdent' : 'indent'](tab === TAB ? TAB : '    '), false;
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
                if (!v) {
                    if (b && a) {
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
                if (!v) {
                    if (b && a) {
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
        'control+shift+?': 'abbr',
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
                regex = '((' + esc(blockquote) + ' )+|' + bullet_any + '| +(' + esc_ol + ') )',
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
        },
        'shift+tab': function(e, $) {
            var s = $.$(),
                b = s.before,
                v = s.value,
                a = s.after,
                ol = formats.ol,
                esc_ol = esc(ol),
                esc_ol_any = format(esc_ol, ['\\d+']),
                esc_blockquote = esc(formats.blockquote),
                bullets = pattern('  ' + bullet_any + '$'),
                lists = pattern('   ( ?' + esc_ol_any + ' )$'),
                dents = '(' + esc_blockquote + ' |' + bullet_any + '| +' + esc_ol_any + ' )',
                match;
            if (!v) {
                if (match = b.match(pattern(esc_blockquote + ' $'))) {
                    return $.outdent(match[0]), false;
                } else if (match = b.match(bullets)) {
                    b = b.replace(bullets, '$1');
                    return $.set(b + a).select(b.length), false;
                } else if (match = b.match(lists)) {
                    b = b.replace(lists, '$1');
                    return $.set(b + a).select(b.length), false;
                }
            } else if (v && (match = v.match(pattern('(^|\\n)' + dents, 'g')))) {
                return $.outdent(pattern(dents)), false;
            }
            return ui.tools.outdent.click(e, $);
        },
        'tab': function(e, $) {
            var s = $.$(),
                b = s.before,
                v = s.value,
                a = s.after,
                ol = formats.ol,
                esc_ol = esc(ol),
                bullets = pattern(bullet_any + '$'),
                lists = pattern(' ?' + format(esc_ol, ['\\d+']) + ' $'),
                match;
            if (!v) {
                if (match = b.match(pattern(esc(formats.blockquote) + ' $'))) {
                    return $.insert(match[0], -1), false;
                } else if (match = b.match(bullets)) {
                    b = b.replace(bullets, '  $1');
                    return $.set(b + a).select(b.length), false;
                } else if (match = b.match(lists)) {
                    b = b.replace(lists, '    ' + format(ol, [1]) + ' ');
                    return $.set(b + a).select(b.length), false;
                }
            }
            return ui.tools.indent.click(e, $);
        }
    });

    return editor.update(extend({
        tools: 'b i | a img | footnote abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | hr | undo redo'
    }, o), 0);

};

// Collect all editor instance(s)
TE.Markdown.__instance__ = [];