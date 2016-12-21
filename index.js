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
                    '. .i': 'None',
                    '.white .i': 'White',
                    '.black .i': 'Black',
                    '.1960 .i': '1960',
                    '.fam-fam-fam /ui.i.fam-fam-fam': 'Fam Fam Fam'
                },
                option, i, v;
            for (i in o) {
                option = doc.createElement('option');
                option.innerHTML = o[i];
                option.value = i;
                if (i === '.') {
                    option.disabled = true;
                } else if (i === '.1960 .i') {
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
                doc.documentElement.className = 'shell-' + id[0].slice(1);
                if (id[0] || id[1]) {
                    v = select.parentNode.getAttribute('data-shell-path');
                    s_0.href = v + '/ui' + id[0] + '.min.css';
                    s_1.href = v + '/../ui' + id[1] + '.min.css';
                } else {
                    s_0.href = '#';
                    s_1.href = '#';
                }
            }
            function select_css() {
                v = this.value;
                add_css(v);
            } add_css('.1960 .i');
            select.onchange = select_css;
            select.onclick = function() {
                ack = true;
            };
        })();
    }
})(window, document);