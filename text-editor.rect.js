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
        offset = 'offset',
        offsetLeft = offset + 'Left',
        offsetTop = offset + 'Top',
        offsetWidth = offset + 'Width',
        offsetHeight = offset + 'Height',
        replace = 'replace';

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
            width = '-width',
            property = [
                border + 'bottom' + width,
                border + 'left' + width,
                border + 'right' + width,
                border + 'top' + width,
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
                'height',
                'letter-spacing',
                'line-height',
                padding + 'bottom',
                padding + 'left',
                padding + 'right',
                padding + 'top',
                'tab-size',
                text + 'align',
                text + 'decoration',
                text + 'indent',
                text + 'transform',
                'width',
                'word-spacing'
            ], i, c;
        doc.body.appendChild(div);
        div.innerHTML = encode($.before) + span + '<mark>' + encode($.value) + '</mark>' + span + encode($.after);
        var s = "", v;
        for (i in property) {
            v = css($$, property[i]);
            v && (s += property[i] + ':' + v + ';');
        }
        var X = $$[offsetLeft],
            Y = $$[offsetTop],
            L = number(css($$, property[1])),
            T = number(css($$, property[3])),
            W = $$[offsetWidth],
            H = $$[offsetHeight];
        div.style.cssText = s + 'border-style:solid;white-space:pre-wrap;word-wrap:break-word;overflow:auto;position:absolute;left:' + X + 'px;top:' + Y + 'px;visibility:hidden;';
        c = div.children;
        var start = c[0],
            rect = c[1],
            end = c[2];
        return [{
            x: start[offsetLeft] + X + L, // left offset of selection start
            y: start[offsetTop] + Y + T, // top offset of selection start
            w: 0, // caret width is always zero
            h: start[offsetHeight] // caret height (must be the font size)
        }, {
            x: end[offsetLeft] + X + L, // left offset of selection end
            y: end[offsetTop] + Y + T, // top offset of selection end
            w: 0, // caret width is always zero
            h: end[offsetHeight] // caret height (must be the font size)
        }, {
            x: rect[offsetLeft] + X + L, // left offset of the whole selection
            y: rect[offsetTop] + Y + T, // top offset of the whole selection
            w: rect[offsetWidth], // total selection width
            h: rect[offsetHeight] // total selection height
        }, {
            x: X, // left offset of text area
            y: Y, // top offset of text area
            w: W, // text area width
            h: H // text area height
        }];
    }

    $$.rect = function(k) {
        var o = rect(this.$(), this.self);
        return x(k) ? o : [o[0][k], o[1][k]];
    };

})(window, document, 'TE');