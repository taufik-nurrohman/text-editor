![Text Editor](https://user-images.githubusercontent.com/1669261/39924715-218a6b24-5553-11e8-8d04-69c4031ce777.png)

Text Editor
===========

> A text selection range API written in pure JavaScript, for modern browsers.

Demo
----

![Auto-close brackets and quotes](https://user-images.githubusercontent.com/1669261/70342109-f565df80-1886-11ea-899f-b600261378a0.gif)

![Know how to stop the auto-close](https://user-images.githubusercontent.com/1669261/70342113-f6970c80-1886-11ea-93f0-a209b277f344.gif)

![Smart indentation in selection](https://user-images.githubusercontent.com/1669261/70346049-f9e2c600-188f-11ea-8761-edf363b4b583.gif)

![Smart word selection](https://user-images.githubusercontent.com/1669261/70342114-f72fa300-1886-11ea-8939-2a81c61703d0.gif)

[Demo and Documentation](https://taufik-nurrohman.github.io/text-editor "View Demo")

Contribute
----------

 - **Please do not make pull requests by editing the files that are in the root of the project. They are generated automatically by the build tool.**
 - Install [Git](https://en.wikipedia.org/wiki/Git) and [Node.js](https://en.wikipedia.org/wiki/Node.js)
 - Run `git clone https://github.com/taufik-nurrohman/text-editor.git`
 - Run `cd text-editor && npm install`
 - Edit the files in the `.github/src/-` folder.
 - Run `npm run pack` to generate the production ready files.

Credits
-------

 - Logo by [@mirzazulfan](https://github.com/mirzazulfan)

---

Release Notes
-------------

### main

 - [ ] Moved plugins to external repositories.

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
