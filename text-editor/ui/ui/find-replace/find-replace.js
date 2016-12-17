/*!
 * ===========================================================
 *  FIND AND REPLACE PLUGIN FOR USER INTERFACE MODULE 1.1.1
 * ===========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * -----------------------------------------------------------
 */

TE.each(function($) {

    var uniq = Date.now(),
        ui = $.ui,
        config = $.config,
        mode = 0,
        found = 0,
        languages = config.languages,
        s = config.classes[""],
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
        _el(status, ui.i('config', 'cogs'), {
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

    ui.tool('find', {
        i: 'binoculars',
        click: function(e, $) {
            if (_dom_get(pane)[0]) {
                do_find_exit();
            } else {
                do_find_enter();
            }
            return false;
        }
    })

    // press `control+f` for "find"
    ui.key('control+f', 'find');

});