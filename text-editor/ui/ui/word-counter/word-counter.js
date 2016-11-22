/*!
 * ==========================================================
 *  WORD COUNTER PLUGIN FOR USER INTERFACE MODULE 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

TE.each(function($) {

    var ui = $.ui,
        _ = $._,
        _dom = _.dom,
        _dom_content_set = _dom.content.set,
        _dom_get = _dom.get,
        _event_set = _.event.set,
        _extend = _.extend,
        _format = _.format,
        _pattern = _.pattern,
        _timer_set = _.timer.set,
        _timer_reset = _.timer.reset,

        is_unset = TE.is.x,

        esc_unit = $.config.unit[1][0],
        config = $.config,
        i18n = config.languages.others,
        right = _dom_get('.right', ui.el.footer)[0],
        debounce;

    i18n = _extend({
        '%1 word': '%1 Word',
        '%1 words': '%1 Words'
    }, i18n);

    function count_words(e) {
        if ((!is_unset(config.word_counter) && !config.word_counter) || !i18n['%1 word'] || !i18n['%1 words']) {
            _dom_content_set(right, "");
            return;
        }
        var words = $.get().replace(_pattern(esc_unit[0] + '.*?' + esc_unit[1], 'g'), "").match(/\w+/g) || [],
            i = words.length;
        _dom_content_set(right, _format(i18n['%1 word' + (i === 1 ? "" : 's')], [i]));
    } count_words();

    function count_words_debounce() {
        if (debounce) _timer_reset(debounce);
        debounce = _timer_set(count_words, !is_unset(config.debounce) ? config.debounce : 250);
    }

    _event_set("copy cut focus input keydown paste select", $.target, count_words_debounce);

});