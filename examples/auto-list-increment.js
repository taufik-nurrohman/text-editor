(function() {

    var myEditor = new Editor(document.getElementById('editor-area'))

    myEditor.area.onkeydown = function(e) {

        var s = myEditor.selection();

        // `Enter` key was pressed
        if (e.keyCode == 13) {
            var isListItem = /(^|\n)( *?)(\d+\.|[\-\+\*]) (.*?)$/;
            if (s.before.match(isListItem)) {
                var take = isListItem.exec(s.before),
                    list = /\d+\./.test(take[3]) ? parseInt(take[3], 10) + 1 + '.' : take[3]; // <ol> or <ul> ?
                myEditor.insert('\n' + take[2] + list + ' ');
                return false;
            }
        }

        // `BackSpace` key was pressed
        if (e.keyCode == 8 && s.value.length === 0 && s.before.match(/( *?)(\d+\.|[*+-]) $/)) {
            myEditor.outdent('( *?)(\\d+\\.|[*+-]) ', 1, true);
            return false;
        }

    };

})();