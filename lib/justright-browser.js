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
exports.BaseElement = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseElement = exports.BaseElement = function () {
	function BaseElement(value, parent) {
		_classCallCheck(this, BaseElement);

		if (value instanceof _xmlparser.XmlElement) {
			this.loadXmlElement(value, parent);
		} else if (typeof value === "string") {
			this._element = document.createElement(value);
		} else {
			this._element = document.createElement("div");
		}
	}

	_createClass(BaseElement, [{
		key: "loadXmlElement",
		value: function loadXmlElement(xmlElement, parentElement) {
			var element = null;
			if (xmlElement.getNamespace() != null) {
				// Not complete
				element = document.createElement("http://nsuri", xmlElement.getFullName());
			} else {
				element = document.createElement(xmlElement.getName());
			}
			if (parentElement != null && parentElement.getMappedElement() != null) {
				// Not complete, insertBefore needed
				parentElement.getMappedElement().appendChild(element);
			}
			xmlElement.getAttributes().forEach(function (key, value) {
				element.setAttribute(key, value.getValue());
				return true;
			});
			this._element = element;
		}
	}, {
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
		key: "getFullName",
		value: function getFullName() {
			return this._element.tagName;
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
		key: "setAttribute",
		value: function setAttribute(key, value) {
			this._element.setAttribute(key, value);
		}
	}, {
		key: "getAttribute",
		value: function getAttribute(key) {
			return this._element.getAttribute(key);
		}
	}, {
		key: "containsAttribute",
		value: function containsAttribute(key) {
			return this._element.hasAttribute(key);
		}
	}, {
		key: "clearAttributes",
		value: function clearAttributes() {
			for (var i = this._element.attributes.length - 1; i >= 0; i--) {
				// TODO, this might be buggy
				this._element.removeAttribute(attributes[i].name);
			}
		}
	}, {
		key: "set",
		value: function set(input) {
			if (this._element.parentNode == null) {
				console.error("The element has no parent, can not swap it for value");
				return;
			}
			if (input instanceof SimpleElement) {
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
	}, {
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
			if (input instanceof SimpleElement) {
				this._element.appendChild(input.getMappedElement());
			} else if (input instanceof Component) {
				this._element.appendChild(input.getRootElement().getMappedElement());
			} else if (typeof input == "string") {
				this._element.appendChild(document.createTextNode(input));
			} else if (input instanceof Text) {
				this._element.appendChild(input);
			} else if (input instanceof Element) {
				this._element.appendChild(input);
			}
			// HTMLTextAreaElement ignores innerHTML after manually editing, therefore forcing value
			if (this._element instanceof HTMLTextAreaElement) {
				this.setValue(this.getInnerHTML());
			}
		}
	}, {
		key: "prependChild",
		value: function prependChild(input) {
			if (this._element.firstChild == null) {
				this.add(input);
				return;
			} else if (input instanceof SimpleElement) {
				this._element.insertBefore(input.getMappedElement(), this._element.firstChild);
			} else if (input instanceof Component) {
				this._element.insertBefore(input.getRootElement().getMappedElement(), this._element.firstChild);
			} else if (typeof input == "string") {
				this._element.insertBefore(document.createTextNode(input), this._element.firstChild);
			} else if (input instanceof Text) {
				this._element.insertBefore(input, this._element.firstChild);
			} else if (input instanceof Element) {
				this._element.insertBefore(input, this._element.firstChild);
			}
			// HTMLTextAreaElement ignores innerHTML after manually editing, therefore forcing value
			if (this._element instanceof HTMLTextAreaElement) {
				this.setValue(this.getInnerHTML());
			}
		}
	}]);

	return BaseElement;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextnodeElement = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextnodeElement = exports.TextnodeElement = function () {
    function TextnodeElement(value, parent) {
        _classCallCheck(this, TextnodeElement);

        if (value instanceof _xmlparser.XmlCdata) {
            this.loadXmlCdata(value, parent);
        }
        if (typeof value === "string") {
            this._element = document.createTextNode(value);
        }
    }

    _createClass(TextnodeElement, [{
        key: "loadXmlCdata",
        value: function loadXmlCdata(cdataElement, parentElement) {
            var element = document.createTextNode(cdataElement.getValue());
            if (parentElement != null && parentElement.getMappedElement() != null) {
                parentElement.getMappedElement().appendChild(element);
            }
            this._element = element;
        }
    }, {
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

    return TextnodeElement;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractInputElement = exports.AbstractInputElement = function (_BaseElement) {
    _inherits(AbstractInputElement, _BaseElement);

    function AbstractInputElement(element, parent) {
        _classCallCheck(this, AbstractInputElement);

        return _possibleConstructorReturn(this, (AbstractInputElement.__proto__ || Object.getPrototypeOf(AbstractInputElement)).call(this, element, parent));
    }

    _createClass(AbstractInputElement, [{
        key: "getValue",
        value: function getValue() {
            return this._element.value;
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            this._element.value = value;
        }
    }]);

    return AbstractInputElement;
}(BaseElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpleElement = exports.SimpleElement = function (_BaseElement) {
    _inherits(SimpleElement, _BaseElement);

    function SimpleElement(element, parent) {
        _classCallCheck(this, SimpleElement);

        return _possibleConstructorReturn(this, (SimpleElement.__proto__ || Object.getPrototypeOf(SimpleElement)).call(this, element, parent));
    }

    _createClass(SimpleElement, [{
        key: "getInnerHTML",
        value: function getInnerHTML() {
            return this._element.innerHTML;
        }
    }, {
        key: "setInnerHTML",
        value: function setInnerHTML(value) {
            this._element.innerHTML = value;
        }
    }]);

    return SimpleElement;
}(BaseElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxInputElement = exports.CheckboxInputElement = function (_AbstractInputElement) {
    _inherits(CheckboxInputElement, _AbstractInputElement);

    function CheckboxInputElement(element, parent) {
        _classCallCheck(this, CheckboxInputElement);

        return _possibleConstructorReturn(this, (CheckboxInputElement.__proto__ || Object.getPrototypeOf(CheckboxInputElement)).call(this, element, parent));
    }

    _createClass(CheckboxInputElement, [{
        key: "setChecked",
        value: function setChecked(value) {
            this._element.checked = value;
        }
    }, {
        key: "isChecked",
        value: function isChecked() {
            return this._element.checked;
        }
    }]);

    return CheckboxInputElement;
}(AbstractInputElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
				value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PasswordInputElement = exports.PasswordInputElement = function (_AbstractInputElement) {
				_inherits(PasswordInputElement, _AbstractInputElement);

				function PasswordInputElement(element, parent) {
								_classCallCheck(this, PasswordInputElement);

								return _possibleConstructorReturn(this, (PasswordInputElement.__proto__ || Object.getPrototypeOf(PasswordInputElement)).call(this, element, parent));
				}

				return PasswordInputElement;
}(AbstractInputElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadioInputElement = exports.RadioInputElement = function (_AbstractInputElement) {
    _inherits(RadioInputElement, _AbstractInputElement);

    function RadioInputElement(element, parent) {
        _classCallCheck(this, RadioInputElement);

        return _possibleConstructorReturn(this, (RadioInputElement.__proto__ || Object.getPrototypeOf(RadioInputElement)).call(this, element, parent));
    }

    _createClass(RadioInputElement, [{
        key: "setChecked",
        value: function setChecked(value) {
            this._element.checked = value;
        }
    }, {
        key: "isChecked",
        value: function isChecked() {
            return this._element.checked;
        }
    }]);

    return RadioInputElement;
}(AbstractInputElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextareaInputElement = exports.TextareaInputElement = function (_AbstractInputElement) {
    _inherits(TextareaInputElement, _AbstractInputElement);

    function TextareaInputElement(element, parent) {
        _classCallCheck(this, TextareaInputElement);

        return _possibleConstructorReturn(this, (TextareaInputElement.__proto__ || Object.getPrototypeOf(TextareaInputElement)).call(this, element, parent));
    }

    _createClass(TextareaInputElement, [{
        key: "getInnerHTML",
        value: function getInnerHTML() {
            return this._element.innerHTML;
        }
    }, {
        key: "setInnerHTML",
        value: function setInnerHTML(value) {
            this._element.innerHTML = value;
        }
    }]);

    return TextareaInputElement;
}(AbstractInputElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
				value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextInputElement = exports.TextInputElement = function (_AbstractInputElement) {
				_inherits(TextInputElement, _AbstractInputElement);

				function TextInputElement(element, parent) {
								_classCallCheck(this, TextInputElement);

								return _possibleConstructorReturn(this, (TextInputElement.__proto__ || Object.getPrototypeOf(TextInputElement)).call(this, element, parent));
				}

				return TextInputElement;
}(AbstractInputElement);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementMapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlparser = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementMapper = exports.ElementMapper = function () {
  function ElementMapper() {
    _classCallCheck(this, ElementMapper);
  }

  _createClass(ElementMapper, null, [{
    key: "map",
    value: function map(input, parent) {
      if (input instanceof _xmlparser.XmlElement) {
        // Add checks for different element types, and create different tag types
        if (input.getName() === "input") {
          var type = input.getAttribute("type").getValue();
          if (type === "radio") {
            return new RadioInputElement(input, parent);
          }
          if (type === "checkbox") {
            return new CheckboxInputElement(input, parent);
          }
          if (type === "password") {
            return new PasswordInputElement(input, parent);
          }
          if (type === "submit") {
            return new SimpleElement(input, parent);
          } // TODO
          return new TextInputElement(input, parent);
        }
        if (input.getName() === "textarea") {
          return new TextareaInputElement(input, parent);
        }
        return new SimpleElement(input, parent);
      }
      if (input instanceof _xmlparser.XmlCdata) {
        return new TextnodeElement(input, parent);
      }
      return null;
    }
  }]);

  return ElementMapper;
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

    if (typeof template === "string") {
      template = templates.get(template);
    }
    this._mapperMap = new _coreutil.Map();
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
    new _xmlparser.DomTree(template.getTemplateSource(), this).load();
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
      var element = ElementMapper.map(xmlElement, parentWrapper);

      this.addToElementIdMap(xmlElement, element);

      this.registerElementEvents(xmlElement, element);

      if (this._rootElement == null && element != null) {
        this._rootElement = element;
      }

      return element;
    }
  }, {
    key: "registerElementEvents",
    value: function registerElementEvents(element, mapper) {
      this._events.forEach(function (eventName, parent) {
        if (parent.hasAttribute(element, eventName)) {
          var value = element.getAttribute(eventName).getValue();
          var suffixedValue = value + "_" + parent._idSuffix;
          element.getAttribute(eventName).setValue(value);
          var mappedElement = mapper.getMappedElement();
          mappedElement[eventName] = function (event) {
            events.trigger(suffixedValue, value, event);
          };
        }
        return true;
      }, this);
    }
  }, {
    key: "addToElementIdMap",
    value: function addToElementIdMap(xmlElement, mapper) {
      var id = null;
      var innerId = null;
      if (this.hasAttribute(xmlElement, "id")) {
        id = xmlElement.getAttribute("id");
        innerId = id.getValue();
        id.setValue(this.idAttributeWithSuffix(id.getValue()));
      }

      if (innerId != null) {
        this._mapperMap.set(innerId, mapper);
      }
    }
  }, {
    key: "hasAttribute",
    value: function hasAttribute(element, name) {
      if (element instanceof _xmlparser.XmlElement) {
        if (element.getAttribute(name) != null) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "get",
    value: function get(id) {
      return this._mapperMap.get(id);
    }
  }, {
    key: "set",
    value: function set(id, value) {
      this._mapperMap.get(id).set(value);
    }
  }, {
    key: "clearChildren",
    value: function clearChildren(id) {
      this._mapperMap.get(id).clear();
    }
  }, {
    key: "setChild",
    value: function setChild(id, value) {
      this._mapperMap.get(id).setChild(value);
    }
  }, {
    key: "addChild",
    value: function addChild(id, value) {
      this._mapperMap.get(id).addChild(value);
    }
  }, {
    key: "prependChild",
    value: function prependChild(id, value) {
      this._mapperMap.get(id).prependChild(value);
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
            eventName = eventName + "_" + this.resolveIdSuffix(handlerObject);
            if (!this._listeners.exists(eventName)) {
                this._listeners.set(eventName, new _coreutil.List());
            }
            var objectFunction = new _coreutil.ObjectFunction(handlerObject, handlerFunction);
            this._listeners.get(eventName).add(objectFunction);
        }
    }, {
        key: "resolveIdSuffix",
        value: function resolveIdSuffix(handlerObject) {
            if (handlerObject.getIdSuffix != undefined) {
                return handlerObject.getIdSuffix();
            }
            if (handlerObject.getComponent != undefined) {
                return handlerObject.getComponent().getIdSuffix();
            }
            console.error("Unable to register event as the handler object is neither a component nor exposes any via getComponent");
            return null;
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
                this._element = new ElementEvent(new SimpleElement(this._browserEvent.target), this._browserEvent.offsetX, this._browserEvent.offsetY);
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
            return ElementMapper.map(xmlElement);
        }
    }, {
        key: "applyStyles",
        value: function applyStyles(element, classValue, styleValue) {
            if (classValue !== null) {
                element.setAttribute("class", classValue);
            }
            if (styleValue !== null) {
                element.setAttribute("style", styleValue);
            }
        }
    }, {
        key: "a",
        value: function a(name, href, classValue, styleValue) {
            var element = HTML.custom("a");
            element.addChild(name);
            element.setAttribute("href", href);
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
exports.StyleUtil = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleUtil = exports.StyleUtil = function () {
    function StyleUtil() {
        _classCallCheck(this, StyleUtil);
    }

    _createClass(StyleUtil, null, [{
        key: "set",
        value: function set(element, key, value) {
            var styleMap = new _coreutil.Map();
            if (element.containsAttribute("style")) {
                var stylePairs = element.getAttribute("style").split(";");
                for (var i = 0; i < stylePairs.length; i++) {
                    var pair = stylePairs[i].split(":");
                    styleMap.set(pair[0], pair[1]);
                }
            }
            styleMap.set(key, value);
            var attributeString = "";
            styleMap.forEach(function (key, value, parent) {
                attributeString = attributeString + key + ":" + value + ";";
                return true;
            }, this);
            element.setAttribute("style", attributeString);
        }
    }]);

    return StyleUtil;
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

        this._inputMappingList = new _coreutil.List();
    }

    _createClass(InputMapper, [{
        key: "link",
        value: function link(model, schema) {
            var inputMapping = new InputMapping(model, schema);
            this._inputMappingList.add(inputMapping);
            return inputMapping;
        }
    }, {
        key: "pullAll",
        value: function pullAll() {
            this._inputMappingList.forEach(function (mapping, parent) {
                mapping.pull();
                return true;
            }, this);
        }
    }, {
        key: "pushAll",
        value: function pushAll() {
            this._inputMappingList.forEach(function (mapping, parent) {
                mapping.push();
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
exports.InputMapping = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coreutil = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputMapping = exports.InputMapping = function () {
    function InputMapping(model, validator) {
        _classCallCheck(this, InputMapping);

        this._model = model;
        this._validator = validator;
        this._pullers = new _coreutil.List();
        this._pushers = new _coreutil.List();
    }

    _createClass(InputMapping, [{
        key: "and",
        value: function and(field) {
            return this.to(field);
        }
    }, {
        key: "to",
        value: function to(field) {
            var inputField = field.getMappedElement();
            var fieldDestination = this._model;
            var fieldName = inputField.name;
            var validator = this._validator;

            var puller = function puller(event) {
                if (field instanceof AbstractInputElement) {
                    var fieldValue = field.getValue();
                    if (field instanceof RadioInputElement) {
                        if (field.isChecked()) {
                            PropertyAccessor.setValue(fieldDestination, fieldName, fieldValue);
                        }
                    } else if (field instanceof CheckboxInputElement) {
                        if (field.isChecked()) {
                            PropertyAccessor.setValue(fieldDestination, fieldName, fieldValue);
                        } else {
                            PropertyAccessor.setValue(fieldDestination, fieldName, null);
                        }
                    } else {
                        PropertyAccessor.setValue(fieldDestination, fieldName, fieldValue);
                    }
                }
                if (validator !== undefined && validator !== null) {
                    validator.validate(field);
                }
            };
            inputField.onchange = puller;
            inputField.onkeyup = puller;
            puller.call();

            var pusher = function pusher() {
                var value = PropertyAccessor.getValue(fieldDestination, fieldName);
                if (field instanceof AbstractInputElement) {
                    if (field instanceof RadioInputElement || field instanceof CheckboxInputElement) {
                        field.setChecked(value == field.getValue());
                    } else {
                        field.setValue(value);
                    }
                }
            };

            this._pullers.add(puller);
            this._pushers.add(pusher);

            return this;
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

    return InputMapping;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = exports.Template = function () {
    function Template(templateSource) {
        _classCallCheck(this, Template);

        this._templateSource = templateSource;
    }

    _createClass(Template, [{
        key: "getTemplateSource",
        value: function getTemplateSource() {
            return this._templateSource;
        }
    }]);

    return Template;
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

        this._templateMap = new _coreutil.Map();
        this._templateQueueSize = 0;
        this._callback = null;
    }

    _createClass(TemplateManager, [{
        key: "set",
        value: function set(name, template) {
            this._templateMap.set(name, template);
        }
    }, {
        key: "get",
        value: function get(name) {
            return this._templateMap.get(name);
        }
    }, {
        key: "done",
        value: function done(callback) {
            this._callback = callback;
            this.doCallback(this);
        }
    }, {
        key: "doCallback",
        value: function doCallback(tmo) {
            if (tmo._callback != null && tmo._templateQueueSize == tmo._templateMap.size()) {
                var tempCallback = tmo._callback.call();
                tmo._callback = null;
                tempCallback.call();
            }
        }
    }, {
        key: "load",
        value: function load(name, url) {
            this._templateQueueSize++;
            var obj = this;
            if (this.get(name) == null) {
                qwest.get(url).then(function (xhr, response) {
                    obj.set(name, new Template(response));
                    obj.doCallback(obj);
                });
            }
        }
    }]);

    return TemplateManager;
}();

var templates = exports.templates = new TemplateManager();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertyAccessor = exports.PropertyAccessor = function () {
    function PropertyAccessor() {
        _classCallCheck(this, PropertyAccessor);
    }

    _createClass(PropertyAccessor, null, [{
        key: 'getValue',
        value: function getValue(destination, name) {
            var pathArray = name.split('.');
            for (var i = 0, n = pathArray.length; i < n; ++i) {
                var key = pathArray[i];
                if (key in destination) {
                    destination = destination[key];
                } else {
                    return;
                }
            }
            return destination;
        }
    }, {
        key: 'setValue',
        value: function setValue(destination, name, value) {
            var pathArray = name.split('.');
            for (var i = 0, n = pathArray.length; i < n; ++i) {
                var key = pathArray[i];
                if (i == n - 1) {
                    destination[key] = value;
                    return;
                }
                if (!(key in destination) || destination[key] === null) {
                    destination[key] = {};
                }
                destination = destination[key];
            }
        }
    }]);

    return PropertyAccessor;
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
        key: "getParameter",
        value: function getParameter(key) {
            return this._parameterMap.get(key);
        }
    }, {
        key: "setParameter",
        value: function setParameter(key, value) {
            this._parameterMap.set(key, value);
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