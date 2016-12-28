/*!
 * ==========================================================
 *  TEXTILE TEXT EDITOR PLUGIN 1.4.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.ui.Textile = function(target, o) {

    var editor = TE.ui.HTML || TE.ui,
        $ = editor(target, {
            auto_close: {
                '@': '@',
                '*': '*',
                '_': '_',
                '-': '-'
            },
            tools: 'b i s | a img | note abbr | p,h1,h2,h3,h4,h5,h6 | blockquote,q pre,code | ul ol | indent outdent | table | hr | undo redo',
            languages: {
                tools: {
                    note: ['Footnote', '\u2318+\u2193']
                },
                modals: {
                    a: {
                        title: ['Link URL/Reference ID']
                    },
                    note: {
                        title: 'Footnote ID'
                    }
                }
            },
            formats: {
                b: ['*', '**'], // first array will be used by default
                i: ['_', '__'], // --ibid
                hr: ['---', '***'] // --ibid
            }
        }),
        ui = $.ui,

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
        _trim = _.trim,

        ul = '*',
        ol = '#',
        esc_ul = _esc(ul),
        esc_ol = _esc(ol);

    $.update(o, 0);

    // define editor type
    $.type = 'Textile';

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

        formats = config.formats,
        languages = config.languages,
        states = config.states,
        tab = config.tab,

        placeholders = languages.placeholders;

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

    function toggle_block(L) {
        var s = $.$(),
            v = s.value,
            b = s.before,
            a = s.after,
            esc_L = _esc(L),
            dent = _pattern('(^|\\n)' + esc_L + '(.*)$'),
            dent_s = _pattern('^' + esc_L, 'gm'),
            placeholder = placeholders[""], B;
        $[0]();
        if (!v) {
            if (a && b && (a[0] !== '\n' || b.slice(-1) !== '\n')) {
                if (dent.test(b)) {
                    B = b.replace(dent, '$1$2');
                } else {
                    B = b.replace(/(^|\n)([^\n]*)$/, '$1' + L + '$2');
                }
                $.set(B + a).select(B.length);
            } else {
                $.tidy('\n\n').insert(L, 0).insert(placeholder);
            }
        } else if (_pattern(esc_L + '$').test(b)) {
            $.unwrap(L, "");
        } else {
            $.replace(/^[a-z\d]+\.\.?( |$)/gm, "").replace(/[\t ]*\n{2,}[\t ]*/g, '\n\n').tidy('\n\n');
            if (dent_s.test(v)) {
                $.replace(dent_s, "");
            } else {
                $.replace(/(^|\n{2})/g, '$1' + L);
            }
        }
        return $[1](), false;
    }

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
        s: {
            click: function(e, $) {
                return $.i().mark('-'), false;
            }
        },
        a: {
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    x = s.value,
                    a = s.after,
                    g = $.get(),
                    n = /^\[\S+?\]/.test(g.split('\n').pop()) ? '\n' : '\n\n',
                    links = g.match(/^\[\S+?\]/gm) || [],
                    i18n = languages.modals.a,
                    http = i18n.placeholder[0],
                    state, href, title, index, start, end, i;
                // automatic link
                if (/^([a-z]+:\/\/\S+|"\$":[a-z]+:\/\/\S+)$/.test(x)) {
                    return $.tidy(' ').mark(['"$":', ""], 1), false;
                }
                // collect all embedded reference link(s)
                for (i in links) {
                    i = ' ' + _trim(links[i]).replace(/^\[|\]$/g, "");
                    states.a[i] = 1;
                }
                state = states.a;
                return ui.prompt(i18n.title[0], http, 1, function(e, $, v) {
                    v = attr_url(v);
                    $[0]();
                    if (state[v]) {
                        $.trim(_trim(b) ? ' ' : "", /^\n+(fn\d+\^?\. |\[)/.test(a) ? false : ' ').mark(['"', '":' + v], 0, false);
                        index = links.indexOf('[' + v + ']');
                        if (index === -1 && state[v] !== 1) {
                            s = $.$();
                            b = s.before;
                            start = s.start;
                            end = s.end;
                            $.set(b + s.value + _trim(s.after, 1) + n + '[' + (v || _trim(x) || placeholders[""]) + ']' + state[v][0]).select(start, end);
                        }
                    } else {
                        href = v;
                        ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                            title = attr_title(v);
                            // image link
                            if (/^\![^\s]+?\!$/.test(x)) {
                                if (title) {
                                    $.replace(/\(.*?\)\!$/, '!').replace(/\!$/, '(' + title + ')!');
                                }
                                $.insert(':' + href, 1);
                            // else ...
                            } else {
                                if (!x) {
                                    $.insert(placeholders[""]);
                                }
                                $.i().trim(_trim(b) ? ' ' : "", !_trim(a) ? "" : (/^\n+(fn\d+\^?\. |\[)/.test(a) ? '\n\n' : ' ')).wrap('"', (title ? '(' + title + ')' : "") + '":' + href);
                            }
                        }, 0, 0, 'a[title]');
                    }
                    $[1]();
                }, 0, 0, 'a[href]').record(), false;
            }
        },
        img: {
            click: function(e, $) {
                var s = $.$(),
                    i18n = languages.modals.img,
                    src, title;
                return ui.prompt(i18n.title[0], i18n.placeholder[0], 1, function(e, $, v) {
                    src = attr_url(v);
                    ui.prompt(i18n.title[1], i18n.placeholder[1], 0, function(e, $, v) {
                        title = attr_title(v);
                        $.tidy('\n\n', "").insert('!' + src + (title ? '(' + title + ')' : "") + '!\n\n', 0);
                    }, 0, 0, 'img[title]');
                }, 0, 0, 'img[src]'), false;
            }
        },
        abbr: {
            click: function(e, $) {
                var s = $.$(),
                    x = _trim(s.value),
                    i18n = languages.modals.abbr,
                    g = $.get(),
                    abbr = force_i(x || placeholders[""]),
                    abbrs = g.match(/\b[A-Z\d]+\(.*?\)/g) || [],
                    state = states.abbr,
                    abbr_end = /\(.*?\)/,
                    i = 0, j;
                for (i in abbrs) {
                    j = abbrs[i].match(/^(.*?)\((.*?)\)$/);
                    states.abbr[j[1]] = _trim(j[2]);
                }
                state = states.abbr;
                if (x && state[x] && s.after[0] !== '(') {
                    return $.i().tidy(' ').insert('(' + state[x] + ')', 1), false;
                }
                return ui.prompt(i18n.title, state[abbr] || i18n.placeholder, !state[x], function(e, $, v, w) {
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
                    $.unwrap("", abbr_end).unwrap("", abbr_end, 1).i().tidy(' ').insert('(' + v + ')', 1)[1]();
                }, 0, 0, 'abbr[title]').record(), false;
            }
        },
        p: {
            click: function(e, $) {
                return toggle_block('p. ');
            }
        },
        'p,h1,h2,h3,h4,h5,h6': {
            click: function(e, $) {
                var s = $.$(),
                    headers = /(?:p|h\d+)\. +/,
                    match, i;
                if (!(match = s.before.match(/(?:^|\n)(?:p|h([1-6]))\. $/))) {
                    match = s.value.match(/^(?:p|h([1-6]))\. /) || [];
                }
                i = +(match[1] || 0);
                $[0]().i();
                if (!s.value) {
                    $.insert(placeholders[""]);
                }
                $.unwrap(headers, "").unwrap(headers, "", 1).tidy('\n\n').wrap(i < 6 ? 'h' + (i + 1) + '. ' : 'p. ', "", 0, '\n\n');
                return $[1](), false;
            }
        },
        'blockquote,q': {
            click: function(e, $) {
                return toggle_block('bq. ');
            }
        },
        'pre,code': {
            click: function(e, $) {
                // block
                if (_pattern('(^|\\n)$').test($.$().before)) {
                    return toggle_block('bc..\n');
                }
                // span
                return $.mark('@'), false;
            }
        },
        ul: {
            click: function(e, $) {
                var s = $.$(),
                    v = s.value,
                    b = s.before,
                    a = s.after,
                    bullet = _pattern('(^|\\n)([\\t ]*)' + esc_ul + ' (.*)$'),
                    bullet_s = _pattern('^(.*)' + esc_ul + ' ', 'gm'),
                    list = _pattern('(^|\\n)([\\t ]*)' + esc_ol + ' (.*)$'),
                    list_s = _pattern('^(.*)' + esc_ol + ' ', 'gm'),
                    placeholder = placeholders[""], B;
                if (!v) {
                    if (b && a) {
                        // ordered list detected
                        if (list.test(b)) {
                            B = b.replace(list, '$1$2' + ul + ' $3');
                        // unordered list detected
                        } else if (bullet.test(b)) {
                            B = b.replace(bullet, '$1$2$3');
                        // plain text ...
                        } else {
                            B = b.replace(/(^|\n)(\s*)([^\n]*)$/, '$1$2' + ul + ' $3');
                        }
                        return $.set(B + a).select(B.length), false;
                    }
                    return $[0]().tidy('\n\n').insert(ul + ' ', 0).insert(placeholder)[1](), false;
                } else {
                    // start ...
                    if (v === placeholder) {
                        $.select();
                    // ordered list detected
                    } else if (list_s.test(v)) {
                        $.replace(list_s, '$1' + ul + ' ');
                    // unordered list detected
                    } else if (bullet_s.test(v)) {
                        $.replace(bullet_s, '$1');
                    // plain text ...
                    } else {
                        $.replace(/^(\s*)(\S.*)$/gm, '$1' + ul + ' $2');
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
                    bullet = _pattern('(^|\\n)([\\t ]*)' + esc_ul + ' (.*)$'),
                    bullet_s = _pattern('^(.*)' + esc_ul + ' ', 'gm'),
                    list = _pattern('(^|\\n)([\\t ]*)' + esc_ol + ' (.*)$'),
                    list_s = _pattern('^(.*)' + esc_ol + ' ', 'gm'),
                    placeholder = placeholders[""], B;
                if (!v) {
                    if (b && a) {
                        // unordered list detected
                        if (bullet.test(b)) {
                            B = b.replace(bullet, '$1$2' + ol + ' $3');
                        // ordered list detected
                        } else if (list.test(b)) {
                            B = b.replace(list, '$1$2$3');
                        // plain text ...
                        } else {
                            B = b.replace(/(^|\n)(\s*)([^\n]*)$/, '$1$2' + ol + ' $3');
                        }
                        return $.set(B + a).select(B.length), false;
                    }
                    return $[0]().tidy('\n\n').insert(ol + ' ', 0).insert(placeholder)[1](), false;
                } else {
                    // start ...
                    if (v === placeholder) {
                        $.select();
                    // unordered list detected
                    } else if (bullet_s.test(v)) {
                        $.replace(bullet_s, function(a, b, c) {
                            return b + ol + ' ';
                        });
                    // ordered list detected
                    } else if (list_s.test(v)) {
                        $.replace(list_s, '$1');
                    // plain text ...
                    } else {
                        $.replace(/^(\s*)(\S.*)$/gm, function(a, b, c) {
                            return b + ol + ' ' + c;
                        });
                    }
                    return false;
                }
            }
        },
        table: function(e, $) {
            var str = states.tr,
                std = states.td,
                i18n = languages.modals.table,
                p = languages.placeholders.table,
                q = _format(p[0], [1, 1]),
                advance = config.advance_table,
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
                            s += '   ' + _format(p[1], [i + 1, j + 1]) + ' |';
                        }
                        o.push(s);
                    }
                    o = o.join('\n');
                    s = '|';
                    for (l = 0; l < c; ++l) {
                        s += '_. ' + _format(p[0], [1, l + 1]) + ' |';
                    }
                    if (advance) {
                        s += '\n|~.\n|';
                        for (l = 0; l < c; ++l) {
                            s += '   ' + _format(p[2], [1, l + 1]) + ' |';
                        }
                        s += '\n|-.';
                    }
                    o = s + '\n' + o;
                    if (advance) {
                        o = '|^.\n' + o;
                    }
                    $.tidy('\n\n').insert(o);
                    m = $.$();
                    n = m.start + m.value.indexOf(q);
                    $.select(n, n + q.length)[1]();
                }, 0, 0, 'table>tr');
            }, 0, 0, 'table>td'), false;
        },
        hr: {
            click: function(e, $) {
                return $.tidy('\n\n', "").insert(formats.hr[0] + '\n\n', 0).scroll(2), false;
            }
        },
        note: {
            click: function(e, $) {
                var s = $.$(),
                    b = s.before,
                    a = s.after,
                    i18n = languages.modals.note,
                    g = $.get(),
                    n = /^fn\d+\^?\. /.test(_trim(g).split('\n').pop()) ? '\n' : '\n\n',
                    notes = g.match(/^fn\d+\^?\. /gm) || [],
                    i = 0, index;
                i = notes.length + 1;
                return ui.prompt(i18n.title, /* s.value || */ i, 0, function(e, $, v, w) {
                    v = _trim(v) || _trim(w) || i;
                    index = notes.indexOf('fn' + _int(v) + '. ');
                    if (index !== -1) {
                        i = g.indexOf(notes[index]) + 2;
                        $.select(i, i + v.length);
                        target.scrollTop = $.$(1).caret[0].y;
                    } else {
                        $.trim("", !_trim(a) || /^[\t ]*\n+[\t ]*/.test(a) ? '\n\n' : ' ').insert('[' + v + ']').set(_trim($.get(), 1) + n + 'fn' + v + '. ').focus(1).insert(placeholders[""]);
                    }
                }, 0, 0, 'note[id]'), false;
            }
        }
    });

    _extend(ui.keys, {
        'control+u': 0,
        'shift+enter': 0,
        'enter': function(e, $) {
            var s = $.$(),
                regex = '((?:' + esc_ul + '|' + esc_ol + ')+ )',
                match = _pattern('^' + regex + '.*$', 'gm').exec(s.before.split('\n').pop());
            if (match) {
                if (match[0] === match[1]) {
                    return $.outdent(_pattern(regex)), false;
                }
                return $.insert('\n' + match[1], 0).scroll(1), false;
            }
        },
        'shift+tab': function(e, $) {
            var s = $.$(),
                v = s.value,
                b = s.before,
                bullets = '(^|\\n)(' + esc_ul + '){2,}',
                lists = '(^|\\n)(' + esc_ol + '){2,}';
            if (v === placeholders[""]) {
                return $.select(), false;
            } else if (_pattern(bullets + ' $').test(b)) {
                return $.replace(_pattern(esc_ul + ' $'), ' ', 0), false;
            } else if (_pattern(bullets).test(v)) {
                return $.replace(_pattern('^' + esc_ul + ' *', 'gm'), ""), false;
            } else if (_pattern(lists + ' $').test(b)) {
                return $.replace(_pattern(esc_ol + ' $'), ' ', 0), false;
            } else if (_pattern(lists).test(v)) {
                return $.replace(_pattern('^' + esc_ol + ' *', 'gm'), ""), false;
            }
            return ui.tools.outdent.click(e, $);
        },
        'tab': function(e, $) {
            var s = $.$(),
                v = s.value,
                b = s.before,
                bullets = '(^|\\n)(' + esc_ul + ')+',
                lists = '(^|\\n)(' + esc_ol + ')+';
            if (v === placeholders[""]) {
                return $.select(), false;
            } else if (_pattern(bullets + ' $').test(b)) {
                return $.replace(/ $/, ul + ' ', 0), false;
            } else if (_pattern(bullets).test(v)) {
                return $.replace(/^(?!$)/gm, ul), false;
            } else if (_pattern(lists + ' $').test(b)) {
                return $.replace(/ $/, ol + ' ', 0), false;
            } else if (_pattern(lists).test(v)) {
                return $.replace(/^(?!$)/gm, ol), false;
            }
            return ui.tools.indent.click(e, $);
        },
        'control+down': 'note',
        'control+up': 'note'
    });

    return $.update({}, 0);

};