/*!
 * ==========================================================
 *  TEXT AREA GROW PLUGIN FOR USER INTERFACE MODULE 0.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {
    var _ = $._,
        _hook = _.hook,
        _event = _.event,
        _timer = _.timer,
        a, b, c;
    _event.set("copy cut input keydown paste", $.target, function() {
        a = this;
        c = $.restore('TE.scroll');
        _timer.set(function() {
            a.style.height = 0;
            b = a.scrollHeight;
            a.style.height = b + 'px';
            if (c) c[3]();
        }, 1);
    });
    
});