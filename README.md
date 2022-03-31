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
 - Edit the files in the `.github/factory` folder.
 - Run `npm run pack` to generate the production ready files.

Contributors
------------

### Code Contributors

This project exists thanks to all the people who contribute.

[![Contributors](https://opencollective.com/text-editor/contributors.svg?width=890&button=false)](https://github.com/taufik-nurrohman/text-editor/graphs/contributors)

### Financial Contributors

[Become a financial contributor](https://opencollective.com/text-editor/contribute) and help us sustain our community.

#### Individuals

[![Contribute](https://opencollective.com/text-editor/individuals.svg?width=890)](https://opencollective.com/text-editor)

#### Organizations

[Support this project with your organization](https://opencollective.com/text-editor/contribute). Your logo will show up here with a link to your website.

<a href="https://opencollective.com/text-editor/organization/0/website"><img src="https://opencollective.com/text-editor/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/1/website"><img src="https://opencollective.com/text-editor/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/2/website"><img src="https://opencollective.com/text-editor/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/3/website"><img src="https://opencollective.com/text-editor/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/4/website"><img src="https://opencollective.com/text-editor/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/5/website"><img src="https://opencollective.com/text-editor/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/6/website"><img src="https://opencollective.com/text-editor/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/7/website"><img src="https://opencollective.com/text-editor/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/8/website"><img src="https://opencollective.com/text-editor/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/text-editor/organization/9/website"><img src="https://opencollective.com/text-editor/organization/9/avatar.svg"></a>

---

Release Notes
-------------

### 3.3.11

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

---

Credits
-------

 - Logo by [@mirzazulfan](https://github.com/mirzazulfan)