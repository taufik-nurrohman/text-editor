/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2021 Taufik Nurrohman
 *
 * <https://github.com/taufik-nurrohman/text-editor>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function() {
    'use strict';

    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };

    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };

    var isInstance = function isInstance(x, of ) {
        return x && isSet( of ) && x instanceof of ;
    };

    var isNull = function isNull(x) {
        return null === x;
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

    var off = function off(name, node, then) {
        node.removeEventListener(name, then);
    };

    var on = function on(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }

        node.addEventListener(name, then, options);
    };

    var fromStates = function fromStates() {
        for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
            lot[_key] = arguments[_key];
        }

        return Object.assign.apply(Object, [{}].concat(lot));
    };

    var hasKey = function hasKey(x, data) {
        return x in data;
    };

    var hasObjectKey = hasKey;

    function hook($) {
        var hooks = {};

        function fire(name, data) {
            if (!isSet(hooks[name])) {
                return $;
            }

            hooks[name].forEach(function(then) {
                return then.apply($, data);
            });
            return $;
        }

        function off(name, then) {
            if (!isSet(name)) {
                return hooks = {}, $;
            }

            if (isSet(hooks[name])) {
                if (isSet(then)) {
                    for (var i = 0, _j = hooks[name].length; i < _j; ++i) {
                        if (then === hooks[name][i]) {
                            hooks[name].splice(i, 1);
                            break;
                        }
                    } // Clean-up empty hook(s)


                    if (0 === j) {
                        delete hooks[name];
                    }
                } else {
                    delete hooks[name];
                }
            }

            return $;
        }

        function on(name, then) {
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }

            if (isSet(then)) {
                hooks[name].push(then);
            }

            return $;
        }

        $.hooks = hooks;
        $.fire = fire;
        $.off = off;
        $.on = on;
        return $;
    }

    var toObject = function toObject(x) {
        return Object.create(x);
    };

    if (isSet(TE)) {
        var TextEditorConstructor = TE;

        function TextEditor(source, state) {
            if (state === void 0) {
                state = {};
            }

            var $ = this;
            TextEditorConstructor.call($, source, state);
            state = $.state;
            var active = hasObjectKey('hook', state) ? state.hook : {};

            if (!active) {
                return $;
            }

            var _hook = hook($),
                fire = _hook.fire;

            var events = isObject(active) && active.events || {},
                pop = $.pop,
                theNativeEvents = fromStates({
                    'blur': 1,
                    'click': 1,
                    'focus': 1,
                    'input': 1,
                    'keydown': 1,
                    'keypress': 1,
                    'keyup': 1,
                    'select': 1
                }, events);

            function doFireHooks(e) {
                fire(e.type, [e]);
            } // Add hook to all native event(s)


            for (var theNativeEvent in theNativeEvents) {
                theNativeEvents[theNativeEvent] && on(theNativeEvent, source, doFireHooks);
            }

            $.pop = function() {
                // Remove hook from all native event(s)
                for (var _theNativeEvent in theNativeEvents) {
                    theNativeEvents[_theNativeEvent] && off(_theNativeEvent, source, doFireHooks);
                }

                return isFunction(pop) ? pop.call($) : $;
            };

            state.hook = state.hook || {};
            state.hook.events = theNativeEvents;
            $.state = state;
            return $;
        } // Clone all prototype(s) from the old constructor


        TextEditor.prototype = toObject(TextEditorConstructor.prototype);
        TextEditor.prototype.constructor = TextEditor; // Clone all static property from the old constructor

        for (var key in TextEditorConstructor) {
            TextEditor[key] = TextEditorConstructor[key];
        } // Override the old constructor


        TE = TextEditor;
    }
})();