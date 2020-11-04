/*!
 * ==============================================================
 *  TEXT EDITOR RECT 1.1.3
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

((win, doc, name) => {

    let $ = win[name],
        _ = $.prototype,

        appendChild = 'appendChild',
        children = 'children',
        div = doc.createElement('div'),
        getBoundingClientRect = 'getBoundingClientRect',
        getComputedStyle = 'getComputedStyle',
        getPropertyValue = 'getPropertyValue',
        innerHTML = 'innerHTML',
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

    function isSet(x) {
        return 'undefined' !== typeof x;
    }

    function number(x) {
        return parseFloat(x);
    }

    function rect($, el) {
        let span = '<span>&zwnj;</span>',
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
        doc.body[appendChild](div);
        div[innerHTML] = encode($.before) + span + '<mark>' + encode($.value) + '</mark>' + span + encode($.after);
        let s = "", v;
        for (i in property) {
            v = css(el, property[i]);
            v && (s += property[i] + ':' + v + ';');
        }
        let X = el[offsetLeft],
            Y = el[offsetTop],
            L = number(css(el, property[1])),
            T = number(css(el, property[3])),
            W = el[offsetWidth],
            H = el[offsetHeight];
        div.style.cssText = s + 'border-style:solid;white-space:pre-wrap;word-wrap:break-word;overflow:auto;position:absolute;left:' + X + 'px;top:' + Y + 'px;visibility:hidden;';
        c = div[children];
        let start = c[0],
            rect = c[1],
            end = c[2];
        return [{
            h: start[offsetHeight], // Caret height (must be the font size)
            w: 0, // Caret width is always zero
            x: start[offsetLeft] + X + L, // Left offset of selection start
            y: start[offsetTop] + Y + T // Top offset of selection start
        }, {
            h: end[offsetHeight], // Caret height (must be the font size)
            w: 0, // Caret width is always zero
            x: end[offsetLeft] + X + L, // Left offset of selection end
            y: end[offsetTop] + Y + T // Top offset of selection end
        }, {
            h: rect[offsetHeight], // Total selection height
            w: rect[offsetWidth], // Total selection width
            x: rect[offsetLeft] + X + L, // Left offset of the whole selection
            y: rect[offsetTop] + Y + T // Top offset of the whole selection
        }, {
            h: H, // Text area height
            w: W, // Text area width
            x: X, // Left offset of text area
            y: Y // Top offset of text area
        }];
    }

    _.rect = function(key) {
        let t = this,
            out = rect(t.$(), t.self);
        return isSet(key) ? [out[0][key], out[1][key]] : out;
    };

})(window, document, 'TE');
