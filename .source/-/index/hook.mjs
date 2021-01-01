import {off as offEvent, on as onEvent} from '@taufik-nurrohman/event';
import {fromStates} from '@taufik-nurrohman/from';
import {fire as fireHook, hooks, off as offHook, on as onHook} from '@taufik-nurrohman/hook';
import {isFunction, isObject, isSet} from '@taufik-nurrohman/is';

if (isSet(TE)) {
    const TextEditorConstructor = TE;
    function TextEditor(source, state = {}) {
        const $ = this;
        TextEditorConstructor.call($, source, state);
        state = $.state;
        let active = 'hook' in state ? state.hook : {};
        if (!active) {
            return $;
        }
        let events = isObject(active) && active.events || {},
            fire = fireHook.bind($),
            off = offHook.bind($),
            on = onHook.bind($),
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
            }, events), value;
        $.fire = fire;
        $.hooks = hooks;
        $.off = off;
        $.on = on;
        function doFireHooks(e) {
            fire(e.type, [e]);
        }
        // Add hook to all native event(s)
        for (let theNativeEvent in theNativeEvents) {
            theNativeEvents[theNativeEvent] && onEvent(theNativeEvent, source, doFireHooks);
        }
        $.pop = () => {
            // Remove hook from all native event(s)
            for (let theNativeEvent in theNativeEvents) {
                theNativeEvents[theNativeEvent] && offEvent(theNativeEvent, source, doFireHooks);
            }
            return isFunction(pop) ? pop.call($) : $;
        };
        state.hook = state.hook || {};
        state.hook.events = theNativeEvents;
        $.state = state;
        return $;
    }
    // Clone all prototype(s) from the old constructor
    TextEditor.prototype = Object.create(TextEditorConstructor.prototype);
    TextEditor.prototype.constructor = TextEditor;
    // Clone all static property from the old constructor
    for (let key in TextEditorConstructor) {
        TextEditor[key] = TextEditorConstructor[key];
    }
    // Override the old constructor
    TE = TextEditor;
}
