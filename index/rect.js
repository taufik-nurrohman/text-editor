(function(factory) {
    typeof define === 'function' && define.amd ? define(factory) : factory();
})(function() {
    'use strict';
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isInstance = function isInstance(x, of ) {
        return x && isSet( of ) && x instanceof of ;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
    };
    var isNumeric = function isNumeric(x) {
        return /^-?(?:\d*.)?\d+$/.test(x + "");
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if ('object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var isString = function isString(x) {
        return 'string' === typeof x;
    };
    var fromHTML = function fromHTML(x) {
        return x.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
    };
    var fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function(v) {
                return fromValue(x);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = fromValue(x[k]);
            }
            return x;
        }
        if (false === x) {
            return 'false';
        }
        if (null === x) {
            return 'null';
        }
        if (true === x) {
            return 'true';
        }
        return "" + x;
    };
    var toCaseCamel = function toCaseCamel(x) {
        return x.replace(/[-_.](\w)/g, function(m0, m1) {
            return toCaseUpper(m1);
        });
    };
    var toCaseUpper = function toCaseUpper(x) {
        return x.toUpperCase();
    };
    var toNumber = function toNumber(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return base ? parseInt(x, base) : parseFloat(x);
    };
    var toValue = function toValue(x) {
        if (isArray(x)) {
            return x.map(function(v) {
                return toValue(v);
            });
        }
        if (isNumeric(x)) {
            return toNumber(x);
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = toValue(x[k]);
            }
            return x;
        }
        if ('false' === x) {
            return false;
        }
        if ('null' === x) {
            return null;
        }
        if ('true' === x) {
            return true;
        }
        return x;
    };
    var D = document;
    var W = window;
    var B = D.body;
    var getChildren = function getChildren(parent, index) {
        var children = parent.children;
        return isNumber(index) ? children[index] || null : children || [];
    };
    var getStyle = function getStyle(node, style, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        var value = W.getComputedStyle(node).getPropertyValue(style);
        if (parseValue) {
            value = toValue(value);
        }
        return value || "" === value || 0 === value ? value : null;
    };
    var hasState = function hasState(node, state) {
        return state in node;
    };
    var isWindow = function isWindow(node) {
        return node === W;
    };
    var letAttribute = function letAttribute(node, attribute) {
        return node.removeAttribute(attribute), node;
    };
    var letStyle = function letStyle(node, style) {
        return node.style[toCaseCamel(style)] = null, node;
    };
    var setAttribute = function setAttribute(node, attribute, value) {
        if (true === value) {
            value = attribute;
        }
        return node.setAttribute(attribute, fromValue(value)), node;
    };
    var setAttributes = function setAttributes(node, attributes) {
        var value;
        for (var attribute in attributes) {
            value = attributes[attribute];
            if (value || "" === value || 0 === value) {
                setAttribute(node, attribute, value);
            } else {
                letAttribute(node, attribute);
            }
        }
        return node;
    };
    var setChildLast = function setChildLast(parent, node) {
        return parent.append(node), node;
    };
    var setElement = function setElement(node, content, attributes) {
        node = isString(node) ? D.createElement(node) : node;
        if (isObject(content)) {
            attributes = content;
            content = false;
        }
        if (isString(content)) {
            setHTML(node, content);
        }
        if (isObject(attributes)) {
            setAttributes(node, attributes);
        }
        return node;
    };
    var setHTML = function setHTML(node, content, trim) {
        if (trim === void 0) {
            trim = true;
        }
        if (null === content) {
            return node;
        }
        var state = 'innerHTML';
        return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
    };
    var setStyle = function setStyle(node, style, value) {
        if (isNumber(value)) {
            value += 'px';
        }
        return node.style[toCaseCamel(style)] = fromValue(value), node;
    };
    var setStyles = function setStyles(node, styles) {
        var value;
        for (var style in styles) {
            value = styles[style];
            if (value || "" === value || 0 === value) {
                setStyle(node, style, value);
            } else {
                letStyle(node, style);
            }
        }
        return node;
    };
    var getOffset = function getOffset(node) {
        return [node.offsetLeft, node.offsetTop];
    };
    var getSize = function getSize(node) {
        return isWindow(node) ? [node.innerWidth, node.innerHeight] : [node.offsetWidth, node.offsetHeight];
    };

    function el(a, b = 'span') {
        return '<' + b + '>' + a + '</' + b + '>';
    }

    function getRectSelection($, div, source) {
        let span = el('&zwnj;'),
            props = ['border-bottom-width', 'border-left-width', 'border-right-width', 'border-top-width', 'box-sizing', 'direction', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'height', 'letter-spacing', 'line-height', 'max-height', 'max-width', 'min-height', 'min-width', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'tab-size', 'text-align', 'text-decoration', 'text-indent', 'text-transform', 'width', 'word-spacing'];
        setHTML(div, el(fromHTML($.before)) + span + el(fromHTML($.value), 'mark') + span + el(fromHTML($.after)));
        let styles = "";
        props.forEach(prop => {
            let value = getStyle(source, prop);
            value && (styles += prop + ':' + value + ';');
        });
        let L = toNumber(getStyle(source, props[1]), 0),
            T = toNumber(getStyle(source, props[3]), 0),
            [X, Y] = getOffset(source),
            [W, H] = getSize(source);
        setAttribute(div, 'style', styles);
        setStyles(div, {
            'border-style': 'solid',
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word',
            'overflow': 'auto',
            'position': 'absolute',
            'left': X,
            'top': Y,
            'visibility': 'hidden'
        });
        setChildLast(B, div);
        let c = getChildren(div);
        let start = c[1],
            rect = c[2],
            end = c[3],
            startOffset = getOffset(start),
            startSize = getSize(start),
            rectOffset = getOffset(rect),
            rectSize = getSize(rect),
            endOffset = getOffset(end),
            endSize = getSize(end);
        return [{
            h: startSize[1],
            // Caret height (must be the font size)
            w: 0,
            // Caret width is always zero
            x: startOffset[0] + X + L,
            // Left offset of selection start
            y: startOffset[1] + Y + T // Top offset of selection start
        }, {
            h: endSize[1],
            // Caret height (must be the font size)
            w: 0,
            // Caret width is always zero
            x: endOffset[0] + X + L,
            // Left offset of selection end
            y: endOffset[1] + Y + T // Top offset of selection end
        }, {
            h: rectSize[1],
            // Total selection height
            w: rectOffset[0],
            // Total selection width
            x: rectOffset[0] + X + L,
            // Left offset of the whole selection
            y: rectOffset[1] + Y + T // Top offset of the whole selection
        }, {
            h: H,
            // Text area height
            w: W,
            // Text area width
            x: X,
            // Left offset of text area
            y: Y // Top offset of text area
        }];
    }
    const __proto__ = TE.prototype;
    __proto__.mirror = setElement('div');
    __proto__.rect = function(key) {
        let t = this,
            rect = getRectSelection(t.$(), t.mirror, t.self);
        return isSet(key) ? [rect[0][key], rect[1][key]] : rect;
    };
});