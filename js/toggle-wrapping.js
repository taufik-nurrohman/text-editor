(function() {

    var myTextArea = document.getElementById('editor-area'),
        myButton = document.getElementById('editor-control').getElementsByTagName('a'),
        myEditor = new Editor(myTextArea);

    var controls = {
        'bold': function() {
            toggleWrapping('**', '**');
        },
        'italic': function() {
            toggleWrapping('_', '_');
        },
        'heading': function() {
            toggleHeading();
        }
    };


    function toggleWrapping(open, close) {
        var s = myEditor.selection();
        if (s.before.slice(-open.length) != open && s.after.slice(0, close.length) != close) {
            myEditor.wrap(open, close);
        } else {
            var cleanB = s.before.substring(0, s.before.length - open.length),
                cleanA = s.after.substring(close.length);
            myEditor.area.value = cleanB + s.value + cleanA;
            myEditor.select(cleanB.length, cleanB.length + s.value.length, function() {
                myEditor.updateHistory();
            });
        }
    }

    var HL = 0;

    function toggleHeading() {
        var h = [
                '',
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
                myEditor.select(cleanB.length + h[HL].length, cleanB.length + h[HL].length + cleanV.length, function() {
                    myEditor.updateHistory();
                });
            }
        } else {
            var placeholder = 'Heading Text Goes Here';
            HL = 1;
            myEditor.insert(h[HL] + placeholder, function() {
                s = myEditor.selection().end;
                myEditor.select(s - placeholder.length - h[HL].length + 2, s, function() {
                    myEditor.updateHistory();
                });
            });
        }
    }

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
