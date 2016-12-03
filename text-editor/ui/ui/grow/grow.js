/*!
 * ==========================================================
 *  EDITOR GROW PLUGIN FOR USER INTERFACE MODULE 1.0.0
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

    if (!$.config.auto_grow) return;

    function grow(a) {
        a.style.height = 0;
        a.style.height = a.scrollHeight + 'px';
        b && win.scroll(b[0], b[1]);
    }

    _event_set("copy cut input keydown paste", target, function() {
        a = this;
        b = [
            win.pageXOffset || html[left] || body[left],
            win.pageYOffset || html[top] || body[top]
        ];
        _timer_set(function() {
            grow(a, b);
        });
    });

    grow(target);

    // do not collapse
    _css(target, {
        'min-height': _css(target, 'height') + 'px'
    });

});