/*!
 * ==========================================================
 *  TEXT AREA GROW PLUGIN FOR USER INTERFACE MODULE 0.0.1
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {
    var doc = document,
        html = doc.documentElement,
        body = doc.body,
        scroll = 'scrollTop',
        _ = $._,
        _event_set = _.event.set,
        _timer_set = _.timer.set,
        a, b, c;
    _event_set("copy cut input keydown paste", $.target, function() {
        a = this;
        c = [html[scroll], body[scroll]];
        _timer_set(function() {
            a.style.height = 0;
            b = a.scrollHeight;
            a.style.height = b + 'px';
            html[scroll] = c[0];
            body[scroll] = c[1];
        }, 1);
    });
});