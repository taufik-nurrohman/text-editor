/*!
 * ==========================================================
 *  PERSISTENT STORAGE MODULE FOR TEXT EDITOR PLUGIN 2.0.2
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($, id) {
    var storage = localStorage,
        json = JSON,
        save_id = 'TE.save',
        i, j;
    if (j = storage.getItem(save_id)) {
        j = json.parse(j);
        for (i in j) {
            $.save(i, j[i]);
        }
    }
    $._.event.set("beforeunload unload", window, function() {
        j = $.restore();
        if (!Object.keys(j).length) {
            storage.removeItem(save_id);
        } else {
            storage.setItem(save_id, json.stringify(j));
        }
    });
}, 250);