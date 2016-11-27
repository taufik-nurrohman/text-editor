var ack;

(function() {
    var edit = document.querySelector('#editor');
    if (!edit || !edit.value) return;
    var i = -1,
        text = edit.value,
        text_count = text.length, t;
    window.addEventListener("scroll", function() {
        ack = true;
    }, false);
    edit.value = "";
    edit.focus();
    function type() {
        ++i;
        edit.value += text.charAt(i);
        if (!ack) {
            edit.selectionStart = edit.selectionEnd = edit.value.length;
            edit.focus();
            window.scroll(0, 0);
        }
        t = setTimeout(type, 50);
        if (i === text_count - 1) {
            clearTimeout(t);
        }
    }
    setTimeout(type, 1000);
})();

(function() {
    var css = document.querySelector('#text-editor-shell-selector');
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
        option, i, v;
    for (i in o) {
        option = document.createElement('option');
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
        document.documentElement.className = 'shell-' + id;
        s.id = 'text-editor-shell';
        s.rel ='stylesheet';
        s.href = select.parentNode.getAttribute('data-shell-path') + '/ui.' + id + '.min.css';
        document.head.appendChild(s);
    }
    function select_css() {
        v = this.value;
        add_css(v);
        if (!v) {
            s.parentNode.removeChild(s);
        }
    } add_css('1960');
    select.onchange = select_css;
    select.onclick = function() {
        ack = true;
    };
})();