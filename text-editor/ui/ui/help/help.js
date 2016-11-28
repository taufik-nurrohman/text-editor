/*!
 * ==========================================================
 *  HELP PANEL PLUGIN FOR USER INTERFACE MODULE 0.0.9
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
                if (config.help && config.help.body) {
                    ui.panel(config.help.body);
                } else {
                    var tr = [];
                    for (i in keys) {
                        j = keys[i];
                        if (!j[1]) continue;
                        tr.push('<tr><td style="width:20%;"><kbd>' + j[1] + '</kbd></td><td>' + j[0] + '</td></tr>');
                    }
                    ui.panel('<table class="' + $.config.classes[""] + '-table"><tbody>' + tr.sort().join("") + '</tbody></table>');
                }
            }
            return $.select(), false;
        }
    });

    // press `f1` for "help"
    ui.key('f1', 'help');

});