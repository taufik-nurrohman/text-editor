/*!
 * ===========================================================
 *  HTML AUTO-COMPLETE PLUGIN FOR USER INTERFACE MODULE 1.0.1
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

        insert_before = 'insertBefore',
        insert_after = 'insertAfter',

        replace_before = 'replaceBefore',
        replace_after = 'replaceAfter',

        k, l, m, n;

    if (!config.auto_close_html) return;

    function get_indent(s) {
        s = s.match(/(?:^|\n)([\t ]*).*$/);
        return (s && s[1]) || "";
    }

    _event.set("keydown", $.target, function(e) {
        $[0]();
        k = e.TE.key;
        _timer_set(function() {
            l = $.$();
            var l_before = l.before,
                l_after = l.after;
            if (k('enter')) {
                if (_pattern(tag_open + '\\n[\\t ]*$').test(l_before) && is_tag_close.test(l_after)) {
                    $[insert_before](config.tab)[insert_after]('\n' + get_indent(l_before));
                }
            } else if (k('>') && !is_tag_close.test(l_after) && l_before.slice(-2) !== '>>') {
                m = l_before.match(is_tag_open) || ["", ""];
                if (is_void.test(m[1])) {
                    $[replace_before](_pattern(esc_unit[1] + '$'), suffix);
                } else {
                    $[replace_after](/^/, unit[0] + unit[2] + m[1] + unit[1]);
                }
            } else if (k(' ')) {
                m = l_before.match(_pattern(tag_open.slice(0, tag_open.length - esc_unit[1].length) + '$')) || ["", ""];
                if (m[1] === 'a') {
                    $[insert_before]('href' + data[0] + data[1])[insert_after](data[1]);
                } else if (m[1] === 'img') {
                    $[insert_before]('alt' + data[0] + data[1] + data[2] + data[3] + 'src' + data[0] + data[1])[insert_after](data[2])[replace_after](_pattern('^' + esc_data[2] + esc_unit[1]), data[2] + suffix);
                } else if (m[1] === 'input') {
                    $[insert_before]('type' + data[0] + data[1])[insert_after](data[2])[replace_after](_pattern('^' + esc_data[2] + esc_unit[1]), data[2] + suffix);
                }
            }
            $[1]();
        });
    });

});