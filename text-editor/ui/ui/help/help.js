/*!
 * ==========================================================
 *  HELP PANEL PLUGIN FOR USER INTERFACE MODULE 0.0.10
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var ui = $.ui,
        config = $.config,
        keys = config.languages.tools,
        i, j, k;

    keys.help = ['Help', 'F1'];

    ui.tool('help', {
        i: 'question-circle',
        click: function(e, $) {
            if (TE._.dom.parent(ui.el.panel)) {
                ui.panel.exit(1);
            } else {
                if (config.help) {
                    ui.panel('help', config.help, 0, 'help');
                } else {
                    var tr = [];
                    for (i in keys) {
                        j = keys[i];
                        if (!j[1]) continue;
                        tr.push('<tr style="border:inherit;"><td style="text-align:right;vertical-align:top;width:10%;border:inherit;padding:.25em .5em;"><kbd>' + j[1] + '</kbd></td><td style="text-align:left;vertical-align:top;border:inherit;padding:.25em .5em;">' + j[0] + '</td></tr>');
                    }
                    ui.panel('help', {
                        header: 'Help',
                        body: '<table style="table-layout:fixed;border-collapse:collapse;border:1px solid;border-color:inherit;" class="' + $.config.classes[""] + '-table"><tbody style="border:inherit;">' + tr.sort().join("") + '</tbody></table>'
                    }, 0, 'help');
                }
            }
            return $.select(), false;
        }
    });

    // press `f1` for "help"
    ui.key('f1', 'help');

});