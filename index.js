(function(win, doc) {
    var edit = doc.querySelector('#editor'),
        css = doc.querySelector('#text-editor-shell-selector'),
        i = -1,
        t, u, ack;
    if (edit && edit.value) {
        if (!edit.classList.contains('no-animation')) {
            var text = edit.value,
                text_count = text.length;
            win.addEventListener("scroll", function() {
                ack = true;
            }, false);
            edit.value = "";
            edit.focus();
            function blur() {
                ack = true;
                clearTimeout(t);
                clearTimeout(u);
                edit.value = text;
                edit.removeEventListener("blur", blur);
            }
            edit.addEventListener("blur", blur, false);
            function type() {
                ++i;
                edit.value += text.charAt(i);
                if (!ack) {
                    edit.selectionStart = edit.selectionEnd = edit.value.length;
                    edit.focus();
                    win.scroll(0, 0);
                }
                t = setTimeout(type, 50);
                if (i === text_count - 1) {
                    clearTimeout(t);
                }
            }
            u = setTimeout(type, 1000);
        }
    } else {
        edit.focus();
    }
    if (css) {
        (function() {
            var s_0 = doc.createElement('link'),
                s_1 = doc.createElement('link'),
                select = doc.createElement('select'),
                o = {
                    '..': 'Theme&hellip;',
                    'ui.i ': 'None',
                    'ui.i ui/white': 'White',
                    'ui.i ui/black': 'Black',
                    'ui.i ui/1960': '1960',
                    'ui/ui/fam-fam-fam.i ui/fam-fam-fam': 'Fam Fam Fam'
                },
                option, i, v;
            for (i in o) {
                option = doc.createElement('option');
                option.innerHTML = o[i];
                option.value = i;
                if (i === '..') {
                    option.disabled = true;
                } else if (i === 'ui.i ui/1960') {
                    option.selected = true;
                }
                select.appendChild(option);
            }
            select.className = 'select';
            css.appendChild(select);
            s_0.id = 'text-editor-ui-shell-0';
            s_0.rel ='stylesheet';
            s_1.id = 'text-editor-ui-shell-1';
            s_1.rel ='stylesheet';
            doc.head.appendChild(s_0);
            doc.head.appendChild(s_1);
            function add_css(id) {
                id = id.split(' ');
                doc.documentElement.className = 'shell-' + id[0];
                if (id[0]) {
                    v = select.parentNode.getAttribute('data-shell-path');
                    s_0.href = v + '/../' + id[0] + '.min.css';
                    if (id[1]) {
                        s_1.href = v + '/' + id[1] + '.min.css';
                    } else {
                        s_1.href = '#';
                    }
                } else {
                    s_0.href = '#';
                }
            }
            function select_css() {
                v = this.value;
                add_css(v);
            } add_css('ui.i ui/1960');
            select.onchange = select_css;
            select.onclick = function() {
                ack = true;
            };
        })();
    }
})(window, document);