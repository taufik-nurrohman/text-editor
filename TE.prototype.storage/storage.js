/*!
 * ==========================================================
 *  PERSISTENT STORAGE MODULE FOR TEXT EDITOR PLUGIN 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(w, d) {

    var s = localStorage,
        b = btoa,
        j = JSON;

    function encode(x) {
        return j.stringify(x);
    }

    function decode(x) {
        return j.parse(x);
    }

    function is_set(x) {
        return typeof x !== "undefined";
    }

    TE.prototype.storage = {
        set: function(k, v) {
            if (v === "") return this;
            return s.setItem(k + ':' + b(this.target), encode(v)), this;
        },
        get: function(k, f) {
            var v = s.getItem(k + ':' + b(this.target));
            return v !== null ? decode(v) : (is_set(f) ? f : false);
        },
        reset: function(k) {
            s.removeItem(k + ':' + b(this.target), null), this;
        }
    };

})(window, document);