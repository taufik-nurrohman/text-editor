/*!
 * ==========================================================
 *  ELEMENT MODULE FOR TEXT EDITOR PLUGIN 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <http://latitudu.com>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(w, d) {

    w.TE_el = function(n, a, parent) {

        function is_node(x) {
            return typeof x === "object" && x.nodeName;
        }

        function is_func(x) {
            return typeof x === "function";
        }

        var $ = is_node(n) ? n : d.createElement(n),
            r = this;

        for (var i in a) {
            if (is_func(a[i])) {
                $[i] = a[i];
            } else {
                $.setAttribute(i, a[i]);
            }
        }

        r.on = function(a, b) {
            return $.addEventListener(a, b, false), r;
        };

        r.off = function(a, b) {
            return $.removeEventListener(a, b), r;
        };

        r.appendTo = function(x) {
            return x.appendChild($), r;
        };

        r.prependTo = function(x) {
            return x.insertBefore($, x.firstChild), r;
        };

        r.content = function(x) {
            return $.innerHTML = x, r;
        };

        r.attributes = function() {
            var o = {},
                a = $.attributes;
            for (var i = 0, len = a.length; i < len; ++i) {
                o[a[i].name] = a[i].value;
            }
            return o;
        };

        r.$ = $;
        r.parent = parent;

        r.toString = function() {
            return $.outerHTML;
        };

        return r;

    };

    TE.prototype.el = function(a, b) {
        return new TE_el(a, b, this);
    };

})(window, document);