// :|
TE.ui.WYSIWYG = function(target, o) {

    var win = window,
        doc = document,
        editor = TE.ui.HTML || TE.ui,
        $ = editor(target, o);

    $.format = function(a, b) {
        switch (a) {
            case 'b': a = 'bold'; break;
            case 'i': a = 'italic'; break;
            case 'u': a = 'underline'; break;
            case 's': a = 'strikethrough'; break;
        }
        doc.execCommand(a, false, b);
    };

};