var coreutil =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = exports.List = function () {
    function List() {
        _classCallCheck(this, List);

        this._list = [];
    }

    _createClass(List, [{
        key: "get",
        value: function get(index) {
            return this._list[index];
        }
    }, {
        key: "set",
        value: function set(index, value) {
            this._list[index] = value;
        }
    }, {
        key: "add",
        value: function add(value) {
            this._list.push(value);
        }
    }, {
        key: "size",
        value: function size() {
            return this._list.length;
        }
    }, {
        key: "forEach",
        value: function forEach(listener, parent) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var val = _step.value;

                    if (!listener(val, parent)) {
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return List;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = exports.Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);
    }

    _createClass(Logger, null, [{
        key: 'disableDebug',
        value: function disableDebug() {
            Logger.debugEnabled = false;
        }
    }, {
        key: 'disableDebug',
        value: function disableDebug() {
            Logger.debugEnabled = true;
        }
    }, {
        key: 'log',
        value: function log(value) {
            console.log(value);
        }
    }, {
        key: 'debug',
        value: function debug(depth, value) {
            if (!Logger.debugEnabled) {
                return;
            }
            var line = '';
            line = line + depth;
            for (var i = 0; i < depth; i++) {
                line = line + ' ';
            }
            line = line + value;
            console.log(line);
        }
    }, {
        key: 'warn',
        value: function warn(value) {
            console.warn('------------------WARN------------------');
            console.warn(value);
            console.warn('------------------/WARN------------------');
        }
    }, {
        key: 'error',
        value: function error(value) {
            console.error('------------------ERROR------------------');
            console.error(value);
            console.error('------------------/ERROR------------------');
        }
    }, {
        key: 'showPos',
        value: function showPos(text, position) {
            if (!Logger.debugEnabled) {
                return;
            }
            var cursorLine = '';
            for (var i = 0; i < text.length; i++) {
                if (i == position) {
                    cursorLine = cursorLine + '+';
                } else {
                    cursorLine = cursorLine + ' ';
                }
            }
            console.log(cursorLine);
            console.log(text);
            console.log(cursorLine);
        }
    }]);

    return Logger;
}();

Logger.debugEanbled = false;
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = exports.Map = function () {
    function Map() {
        _classCallCheck(this, Map);

        this._map = {};
    }

    _createClass(Map, [{
        key: "get",
        value: function get(name) {
            return this._map[name];
        }
    }, {
        key: "set",
        value: function set(name, value) {
            this._map[name] = value;
        }
    }, {
        key: "exists",
        value: function exists(name) {
            if (name in this._map) {
                return true;
            }
            return false;
        }
    }, {
        key: "forEach",
        value: function forEach(listener, parent) {
            for (var key in this._map) {
                if (!listener(key, this._map[key], parent)) {
                    break;
                }
            }
        }
    }]);

    return Map;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectFunction = exports.ObjectFunction = function () {
    function ObjectFunction(theObject, theFunction) {
        _classCallCheck(this, ObjectFunction);

        this._object = theObject;
        this._function = theFunction;
    }

    _createClass(ObjectFunction, [{
        key: "getObject",
        value: function getObject() {
            return this._object;
        }
    }, {
        key: "getFunction",
        value: function getFunction() {
            return this._function;
        }
    }, {
        key: "call",
        value: function call(params) {
            this._function.call(this._object, params);
        }
    }]);

    return ObjectFunction;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringUtils = exports.StringUtils = function () {
    function StringUtils() {
        _classCallCheck(this, StringUtils);
    }

    _createClass(StringUtils, null, [{
        key: "isInAlphabet",
        value: function isInAlphabet(val) {
            if (val.charCodeAt(0) >= 65 && val.charCodeAt(0) <= 90) {
                return true;
            }
            if (val.charCodeAt(0) >= 97 && val.charCodeAt(0) <= 122) {
                return true;
            }
            if (val.charCodeAt(0) >= 48 && val.charCodeAt(0) <= 57) {
                return true;
            }
            return false;
        }
    }]);

    return StringUtils;
}();

//# sourceMappingURL=coreutil.js.map

/***/ })
/******/ ]);