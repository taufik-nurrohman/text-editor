/*!
 * ==========================================================
 *  USER INTERFACE MODULE FOR TEXT EDITOR PLUGIN 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <http://latitudu.com>
 * License: MIT
 * ----------------------------------------------------------
 */

var TE_ui = function(o, parent) {

    var r = this,
	    el = r.el,
		c = 'text-editor',
		target = parent.target,
		field = el('span', {
			'class': c + '-editor' 
		});

	// wrap text area with `<span class="text-editor-field"></span>`
	target.className = c + '-editor-field';
	target.parentNode.insertBefore(field, target);
	field.appendChild(target);

	function is_object(x) {
		return typeof x === "object";
	}

    function extend(a, b) {
        a = a || {};
        for (var i in b) {
            if (is_object(b[i])) {
                a[i] = extend(a[i], b[i]);
            } else {
                a[i] = b[i];
            }
        }
        return a;
    }

	function printf(s, a) {
		return s.replace(/%(\d+)s/g, function(b, c) {
			return a[c] ? a[c] : b;
		}).replace(/%s/g, a[0] || '%s');
	}

	r.parent = parent;

	return r;

};

TE.prototype.ui = function(o) {
	return new TE_ui(o, this), this;
};