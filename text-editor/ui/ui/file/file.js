TE.each(function($) {

    var ui = $.ui,
        _ = $._,
        _dom = _.dom,
        _dom_get = _dom.get,
        _events_set = _.events.set,
        _events_fire = _.events.fire,
        o = $._.el('input', false, {
            'type': 'file',
            'style': 'margin:0;padding:0;border:0;width:1px;height:1px;font:0/0 a;overflow:hidden;position:absolute;top:-1px;left:-1px;opacity:0;'
        }),
        modal = ui.el.modal,
        f = new FileReader(), i, j, k, t, u, v, w;

    $._.dom.set(document.body, o);

    function is_img(a) {
        return /^image\/.*/i.test(a.type);
    }

    function is_txt(a) {
        return /^(text|application)\/.*/i.test(a.type);
    }

    function do_modals(id, data, $) {
        ui.tools[id].click(null, $);
        for (i in data) {
            if (j = _dom_get('[name=data]', modal)[0]) {
                j.value = data[i];
                if (k = _dom_get('[name=y]', modal)[0]) {
                    _events_fire("click", k);
                }
            }
        }
    }

    $.ui.tool('file', {
        i: 'folder-open',
        click: function(e, $) {
            return o.click(), false;
        }
    });

    _events_set("change", o, function() {
        t = this;
        u = t.files;
        if (!u || !u.length) return;
        u = u[0];
        if (is_img(u)) {
            f.readAsDataURL(u);
            v = 0;
        } else if (is_txt(u)) {
            f.readAsBinaryString(u);
            v = 1;
        }
        _events_set("loadend", f, function(e) {
            w = f.result;
            if (v === 1) {
                $.tidy('\n\n').insert(w);
            } else {
                do_modals('img', [w, ""], $);
            }
        });
    });

});