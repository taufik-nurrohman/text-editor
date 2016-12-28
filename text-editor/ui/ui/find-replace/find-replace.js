/*!
 * ===========================================================
 *  FIND AND REPLACE PLUGIN FOR USER INTERFACE MODULE 1.3.0
 * ===========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * -----------------------------------------------------------
 */

(function(win, doc) {

    var once = 1;

    TE.each(function($) {

        var uniq = Date.now(),
            ui = $.ui,
            config = $.config,
            mode = 0,
            found = 0,
            languages = config.languages,
            s = config.classes[""],
            s_i = config.classes.i.split(' ')[0],
            target = $.target,
            _ = $._,
            _dom = _.dom,
            _dom_content_set = _dom.content.set,
            _dom_get = _dom.get,
            _dom_reset = _dom.reset,
            _dom_set = _dom.set,
            _el = _.el,
            _esc = _.x,
            _events_reset = _.events.reset,
            _events_set = _.events.set,
            _events_x = _.events.x,
            _extend = _.extend,
            _format = _.format,
            _pattern = _.pattern,
            _timer_set = _.timer.set,
            s_f_r = '-find-replace',
            s_html_class = s + s_f_r + '--' + uniq,
            s_css_class = '.' + s_html_class,
            k, t, u, v, w, x, y, z;

        _extend(languages, {
            tools: {
                find: ['Find and Replace', '\u2318+F']
            },
            modals: {
                find: ['Mode', ['Ignore Case', 'Match Case', 'Match Pattern', 'Match Case and Pattern']],
                find_alert: ['Not Found', 'Can\u2019t find \u201C%1\u201D. Find again from top?']
            },
            placeholders: {
                find: ['find\u2026', 'replace with\u2026']
            },
            labels: {
                find: ['Find', 'Replace']
            }
        });

        var pane = _el(),
            find = _el('input'),
            replace = _el('input'),
            status = _el('a'),
            find_label = _el('label'),
            replace_label = _el('label'),
            status_label = _el('span');

        if (once) {
            _dom.append(doc.head, _el('style', '@font-face{font-family:\'' + s_i + '-find,' + s_i + '-find-config\';src:url(data:application/octet-stream;base64,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)format(\'woff\')}.' + s_i + '-find:before,.' + s_i + '-find-config:before{content:\'\\e000\';font-family:\'' + s_i + '-find,' + s_i + '-find-config\'}.' + s_i + '-find-config:before{content:\'\\e001\'}', {
                'id': s + ':style' + s_f_r
            }));
            once = 0;
        }

        w = languages.placeholders.find;
        x = languages.labels.find;
        y = languages.modals.find;
        z = languages.modals.find_alert;

        function regex_index_of(a, b, start) {
            start = start || 0;
            var i = a.slice(start).search(b);
            return i >= 0 ? i + start : i;
        }

        function do_find() {
            v = find.value;
            u = $.get();
            if (mode === 1) {
                t = u.indexOf(v, found); // match case
            } else if (mode === 2) {
                t = regex_index_of(u, _pattern(v), found); // match pattern
            } else if (mode === 3) {
                t = regex_index_of(u, _pattern(v, 'i'), found); // match case and pattern
            } else {
                t = u.toLowerCase().indexOf(v.toLowerCase(), found); // ignore case
            }
            if (t === -1) {
                ui.alert(z[0], _format(z[1], [v]), do_find_enter);
            } else {
                if (mode !== 2 && mode !== 3) {
                    v = _esc(v);
                }
                u = (u.slice(t).match(_pattern('^' + v, mode === 0 || mode === 2 ? 'i' : "")) || [""])[0].length;
                found = t + u;
                $.select(t, t + u);
                target.scrollTop = $.$(1).caret[0].y;
            }
        }

        function do_replace(step) {
            t = find.value;
            $.select(true).replace(_pattern(mode !== 0 && mode !== 1 ? t : _esc(t), (step ? "" : 'g') + (mode !== 1 && mode !== 3 ? 'i' : "")), replace.value);
            if (step) replace.focus(), replace.select();
        }

        function do_find_advance(e) {
            ui.prompt(y[0], y[1], "" + mode, function(e, $, v) {
                do_find_enter();
                _dom_content_set(status_label, y[1][mode = +v]);
            }, 2);
        }

        function do_find_more(e) {
            k = e.TE.key;
            if (k('alt')) return do_find_advance(), _events_x(e);
            if (k(['down', 'enter'])) return do_find(), _events_x(e);
        }

        function do_find_enter() {
            found = 0;
            _el(find, false, {
                'type': 'text',
                'class': s + '-input ' + s + '-input-find',
                'id': s + '-find:' + uniq,
                'title': w[0]
            });
             _el(replace, false, {
                'type': 'text',
                'class': s + '-input ' + s + '-input-replace',
                'id': s + '-replace:' + uniq,
                'title': w[1]
            });
            _el(status, ui.i('config', 'find-config'), {
                'href': 'javascript:;',
                'class': s + '-a',
                'title': y[0],
                'style': 'width:1.125em;height:1.125em;line-height:1.125em;margin:0 .25em 0 .5em;'
            });
            _el(find_label, x[0], {
                'class': s + '-label ' + s + '-label-find',
                'for': s + '-find:' + uniq,
                'style': 'padding:0 .5em;'
            });
            _el(replace_label, x[1], {
                'class': s + '-label ' + s + '-label-replace',
                'for': s + '-replace:' + uniq,
                'style': 'padding:0 .5em;'
            });
            _el(status_label, y[1][mode], {
                'class': s + '-label ' + s + '-label-status'
            });
            _el(status.firstChild, false, {
                'style': 'display:block;background-size:100% auto;' // for `fam-fam-fam` theme
            });
            _el(pane, [find_label, find, replace_label, replace, status, status_label], {
                'class': s + s_f_r + ' ' + s_html_class,
                'id': s + s_f_r + ':' + uniq,
                'style': 'font-size:80%;padding:.25em;border-top:1px solid;border-top-color:inherit;'
            });
            t = $.blur().$();
            if (!_dom_get(pane)[0] && (t = t.value)) {
                find.value = t;
            }
            _dom_set(ui.el.header, pane);
            _timer_set(function() {
                find.focus();
                find.select();
            });
            _events_set("keydown", target, do_find_more);
        }

        function do_find_exit() {
            _dom_reset(pane), $.select();
            _events_reset("keydown", target, do_find_more);
        }

        _events_set("click", target, do_find_exit);

        _events_set("keydown", find, function(e) {
            k = e.TE.key;
            v = this.value;
            if (e.TE.control('f') || k('back') && !v) return (v ? do_find_enter() : do_find_exit()), _events_x(e);
            if (k('alt')) return do_find_advance(), _events_x(e);
            if (k('tab')) return !replace.value && (replace.value = find.value), replace.focus(), replace.select(), _events_x(e);
            if (k('enter') && v) return do_find(), _events_x(e);
        });

        _events_set("keydown", replace, function(e) {
            k = e.TE.key;
            v = this.value;
            if (e.TE.control('f')) return (v ? do_find_enter() : do_find_exit()), _events_x(e);
            if (k('back') && !v) return find.focus(), _events_x(e);
            if (k('alt')) return do_find_advance(), _events_x(e);
            if (k('tab')) return status.focus(), _events_x(e);
            if (k('enter')) return do_replace(e.TE.control()), _events_x(e);
        });

        _events_set("click", status, do_find_advance);
        _events_set("click", status_label, do_find_advance);

        if (config.tools) {
            ui.tool('find', {
                click: function(e, $) {
                    if (_dom_get(pane)[0]) {
                        do_find_exit();
                    } else {
                        do_find_enter();
                    }
                    return false;
                }
            });
        }

        // press `control+f` for "find"
        ui.key('control+f', 'find');

    });

})(window, document);