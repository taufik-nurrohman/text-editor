import {W, getValue, isDisabled, isReadOnly, isRequired, setValue} from '@taufik-nurrohman/document';
import {fromStates} from '@taufik-nurrohman/from';
import {getReference, forEachArray, setObjectAttributes, setReference} from '@taufik-nurrohman/f';
import {isArray, isFunction, isInstance, isInteger, isObject, isString} from '@taufik-nurrohman/is';
import {toCount} from '@taufik-nurrohman/to';

const name = 'TagPicker';

function TextEditor(self, state) {
    const $ = this;
    if (!self) {
        return $;
    }
    // Return new instance if `TextEditor` was called without the `new` operator
    if (!isInstance($, TextEditor)) {
        return new TextEditor(self, state);
    }
    setReference(self, $);
    return $.attach(self, fromStates({}, TextEditor.state, isString(state) ? {
        tab: state
    } : (state || {})));
}

TextEditor.from = function (self, state) {
    return new TextEditor(self, state);
};

TextEditor.of = getReference;

TextEditor.state = {
    'tab': '\t',
    'with': []
};

TextEditor.version = '5.0.0';

setObjectAttributes(TextEditor, {
    name: {
        value: name
    }
}, 1);

setObjectAttributes(TextEditor, {
    active: {
        get: function () {
            return this._active;
        },
        set: function (value) {
            let $ = this;
            return ($.self.disabled = !($._active = !!value)), $;
        }
    },
    fix: {
        get: function () {
            return this._fix;
        },
        set: function (value) {
            let $ = this;
            return ($.self.readOnly = $._fix = !!value), $;
        }
    },
    value: {
        get: function () {
            let value = getValue(this.self);
            return "" !== value ? value : null;
        },
        set: function (value) {
            let $ = this,
                {_active, self} = $;
            return (_active && setValue(self, value)), $;
        }
    },
    vital: {
        get: function () {
            return this._vital;
        },
        set: function (value) {
            let $ = this;
            return ($.self.required = $._vital = !!value), $;
        }
    }
});

TextEditor._ = setObjectMethods(TextEditor, {
    attach: function (self, state) {
        let $ = this;
        self = self || $.self;
        if (state && isString(state)) {
            state = {
                tab: state
            };
        }
        state = fromStates({}, $.state, state || {});
        $.self = self;
        $.state = state;
        let isDisabledSelf = isDisabled(self),
            isReadOnlySelf = isReadOnly(self),
            isRequiredSelf = isRequired(self),
            theTextAreaID = self.id,
            theTextAreaName = self.name,
            theTextAreaValue = getValue(self);
        $._active = !isDisabledSelf;
        $._fix = isReadOnlySelf;
        $._value = theTextAreaValue;
        $._vital = isRequiredSelf;
        // Attach extension(s)
        if (isSet(state) && isArray(state.with)) {
            forEachArray(state.with, (v, k) => {
                if (isString(v)) {
                    v = TextEditor[v];
                }
                // `const Extension = function (self, state = {}) {}`
                if (isFunction(v)) {
                    v.call($, self, state);
                // `const Extension = {attach: function (self, state = {}) {}, detach: function (self, state = {}) {}}`
                } else if (isObject(v) && isFunction(v.attach)) {
                    v.attach.call($, self, state);
                }
            });
        }
        return $;
    },
    blur: function () {
        let $ = this;
        return $.self.blur(), $;
    },
    detach: function () {
        let $ = this,
            {self, state} = $;
        $._active = false;
        $._value = null;
        // Detach extension(s)
        if (isArray(state.with)) {
            forEachArray(state.with, (v, k) => {
                if (isString(v)) {
                    v = TextEditor[v];
                }
                if (isObject(v) && isFunction(v.detach)) {
                    v.detach.call($, self, state);
                }
            });
        }
        return $;
    },
    focus: function (mode) {
        let $ = this,
            {_active, self} = $;
        if (!_active) {
            return $;
        }
        self.focus();
        if (true === mode) {
            self.select();
        } else if (isInteger(mode)) {
            if (mode < 0) {
                self.scrollTop = 0;
                self.setSelectionRange(0, 0);
            } else if (mode > 0) {
                let end = toCount(getValue(self));
                self.scrollTop = self.scrollHeight;
                self.setSelectionRange(end, end);
            }
        }
        return $;
    },
    reset: function (focus, mode) {
        let $ = this,
            {_active, _value} = $;
        if (!_active) {
            return $;
        }
        $.value = _value;
        return focus ? $.focus(mode) : $;
    }
});

export default TextEditor;