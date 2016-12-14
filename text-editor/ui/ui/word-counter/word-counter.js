/*!
 * ==========================================================
 *  WORD COUNTER PLUGIN FOR USER INTERFACE MODULE 1.1.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var ui = $.ui,
        _ = $._,
        _dom = _.dom,
        _dom_append = _dom.append,
        _dom_content_set = _dom.content.set,
        _dom_get = _dom.get,
        _events_set = _.events.set,
        _extend = _.extend,
        _format = _.format,
        _pattern = _.pattern,
        _timer,
        _timer_reset = _.timer.reset,
        _timer_set = _.timer.set,

        is_unset = $.is.x,

        config = $.config,
        esc_unit = config.union[0][0],
        debounce = config.debounce,
        i18n = config.languages.others,
        right = _dom_get('.' + (config.direction === 'ltr' ? 'right' : 'left'), ui.el.footer)[0],
        container = _.el('span', "", {
            'class': config.classes[""] + '-word-counter'
        });

    i18n = _extend({
        '%1 word': ['%1 Word', '%1 Words']
    }, i18n);

    _dom_append(right, container);

    function count_words(e) {
        if ((!is_unset(config.word_counter) && !config.word_counter) || !i18n['%1 word']) {
            _dom_content_set(container, "");
            return;
        }
        var words = $.get().replace(_pattern(esc_unit[0] + '.*?' + esc_unit[1], 'g'), "").match(/\w+/g) || [],
            i = words.length;
        _dom_content_set(container, _format(i18n['%1 word'][i === 1 ? 0 : 1], [i]));
    } count_words();

    function count_words_debounce() {
        if (debounce) _timer_reset(_timer);
        _timer = _timer_set(count_words, !is_unset(debounce) ? debounce : 250);
    }

    _events_set("copy cut focus input keydown paste select", $.target, count_words_debounce);

});