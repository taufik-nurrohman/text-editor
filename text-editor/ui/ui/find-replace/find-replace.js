/*!
 * ===========================================================
 *  FIND AND REPLACE PLUGIN FOR USER INTERFACE MODULE 1.0.1
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
        _event_reset = _.event.reset,
        _event_set = _.event.set,
        _event_x = _.event.x,
        _extend = _.extend,
        _format = _.format,
        _pattern = _.pattern,
        _timer_set = _.timer.set,
        s_f_r = '-find-replace',
        s_html_class = s + s_f_r + '--' + uniq,
        s_css_class = '.' + s_html_class,
        k, s, v, w, x;

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

    w = languages.placeholders.find;

    var find = _el('input', false, {
            'type': 'text',
            'class': s + '-input ' + s + '-input-find',
            'id': s + '-find:' + uniq,
            'title': w[0]
        }),
        replace = _el('input', false, {
            'type': 'text',
            'class': s + '-input ' + s + '-input-replace',
            'id': s + '-replace:' + uniq,
            'title': w[1]
        }),
        cog = _el('a', ui.i('config', 'cogs'), {
            'href': 'javascript:;',
            'class': s + '-a',
            'title': languages.modals.find[0],
            'style': 'padding:0 .25em 0 .5em;'
        }),
        status = _el('span', languages.modals.find[1][0], {
            'class': s + '-label'
        });

    // for `fam-fam-fam` theme
    cog.firstChild.style.backgroundSize = '100% auto';

    w = languages.labels.find;

    var pane = _el('div', [
         _el('label', w[0], {
            'class': s + '-label ' + s + '-label-find',
            'for': s + '-find:' + uniq,
            'style': 'padding:0 .5em;'
        }), find,
        _el('label', w[1], {
            'class': s + '-label ' + s + '-label-replace',
            'for': s + '-replace:' + uniq,
            'style': 'padding:0 .5em;'
        }),
        replace, cog, status,
    ], {
        'class': s + s_f_r + ' ' + s_html_class,
        'id': s + s_f_r + ':' + uniq,
        'style': 'font-size:80%;line-height:1.25em;padding:.25em;border-top:1px solid;border-top-color:inherit;'
    });

    function regex_index_of(a, b, start) {
        start = start || 0;
        var i = a.slice(start).search(b);
        return i >= 0 ? i + start : i;
    }

    function do_find() {
        v = find.value;
        w = languages.modals.find_alert;
        x = $.get();
        if (mode === 1) {
            s = x.indexOf(v, found); // match case
        } else if (mode === 2) {
            s = regex_index_of(x, _pattern(v), found); // match pattern
        } else if (mode === 3) {
            s = regex_index_of(x, _pattern(v, 'i'), found); // match case and pattern
        } else {
            s = x.toLowerCase().indexOf(v.toLowerCase(), found); // ignore case
        }
        if (s === -1) {
            ui.alert(w[0], _format(w[1], [v]), do_find_enter);
        } else {
            if (mode !== 2 && mode !== 3) {
                v = _esc(v);
            }
            x = (x.slice(s).match(_pattern('^' + v, mode === 0 || mode === 2 ? 'i' : "")) || [""])[0].length;
            found = s + x;
            $.select(s, s + x);
            target.scrollTop = $.$(1).caret[0].y;
        }
    }

    function do_replace() {
        s = find.value;
        $.select(true).replace(_pattern(mode !== 0 && mode !== 1 ? s : _esc(s), 'g' + (mode !== 1 && mode !== 3 ? 'i' : "")), replace.value);
    }

    function do_find_advance(e) {
        w = languages.modals.find;
        ui.prompt(w[0], w[1], "" + mode, function(e, $, v) {
            do_find_enter();
            _dom_content_set(status, w[1][mode = +v]);
        }, 2);
    }

    function do_find_more(e) {
        k = e.TE.key;
        if (k('alt')) return do_find_advance(), _event_x(e);
        if (k(/^(arrowdown|enter)$/)) return do_find(), _event_x(e);
    }

    function do_find_enter() {
        found = 0;
        s = $.blur().$();
        if (!_dom_get(pane)[0] && (s = s.value)) {
            find.value = s;
        }
        _dom_set(ui.el.header, pane);
        _timer_set(function() {
            find.focus();
            find.select();
        });
        _event_set("keydown", target, do_find_more);
    }

    function do_find_exit() {
        ui.key.set('control'); // hold the `control` key
        _dom_reset(pane, 0), $.select();
        _event_reset("keydown", target, do_find_more);
    }

    _event_set("click", target, do_find_exit);

    _event_set("keydown", find, function(e) {
        k = e.TE.key;
        v = this.value;
        if (e.TE.control('f') || k('backspace') && !v) return (v ? do_find_enter() : do_find_exit()), _event_x(e);
        if (k('alt')) return do_find_advance(), _event_x(e);
        if (k('tab')) return replace.value = find.value, replace.focus(), replace.select(), _event_x(e);
        if (k('enter') && v) return do_find(), _event_x(e);
    });

    _event_set("keydown", replace, function(e) {
        k = e.TE.key;
        v = this.value;
        if (e.TE.control('f')) return (v ? do_find_enter() : do_find_exit()), _event_x(e);
        if (k('backspace') && !v) return find.focus(), _event_x(e);
        if (k('alt')) return do_find_advance(), _event_x(e);
        if (k('tab')) return cog.focus(), _event_x(e);
        if (k('enter')) return do_replace(), _event_x(e);
    });

    _event_set("click", cog, do_find_advance);
    _event_set("click", status, do_find_advance);

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