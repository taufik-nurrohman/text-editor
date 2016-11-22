var ack;

(function() {
    if (!editor) return;
    var i = -1,
        text = editor.get(),
        text_count = text.length, t;
    editor._.event.set("scroll", window, function() {
        ack = true;
    });
    editor.set("").focus();
    function type() {
        ++i;
        editor.set(editor.get() + text.charAt(i));
        if (!ack) {
            editor.focus(true);
            window.scroll(0, 0);
        }
        t = editor._.timer.set(type, 50);
        if (i === text_count - 1) {
            editor._.timer.reset(t);
        }
    }
    editor._.timer.set(type, 3000);
})();

(function() {
    var css = document.querySelector('#text-editor-theme-select');
    if (!css) return;
    var s = document.createElement('link'),
        select = document.createElement('select'),
        o = {
            '.': 'Theme&hellip;',
            "": 'None',
            'ui.white.min.css': 'White',
            'ui.black.min.css': 'Black',
            'ui.1960.min.css': '1960',
            'ui.fam-fam-fam.min.css': 'Fam Fam Fam'
        },
        option, i;
    for (i in o) {
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = o[i];
        if (i === '.') {
            option.disabled = true;
            option.selected = true;
        }
        select.appendChild(option);
    }
    select.className = 'select';
    css.appendChild(select);
    function select_css() {
        document.documentElement.className = 'text-editor-page-' + this.value.replace(/ui\.|\.min\.css/g, "");
        s.id = 'text-editor-theme';
        s.rel ='stylesheet';
        s.href = this.parentNode.getAttribute('data-theme-base') + '/' + this.value;
        if (!this.value) {
            s.parentNode.removeChild(s);
        }
        document.head.appendChild(s);
    }
    select.onchange = select_css;
    select.onclick = function() {
        ack = true;
    };
})();