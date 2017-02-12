var xmlparser =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = coreutil;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomTree = exports.DomTree = function () {
    function DomTree(xml, elementCreatedListener) {
        _classCallCheck(this, DomTree);

        this._elementCreatedListener = elementCreatedListener;
        this._xml = xml;
        this._rootElement = null;
    }

    _createClass(DomTree, [{
        key: "getRootElement",
        value: function getRootElement() {
            return this._rootElement;
        }
    }, {
        key: "setRootElement",
        value: function setRootElement(element) {
            this._rootElement = element;
        }
    }, {
        key: "load",
        value: function load() {
            var domScaffold = new DomScaffold();
            domScaffold.load(this._xml, 0, this._elementCreatedListener);
            this._rootElement = domScaffold.getTree();
        }
    }, {
        key: "dump",
        value: function dump() {
            this._rootElement.dump();
        }
    }, {
        key: "read",
        value: function read() {
            return this._rootElement.read();
        }
    }]);

    return DomTree;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CdataDetector = function () {
    function CdataDetector() {
        _classCallCheck(this, CdataDetector);

        this._type = 'CdataDetector';
        this._value = null;
        this._found = false;
    }

    _createClass(CdataDetector, [{
        key: 'isFound',
        value: function isFound() {
            return this._found;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this._type;
        }
    }, {
        key: 'createElement',
        value: function createElement() {
            return new XmlCdata(this._value);
        }
    }, {
        key: 'detect',
        value: function detect(depth, xmlCursor) {
            this._found = false;
            this._value = null;

            var endPos = this.detectContent(depth, xmlCursor.xml, xmlCursor.cursor, xmlCursor.parentDomScaffold);
            if (endPos != -1) {
                this._found = true;
                this.hasChildren = false;
                this._value = xmlCursor.xml.substring(xmlCursor.cursor, endPos);
                xmlCursor.cursor = endPos;
            }
        }
    }, {
        key: 'detectContent',
        value: function detectContent(depth, xml, cursor, parentDomScaffold) {
            _coreutil.Logger.debug(depth, 'Cdata start at ' + cursor);
            var internalStartPos = cursor;
            if (!CdataDetector.isContent(depth, xml, cursor)) {
                _coreutil.Logger.debug(depth, 'No Cdata found');
                return -1;
            }
            while (CdataDetector.isContent(depth, xml, cursor) && cursor < xml.length) {
                cursor++;
            }
            _coreutil.Logger.debug(depth, 'Cdata end at ' + (cursor - 1));
            if (parentDomScaffold == null) {
                _coreutil.Logger.error('ERR: Content not allowed on root level in xml document');
                return -1;
            }
            _coreutil.Logger.debug(depth, 'Cdata found value is ' + xml.substring(internalStartPos, cursor));
            return cursor;
        }
    }], [{
        key: 'isContent',
        value: function isContent(depth, xml, cursor) {
            if (ReadAhead.read(xml, '<', cursor) != -1) {
                return false;
            }
            if (ReadAhead.read(xml, '>', cursor) != -1) {
                return false;
            }
            return true;
        }
    }]);

    return CdataDetector;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClosingElementDetector = function () {
    function ClosingElementDetector() {
        _classCallCheck(this, ClosingElementDetector);

        this._type = 'ClosingElementDetector';
        this._found = false;
        this._element = null;
    }

    _createClass(ClosingElementDetector, [{
        key: 'createElement',
        value: function createElement() {
            return this._element;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this._type;
        }
    }, {
        key: 'isFound',
        value: function isFound() {
            return this._found;
        }
    }, {
        key: 'detect',
        value: function detect(depth, xmlCursor) {
            _coreutil.Logger.debug(depth, 'Looking for self closing element at position ' + xmlCursor.cursor);
            var elementBody = new ElementBody();
            var endpos = ClosingElementDetector.detectClosingElement(depth, xmlCursor.xml, xmlCursor.cursor, elementBody);
            if (endpos != -1) {
                this._element = new XmlElement(elementBody.getName(), elementBody.getNamespace(), true);

                elementBody.getAttributes().forEach(function (attributeName, attributeValue, parent) {
                    parent._element.getAttributes().set(attributeName, new XmlAttribute(attributeName, attributeValue));
                    return true;
                }, this);

                _coreutil.Logger.debug(depth, 'Found self closing tag <' + this._element.getFullName() + '/> from ' + xmlCursor.cursor + ' to ' + endpos);
                this._found = true;
                xmlCursor.cursor = endpos + 1;
            }
        }
    }], [{
        key: 'detectClosingElement',
        value: function detectClosingElement(depth, xml, cursor, elementBody) {
            if ((cursor = ReadAhead.read(xml, '<', cursor)) == -1) {
                return -1;
            }
            cursor++;
            cursor = elementBody.detectPositions(depth + 1, xml, cursor);
            if ((cursor = ReadAhead.read(xml, '/>', cursor)) == -1) {
                return -1;
            }
            return cursor;
        }
    }]);

    return ClosingElementDetector;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementBody = function () {
    function ElementBody() {
        _classCallCheck(this, ElementBody);

        this._name = null;
        this._namespace = null;
        this._attributes = new _coreutil.Map();
    }

    _createClass(ElementBody, [{
        key: 'getName',
        value: function getName() {
            return this._name;
        }
    }, {
        key: 'getNamespace',
        value: function getNamespace() {
            return this._namespace;
        }
    }, {
        key: 'getAttributes',
        value: function getAttributes() {
            return this._attributes;
        }
    }, {
        key: 'detectPositions',
        value: function detectPositions(depth, xml, cursor) {
            var nameStartpos = cursor;
            var nameEndpos = null;
            var namespaceEndpos = null;
            var namespaceStartpos = null;
            while (_coreutil.StringUtils.isInAlphabet(xml.charAt(cursor)) && cursor < xml.length) {
                cursor++;
            }
            if (xml.charAt(cursor) == ':') {
                _coreutil.Logger.debug(depth, 'Found namespace');
                namespaceStartpos = nameStartpos;
                namespaceEndpos = cursor - 1;
                nameStartpos = cursor + 1;
                cursor++;
                while (_coreutil.StringUtils.isInAlphabet(xml.charAt(cursor)) && cursor < xml.length) {
                    cursor++;
                }
            }
            nameEndpos = cursor - 1;
            this._name = xml.substring(nameStartpos, nameEndpos + 1);
            if (namespaceStartpos != null && namespaceEndpos != null) {
                this._namespace = xml.substring(namespaceStartpos, namespaceEndpos + 1);
            }
            cursor = this.detectAttributes(depth, xml, cursor);
            return cursor;
        }
    }, {
        key: 'detectAttributes',
        value: function detectAttributes(depth, xml, cursor) {
            var detectedAttrNameCursor = null;
            while ((detectedAttrNameCursor = this.detectNextStartAttribute(depth, xml, cursor)) != -1) {
                cursor = this.detectNextEndAttribute(depth, xml, detectedAttrNameCursor);
                var name = xml.substring(detectedAttrNameCursor, cursor + 1);
                _coreutil.Logger.debug(depth, 'Found attribute from ' + detectedAttrNameCursor + '  to ' + cursor);
                cursor = this.detectValue(name, depth, xml, cursor + 1);
            }
            return cursor;
        }
    }, {
        key: 'detectNextStartAttribute',
        value: function detectNextStartAttribute(depth, xml, cursor) {
            while (xml.charAt(cursor) == ' ' && cursor < xml.length) {
                cursor++;
                if (_coreutil.StringUtils.isInAlphabet(xml.charAt(cursor))) {
                    return cursor;
                }
            }
            return -1;
        }
    }, {
        key: 'detectNextEndAttribute',
        value: function detectNextEndAttribute(depth, xml, cursor) {
            while (_coreutil.StringUtils.isInAlphabet(xml.charAt(cursor))) {
                cursor++;
            }
            return cursor - 1;
        }
    }, {
        key: 'detectValue',
        value: function detectValue(name, depth, xml, cursor) {
            var valuePos = cursor;
            if ((valuePos = ReadAhead.read(xml, '="', valuePos, true)) == -1) {
                this._attributes.set(name, null);
                return cursor;
            }
            valuePos++;
            _coreutil.Logger.debug(depth, 'Possible attribute value start at ' + valuePos);
            var valueStartPos = valuePos;
            while (this.isAttributeContent(depth, xml, valuePos)) {
                valuePos++;
            }
            if (valuePos == cursor) {
                this._attributes.set(name, '');
            } else {
                this._attributes.set(name, xml.substring(valueStartPos, valuePos));
            }

            _coreutil.Logger.debug(depth, 'Found attribute content ending at ' + (valuePos - 1));

            if ((valuePos = ReadAhead.read(xml, '"', valuePos, true)) != -1) {
                valuePos++;
            } else {
                _coreutil.Logger.error('Missing end quotes on attribute at position ' + valuePos);
            }
            return valuePos;
        }
    }, {
        key: 'isAttributeContent',
        value: function isAttributeContent(depth, xml, cursor) {
            if (ReadAhead.read(xml, '<', cursor) != -1) {
                return false;
            }
            if (ReadAhead.read(xml, '>', cursor) != -1) {
                return false;
            }
            if (ReadAhead.read(xml, '"', cursor) != -1) {
                return false;
            }
            return true;
        }
    }]);

    return ElementBody;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementDetector = function () {
    function ElementDetector() {
        _classCallCheck(this, ElementDetector);

        this._type = 'ElementDetector';
        this._hasChildren = false;
        this._found = false;
        this._xmlCursor = null;
        this._element = null;
    }

    _createClass(ElementDetector, [{
        key: 'createElement',
        value: function createElement() {
            return this._element;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return this._type;
        }
    }, {
        key: 'isFound',
        value: function isFound() {
            return this._found;
        }
    }, {
        key: 'hasChildren',
        value: function hasChildren() {
            return this._hasChildren;
        }
    }, {
        key: 'detect',
        value: function detect(depth, xmlCursor) {
            this._xmlCursor = xmlCursor;
            _coreutil.Logger.debug(depth, 'Looking for opening element at position ' + xmlCursor.cursor);
            var elementBody = new ElementBody();
            var endpos = ElementDetector.detectOpenElement(depth, xmlCursor.xml, xmlCursor.cursor, elementBody);
            if (endpos != -1) {

                this._element = new XmlElement(elementBody.getName(), elementBody.getNamespace(), false);

                elementBody.getAttributes().forEach(function (attributeName, attributeValue, parent) {
                    parent._element.getAttributes().set(attributeName, new XmlAttribute(attributeName, attributeValue));
                    return true;
                }, this);

                _coreutil.Logger.debug(depth, 'Found opening tag <' + this._element.getFullName() + '> from ' + xmlCursor.cursor + ' to ' + endpos);
                xmlCursor.cursor = endpos + 1;

                if (!this.stop(depth)) {
                    this._hasChildren = true;
                }
                this._found = true;
            }
        }
    }, {
        key: 'stop',
        value: function stop(depth) {
            _coreutil.Logger.debug(depth, 'Looking for closing element at position ' + this._xmlCursor.cursor);
            var closingElement = ElementDetector.detectEndElement(depth, this._xmlCursor.xml, this._xmlCursor.cursor);
            if (closingElement != -1) {
                var closingTagName = this._xmlCursor.xml.substring(this._xmlCursor.cursor + 2, closingElement);
                _coreutil.Logger.debug(depth, 'Found closing tag </' + closingTagName + '> from ' + this._xmlCursor.cursor + ' to ' + closingElement);

                if (this._element.getFullName() != closingTagName) {
                    _coreutil.Logger.error('ERR: Mismatch between opening tag <' + this._element.getFullName() + '> and closing tag </' + closingTagName + '> When exiting to parent elemnt');
                }
                this._xmlCursor.cursor = closingElement + 1;
                return true;
            }
            return false;
        }
    }], [{
        key: 'detectOpenElement',
        value: function detectOpenElement(depth, xml, cursor, elementBody) {
            if ((cursor = ReadAhead.read(xml, '<', cursor)) == -1) {
                return -1;
            }
            cursor++;
            cursor = elementBody.detectPositions(depth + 1, xml, cursor);
            if ((cursor = ReadAhead.read(xml, '>', cursor)) == -1) {
                return -1;
            }
            return cursor;
        }
    }, {
        key: 'detectEndElement',
        value: function detectEndElement(depth, xml, cursor) {
            if ((cursor = ReadAhead.read(xml, '</', cursor)) == -1) {
                return -1;
            }
            cursor++;
            cursor = new ElementBody().detectPositions(depth + 1, xml, cursor);
            if ((cursor = ReadAhead.read(xml, '>', cursor)) == -1) {
                return -1;
            }
            return cursor;
        }
    }]);

    return ElementDetector;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var coreutilPromise = new Promise(function (resolve) {
    Promise.resolve().then((function (require) {
        resolve(__webpack_require__(0));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
});
var coreutil;
coreutilPromise.then(function (value) {
    coreutil = value;
});

var DomScaffold = function () {
    function DomScaffold() {
        _classCallCheck(this, DomScaffold);

        this._element = null;
        this._childDomScaffolds = new coreutil.List();
        this._detectors = new coreutil.List();
        this._elementCreatedListener = null;
        this._detectors.add(new ElementDetector());
        this._detectors.add(new CdataDetector());
        this._detectors.add(new ClosingElementDetector());
    }

    _createClass(DomScaffold, [{
        key: 'getElement',
        value: function getElement() {
            return this._element;
        }
    }, {
        key: 'load',
        value: function load(xml, cursor, elementCreatedListener) {
            var xmlCursor = new XmlCursor(xml, cursor, null);
            this.loadDepth(1, xmlCursor, elementCreatedListener);
        }
    }, {
        key: 'loadDepth',
        value: function loadDepth(depth, xmlCursor, elementCreatedListener) {
            coreutil.Logger.showPos(xmlCursor.xml, xmlCursor.cursor);
            coreutil.Logger.debug(depth, 'Starting DomScaffold');
            this._elementCreatedListener = elementCreatedListener;

            if (xmlCursor.eof()) {
                coreutil.Logger.debug(depth, 'Reached eof. Exiting');
                return false;
            }

            var elementDetector = null;
            this._detectors.forEach(function (curElementDetector, parent) {
                coreutil.Logger.debug(depth, 'Starting ' + curElementDetector.getType());
                curElementDetector.detect(depth + 1, xmlCursor);
                if (!curElementDetector.isFound()) {
                    return true;
                }
                elementDetector = curElementDetector;
                return false;
            }, this);

            if (elementDetector == null) {
                xmlCursor.cursor++;
                coreutil.Logger.warn('WARN: No handler was found searching from position: ' + xmlCursor.cursor);
            }

            this._element = elementDetector.createElement();

            if (elementDetector instanceof ElementDetector && elementDetector.hasChildren()) {
                while (!elementDetector.stop(depth + 1) && xmlCursor.cursor < xmlCursor.xml.length) {
                    var previousParentScaffold = xmlCursor.parentDomScaffold;
                    var childScaffold = new DomScaffold();
                    xmlCursor.parentDomScaffold = childScaffold;
                    childScaffold.loadDepth(depth + 1, xmlCursor, this._elementCreatedListener);
                    this._childDomScaffolds.add(childScaffold);
                    xmlCursor.parentDomScaffold = previousParentScaffold;
                }
            }
            coreutil.Logger.showPos(xmlCursor.xml, xmlCursor.cursor);
        }
    }, {
        key: 'getTree',
        value: function getTree(parentNotifyResult) {
            if (this._element == null) {
                return null;
            }

            var notifyResult = this.notifyElementCreatedListener(this._element, parentNotifyResult);

            this._childDomScaffolds.forEach(function (childDomScaffold, parent) {
                var childElement = childDomScaffold.getTree(notifyResult);
                if (childElement != null) {
                    parent._element.getChildElements().add(childElement);
                }
                return true;
            }, this);

            return this._element;
        }
    }, {
        key: 'notifyElementCreatedListener',
        value: function notifyElementCreatedListener(element, parentNotifyResult) {
            if (this._elementCreatedListener != null) {
                return this._elementCreatedListener.elementCreated(element, parentNotifyResult);
            }
            return null;
        }
    }]);

    return DomScaffold;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReadAhead = function () {
    function ReadAhead() {
        _classCallCheck(this, ReadAhead);
    }

    _createClass(ReadAhead, null, [{
        key: 'read',
        value: function read(value, matcher, cursor) {
            var ignoreWhitespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var internalCursor = cursor;
            for (var i = 0; i < matcher.length && i < value.length; i++) {
                while (ignoreWhitespace && value.charAt(internalCursor) == ' ') {
                    internalCursor++;
                }
                if (value.charAt(internalCursor) == matcher.charAt(i)) {
                    internalCursor++;
                } else {
                    return -1;
                }
            }

            return internalCursor - 1;
        }
    }]);

    return ReadAhead;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlCursor = function () {
    function XmlCursor(xml, cursor, parentDomScaffold) {
        _classCallCheck(this, XmlCursor);

        this.xml = xml;
        this.cursor = cursor;
        this.parentDomScaffold = parentDomScaffold;
    }

    _createClass(XmlCursor, [{
        key: "eof",
        value: function eof() {
            return this.cursor >= this.xml.length;
        }
    }]);

    return XmlCursor;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlAttribute = exports.XmlAttribute = function () {
    function XmlAttribute(name, value) {
        _classCallCheck(this, XmlAttribute);

        this._name = name;
        this._value = value;
    }

    _createClass(XmlAttribute, [{
        key: "getName",
        value: function getName() {
            return this._name;
        }
    }, {
        key: "setName",
        value: function setName(val) {
            this._name = val;
        }
    }, {
        key: "getValue",
        value: function getValue() {
            return this._value;
        }
    }, {
        key: "setValue",
        value: function setValue(val) {
            this._value = val;
        }
    }]);

    return XmlAttribute;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.XmlCdata = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlCdata = exports.XmlCdata = function () {
    function XmlCdata(value) {
        _classCallCheck(this, XmlCdata);

        this._value = value;
    }

    _createClass(XmlCdata, [{
        key: 'setValue',
        value: function setValue(value) {
            this._value = value;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this._value;
        }
    }, {
        key: 'dump',
        value: function dump() {
            this.dumpLevel(0);
        }
    }, {
        key: 'dumpLevel',
        value: function dumpLevel(level) {
            var spacer = ':';
            for (var space = 0; space < level * 2; space++) {
                spacer = spacer + ' ';
            }

            _coreutil.Logger.log(spacer + this._value);
            return;
        }
    }, {
        key: 'read',
        value: function read() {
            return this._value;
        }
    }]);

    return XmlCdata;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.XmlElement = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlElement = exports.XmlElement = function () {
    function XmlElement(name, namespace, selfClosing, childElements) {
        _classCallCheck(this, XmlElement);

        this._name = name;
        this._namespace = namespace;
        this._selfClosing = selfClosing;
        this._childElements = new _coreutil.List();
        this._attributes = new _coreutil.Map();
    }

    _createClass(XmlElement, [{
        key: 'getName',
        value: function getName() {
            return this._name;
        }
    }, {
        key: 'getNamespace',
        value: function getNamespace() {
            return this._namespace;
        }
    }, {
        key: 'getFullName',
        value: function getFullName() {
            if (this._namespace == null) {
                return this._name;
            }
            return this._namespace + ':' + this._name;
        }
    }, {
        key: 'getAttributes',
        value: function getAttributes() {
            return this._attributes;
        }
    }, {
        key: 'setAttributes',
        value: function setAttributes(attributes) {
            this._attributes = attributes;
        }
    }, {
        key: 'getChildElements',
        value: function getChildElements() {
            return this._childElements;
        }
    }, {
        key: 'setChildElements',
        value: function setChildElements(elements) {
            this._childElements = elements;
        }
    }, {
        key: 'setText',
        value: function setText(text) {
            this._childElements = new _coreutil.List();
            this.addText(text);
        }
    }, {
        key: 'addText',
        value: function addText(text) {
            var textElement = new XmlCdata(text);
            this._childElements.add(textElement);
        }
    }, {
        key: 'dump',
        value: function dump() {
            this.dumpLevel(0);
        }
    }, {
        key: 'dumpLevel',
        value: function dumpLevel(level) {
            var spacer = ':';
            for (var space = 0; space < level * 2; space++) {
                spacer = spacer + ' ';
            }

            if (this._selfClosing) {
                _coreutil.Logger.log(spacer + '<' + this.getFullName() + this.readAttributes() + '/>');
                return;
            }
            _coreutil.Logger.log(spacer + '<' + this.getFullName() + this.readAttributes() + '>');
            this._childElements.forEach(function (childElement) {
                childElement.dumpLevel(level + 1);
                return true;
            });
            _coreutil.Logger.log(spacer + '</' + this.getFullName() + '>');
        }
    }, {
        key: 'read',
        value: function read() {
            var result = '';
            if (this._selfClosing) {
                result = result + '<' + this.getFullName() + this.readAttributes() + '/>';
                return result;
            }
            result = result + '<' + this.getFullName() + this.readAttributes() + '>';
            this._childElements.forEach(function (childElement) {
                result = result + childElement.read();
                return true;
            });
            result = result + '</' + this.getFullName() + '>';
            return result;
        }
    }, {
        key: 'readAttributes',
        value: function readAttributes() {
            var result = '';
            this._attributes.forEach(function (key, attribute, parent) {
                result = result + ' ' + attribute.getName();
                if (attribute.getValue() != null) {
                    result = result + '="' + attribute.getValue() + '"';
                }
                return true;
            }, this);
            return result;
        }
    }]);

    return XmlElement;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlParserException = function XmlParserException(value) {
    _classCallCheck(this, XmlParserException);
};

//# sourceMappingURL=xmlparser.js.map

/***/ })
/******/ ]);