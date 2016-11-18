/*!
 * ==========================================================
 *  TEXT AREA GROW PLUGIN FOR USER INTERFACE MODULE 0.0.3
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var win = window,
        doc = document,
        html = doc.documentElement,
        body = doc.body,
        target = $.target,
        left = 'scrollLeft',
        top = 'scrollTop',

        _ = $._,
        _css = _.css,
        _event_set = _.event.set,
        _timer_set = _.timer.set,

        a, b;

    _event_set("copy cut input keydown paste", $.target, function() {
        a = this;
        b = [
            win.pageXOffset || html[left] || body[left],
            win.pageYOffset || html[top] || body[top]
        ];
        _timer_set(function() {
            a.style.height = 0;
            a.style.height = a.scrollHeight + 'px';
            win.scroll(b[0], b[1]);
        });
    });

    _css(target, {
        'min-height': _css(target, 'height') + 'px'
    });

});