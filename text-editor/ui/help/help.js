TE.each(function($) {

    var ui = $.ui;

    ui.tool('help', {
        i: 'question-circle',
        click: function(e, $) {
            var panel = "", i;
            for (i in ui.keys) {
                panel += '<p><kbd>' + i.replace(/\bcontrol\b/g, '\u2318').toUpperCase() + '</kbd> for ' + 'foo' + '</p>';
            }
            ui.overlay(panel);
        }
    });

    // press `f1` for "help"
    ui.key('f1', 'help');

});