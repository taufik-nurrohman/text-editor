(function() {

    var myTextArea = document.getElementById('editor-area'),
        myButton = document.getElementById('editor-control').getElementsByTagName('a'),
        myEditor = new Editor(myTextArea);

    var controls = {
        'bold': function() {
            toggleWrapping(['**', '**'], [/\*{2}$/, /^\*{2}/]);
        },
        'italic': function() {
            toggleWrapping(['_', '_'], [/\_$/, /^\_/]);
        },
        'heading': function() {
            toggleHeading();
        }
    };

    function toggleWrapping(wrapper, regex) {
        var s = myEditor.selection();
        if (!s.before.match(regex[0]) && !s.after.match(regex[1])) {
            myEditor.wrap(wrapper[0], wrapper[1]);
        } else {
            var cleanB = s.before.replace(regex[0], ""),
                cleanA = s.after.replace(regex[1], "");
            myEditor.area.value = cleanB + s.value + cleanA;
            myEditor.select(cleanB.length, cleanB.length + s.value.length, function() {
                myEditor.updateHistory();
            });
        }
    }

    var headingLevel = 0;

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
        headingLevel = headingLevel < h.length - 1 ? headingLevel + 1 : 0;
        if (s.value.length > 0) {
            if (!s.before.match(/\#+ $/) && !s.after.match(/^\n/)) {
                myEditor.wrap(h[headingLevel], '\n\n', function() {
                    myEditor.replace(/^\#+ /, ""); // Remove leading hash inside selection
                });
            } else {
                var cleanB = s.before.replace(/\#+ $/, ""), // Clean text before selection without leading hash
                    cleanV = s.value.replace(/^\#+ /, ""); // Clean text selection without leading hash
                myEditor.area.value = cleanB + h[headingLevel] + cleanV + s.after;
                myEditor.select(cleanB.length + h[headingLevel].length, cleanB.length + h[headingLevel].length + cleanV.length, function() {
                    myEditor.updateHistory();
                });
            }
        } else {
            var placeholder = 'Heading Text Goes Here';
            myEditor.insert(h[headingLevel] + placeholder + '\n\n', function() {
                s = myEditor.selection().end;
                myEditor.select(s - placeholder.length - h[headingLevel].length, s - 2, function() {
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
