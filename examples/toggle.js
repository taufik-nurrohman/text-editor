(function() {

    var myTextArea = document.getElementById('editor-area'),
        myButton = document.getElementById('editor-control').getElementsByTagName('a'),
        myEditor = new Editor(myTextArea);

    myEditor.toggle = function(open, close) {
        var s = myEditor.selection();
        if (s.before.slice(-open.length) != open && s.after.slice(0, close.length) != close) {
            myEditor.wrap(open, close);
        } else {
            var cleanB = s.before.slice(-open.length) == open ? s.before.slice(0, -open.length) : s.before,
                cleanA = s.after.slice(0, close.length) == close ? s.after.slice(close.length) : s.after;
            myEditor.area.value = cleanB + s.value + cleanA;
            myEditor.select(cleanB.length, cleanB.length + s.value.length, true);
        }
    };

    var HL = 0;

    myEditor.heading = function() {
        var h = [
                "",
                '# ',
                '## ',
                '### ',
                '#### ',
                '##### ',
                '###### '
            ],
            s = myEditor.selection();
            HL = HL < h.length - 1 ? HL + 1 : 0;
        if (s.value.length > 0) {
            if (!s.before.match(/\#+ $/)) {
                myEditor.wrap(h[HL], "", function() {
                    myEditor.replace(/^\#+ /, ""); // Remove leading hash inside selection
                });
            } else {
                var cleanB = s.before.replace(/\#+ $/, ""), // Clean text before selection without leading hash
                    cleanV = s.value.replace(/^\#+ /, ""); // Clean text selection without leading hash
                myEditor.area.value = cleanB + h[HL] + cleanV + s.after;
                myEditor.select(cleanB.length + h[HL].length, cleanB.length + h[HL].length + cleanV.length, true);
            }
        } else {
            var placeholder = 'Heading Text Goes Here';
            HL = 1;
            myEditor.insert(h[HL] + placeholder, function() {
                s = myEditor.selection().end;
                myEditor.select(s - placeholder.length - h[HL].length + 2, s, true);
            });
        }
    };

    var controls = {
        'bold': function() {
            myEditor.toggle('**', '**');
        },
        'italic': function() {
            myEditor.toggle('_', '_');
        },
        'heading': function() {
            myEditor.heading();
        }
    };

    function click(elem) {
        var hash = elem.hash.replace('#', "");
        if(controls[hash]) {
            elem.onclick = function() {
                controls[hash]();
                return false;
            };
        }
    }

    for (var i = 0, len = myButton.length; i < len; ++i) {
        click(myButton[i]);
        myButton[i].href = 'javascript:;';
    }

})();