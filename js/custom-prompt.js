(function() {

    // => http://stackoverflow.com/a/7592235/1163000
    String.prototype.capitalize = function(lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        });
    };

    var myTextArea = document.getElementById('editor-area'),
        myButton = document.getElementById('editor-control').getElementsByTagName('a'),
        myEditor = new Editor(myTextArea);

    var controls = {
        'link': function() {
            var sel = myEditor.selection(),
                title = null,
                url = null,
                placeholder = 'Your link text goes here...';
            fakePrompt('Link title:', 'Link title goes here...', false, function(r) {
                title = r;
                fakePrompt('URL:', 'http://', true, function(r) {
                    url = r;
                    myEditor.wrap('[' + (sel.value.length === 0 ? placeholder : ''), '](' + url + (title !== "" ? ' \"' + title + '\"' : '') + ')', function() {
                        myEditor.select(sel.start + 1, (sel.value.length === 0 ? sel.start + placeholder.length + 1 : sel.end + 1));
                    });
                });
            });
        },
        'image': function() {
            fakePrompt('Image URL:', 'http://', true, function(r) {
                var altText = r.substring(r.lastIndexOf('/') + 1, r.lastIndexOf('.')).replace(/[\-\_\+]+/g, " ").capitalize();
                myEditor.insert('\n\n![' + altText + '](' + r + ')\n\n');
            });
        }
    };

    function fakePrompt(label, value, isRequired, callback) {
        var overlay = document.createElement('div');
            overlay.className = 'custom-modal-overlay';
        var modal = document.createElement('div');
            modal.className = 'custom-modal custom-modal-prompt';
            modal.innerHTML = '<div class="custom-modal-header">' + label + '</div><div class="custom-modal-content"></div><div class="custom-modal-action"></div>';
        var onSuccess = function(value) {
            overlay.parentNode.removeChild(overlay);
            modal.parentNode.removeChild(modal);
            if (typeof callback == "function") callback(value);
        };
        var input = document.createElement('input');
            input.type = 'text';
            input.value = value;
            input.onkeyup = function(e) {
                if (isRequired) {
                    if (e.keyCode == 13 && this.value !== "" && this.value !== value) {
                        onSuccess(this.value);
                    }
                } else {
                    if (e.keyCode == 13) {
                        onSuccess(this.value == value ? "" : this.value);
                    }
                }
            };
        var buttonOK = document.createElement('button');
            buttonOK.innerHTML = 'OK';
            buttonOK.onclick = function() {
                if (isRequired) {
                    if (input.value !== "" && input.value !== value) {
                        onSuccess(input.value);
                    }
                } else {
                    onSuccess(input.value == value ? "" : input.value);
                }
            };
        var buttonCANCEL = document.createElement('button');
            buttonCANCEL.innerHTML = 'Cancel';
            buttonCANCEL.onclick = function() {
                overlay.style.display = "none";
                modal.style.display = "none";
            };
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        modal.children[1].appendChild(input);
        modal.children[2].appendChild(buttonOK);
        modal.children[2].appendChild(buttonCANCEL);
        input.select();
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
