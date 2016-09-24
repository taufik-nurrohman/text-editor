Storage › Text Editor
=====================

> Persistent storage module for text editor plugin.

~~~ .html
<script src="../text-editor.min.js"></script>
<script src="../storage/storage.min.js"></script>
~~~

Instance
--------

~~~ .javascript
var editor = new TE(document.querySelector('textarea'));
~~~

Methods
-------

### Save State

Save state to the editor storage:

~~~ .javascript
editor.storage.set('my_state_id', 1);
~~~

### Restore State

Restore the saved state from the editor storage:

~~~ .javascript
var previous = editor.storage.get('my_state_id', '#'); // should return `1` or `#` if not available
~~~

### Remove State

Remove the saved state from the editor storage:

~~~ .javascript
editor.storage.reset('my_state_id');
~~~