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
    this._events.add("onmousemove");
    this._events.add("onmouseover");
    this._events.add("onmouseout");
    this._events.add("onmouseenter");
    this._events.add("touchstart");
    this._events.add("touchend");
    this._events.add("touchmove");
    this._events.add("touchcancel");

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
    value: function elementCreated(xmlElement, parentWrapper) {
      var wrapper = new Mapper(xmlElement, parentWrapper).map();

      this.addToElementMap(xmlElement, wrapper);

      this.registerElementEvents(xmlElement, wrapper);

      if (this._rootElement == null && wrapper != null) {
        this._rootElement = wrapper;
      }

      return wrapper;
    }
  }, {
    key: "registerElementEvents",
    value: function registerElementEvents(element, wrapper) {
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
    }
  }, {
    key: "addToElementMap",
    value: function addToElementMap(xmlElement, wrapper) {
      var id = null;
      var innerId = null;
      if (this.hasAttribute(xmlElement, "id")) {
        id = xmlElement.getAttributes().get("id");
        innerId = id.getValue();
        id.setValue(this.idAttributeWithSuffix(id.getValue()));
      }

      if (innerId != null) {
        this._wrapperMap.set(innerId, wrapper);
      }
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

        // Should only have element as StyleAttribute
        // because other wrappers may exist for same element
        this._element = element;
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
        key: "addChild",
        value: function addChild(value) {
            this.getChildElements().addChild(value);
        }
    }, {
        key: "getFullName",
        value: function getFullName() {
            return this._element.tagName;
        }
    }, {
        key: "getStyleAttribute",
        value: function getStyleAttribute() {
            return new StyleAttribute(this);
        }
    }, {
        key: "getTop",
        value: function getTop() {
            return this._element.getBoundingClientRect().top;
        }
    }, {
        key: "getBottom",
        value: function getBottom() {
            return this._element.getBoundingClientRect().bottom;
        }
    }, {
        key: "getLeft",
        value: function getLeft() {
            return this._element.getBoundingClientRect().left;
        }
    }, {
        key: "getRight",
        value: function getRight() {
            return this._element.getBoundingClientRect().right;
        }
    }, {
        key: "getWidth",
        value: function getWidth() {
            return this._element.offsetWidth;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this._element.offsetHeight;
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
            if (this._element.parentNode == null) {
                console.error("The element has no parent, can not swap it for value");
                return;
            }
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementEvent = exports.ElementEvent = function () {
    function ElementEvent(element, positionX, positionY) {
        _classCallCheck(this, ElementEvent);

        this._element = element;
        this._x = positionX;
        this._y = positionY;
    }

    _createClass(ElementEvent, [{
        key: "getElement",
        value: function getElement() {
            return this._element;
        }
    }, {
        key: "getX",
        value: function getX() {
            return this._x;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this._y;
        }
    }]);

    return ElementEvent;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.events = exports.EventMapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventMapper = exports.EventMapper = function () {
    function EventMapper() {
        _classCallCheck(this, EventMapper);

        this._listeners = new _coreutil.Map();
        this._beforeListeners = new _coreutil.Map();
        this._afterListeners = new _coreutil.Map();
    }

    _createClass(EventMapper, [{
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
                    value.call(new EventWrapper(event));
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
                    value.call(new EventWrapper(event));
                    return true;
                }, this);
            }
        }
    }]);

    return EventMapper;
}();

var events = exports.events = new EventMapper();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventWrapper = exports.EventWrapper = function () {
    function EventWrapper(browserEvent) {
        _classCallCheck(this, EventWrapper);

        this._browserEvent = browserEvent;
        if (this._browserEvent.type.toLowerCase() == "dragstart") {
            this._browserEvent.dataTransfer.setData('text/plain', null);
        }
        this._element = null;
    }

    _createClass(EventWrapper, [{
        key: "getBrowserEvent",
        value: function getBrowserEvent() {
            return this._browserEvent;
        }
    }, {
        key: "preventDefault",
        value: function preventDefault() {
            this._browserEvent.preventDefault();
        }
    }, {
        key: "getX",
        value: function getX() {
            return this._browserEvent.clientX;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this._browserEvent.clientY;
        }
    }, {
        key: "getTarget",
        value: function getTarget() {
            if (this._element == null) {
                this._element = new ElementEvent(new ElementWrapper(this._browserEvent.target), this._browserEvent.offsetX, this._browserEvent.offsetY);
            }
            return this._element;
        }
    }]);

    return EventWrapper;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inputs = exports.InputMapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputMapper = exports.InputMapper = function () {
    function InputMapper() {
        _classCallCheck(this, InputMapper);

        this._pullers = new _coreutil.List();
        this._pushers = new _coreutil.List();
    }

    _createClass(InputMapper, [{
        key: "map",
        value: function map(field, destination) {
            var puller = function puller(event) {
                if (field.getMappedElement() instanceof HTMLInputElement) {
                    var inputField = field.getMappedElement();
                    var type = inputField.type;
                    if (type == "text" || type == "select" || type == "password" || type == "hidden") {
                        destination[inputField.name] = inputField.value;
                    }
                    if (type == "radio" && inputField.checked) {
                        destination[inputField.name] = inputField.value;
                    }
                    if (type == "checkbox") {
                        if (inputField.checked) {
                            destination[inputField.name] = inputField.value;
                        } else {
                            destination[inputField.name] = null;
                        }
                    }
                }
            };
            field.getMappedElement().onchange = puller;
            field.getMappedElement().onkeyup = puller;
            puller.call();
            this._pullers.add(puller);

            var pusher = function pusher() {
                if (field.getMappedElement() instanceof HTMLInputElement) {
                    var inputField = field.getMappedElement();
                    var type = inputField.type;
                    if (type == "text" || type == "select" || type == "password" || type == "hidden") {
                        inputField.value = destination[inputField.name];
                    }
                    if (type == "radio") {
                        if (destination[inputField.name] == inputField.value) {
                            inputField.checked = true;
                        } else {
                            inputField.checked = false;
                        }
                    }
                    if (type == "checkbox") {
                        if (destination[inputField.name] == inputField.value) {
                            inputField.checked = true;
                        } else {
                            inputField.checked = false;
                        }
                    }
                }
            };
            this._pushers.add(pusher);
        }
    }, {
        key: "pull",
        value: function pull() {
            this._pullers.forEach(function (value, parent) {
                value.call(parent);
                return true;
            }, this);
        }
    }, {
        key: "push",
        value: function push() {
            this._pushers.forEach(function (value, parent) {
                value.call(parent);
                return true;
            }, this);
        }
    }]);

    return InputMapper;
}();

var inputs = exports.inputs = new InputMapper();
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Mapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapper = exports.Mapper = function () {
	function Mapper(xmlElement, parentWrapper) {
		_classCallCheck(this, Mapper);

		this._element = xmlElement;
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HTML = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTML = exports.HTML = function () {
    function HTML() {
        _classCallCheck(this, HTML);
    }

    _createClass(HTML, null, [{
        key: "custom",
        value: function custom(elementName) {
            var xmlElement = new _xmlparser.XmlElement(elementName);
            return new Mapper(xmlElement).map();
        }
    }, {
        key: "applyStyles",
        value: function applyStyles(element, classValue, styleValue) {
            if (classValue !== null) {
                element.getAttributes().set("class", classValue);
            }
            if (styleValue !== null) {
                element.getAttributes().set("style", styleValue);
            }
        }
    }, {
        key: "a",
        value: function a(name, href, classValue, styleValue) {
            var element = HTML.custom("a");
            element.addChild(name);
            element.getAttributes().set("href", href);
            HTML.applyStyles(element, classValue, styleValue);
            return element;
        }
    }]);

    return HTML;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.URL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = exports.URL = function () {
    function URL(value) {
        _classCallCheck(this, URL);

        this._protocol = null;
        this._host = null;
        this._port = null;
        this._pathList = new _coreutil.List();
        this._parameterMap = new _coreutil.Map();
        if (value === null) {
            return;
        }
        var remaining = this.determineProtocol(value);
        if (remaining === null) {
            return;
        }
        if (this._protocol !== null) {
            remaining = this.determineHost(remaining);
        }
        if (remaining === null) {
            return;
        }
        if (this._host !== null) {
            remaining = this.determinePort(remaining);
        }
        if (remaining === null) {
            return;
        }
        remaining = this.determinePath(remaining);
        if (remaining === null) {
            return;
        }
        this.determineParameters(remaining);
    }

    _createClass(URL, [{
        key: "getProtocol",
        value: function getProtocol() {
            return this._protocol;
        }
    }, {
        key: "getHost",
        value: function getHost() {
            return this._host;
        }
    }, {
        key: "getPort",
        value: function getPort() {
            return this._port;
        }
    }, {
        key: "getPathList",
        value: function getPathList() {
            return this._pathList;
        }
    }, {
        key: "getParameterMap",
        value: function getParameterMap() {
            return this._parameterMap;
        }
    }, {
        key: "determineProtocol",
        value: function determineProtocol(value) {
            if (!value.includes("//")) {
                return value;
            }
            var parts = value.split("//");
            if (parts[0].includes("/")) {
                return value;
            }
            this._protocol = parts[0];
            if (parts.length == 1) {
                return null;
            }
            return value.replace(parts[0] + "//", "");
        }
    }, {
        key: "determineHost",
        value: function determineHost(value) {
            var parts = value.split("/");
            var hostPart = parts[0];
            if (hostPart.includes(":")) {
                hostPart = hostPart.split(":")[0];
            }
            this._host = hostPart;
            if (parts.length > 1) {
                return value.replace(hostPart, "");
            }
            return null;
        }
    }, {
        key: "determinePort",
        value: function determinePort(value) {
            if (!value.startsWith(":")) {
                return value;
            }
            var portPart = value.split("/")[0].substring(1);
            this._port = portPart;
            return value.replace(":" + portPart, "");
        }
    }, {
        key: "determinePath",
        value: function determinePath(value) {
            var remaining = null;
            if (value.includes("?")) {
                var parts = value.split("?");
                if (parts.length > 1) {
                    remaining = value.replace(parts[0] + "?", "");
                }
                value = parts[0];
            }
            var pathParts = new _coreutil.List(value.split("/"));
            pathParts.forEach(function (value, parent) {
                if (parent._pathList === null) {
                    parent._pathList = new _coreutil.List();
                }
                parent._pathList.add(decodeURI(value));
                return true;
            }, this);
            return remaining;
        }
    }, {
        key: "determineParameters",
        value: function determineParameters(value) {
            var partList = new _coreutil.List(value.split("&"));
            var parameterMap = new _coreutil.Map();
            partList.forEach(function (value, parent) {
                var keyValue = value.split("=");
                if (keyValue.length >= 2) {
                    parameterMap.set(decodeURI(keyValue[0]), decodeURI(keyValue[1]));
                }
                return true;
            }, this);
            this._parameterMap = parameterMap;
        }
    }, {
        key: "toString",
        value: function toString() {
            var value = "";
            if (this._protocol !== null) {
                value = value + this._protocol + "//";
            }
            if (this._host !== null) {
                value = value + this._host;
            }
            if (this._port !== null) {
                value = value + ":" + this._port;
            }

            var firstPathPart = true;
            this._pathList.forEach(function (pathPart, parent) {
                if (!firstPathPart) {
                    value = value + "/";
                }
                firstPathPart = false;
                value = value + pathPart;
                return true;
            }, this);

            var firstParameter = true;
            this._parameterMap.forEach(function (parameterKey, parameterValue, parent) {
                if (firstParameter) {
                    firstParameter = false;
                    value = value + "?";
                } else {
                    value = value + "&";
                }
                value = value + encodeURI(parameterKey) + "=" + encodeURI(parameterValue);
            }, this);
            return value;
        }
    }]);

    return URL;
}();

//# sourceMappingURL=justright.js.map

/***/ })
/******/ ]);