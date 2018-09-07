/*!
 * ==========================================================
 *  TEXT EDITOR RECT 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var $ = win[NS],
        $$ = $._,
        x = $.is.x,
        number = $.i,
        div = doc.createElement('div'),
        getBoundingClientRect = 'getBoundingClientRect',
        getComputedStyle = 'getComputedStyle',
        getPropertyValue = 'getPropertyValue',
        replace = 'replace',
        X = 'left',
        Y = 'top',
        W = 'width',
        H = 'height';

    $.mirror = div;

    function css(el, prop) {
        return win[getComputedStyle](el)[getPropertyValue](prop);
    }

    function encode(x) {
        return x[replace](/&/g, '&amp;')[replace](/</g, '&lt;')[replace](/>/g, '&gt;');
    }

    function rect($, $$) {
        var span = '<span>&zwnj;</span>',
            font = 'font-',
            text = 'text-',
            padding = 'padding-',
            border = 'border-',
            width = '-' + W,
            property = [
                border + 'bottom' + width,
                border + X + width,
                border + 'right' + width,
                border + Y + width,
                '-webkit-box-sizing',
                '-moz-box-sizing',
                'box-sizing',
                'direction',
                font + 'family',
                font + 'size',
                font + 'size-adjust',
                font + 'stretch',
                font + 'style',
                font + 'variant',
                font + 'weight',
                H,
                'letter-spacing',
                'line-' + H,
                padding + 'bottom',
                padding + X,
                padding + 'right',
                padding + Y,
                'tab-size',
                text + 'align',
                text + 'decoration',
                text + 'indent',
                text + 'transform',
                W,
                'word-spacing'
            ], i, r, c;
        doc.body.appendChild(div);
        div.innerHTML = encode($.before) + span + '<mark>' + encode($.value) + '</mark>' + span + encode($.after);
        var s = "", v;
        for (i in property) {
            v = css($$.self, property[i]);
            v && (s += property[i] + ':' + v + ';');
        }
        r = $$.self[getBoundingClientRect]();
        div.style.cssText = s + 'border-style:solid;white-space:pre-wrap;word-wrap:break-word;overflow:auto;position:absolute;' + Y + ':' + r[Y] + 'px;' + X + ':' + r[X] + 'px;visibility:hidden;';
        c = div.children;
        var start = c[0][getBoundingClientRect](),
            rect = c[1][getBoundingClientRect](),
            end = c[2][getBoundingClientRect]();
        return [{
            x: start[X], // left offset of selection start
            y: start[Y], // top offset of selection start
            w: 0, // caret width is always zero
            h: start[H] // caret height (must be the font size)
        }, {
            x: end[X], // left offset of selection end
            y: end[Y], // top offset of selection end
            w: 0, // caret width is always zero
            h: end[H] // caret height (must be the font size)
        }, {
            x: rect[X], // left offset of the whole selection
            y: rect[Y], // top offset of the whole selection
            w: rect[W], // total selection width
            h: rect[H] // total selection height
        }, {
            x: r[X], // left offset of text area
            y: r[Y], // top offset of text area
            w: r[W], // text area width
            h: r[H] // text area height
        }];
    }

    $$.rect = function(k) {
        var o = rect(this.$(), this);
        return x(k) ? o : [o[0][k], o[1][k]];
    };

})(window, document, 'TE');