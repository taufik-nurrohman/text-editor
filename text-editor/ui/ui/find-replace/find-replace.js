TE.each(function($) {

    var uniq = Date.now(),
        ui = $.ui,
        config = $.config,
        s = config.classes[""],
        _ = $._,
        _el = _.el,
        _format = _.format,
        _event_set = _.event.set,
        _event_x = _.event.x,
        _dom_set = _.dom.set,
        _dom_reset = _.dom.reset,
        _dom_parent = _.dom.parent,
        s_html_class = s + '-find-replace--' + uniq,
        s_css_class = '.' + s_html_class,
        style = $._.el('style', false, {
            'id': s + ':style-find-replace-' + uniq
        }), k;

    function do_find() {}
    function do_replace() {}

    var find = _el('input', false, {
            'type': 'text',
            'class': s + '-input',
            'id': s + '-find:' + uniq
        }),
        replace = _el('input', false, {
            'type': 'text',
            'class': s + '-input',
            'id': s + '-replace:' + uniq
        }),
        setting = _el('a', '<i class="' + _format(config.classes.i, ['setting', 'cogs']) + '"></i>', {
            'href': 'javascript:;',
            'class': s + '-a'
        });

    _event_set("keydown", find, function(e) {
        k = e.TE.key;
        if (k('tab')) return replace.focus(), _event_x(e);
        if (k('enter')) return do_find(), _event_x(e);
    });

    _event_set("keydown", replace, function(e) {
        k = e.TE.key;
        if (k('backspace') && !this.value) return find.focus(), _event_x(e);
        if (k('enter')) return do_replace(), _event_x(e);
    });

    _event_set("click", setting, function(e) {
        ui.drop.target = this;
        ui.drop('find-replace-setting', function(drop) {
            var c_1 = _el('label', [
                _el('input', false, {
                    'type': 'checkbox'
                }),
                _el('span', 'Match Case')
            ]),
            c_2 = _el('label', [
                _el('input', false, {
                    'type': 'checkbox'
                }),
                _el('span', 'Match Pattern')
            ]);
            _dom_set(drop, c_1);
            _dom_set(drop, c_2);
        }, false);
        return _event_x(e);
    });

    _dom_set(document.head, _el(style, s_css_class + '{line-height:1.25em;border-top:1px solid;border-top-color:inherit;padding:.25em;font-size:80%}' + s_css_class + ' label{padding:0 .5em}' + s_css_class + ' a{padding:0 .5em}'));

    var pane = _el('div', [
         _el('label', 'Find', {
            'class': s + '-label',
            'for': s + '-find:' + uniq
        }),
        find,
        _el('label', 'Replace', {
            'class': s + '-label',
            'for': s + '-replace:' + uniq
        }),
        replace,
        setting
    ], {
        'class': s + '-find-replace ' + s_html_class,
        'id': s + '-find-replace:' + uniq
    });

    ui.tool('find', {
        i: 'binoculars',
        click: function(e, $) {
            if (_dom_parent(pane)) {
                _dom_reset(pane, false), $.select();
            } else {
                _dom_set(ui.el.header, pane), find.focus(), find.select();
            }
            return false;
        }
    })

    ui.key('control+f', 'find');

});