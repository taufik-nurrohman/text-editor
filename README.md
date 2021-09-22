![Text Editor](https://user-images.githubusercontent.com/1669261/39924715-218a6b24-5553-11e8-8d04-69c4031ce777.png)

Text Editor
===========

> A text selection range API written in pure JavaScript, for modern browsers.

[Demo and Documentation](https://taufik-nurrohman.github.io/text-editor "View Demo")

Contribute
----------

 - **Please do not make pull requests by editing the files that are in the root of the project. They are generated automatically by the build tool.**
 - Install [Git](https://en.wikipedia.org/wiki/Git) and [Node.js](https://en.wikipedia.org/wiki/Node.js)
 - Run `git clone https://github.com/taufik-nurrohman/text-editor.git`
 - Run `cd text-editor && npm install --save-dev`
 - Edit the files in the `.github/source` folder.
 - Run `npm run pack` to generate the production ready files.

Credits
-------

 - Logo by [@mirzazulfan](https://github.com/mirzazulfan)

---

Release Notes
-------------

### 3.3.9

 - Added example of paste as plain text functionality.
 - Maintenance.

### 3.3.4

 - Moved extensions to external repositories.
 - Removed regular expression features in `editor.peel()` and `editor.pull()` method for consistency.

### 3.2.6

 - Added example of search/replace functionality.
 - Maintenance.

### 3.2.1

 - Restructured the test files.

### 3.2.0

 - Prioritized maintainability over file size. Say hello to Node.js and ES6! :wave:
 - Output file for the browser is now using the [Universal Module Definition](https://github.com/umdjs/umd) format.

### 3.1.10

 - Updated all extensions.

### 3.1.9

 - Removed `TE._` method.

### 3.1.8

 - Added ability to clear the hook storage object if it’s empty.
 - Added ability to collapse brackets for `text-editor/source.js` extension.
 - Added ability to set custom indent and outdent handler for `text-editor/source.js` extension.
 - Fixed common issue with ES6 module which does not reference the `this` scope to `window` object by default.
 - Updated donation target.

### 3.1.7

 - Added `TE.state` property to set initial state globally.

### 3.1.6

 - Removed `TE.each()` method.
 - Renamed `TE.__instance__` to `TE.instances`.

### 3.1.5

 - Refactor.

### 2.8.5

 - None.