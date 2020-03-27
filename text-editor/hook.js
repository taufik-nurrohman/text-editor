


/*!
 * ==============================================================
 *  TEXT EDITOR HOOK 1.0.0
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, name) {

    var $ = win[name],
        _ = $._,
        _hooks = {};

    function isSet(x) {
        return 'undefined' !== typeof x;
    }

    _.fire = function(name, lot) {
        if (!isSet(_hooks[name])) {
            return this;
        }
        for (var i = 0, j = _hooks[name].length; i < j; ++i) {
            _hooks[name][i].apply(this, lot);
        }
        return this;
    };

    _.hooks = _hooks;

    _.off = function(name, fn) {
        if (!isSet(name)) {
            return (_hooks = {}), this;
        }
        if (isSet(_hooks[name])) {
            if (isSet(fn)) {
                for (var i = 0, j = _hooks[name].length; i < j; ++i) {
                    if (fn === _hooks[name][i]) {
                        _hooks[name].splice(i, 1);
                    }
                }
            } else {
                delete _hooks[name];
            }
        }
        return this;
    };

    _.on = function(name, fn) {
        if (!isSet(_hooks[name])) {
            _hooks[name] = [];
        }
        if (isSet(fn)) {
            _hooks[name].push(fn);
        }
        return this;
    };

})(this, this.document, 'TE');
