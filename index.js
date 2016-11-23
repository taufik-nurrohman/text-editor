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
    editor._.timer.set(type, 1000);
})();

(function() {
    var css = document.querySelector('#text-editor-shell-select');
    if (!css) return;
    var s = document.createElement('link'),
        select = document.createElement('select'),
        o = {
            '..': 'Theme&hellip;',
            '.': 'None',
            '.white': 'White',
            '.black': 'Black',
            '.1960': '1960',
            '.fam-fam-fam': 'Fam Fam Fam'
        },
        option, i;
    for (i in o) {
        option = document.createElement('option');
        option.innerHTML = o[i];
        i = i.slice(1);
        option.value = i;
        if (i === '.') {
            option.disabled = true;
            option.selected = true;
        }
        select.appendChild(option);
    }
    select.className = 'select';
    css.appendChild(select);
    function select_css() {
        document.documentElement.className = 'shell-' + this.value;
        s.id = 'text-editor-shell';
        s.rel ='stylesheet';
        s.href = this.parentNode.getAttribute('data-shell-base') + '/ui.' + this.value + '.min.css';
        document.head.appendChild(s);
        if (!this.value) {
            s.parentNode.removeChild(s);
        }
    }
    select.onchange = select_css;
    select.onclick = function() {
        ack = true;
    };
})();