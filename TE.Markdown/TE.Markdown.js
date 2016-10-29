/*!
 * ==========================================================
 *  MARKDOWN TEXT EDITOR PLUGIN 1.1.4
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.Markdown = function(target, o) {

    var win = window,
        doc = document,
        editor = new TE.HTML(target),
        ui = editor.ui,
        extend = editor._.extend,
        esc = editor._.x,
        format = editor._.format,
        attrs = '(?:\\s[^<>]*?)?',
        attrs_capture = '(|\\s[^<>]*?)',
        content = '([\\s\\S]*?)',
        TAB = '\t';

    editor.update(extend({
        extra: 0, // enable **Markdown Extra** feature
        auto_p: 0, // disable automatic paragraph feature from `TE.HTML` by default
        auto_close: {
            '`': '`'
        },
        tools: 'b i s | a img | sup abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
        states: {
            a: {
                "": [""] // implicit link name shortcut (do not remove!)
            },
            img: {}
        },
        languages: {
            tools: {
                sup: ['Footnote', editor.config.languages.tools.sub[1]]
            },
            modals: {
                a: {
                    title: ['Link URL/Reference ID']
                },
                img: {
                    title: ['Image URL/Reference ID']
                },
                sup: {
                    title: 'Footnote ID'
                }
            }
        },
        advance_br: 1, // press `⇧+↵` to do a hard break
        'advance_h1,h2': 1, // enable **SEText** header style
        'advance_pre,code': 1, // replace with `true` or `%1 .foo` to enable fenced code block syntax in **Markdown Extra**
        'close_h1,h2,h3,h4,h5,h6': 0, // replace with `true` for `### heading 3 ###`
        close_tr: 0, // enable closed table pipe
        formats: {
            b: ['**', '__'], // first array will be used by default
            i: ['_', '*'], // --ibid
            s: '~~',
            h1: ['=', '#'], // --ibid
            h2: ['-', '##'], // --ibid
            h3: '###',
            h4: '####',
            h5: '#####',
            h6: '######',
            blockquote: '>',
            code: ['`', '~'], // --ibid
            ul: ['-', '+', '*'], // --ibid
            ol: ['%1.'],
            hr: ['---', '+++', '***'] // --ibid
        }
    }, o), 0);

    // define editor type
    editor.type = 'Markdown';

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

    function is_number(x) {
        return typeof x === "number";
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function trim(s) {
        return s.replace(/^\s*|\s*$/g, "");
    }

    function trim_right(s) {
        return s.replace(/\s+$/, "");
    }

    function edge(a, b, c) {
        if (a < b) return b;
        if (a > c) return c;
        return a;
    }

    function num(x) {
        return parseInt(x, 10);
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

    var config = editor.config,
        states = config.states,
        languages = config.languages,
        formats = config.formats,
        tab = config.tab,
        placeholders = languages.placeholders,
        header_step = 0,
        extra = config.extra,
        bullet_any = '( +[' + esc(formats.ul).join("") + '] )';

    if (!extra) {
        config['advance_pre,code'] = 0;
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
            editor.insert(placeholders[""]);
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
            click: function(e, $) {
                return $.i().mark(formats.b[0]), false;
            }
        },
        i: {
            click: function(e, $) {
                return $.i().mark(formats.i[0]), false;
            }
        },
        u: 0,
        s: extra ? {
            click: function(e, $) {
                return $.i().mark(formats.s), false;
            }
        } : 0,
        a: {
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    x = s.value,
                    a = s.after,
                    g = $.get(),
                    n = /^ {0,3}\[[^\^]+?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    links = g.match(/^ {0,3}\[[^\^]+?\]:/gm) || [],
                    i18n = languages.modals.a,
                    http = i18n.placeholder[0],
                    state, href, title, index, start, end, i;
                // automatic link
                if (/^([a-z]+:\/\/\S+|<[a-z]+:\/\/\S+>)$/.test(x)) {
                    return $.tidy(' ').mark(['<', '>'], 1), false;
                }
                // collect all embedded reference link(s)
                for (i in links) {
                    i = ' ' + trim(links[i]).replace(/^\[|\]:$/g, "");
                    states.a[i] = 1;
                }
                state = states.a;
                return $.record().ui.prompt(['a[href]', i18n.title[0]], http, 0, function(e, $, v) {
                    var implicit = v === "";
                    v = attr_url(v);
                    $[0]();
                    if (state[v]) {
                        $.trim(trim(b) ? ' ' : "", /^\n+ {0,3}\*?\[/.test(a) ? false : ' ').mark(['[', '][' + v + ']'], 0, false);
                        index = links.indexOf(' [' + v + ']:');
                        if (index === -1 && state[v] !== 1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + s.value + trim_right(s.after) + n + ' [' + (v || trim(x) || placeholders[""]) + ']: ' + (!implicit ? state[v][0] + (state[v][1] ? ' "' + state[v][1] + '"' : "") : "")).select(start, end);
                            if (implicit) $.focus(true).insert(http);
                        }
                    } else {
                        href = v;
                        $.blur().ui.prompt(['a[title]', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_title(v);
                            if (!x) {
                                $.insert(placeholders[""]);
                            }
                            $.i().trim(trim(b) ? ' ' : "", !trim(a) ? "" : (/^\n+ {0,3}\*?\[/.test(a) ? '\n\n ' : ' ')).wrap('[', '](' + href + (title ? ' "' + title + '"' : "") + ')');
                        });
                    }
                    $[1]();
                }), false;
            }
        },
        img: {
            click: function(e, $) {
                var s = $.$(),
                    alt = s.value,
                    b = s.before,
                    a = s.after,
                    g = $.get(),
                    n = /^ {0,3}\[[^\^]+?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    images = g.match(/^ {0,3}\[[^\^]+?\]:/gm) || [],
                    i18n = languages.modals.img,
                    keep = /^\n* {0,3}\[.+?\]:/.test(a) ? ' ' : "",
                    A = trim(a),
                    state, src, title, index, start, end;
                // collect all embedded reference image(s)
                for (i in images) {
                    i = ' ' + trim(images[i]).replace(/^\[|\]:$/g, "");
                    !states.img[i] && (states.img[i] = 1);
                }
                state = states.img;
                return $.ui.prompt(['img[src]', i18n.title[0]], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    src = v;
                    if (!alt) {
                        alt = src.split(/[\/\\\\]/).pop();
                    }
                    alt = attr_title(alt);
                    $[0]().trim(trim(b) ? '\n\n' : "", keep);
                    if (state[v]) {
                        $.insert('![' + alt + '][' + v + ']\n\n', -1, 1);
                        if (keep) $.select($.$().start);
                        index = images.indexOf(' [' + v + ']:');
                        if (index === -1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + s.value + s.after + (A ? n : "") + ' [' + v + ']: ' + state[v][0] + (state[v][1] ? ' "' + state[v][1] + '"' : "")).select(start, end);
                        }
                    } else {
                        $.blur().ui.prompt(['img[title]', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_title(v);
                            $.insert('![' + alt + '](' + src + (title ? ' "' + title + '"' : "") + ')\n\n', -1, 1);
                            if (keep) $.select($.$().start);
                        });
                    }
                    $[1]();
                }), false;
            }
        },
        sub: 0,
        sup: extra ? {
            i: 'thumb-tack',
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    a = s.after,
                    i18n = languages.modals.sup,
                    g = $.get(),
                    n = /^ {0,3}\[\^.+?\]:/.test(trim(g).split('\n').pop()) ? '\n' : '\n\n',
                    notes = g.match(/^ {0,3}\[\^.+?\]:/gm) || [],
                    i = 0, index;
                for (i in notes) {
                    notes[i] = ' ' + trim(notes[i]);
                }
                i = notes.length + 1;
                return $.ui.prompt(['sup[id]', i18n.title], s.value || i18n.placeholder || i, 0, function(e, $, v, w) {
                    v = trim(v || w) || i;
                    index = notes.indexOf(' [^' + v + ']:');
                    if (index !== -1) {
                        i = g.indexOf(notes[index]) + 3;
                        $.select(i, i + v.length);
                    } else {
                        $.trim(trim(b) ? ' ' : "", !trim(a) || /^[\t ]*\n+[\t ]*/.test(a) ? '\n\n' : ' ').insert('[^' + v + ']').set(trim_right($.get()) + n + ' [^' + v + ']: ').focus(true).insert(placeholders[""]);
                    }
                }), false;
            }
        } : 0,
        abbr: extra ? {
            click: function(e, $) {
                var s = $.$(),
                    x = trim(s.value),
                    i18n = languages.modals.abbr,
                    g = $.get(),
                    abbr = force_i(x || placeholders[""]),
                    n = /^ {0,3}\*\[.+?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    abbrs = g.match(/^ {0,3}\*\[.+?\]:/gm) || [],
                    state = states.abbr,
                    i = 0;
                for (i in abbrs) {
                    abbrs[i] = ' ' + trim(abbrs[i]);
                }
                i = abbrs.indexOf(' *[' + abbr + ']:');
                if (x && i !== -1) {
                    i = g.indexOf(abbrs[i]) + 3;
                    return $.select(i, i + abbr.length), false;
                }
                return $.record().ui.prompt(['abbr[title]', i18n.title], state[abbr] || i18n.placeholder, !state[x], function(e, $, v, w) {
                    v = attr_title(v);
                    $[0]().set(trim_right($.get()) + (s.before || x ? n : "") + ' *[' + abbr + ']: ').focus(true).insert(v || w);
                    if (abbr === placeholders[""]) {
                        var a = $.$().start;
                        $.select(a - 3 - abbr.length, a - 3);
                    }
                    $[1]();
                }), false;
            }
        } : 0,
        p: {
            click: function(e, $) {
                if ($.$().length) {
                    return $.tidy('\n\n').replace(/([\t ]*\n[\t ]*){2,}/g, '\n\n'), false;
                }
                return $.tidy('\n\n').insert(placeholders[""]), false;
            }
        },
        'p,h1,h2,h3,h4,h5,h6': {
            click: function(e, $) {
                if (header_step > 5) {
                    header_step = 0;
                } else {
                    header_step++;
                }
                var s = $.$(),
                    setext = config['advance_h1,h2'],
                    setext_esc = '\\s?[' + esc(formats.h1[0] + formats.h2[0]) + ']+\\s*',
                    h1 = esc(formats.h1[1]),
                    clean_B = s.before.replace(pattern('[' + h1 + '\\s]+$'), ""),
                    clean_V = force_i(s.value).replace(pattern('^[' + h1 + '\\s]+|[' + h1 + '\\s]+$', 'g'), "").replace(pattern(setext_esc + '$'), "") || placeholders[""],
                    clean_A = s.after.replace(pattern('^[' + h1 + '\\s]+'), "").replace(pattern('^' + setext_esc), ""),
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
                    $.wrap(H[header_step] + ' ', config['close_h1,h2,h3,h4,h5,h6'] ? ' ' + H[header_step] : "");
                }
                return $[1](), false;
            }
        },
        'blockquote,q': {
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    blockquote = formats.blockquote;
                if (v === placeholders[""]) {
                    return $.select(), false;
                }
                if (!v) {
                    return $[0]().tidy('\n\n').insert(blockquote + ' ', -1).insert(placeholders[""])[1](), false;
                }
                return $.tidy(pattern(blockquote + ' $').test(s.before) ? false : '\n\n')[pattern('^' + blockquote).test(v) ? 'outdent' : 'indent'](blockquote + ' '), false;
            }
        },
        'pre,code': {
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    v = s.value,
                    pre = config['advance_pre,code'],
                    code = formats.code,
                    p = code[1] || code[0];
                p = p + p + p; // repeat three times
                if (!is_string(pre) && pre) {
                    pre = p;
                } else if (is_string(pre) && pre.indexOf('%1') !== -1) {
                    pre = format(pre, [p]);
                }
                var dents = '( {4,}|\\t' + (is_string(pre) ? '|' + esc(pre) : "") + ')';
                // block
                if (pattern('(^|\\n)' + dents + '?$').test(b)) {
                    if (pre) {
                        return $.mark([pre, pre.split(/\s+/)[0]], 0, '\n\n', '\n'), false;
                    }
                    pre = tab === TAB ? TAB : '    ';
                    if (!v) {
                        $[0]().tidy('\n\n');
                        var t = $.$().start,
                            str = pre + placeholders[""];
                        return $.insert(str).select(t + pre.length, t + str.length)[1](), false;
                    } else if(v === placeholders[""] && pattern(dents + '$').test(b)) {
                        return $.select(s.start - pre.length, s.end), false;
                    }
                    return $.tidy('\n\n')[pattern('^' + dents).test(v) ? 'outdent' : 'indent'](pre), false;
                }
                // span
                return $.mark(code[0]), false;
            }
        },
        ul: {
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    b = s.before,
                    a = s.after,
                    ul = formats.ul[0],
                    ol = formats.ol[0],
                    esc_ul = esc(ul),
                    esc_ol = format(esc(ol), ['\\d+']),
                    bullet = pattern('(^|\\n)([\\t ]*) ' + esc_ul + ' (.*)$'),
                    bullet_s = pattern('^(.*) ' + esc_ul + ' ', 'gm'),
                    list = pattern('(^|\\n)([\\t ]*) ' + esc_ol + ' (.*)$'),
                    list_s = pattern('^(.*) ' + esc_ol + ' ', 'gm'),
                    placeholder = placeholders[""], B;
                if (!v) {
                    if (b && a) {
                        // ordered list detected
                        if (list.test(b)) {
                            B = b.replace(list, '$1$2 ' + ul + ' $3');
                        // unordered list detected
                        } else if (bullet.test(b)) {
                            B = b.replace(bullet, '$1$2$3');
                        // plain text ...
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
                        $.replace(bullet_s, '$1');
                    // plain text ...
                    } else {
                        $.replace(/^(\s*)(\S.*)$/gm, '$1 ' + ul + ' $2');
                    }
                    return false;
                }
            }
        },
        ol: {
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    b = s.before,
                    a = s.after,
                    ul = formats.ul[0],
                    ol = formats.ol[0],
                    ol_first = format(ol, [1]),
                    esc_ul = esc(ul),
                    esc_ol = format(esc(ol), ['\\d+']),
                    bullet = pattern('(^|\\n)([\\t ]*) ' + esc_ul + ' (.*)$'),
                    bullet_s = pattern('^(.*) ' + esc_ul + ' ', 'gm'),
                    list = pattern('(^|\\n)([\\t ]*) ' + esc_ol + ' (.*)$'),
                    list_s = pattern('^(.*) ' + esc_ol + ' ', 'gm'),
                    placeholder = placeholders[""],
                    i = 0, B;
                if (!v) {
                    if (b && a) {
                        // unordered list detected
                        if (bullet.test(b)) {
                            B = b.replace(bullet, '$1$2 ' + ol_first + ' $3');
                        // ordered list detected
                        } else if (list.test(b)) {
                            B = b.replace(list, '$1$2$3');
                        // plain text ...
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
                        $.replace(list_s, '$1');
                    // plain text ...
                    } else {
                        $.replace(/^(\s*)(\S.*)$/gm, function(a, b, c) {
                            return ++i, b + ' ' + format(ol, [i]) + ' ' + c;
                        });
                    }
                    return false;
                }
            }
        },
        table: extra ? function(e, $) {
            var str = states.tr,
                std = states.td,
                i18n = languages.modals.table,
                p = languages.placeholders.table,
                q = format(p[0], [1, 1]),
                o = [], s, c, r;
            if ($.$().value === q) return $.select(), false;
            return $[0]().ui.prompt(['table>td', i18n.title[0]], i18n.placeholder[0], 0, function(e, $, v, w) {
                c = edge(num(v) || w, std[0], std[1]);
                $.blur().ui.prompt(['table>tr', i18n.title[1]], i18n.placeholder[1], 0, function(e, $, v, w) {
                    r = edge(num(v) || w, str[0], str[1]);
                    var i, j, k, l, m, n;
                    for (i = 0; i < r; ++i) {
                        s = '|';
                        for (j = 0; j < c; ++j) {
                            s += ' ' + format(p[1], [i + 1, j + 1]) + ' |';
                        }
                        o.push(s);
                    }
                    o = o.join('\n');
                    s = '|';
                    for (k = 0; k < c; ++k) {
                        s += ' ' + format(p[0], [k + 1, k + 1]).replace(/./g, '-') + ' |';
                    }
                    o = s + '\n' + o;
                    s = '|';
                    for (l = 0; l < c; ++l) {
                        s += ' ' + format(p[0], [1, l + 1]) + ' |';
                    }
                    o = s + '\n' + o;
                    if (!config.close_tr) {
                        o = o.replace(/^\|\s*|\s*\|$/gm, "");
                    }
                    $.tidy('\n\n').insert(o);
                    m = $.$();
                    n = m.start + m.value.indexOf(q);
                    $.select(n, n + q.length)[1]();
                });
            }), false;
        } : 0,
        hr: {
            click: function(e, $) {
                return $.tidy('\n\n', "").insert(formats.hr[0] + '\n\n', -1), false;
            }
        }
    });

    extend(ui.keys, {
        'control+u': 0,
        'control+arrowup': 'sup',
        'control+arrowdown': 'sup',
        'control+shift+?': 'abbr',
        'shift+enter': function(e, $) {
            var br = config.advance_br;
            if (!is_string(br) && br) {
                br = '  \n';
            }
            return $.trim().insert(br || '\n', -1).scroll(true), false;
        },
        'enter': function(e, $) {
            var s = $.$(),
                blockquote = formats.blockquote,
                ul = formats.ul[0],
                ol = formats.ol[0],
                esc_ol = format(esc(ol), ['\\d+']),
                regex = '((' + esc(blockquote) + ' )+|' + bullet_any + '| +(' + esc_ol + ') )',
                match = pattern('^' + regex + '.*$', 'gm').exec(s.before.split('\n').pop());
            if (match) {
                if (match[0] === match[1]) {
                    return $.outdent(pattern(regex)), false;
                } else if (pattern('\\s*' + esc_ol + '\\s*').test(match[1])) {
                    var i = num(trim(match[1]));
                    return $.insert('\n' + match[1].replace(/\d+/, i + 1), -1).scroll(true), false;
                }
                return $.insert('\n' + match[1], -1).scroll(true), false;
            }
        },
        'shift+tab': function(e, $) {
            var s = $.$(),
                b = s.before,
                v = s.value,
                a = s.after,
                ol = formats.ol[0],
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
                ol = formats.ol[0],
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

    return editor.update({}, 0);

};