(function() {

    var myEditor = new Editor(document.getElementById('editor-area'))

    myEditor.area.onkeydown = function(e) {

        var sel = myEditor.selection();

        // `Enter` key was pressed
        if (e.keyCode == 13) {
            var isListItem = /(^|\n)( *?)([0-9]+\.|[\-\+\*]) (.*?)$/;
            if (sel.before.match(isListItem)) {
                var take = isListItem.exec(sel.before),
                    list = /[0-9]+\./.test(take[3]) ? parseInt(take[3], 10) + 1 + '.' : take[3]; // <ol> or <ul> ?
                myEditor.insert('\n' + take[2] + list + ' ');
                return false;
            }
        }

        // `Backspace` was pressed
        if (e.keyCode == 8 && sel.value.length === 0 && sel.before.match(/( *?)([0-9]+\.|[\-\+\*]) $/)) {
            myEditor.outdent('( *?)([0-9]+\.|[\-\+\*]) ');
            return false;
        }

    };

})();
