(function(win, doc) {
    var edit = doc.querySelector('#editor'),
        css = doc.querySelector('#text-editor-shell-selector'),
        i = -1,
        t, ack;
    if (edit && edit.value) {
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
        setTimeout(type, 1000);
    } else {
        edit.focus();
    }
    if (css) {
        (function() {
            var s = doc.createElement('link'),
                select = doc.createElement('select'),
                o = {
                    '..': 'Theme&hellip;',
                    '.': 'None',
                    '.white': 'White',
                    '.black': 'Black',
                    '.1960': '1960',
                    '.fam-fam-fam': 'Fam Fam Fam'
                },
                option, i, v;
            for (i in o) {
                option = doc.createElement('option');
                option.innerHTML = o[i];
                i = i.slice(1);
                option.value = i;
                if (i === '.') {
                    option.disabled = true;
                } else if (i === '1960') {
                    option.selected = true;
                }
                select.appendChild(option);
            }
            select.className = 'select';
            css.appendChild(select);
            function add_css(id) {
                doc.documentElement.className = 'shell-' + id;
                s.id = 'text-editor-shell';
                s.rel ='stylesheet';
                if (id) {
                    s.href = select.parentNode.getAttribute('data-shell-path') + '/ui.' + id + '.min.css';
                    doc.head.appendChild(s);
                } else if (s.parentNode) {
                    s.parentNode.removeChild(s);
                }
            }
            function select_css() {
                v = this.value;
                add_css(v);
            } add_css('1960');
            select.onchange = select_css;
            select.onclick = function() {
                ack = true;
            };
        })();
    }
})(window, document);