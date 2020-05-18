/*!
 * ==============================================================
 *  TEXT EDITOR HOOK 1.0.1
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, name) {

    var $$ = win[name],

        call = 'call',
        forEach = 'forEach',

        $$$, prop;

    function isFunction(x) {
        return 'function' === typeof x;
    }

    function isSet(x) {
        return 'undefined' !== typeof x;
    }

    $$$ = function(source, state) {

        var $ = this,
            hooks = {},
            nativeEvents = [
                'blur',
                'click',
                'focus',
                'input',
                'keydown',
                'keypress',
                'keyup',
                'select'
            ],
            pop = $.pop;

        // Is the same as `parent::__construct()` in PHP
        $$[call]($, source, state);

        $.fire = function(name, lot) {
            if (!isSet(hooks[name])) {
                return $;
            }
            for (var i = 0, j = hooks[name].length; i < j; ++i) {
                hooks[name][i].apply($, lot);
            }
            return $;
        };

        $.hooks = hooks;

        $.off = function(name, fn) {
            if (!isSet(name)) {
                return (hooks = {}), $;
            }
            if (isSet(hooks[name])) {
                if (isSet(fn)) {
                    for (var i = 0, j = hooks[name].length; i < j; ++i) {
                        if (fn === hooks[name][i]) {
                            hooks[name].splice(i, 1);
                        }
                    }
                    // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[name];
                    }
                } else {
                    delete hooks[name];
                }
            }
            return $;
        };

        $.on = function(name, fn) {
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }
            if (isSet(fn)) {
                hooks[name].push(fn);
            }
            return $;
        };

        function doApplyHookToNativeEvents(e) {
            $.fire(e.type, [e]);
        }

        // Apply hook to all event(s)
        nativeEvents[forEach](function(n) {
            source.addEventListener(n, doApplyHookToNativeEvents, false);
        });

        $.pop = function() {
            // Remove hook from all event(s)
            nativeEvents[forEach](function(n) {
                source.removeEventListener(n, doApplyHookToNativeEvents);
            });
            return isFunction(pop) ? pop[call]($) : $;
        }

    };

    // Clone all static property from the old constructor
    for (prop in $$) {
        $$$[prop] = $$[prop];
    }

    // Clone prototype(s)
    $$$.prototype = $$$._ = $$._;

    // Override
    win[name] = $$$;

})(this, this.document, 'TE');
