/*!
 * ==========================================================
 *  MARKDOWN TEXT EDITOR PLUGIN 1.4.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.ui.Markdown = function(target, o) {

    var editor = TE.ui.HTML || TE.ui,
        $ = editor(target, {
            extra: 0, // enable **Markdown Extra** feature
            auto_p: 0, // disable automatic paragraph feature from `TE.ui.HTML` by default
            auto_close: {
                '`': '`',
                '*': '*',
                '_': '_',
                '~': '~'
            },
            tools: 'b i s | a img | note abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            states: {
                a: {
                    "": [""] // implicit link name shortcut (do not remove!)
                },
                img: {}
            },
            languages: {
                tools: {
                    note: ['Footnote', '\u2318+\u2193']
                },
                modals: {
                    a: {
                        title: ['Link URL/Reference ID']
                    },
                    img: {
                        title: ['Image URL/Reference ID']
                    },
                    note: {
                        title: 'Footnote ID'
                    }
                }
            },

            'advance_br': 1, // press `⇧+↵` to do a hard break
            'advance_h1,h2': 1, // enable **SEText** header style
            'advance_pre,code': 1, // replace with `true` or `%1 .foo` to enable fenced code block syntax in **Markdown Extra**
            'close_h1,h2,h3,h4,h5,h6': 0, // replace with `true` for `### heading 3 ###`
            'close_tr': 0, // enable closed table pipe

            formats: {
                b: ['**', '__'], // first array will be used by default
                i: ['_', '*'], // --ibid
                s: ['~~'],
                h1: ['=', '#'], // --ibid
                h2: ['-', '##'], // --ibid
                h3: ['###'],
                h4: ['####'],
                h5: ['#####'],
                h6: ['######'],
                blockquote: ['>'],
                code: ['`', '~'], // --ibid
                ul: ['-', '+', '*'], // --ibid
                ol: ['%1.'],
                hr: ['---', '+++', '***'] // --ibid
            }
        }),

        ui = $.ui,

        TAB = '\t',

        is = TE.is,
        is_object = is.o,
        is_set = function(x) {
            return !is.x(x);
        },
        is_string = is.s,

        _ = $._,
        _edge = _.edge,
        _esc = _.x,
        _extend = _.extend,
        _format = _.format,
        _int = _.i,
        _pattern = _.pattern,
        _replace = _.replace,
        _trim = _.trim;

    $.update(o, 0);

    // define editor type
    $.type = 'Markdown';

    function force_i(s) {
        return _trim(s.replace(/\s+/g, ' '));
    }

    function attr_title(s) {
        return _replace(force_i(s), [/<.*?>/g, '"', "'", '(', ')', '[', ']'], ["", '&#34;', '&#39;', '&#40;', '&#41;', '&#91;', '&#93;']);
    }

    function attr_url(s) {
        return _replace(force_i(s), [/<.*?>/g, /\s/g, '"', '(', ')', '[', ']'], ["", '%20', '%22', '%28', '%29', '%5B', '%5D']);
    }

    var config = $.config,

        extra = config.extra,
        formats = config.formats,
        languages = config.languages,
        states = config.states,
        tab = config.tab,

        placeholders = languages.placeholders,

        bullet_any = '( +[' + _esc(formats.ul).join("") + '] )',
        header_step = 0;

    if (!extra) {
        config['advance_pre,code'] = 0;
    }

    $.mark = function(str, wrap, gap_1, gap_2) {
        if (!is_object(str)) str = [str];
        if (!is_set(gap_1)) gap_1 = ' ';
        if (!is_set(gap_2)) gap_2 = "";
        var current = $.h,
            s = $[0]().$(),
            a = str[0] + gap_2,
            b = gap_2 + (is_set(str[1]) ? str[1] : str[0]),
            c = s.value,
            A = _esc(a),
            B = _esc(b),
            m = _pattern('^' + A + '([\\s\\S]*?)' + B + '$'),
            m_A = _pattern(A + '$'),
            m_B = _pattern('^' + B),
            before = s.before,
            after = s.after;
        if (!c) {
            $.insert(placeholders[""]);
        } else {
            gap_1 = false;
        }
        return $.toggle(
            // when ...
            wrap ? !m.test(c) : (!m_A.test(before) && !m_B.test(after)),
            // do ...
            [
                // first toggle
                function($) {
                    $.unwrap(a, b, 1).tidy(/<[^\/<>]+?>$/.test(before) ? "" : gap_1, /^<\/[^<>]+?>/.test(after) ? "" : gap_1).wrap(a, b, wrap);
                },
                // second toggle (the reset state)
                function($) {
                    $.unwrap(a, b, wrap);
                }
            ]
        )[current]();
    };

    _extend(ui.tools, {
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
                return $.i().mark(formats.s[0]), false;
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
                    i = ' ' + _trim(links[i]).replace(/^\[|\]:$/g, "");
                    states.a[i] = 1;
                }
                state = states.a;
                return ui.prompt(i18n.title[0], http, 0, function(e, $, v) {
                    var implicit = v === "";
                    v = attr_url(v);
                    $[0]();
                    if (state[v]) {
                        $.trim(_trim(b) ? ' ' : "", /^\n+ {0,3}\*?\[/.test(a) ? false : ' ').mark(['[', '][' + v + ']'], 0, false);
                        index = links.indexOf(' [' + v + ']:');
                        if (index === -1 && state[v] !== 1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + x + _trim(s.after, 1) + n + ' [' + (v || _trim(x) || placeholders[""]) + ']: ' + (!implicit ? state[v][0] + (state[v][1] ? ' "' + state[v][1] + '"' : "") : "")).select(start, end);
                            if (implicit) $.focus(1).insert(http);
                        }
                    } else {
                        href = v;
                        ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_title(v);
                            if (!x) {
                                $.insert(placeholders[""]);
                            }
                            $.i().trim(_trim(b) ? ' ' : "", !_trim(a) ? "" : (/^\n+ {0,3}\*?\[/.test(a) ? '\n\n ' : ' ')).wrap('[', '](' + href + (title ? ' "' + title + '"' : "") + ')');
                        }, 0, 0, 'a[title]');
                    }
                    $[1]();
                }, 0, 0, 'a[href]').record(), false;
            }
        },
        img: {
            click: function(e, $) {
                var s = $.$(),
                    x = s.value,
                    alt = x,
                    b = s.before,
                    a = s.after,
                    g = $.get(),
                    n = /^ {0,3}\[[^\^]+?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    images = g.match(/^ {0,3}\[[^\^]+?\]:/gm) || [],
                    i18n = languages.modals.img,
                    keep = /^\n* {0,3}\[.+?\]:/.test(a) ? ' ' : "",
                    A = _trim(a),
                    state, src, title, index, start, end, i;
                // collect all embedded reference image(s)
                for (i in images) {
                    i = ' ' + _trim(images[i]).replace(/^\[|\]:$/g, "");
                    !states.img[i] && (states.img[i] = 1);
                }
                state = states.img;
                return ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    v = attr_url(v);
                    src = v;
                    if (!alt) {
                        alt = src.split(/[\/\\\\]/).pop();
                    }
                    alt = attr_title(alt);
                    $[0]().trim(_trim(b) ? '\n\n' : "", keep);
                    if (state[v]) {
                        $.insert('![' + alt + '][' + v + ']\n\n', 0, 1);
                        if (keep) $.select($.$().start);
                        index = images.indexOf(' [' + v + ']:');
                        if (index === -1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + x + s.after + (A ? n : "") + ' [' + v + ']: ' + state[v][0] + (state[v][1] ? ' "' + state[v][1] + '"' : "")).select(start, end);
                        }
                    } else {
                        ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_title(v);
                            $.insert('![' + alt + '](' + src + (title ? ' "' + title + '"' : "") + ')\n\n', 0, 1);
                            if (keep) $.select($.$().start);
                        }, 0, 0, 'img[title]');
                    }
                    $[1]();
                }, 0, 0, 'img[src]'), false;
            }
        },
        sub: 0,
        sup: 0,
        abbr: extra ? {
            click: function(e, $) {
                var s = $.$(),
                    x = _trim(s.value),
                    i18n = languages.modals.abbr,
                    g = $.get(),
                    abbr = force_i(x || placeholders[""]),
                    n = /^ {0,3}\*\[.+?\]:/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    abbrs = g.match(/^ {0,3}\*\[.+?\]:/gm) || [],
                    state = states.abbr,
                    i = 0;
                for (i in abbrs) {
                    abbrs[i] = ' ' + _trim(abbrs[i]);
                }
                i = abbrs.indexOf(' *[' + abbr + ']:');
                if (x && i !== -1) {
                    i = g.indexOf(abbrs[i]) + 3;
                    $.select(i, i + abbr.length);
                    return target.scrollTop = $.$(1).caret[0].y, false;
                }
                return ui.prompt(i18n.title, state[abbr] || i18n.placeholder, !state[x], function(e, $, v, w) {
                    v = attr_title(v);
                    $[0]().set(_trim($.get(), 1) + (s.before || x ? n : "") + ' *[' + abbr + ']: ').focus(1).insert(v || w);
                    if (abbr === placeholders[""]) {
                        var a = $.$().start;
                        $.select(a - 3 - abbr.length, a - 3);
                    }
                    $[1]();
                }, 0, 0, 'abbr[title]').record(), false;
            }
        } : 0,
        p: {
            click: function(e, $) {
                if ($.$().length) {
                    return $.tidy('\n\n').replace(/([\t ]*\n[\t ]*){2,}/g, '\n\n'), false;
                }
                return $.tidy('\n\n').insert(placeholders[""]).scroll(2), false;
            }
        },
        br: {
            click: function(e, $) {
                var br = config.advance_br;
                if (!is_string(br) && br) {
                    br = '  \n';
                }
                return $.trim().insert(br || '\n', 0).scroll(1), false;
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
                    setext_esc = '\\s?[' + _esc(formats.h1[0] + formats.h2[0]) + ']+\\s*',
                    h1 = _esc(formats.h1[1]),
                    clean_B = s.before.replace(_pattern('[' + h1 + '\\s]+$'), ""),
                    clean_V = force_i(s.value).replace(_pattern('^[' + h1 + '\\s]+|[' + h1 + '\\s]+$', 'g'), "").replace(_pattern(setext_esc + '$'), "") || placeholders[""],
                    clean_A = s.after.replace(_pattern('^[' + h1 + '\\s]+'), "").replace(_pattern('^' + setext_esc), ""),
                    H = [
                        "",
                        formats.h1[setext ? 0 : 1],
                        formats.h2[setext ? 0 : 1],
                        formats.h3[0],
                        formats.h4[0],
                        formats.h5[0],
                        formats.h6[0]
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
                    blockquote = formats.blockquote[0];
                if (v === placeholders[""]) {
                    return $.select(), false;
                }
                if (!v) {
                    return $[0]().tidy('\n\n').insert(blockquote + ' ', 0).insert(placeholders[""])[1](), false;
                }
                return $.tidy(_pattern(blockquote + ' $').test(s.before) ? false : '\n\n')[_pattern('^' + blockquote).test(v) ? 'outdent' : 'indent'](blockquote + ' '), false;
            }
        },
        'pre,code': {
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    v = s.value,
                    pre = config['advance_pre,code'],
                    code = formats.code,
                    p = code[1] || code[0],
                    dents, t, str;
                p = p + p + p; // repeat three times
                if (!is_string(pre) && pre) {
                    pre = p;
                } else if (is_string(pre) && pre.indexOf('%') !== -1) {
                    pre = _format(pre, [p]);
                }
                dents = '( {4,}|\\t' + (is_string(pre) ? '|' + _esc(pre) : "") + ')';
                // block
                if (_pattern('(^|\\n)' + dents + '?$').test(b)) {
                    if (pre) {
                        return $.mark([pre, pre.split(/\s+/)[0]], 0, '\n\n', '\n'), false;
                    }
                    pre = tab === TAB ? TAB : '    ';
                    if (!v) {
                        $[0]().tidy('\n\n');
                        t = $.$().start;
                        str = pre + placeholders[""];
                        return $.insert(str).select(t + pre.length, t + str.length)[1](), false;
                    } else if (v === placeholders[""] && _pattern(dents + '$').test(b)) {
                        return $.select(s.start - pre.length, s.end), false;
                    }
                    return $.tidy('\n\n')[_pattern('^' + dents).test(v) ? 'outdent' : 'indent'](pre), false;
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
                    esc_ul = _esc(ul),
                    esc_ol = _format(_esc(ol), ['\\d+']),
                    bullet = _pattern('(^|\\n)([\\t ]*) ' + esc_ul + ' (.*)$'),
                    bullet_s = _pattern('^(.*) ' + esc_ul + ' ', 'gm'),
                    list = _pattern('(^|\\n)([\\t ]*) ' + esc_ol + ' (.*)$'),
                    list_s = _pattern('^(.*) ' + esc_ol + ' ', 'gm'),
                    placeholder = placeholders[""], B;
                if (!v) {
                    if (a && b && (a[0] !== '\n' || b.slice(-1) !== '\n')) {
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
                    return $[0]().tidy('\n\n').insert(' ' + ul + ' ', 0).insert(placeholder)[1](), false;
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
                    ol_first = _format(ol, [1]),
                    esc_ul = _esc(ul),
                    esc_ol = _format(_esc(ol), ['\\d+']),
                    bullet = _pattern('(^|\\n)([\\t ]*) ' + esc_ul + ' (.*)$'),
                    bullet_s = _pattern('^(.*) ' + esc_ul + ' ', 'gm'),
                    list = _pattern('(^|\\n)([\\t ]*) ' + esc_ol + ' (.*)$'),
                    list_s = _pattern('^(.*) ' + esc_ol + ' ', 'gm'),
                    placeholder = placeholders[""],
                    i = 0, B;
                if (!v) {
                    if (a && b && (a[0] !== '\n' || b.slice(-1) !== '\n')) {
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
                    return $[0]().tidy('\n\n').insert(' ' + ol_first + ' ', 0).insert(placeholder)[1](), false;
                } else {
                    // start ...
                    if (v === placeholder) {
                        $.select();
                    // unordered list detected
                    } else if (bullet_s.test(v)) {
                        $.replace(bullet_s, function(a, b, c) {
                            return ++i, b + ' ' + _format(ol, [i]) + ' ';
                        });
                    // ordered list detected
                    } else if (list_s.test(v)) {
                        $.replace(list_s, '$1');
                    // plain text ...
                    } else {
                        $.replace(/^(\s*)(\S.*)$/gm, function(a, b, c) {
                            return ++i, b + ' ' + _format(ol, [i]) + ' ' + c;
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
                q = _format(p[0], [1, 1]),
                o = [], s, c, r;
            if ($[0]().$().value === q) return $.select(), false;
            return ui.prompt(i18n.title[0], i18n.placeholder[0], 0, function(e, $, v, w) {
                c = _edge(_int(v) || w, std[0], std[1]);
                ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v, w) {
                    r = _edge(_int(v) || w, str[0], str[1]);
                    var i, j, k, l, m, n;
                    for (i = 0; i < r; ++i) {
                        s = '|';
                        for (j = 0; j < c; ++j) {
                            s += ' ' + _format(p[1], [i + 1, j + 1]) + ' |';
                        }
                        o.push(s);
                    }
                    o = o.join('\n');
                    s = '|';
                    for (k = 0; k < c; ++k) {
                        s += ' ' + _format(p[0], [k + 1, k + 1]).replace(/./g, '-') + ' |';
                    }
                    o = s + '\n' + o;
                    s = '|';
                    for (l = 0; l < c; ++l) {
                        s += ' ' + _format(p[0], [1, l + 1]) + ' |';
                    }
                    o = s + '\n' + o;
                    if (!config.close_tr) {
                        o = o.replace(/^\|\s*|\s*\|$/gm, "");
                    }
                    $.tidy('\n\n').insert(o);
                    m = $.$();
                    n = m.start + m.value.indexOf(q);
                    $.select(n, n + q.length)[1]();
                }, 0, 0, 'table>tr');
            }, 0, 0, 'table>td'), false;
        } : 0,
        hr: {
            click: function(e, $) {
                return $.tidy('\n\n', "").insert(formats.hr[0] + '\n\n', 0).scroll(2), false;
            }
        },
        note: extra ? {
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    a = s.after,
                    i18n = languages.modals.note,
                    g = $.get(),
                    n = /^ {0,3}\[\^.+?\]:/.test(_trim(g).split('\n').pop()) ? '\n' : '\n\n',
                    notes = g.match(/^ {0,3}\[\^.+?\]:/gm) || [],
                    i = 0, index;
                for (i in notes) {
                    notes[i] = ' ' + _trim(notes[i]);
                }
                i = notes.length + 1;
                return ui.prompt(i18n.title, s.value || i, 0, function(e, $, v, w) {
                    v = _trim(v || w) || i;
                    index = notes.indexOf(' [^' + v + ']:');
                    if (index !== -1) {
                        i = g.indexOf(notes[index]) + 3;
                        $.select(i, i + v.length);
                        target.scrollTop = $.$(1).caret[0].y;
                    } else {
                        $.trim(_trim(b) ? ' ' : "", !_trim(a) || /^[\t ]*\n+[\t ]*/.test(a) ? '\n\n' : ' ').insert('[^' + v + ']').set(_trim($.get(), 1) + n + ' [^' + v + ']: ').focus(1).insert(placeholders[""]);
                    }
                }, 0, 0, 'note[id]'), false;
            }
        } : 0
    });

    _extend(ui.keys, {
        'enter': function(e, $) {
            var s = $.$(),
                placeholder = placeholders[""],
                blockquote = formats.blockquote[0],
                ul = formats.ul[0],
                ol = formats.ol[0],
                esc_ol = _format(_esc(ol), ['\\d+']),
                regex = '((' + _esc(blockquote) + ' )+|' + bullet_any + '| +(' + esc_ol + ') )',
                match = _pattern('^' + regex + '.*$', 'gm').exec(s.before.split('\n').pop());
            if (match) {
                if (match[0] === match[1]) {
                    return $[0]().insert("").outdent(_pattern(regex))[1](), false;
                } else if (_pattern('\\s*' + esc_ol + '\\s*').test(match[1])) {
                    var i = _int(_trim(match[1]));
                    return $[0]().insert('\n' + match[1].replace(/\d+/, i + 1), 0).insert(placeholder).scroll(1)[1](), false;
                }
                return $[0]().insert('\n' + match[1], 0).insert(placeholder).scroll(1)[1](), false;
            }
        },
        'shift+tab': function(e, $) {
            var s = $.$(),
                b = s.before,
                v = s.value,
                a = s.after,
                placeholder = placeholders[""],
                ol = formats.ol[0],
                esc_ol = _esc(ol),
                esc_ol_any = _format(esc_ol, ['\\d+']),
                esc_blockquote = _esc(formats.blockquote[0]),
                bullets = _pattern('  ' + bullet_any + '$'),
                lists = _pattern('   ( ?' + esc_ol_any + ' )$'),
                dents = '(' + esc_blockquote + ' |' + bullet_any + '| +' + esc_ol_any + ' )',
                match;
            if (!v || v === placeholder) {
                if (match = b.match(_pattern(esc_blockquote + ' $'))) {
                    return $[0]().insert("").outdent(match[0]).insert(v)[1](), false;
                } else if (match = b.match(bullets)) {
                    b = b.replace(bullets, '$1');
                    return $.set(b + v + a).select(b.length, (b + v).length), false;
                } else if (match = b.match(lists)) {
                    b = b.replace(lists, '$1');
                    return $.set(b + v + a).select(b.length, (b + v).length), false;
                }
            } else if (v && (match = v.match(_pattern('(^|\\n)' + dents, 'g')))) {
                return $.outdent(_pattern(dents)), false;
            }
            return ui.tools.outdent.click(e, $);
        },
        'tab': function(e, $) {
            var s = $.$(),
                b = s.before,
                v = s.value,
                a = s.after,
                placeholder = placeholders[""],
                ol = formats.ol[0],
                blockquote = formats.blockquote[0],
                esc_ol = _esc(ol),
                esc_blockquote = _esc(blockquote),
                bullets = _pattern(bullet_any + '$'),
                lists = _pattern(' ?' + _format(esc_ol, ['\\d+']) + ' $'),
                match;
            if (!v || v === placeholder) {
                if (match = b.match(_pattern(esc_blockquote + ' $'))) {
                    return $.insert(match[0], 0), false;
                } else if (match = b.match(bullets)) {
                    b = b.replace(bullets, '  $1');
                    return $.set(b + v + a).select(b.length, (b + v).length), false;
                } else if (match = b.match(lists)) {
                    b = b.replace(lists, '    ' + _format(ol, [1]) + ' ');
                    return $.set(b + v + a).select(b.length, (b + v).length), false;
                }
            } else {
                if (_pattern('^' + esc_blockquote + ' ').test(v)) {
                    return $.indent(blockquote + ' '), false;
                }
            }
            return ui.tools.indent.click(e, $);
        },
        'control+down': 'note',
        'control+up': 'note'
    });

    return $.update({}, 0);

};