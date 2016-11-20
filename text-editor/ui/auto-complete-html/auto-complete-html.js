/*!
 * ===========================================================
 *  HTML AUTO-COMPLETE PLUGIN FOR USER INTERFACE MODULE 1.0.0
 * ===========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * -----------------------------------------------------------
 */

TE.each(function($) {

    var config = $.config,
        unit = config.unit[0][0],
        data = config.unit[0][1],
        esc_unit = config.unit[1][0],
        esc_data = config.unit[1][1],

        _ = $._,
        _event = _.event,
        _pattern = _.pattern,
        _timer_set = _.timer.set,

        suffix = config.suffix,

        tag_open = esc_unit[0] + '([^\\s' + esc_unit[0] + esc_unit[1] + esc_unit[2] + ']+)(?:' + esc_data[3] + '.*?)?' + esc_unit[1],
        tag_close = esc_unit[0] + esc_unit[2] + '[^\\s' + esc_unit[0] + esc_unit[1] + esc_unit[2] + ']+' + esc_unit[1],

        is_void = /^(?:area|base|br|col|command|embed|hr|img|input|link|meta|param|source)$/,
        is_tag_open = _pattern(tag_open + '$'),
        is_tag_close = _pattern('^' + tag_close),

        k, l, m, n;

    if (!config.auto_close_html) return;

    function get_indent(s) {
        s = s.match(/(?:^|\n)([\t ]*).*$/);
        return (s && s[1]) || "";
    }

    _event.set("keydown", $.target, function(e) {
        k = e.TE.key;
        if (k('enter')) {
            $[0]();
            _timer_set(function() {
                l = $.$();
                if (_pattern(tag_open + '\\n[\\t ]*$').test(l.before) && is_tag_close.test(l.after)) {
                    $.insertBefore(config.tab).insertAfter('\n' + get_indent(l.before));
                }
                $[1]();
            });
        } else if (k('>')) {
            $[0]();
            _timer_set(function() {
                l = $.$();
                m = l.before.match(is_tag_open) || ["", ""];
                if (is_void.test(m[1])) {
                    $.replaceBefore(_pattern(esc_unit[1] + '$'), suffix);
                } else {
                    $.replaceAfter(/^/, unit[0] + unit[2] + m[1] + unit[1]);
                }
                $[1]();
            });
        } else if (k(' ')) {
            $[0]();
            _timer_set(function() {
                l = $.$();
                m = l.before.match(_pattern(tag_open.slice(0, tag_open.length - esc_unit[1].length) + '$')) || ["", ""];
                if (m[1] === 'a') {
                    $.insertBefore('href' + data[0] + data[1]).insertAfter(data[1]);
                } else if (m[1] === 'img') {
                    $.insertBefore('alt' + data[0] + data[1] + data[2] + data[3] + 'src' + data[0] + data[1]).insertAfter(data[2]).replaceAfter(_pattern('^' + esc_data[2] + esc_unit[1]), data[2] + suffix);
                } else if (m[1] === 'input') {
                    $.insertBefore('type' + data[0] + data[1]).insertAfter(data[2]).replaceAfter(_pattern('^' + esc_data[2] + esc_unit[1]), data[2] + suffix);
                }
                $[1]();
            });
        }
    });

});