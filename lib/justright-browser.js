var justright =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = coreutil;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = xmlparser;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AttributesWrapper = exports.AttributesWrapper = function () {
	function AttributesWrapper(element) {
		_classCallCheck(this, AttributesWrapper);

		this._element = element;
	}

	_createClass(AttributesWrapper, [{
		key: "set",
		value: function set(key, value) {
			this._element.setAttribute(key, value);
		}
	}, {
		key: "get",
		value: function get(key) {
			return this._element.getAttribute(key);
		}
	}, {
		key: "contains",
		value: function contains(key) {
			return this._element.hasAttribute(key);
		}
	}, {
		key: "clear",
		value: function clear() {
			for (var i = 0; i < this._element.attributes.length; i++) {
				this._element.removeAttribute(attributes[i].name);
			}
		}
	}]);

	return AttributesWrapper;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = exports.Component = function () {
	function Component(template) {
		_classCallCheck(this, Component);

		this._wrapperMap = new _coreutil.Map();
		this._idSuffix = componentCounter++;
		this._rootElement = null;
		this._events = new _coreutil.List();
		this._events.add("onclick");
		this._events.add("onmousedown");
		this._events.add("onmouseup");
		this._events.add("ondrag");
		this._events.add("ondragend");
		this._events.add("ondragstart");
		this._events.add("ondrop");
		this._events.add("ondragover");

		new _xmlparser.DomTree(template, this).load();
	}

	_createClass(Component, [{
		key: "getRootElement",
		value: function getRootElement() {
			return this._rootElement;
		}
	}, {
		key: "getIdSuffix",
		value: function getIdSuffix() {
			return this._idSuffix;
		}
	}, {
		key: "idAttributeWithSuffix",
		value: function idAttributeWithSuffix(id) {
			if (this._idSuffix != null) {
				return id + "-" + this._idSuffix;
			}
			return id;
		}
	}, {
		key: "elementCreated",
		value: function elementCreated(element, parentWrapper) {
			var id = null;
			var innerId = null;
			if (this.hasAttribute(element, "id")) {
				id = element.getAttributes().get("id");
				innerId = id.getValue();
				id.setValue(this.idAttributeWithSuffix(id.getValue()));
			}

			var wrapper = new Mapper(element, parentWrapper).map();

			if (innerId != null) {
				this._wrapperMap.set(innerId, wrapper);
			}

			this._events.forEach(function (eventName, parent) {
				if (parent.hasAttribute(element, eventName)) {
					var value = element.getAttributes().get(eventName).getValue();
					var suffixedValue = value + "_" + parent._idSuffix;
					element.getAttributes().get(eventName).setValue(value);
					var mappedElement = wrapper.getMappedElement();
					mappedElement[eventName] = function (event) {
						events.trigger(suffixedValue, value, event);
					};
				}
				return true;
			}, this);

			if (this._rootElement == null && wrapper != null) {
				this._rootElement = wrapper;
			}

			return wrapper;
		}
	}, {
		key: "hasAttribute",
		value: function hasAttribute(element, name) {
			if (element instanceof _xmlparser.XmlElement) {
				if (element.getAttributes().get(name) != null) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "get",
		value: function get(id) {
			return this._wrapperMap.get(id);
		}
	}, {
		key: "set",
		value: function set(id, value) {
			this._wrapperMap.get(id).set(value);
		}
	}, {
		key: "clearChildren",
		value: function clearChildren(id) {
			this._wrapperMap.get(id).getChildElements().clear();
		}
	}, {
		key: "setChild",
		value: function setChild(id, value) {
			this._wrapperMap.get(id).getChildElements().setChild(value);
		}
	}, {
		key: "addChild",
		value: function addChild(id, value) {
			this._wrapperMap.get(id).getChildElements().addChild(value);
		}
	}, {
		key: "prependChild",
		value: function prependChild(id, value) {
			this._wrapperMap.get(id).getChildElements().prependChild(value);
		}
	}]);

	return Component;
}();
"use strict";

var componentCounter = 0;
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementWrapper = exports.ElementWrapper = function () {
	function ElementWrapper(element) {
		_classCallCheck(this, ElementWrapper);

		this._element = element;
		this._styleAttribute = null;
	}

	_createClass(ElementWrapper, [{
		key: "getMappedElement",
		value: function getMappedElement() {
			return this._element;
		}
	}, {
		key: "setMappedElement",
		value: function setMappedElement(mappedElement) {
			return this._element = mappedElement;
		}
	}, {
		key: "add",
		value: function add(value) {
			this.getChildElements().add(value);
		}
	}, {
		key: "getFullName",
		value: function getFullName() {
			return this._element.tagName;
		}
	}, {
		key: "getStyleAttribute",
		value: function getStyleAttribute() {
			if (this._styleAttribute === null) {
				this._styleAttribute = new StyleAttribute(this);
			}
			return this._styleAttribute;
		}
	}, {
		key: "getAttributes",
		value: function getAttributes() {
			return new AttributesWrapper(this._element);
		}
	}, {
		key: "getChildElements",
		value: function getChildElements() {
			return new NodesWrapper(this._element);
		}
	}, {
		key: "set",
		value: function set(input) {
			if (input instanceof ElementWrapper) {
				this._element.parentNode.replaceChild(input.getMappedElement(), this._element);
				return;
			}
			if (input instanceof Component) {
				this._element.parentNode.replaceChild(input.getRootElement().getMappedElement(), this._element);
				this._element = input.getRootElement().getMappedElement();
				return;
			}
			if (typeof input == "string") {
				this._element.parentNode.replaceChild(document.createTextNode(input), this._element);
				return;
			}
			if (input instanceof Text) {
				this._element.parentNode.replaceChild(input, this._element);
				return;
			}
			if (input instanceof Element) {
				this._element.parentNode.replaceChild(input, this._element);
				return;
			}
		}
	}]);

	return ElementWrapper;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.events = exports.EventManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventManager = exports.EventManager = function () {
    function EventManager() {
        _classCallCheck(this, EventManager);

        this._listeners = new _coreutil.Map();
        this._beforeListeners = new _coreutil.Map();
        this._afterListeners = new _coreutil.Map();
    }

    _createClass(EventManager, [{
        key: "listen",
        value: function listen(eventName, handlerObject, handlerFunction) {
            eventName = eventName + "_" + handlerObject.getIdSuffix();
            if (!this._listeners.exists(eventName)) {
                this._listeners.set(eventName, new _coreutil.List());
            }
            var objectFunction = new _coreutil.ObjectFunction(handlerObject, handlerFunction);
            this._listeners.get(eventName).add(objectFunction);
        }
    }, {
        key: "listenBefore",
        value: function listenBefore(eventName, handlerObject, handlerFunction) {
            if (!this._beforeListeners.exists(eventName)) {
                this._beforeListeners.set(eventName, new _coreutil.List());
            }
            var objectFunction = new _coreutil.ObjectFunction(handlerObject, handlerFunction);
            this._beforeListeners.get(eventName).add(objectFunction);
        }
    }, {
        key: "listenAfter",
        value: function listenAfter(eventName, handlerObject, handlerFunction) {
            if (!this._afterListeners.exists(eventName)) {
                this._afterListeners.set(eventName, new _coreutil.List());
            }
            this._afterListeners.get(eventName).add(new _coreutil.ObjectFunction(handlerObject, handlerFunction));
        }
    }, {
        key: "trigger",
        value: function trigger(suffixedEventName, eventName, event) {
            this.handleBefore(eventName, event);
            if (this._listeners.exists(suffixedEventName)) {
                var currentListeners = new _coreutil.List();
                this._listeners.get(suffixedEventName).forEach(function (value, parent) {
                    currentListeners.add(value);
                    return true;
                }, this);
                currentListeners.forEach(function (value, parent) {
                    value.call(event);
                    return true;
                }, this);
            }
            this.handleAfter(eventName, event);
        }
    }, {
        key: "handleBefore",
        value: function handleBefore(eventName, event) {
            this.handleGlobal(this._beforeListeners, eventName, event);
        }
    }, {
        key: "handleAfter",
        value: function handleAfter(eventName, event) {
            this.handleGlobal(this._afterListeners, eventName, event);
        }
    }, {
        key: "handleGlobal",
        value: function handleGlobal(listeners, eventName, event) {
            if (listeners.exists(eventName)) {
                var currentListeners = new _coreutil.List();
                listeners.get(eventName).forEach(function (value, parent) {
                    currentListeners.add(value);
                    return true;
                }, this);
                currentListeners.forEach(function (value, parent) {
                    value.call(event);
                    return true;
                }, this);
            }
        }
    }]);

    return EventManager;
}();

var events = exports.events = new EventManager();
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Mapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapper = exports.Mapper = function () {
	function Mapper(element, parentWrapper) {
		_classCallCheck(this, Mapper);

		this._element = element;
		this._mappedElement = null;
		this._parentWrapper = parentWrapper;
	}

	_createClass(Mapper, [{
		key: "getMappedElement",
		value: function getMappedElement() {
			return this._mappedElement;
		}
	}, {
		key: "map",
		value: function map() {
			if (this._element instanceof _xmlparser.XmlElement) {
				this._mappedElement = this.mapXmlElement(this._element, this._parentWrapper);
				this._element.getAttributes().forEach(function (key, value, parent) {
					parent._mappedElement.setAttribute(key, value.getValue());
					return true;
				}, this);
				return new ElementWrapper(this._mappedElement);
			}
			if (this._element instanceof _xmlparser.XmlCdata) {
				this._mappedElement = this.mapXmlCdata(this._element, this._parentWrapper);
				return new TextnodeWrapper(this._mappedElement);
			}
			return null;
		}
	}, {
		key: "mapXmlCdata",
		value: function mapXmlCdata(cdataElement, parentWrapper) {
			var element = document.createTextNode(cdataElement.getValue());
			if (parentWrapper != null && parentWrapper.getMappedElement() != null) {
				parentWrapper.getMappedElement().appendChild(element);
			}
			return element;
		}
	}, {
		key: "mapXmlElement",
		value: function mapXmlElement(xmlElement, parentWrapper) {
			var element = null;
			if (xmlElement.getNamespace() != null) {
				// Not complete
				element = document.createElement("http://nsuri", xmlElement.getFullName());
			} else {
				element = document.createElement(xmlElement.getName());
			}
			if (parentWrapper != null && parentWrapper.getMappedElement() != null) {
				// Not complete, insertBefore needed
				parentWrapper.getMappedElement().appendChild(element);
			}
			return element;
		}
	}]);

	return Mapper;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodesWrapper = exports.NodesWrapper = function () {
	function NodesWrapper(element) {
		_classCallCheck(this, NodesWrapper);

		this._element = element;
	}

	_createClass(NodesWrapper, [{
		key: "clear",
		value: function clear() {
			while (this._element.firstChild) {
				this._element.removeChild(this._element.firstChild);
			}
		}
	}, {
		key: "setChild",
		value: function setChild(input) {
			this.clear();
			this.addChild(input);
		}
	}, {
		key: "addChild",
		value: function addChild(input) {
			if (input instanceof ElementWrapper) {
				this._element.appendChild(input.getMappedElement());
				return;
			}
			if (input instanceof Component) {
				this._element.appendChild(input.getRootElement().getMappedElement());
				return;
			}
			if (typeof input == "string") {
				this._element.appendChild(document.createTextNode(input));
				return;
			}
			if (input instanceof Text) {
				this._element.appendChild(input);
				return;
			}
			if (input instanceof Element) {
				this._element.appendChild(input);
				return;
			}
		}
	}, {
		key: "prependChild",
		value: function prependChild(input) {
			if (this._element.firstChild == null) {
				this.add(input);
				return;
			}
			if (input instanceof ElementWrapper) {
				this._element.insertBefore(input.getMappedElement(), this._element.firstChild);
				return;
			}
			if (input instanceof Component) {
				this._element.insertBefore(input.getRootElement().getMappedElement(), this._element.firstChild);
				return;
			}
			if (typeof input == "string") {
				this._element.insertBefore(document.createTextNode(input), this._element.firstChild);
				return;
			}
			if (input instanceof Text) {
				this._element.insertBefore(input, this._element.firstChild);
				return;
			}
			if (input instanceof Element) {
				this._element.insertBefore(input, this._element.firstChild);
				return;
			}
		}
	}]);

	return NodesWrapper;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StyleAttribute = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleAttribute = exports.StyleAttribute = function () {
    function StyleAttribute(element) {
        _classCallCheck(this, StyleAttribute);

        this._element = element;
        this._styleMap = new _coreutil.Map();
        if (element.getAttributes().contains("style")) {
            var stylePairs = element.getAttributes().get("style").split(";");
            for (var i = 0; i < stylePairs.length; i++) {
                var pair = stylePairs[i].split(":");
                this._styleMap.set(pair[0], pair[1]);
            }
        }
    }

    _createClass(StyleAttribute, [{
        key: "set",
        value: function set(key, value) {
            this._styleMap.set(key, value);
            var attributeString = "";
            this._styleMap.forEach(function (key, value, parent) {
                attributeString = attributeString + key + ":" + value + ";";
                return true;
            }, this);
            this._element.getAttributes().set("style", attributeString);
        }
    }]);

    return StyleAttribute;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.templates = exports.TemplateManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TemplateManager = exports.TemplateManager = function () {
    function TemplateManager() {
        _classCallCheck(this, TemplateManager);

        this._templates = new _coreutil.Map();
    }

    _createClass(TemplateManager, [{
        key: "set",
        value: function set(name, template) {
            this._templates.set(name, template);
        }
    }, {
        key: "get",
        value: function get(name) {
            return this._templates.get(name);
        }
    }, {
        key: "load",
        value: function load(name, url) {
            var obj = this;
            if (this.get(name) == null) {
                jQuery.ajax({
                    url: url,
                    success: function success(result) {
                        obj.set(name, result);
                    }
                });
            }
        }
    }]);

    return TemplateManager;
}();

var templates = exports.templates = new TemplateManager();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextnodeWrapper = exports.TextnodeWrapper = function () {
    function TextnodeWrapper(textnode) {
        _classCallCheck(this, TextnodeWrapper);

        this._textnode = textnode;
    }

    _createClass(TextnodeWrapper, [{
        key: "setValue",
        value: function setValue(value) {
            this._textnode = value;
        }
    }, {
        key: "getValue",
        value: function getValue() {
            return this._textnode;
        }
    }, {
        key: "getMappedElement",
        value: function getMappedElement() {
            return this._textnode;
        }
    }]);

    return TextnodeWrapper;
}();

//# sourceMappingURL=justright.js.map

/***/ })
/******/ ]);