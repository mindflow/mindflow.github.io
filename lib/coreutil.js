(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.coreutil = global.coreutil || {})));
}(this, (function (exports) { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/* jshint esversion: 6 */

/**
 * Generic List class
 */
var List = function () {

    /**
     * Create new list and optionally assign existing array
     * 
     * @param {Array} values 
     */
    function List(values) {
        classCallCheck(this, List);

        if (values !== undefined && values instanceof Array) {
            this._list = values;
        } else {
            this._list = [];
        }
    }

    /**
     * Get value of position
     * 
     * @param {number} index 
     * @return {any}
     */


    createClass(List, [{
        key: "get",
        value: function get$$1(index) {
            return this._list[index];
        }

        /**
         * Set value on position
         * 
         * @param {number} index 
         * @param {any} value 
         */

    }, {
        key: "set",
        value: function set$$1(index, value) {
            this._list[index] = value;
        }

        /**
         * Add value to end of list
         * 
         * @param {any} value 
         */

    }, {
        key: "add",
        value: function add(value) {
            this._list.push(value);
        }

        /**
         * Get the size of the list
         * 
         * @return {number}
         */

    }, {
        key: "size",
        value: function size() {
            return this._list.length;
        }

        /**
         * Run the function for each value in the list
         * 
         * @param {function} listener - The function to call for each entry
         * @param {any} parent - The outer context passed into the function, function should return true to continue and false to break
         */

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

/* jshint esversion: 6 */

var Logger = function () {
    function Logger() {
        classCallCheck(this, Logger);
    }

    createClass(Logger, null, [{
        key: 'disableDebug',
        value: function disableDebug() {
            Logger.debugEnabled = false;
        }
    }, {
        key: 'enableDebug',
        value: function enableDebug() {
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

/* jshint esversion: 6 */

var Map = function () {
    function Map() {
        classCallCheck(this, Map);

        this._map = {};
    }

    createClass(Map, [{
        key: "size",
        value: function size() {
            return Object.keys(this._map).length;
        }
    }, {
        key: "get",
        value: function get$$1(name) {
            return this._map[name];
        }
    }, {
        key: "set",
        value: function set$$1(name, value) {
            this._map[name] = value;
        }
    }, {
        key: "contains",
        value: function contains(name) {
            return this.exists(name);
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

/* jshint esversion: 6 */

var ObjectFunction = function () {
    function ObjectFunction(theObject, theFunction) {
        classCallCheck(this, ObjectFunction);

        this._object = theObject;
        this._function = theFunction;
    }

    createClass(ObjectFunction, [{
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

/* jshint esversion: 6 */

var PropertyAccessor = function () {
    function PropertyAccessor() {
        classCallCheck(this, PropertyAccessor);
    }

    createClass(PropertyAccessor, null, [{
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

/* jshint esversion: 6 */

var StringUtils = function () {
    function StringUtils() {
        classCallCheck(this, StringUtils);
    }

    createClass(StringUtils, null, [{
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

exports.List = List;
exports.Logger = Logger;
exports.Map = Map;
exports.ObjectFunction = ObjectFunction;
exports.PropertyAccessor = PropertyAccessor;
exports.StringUtils = StringUtils;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluL2NvcmV1dGlsL2xpc3QuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9sb2dnZXIuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9tYXAuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9vYmplY3RGdW5jdGlvbi5qcyIsIi4uL3NyYy9tYWluL2NvcmV1dGlsL3Byb3BlcnR5QWNjZXNzb3IuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9zdHJpbmdVdGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKipcclxuICogR2VuZXJpYyBMaXN0IGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTGlzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgbmV3IGxpc3QgYW5kIG9wdGlvbmFsbHkgYXNzaWduIGV4aXN0aW5nIGFycmF5XHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgaWYodmFsdWVzICE9PSB1bmRlZmluZWQgJiYgdmFsdWVzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gdmFsdWVzO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHZhbHVlIG9mIHBvc2l0aW9uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBcclxuICAgICAqIEByZXR1cm4ge2FueX1cclxuICAgICAqL1xyXG4gICAgZ2V0KGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHZhbHVlIG9uIHBvc2l0aW9uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBcclxuICAgICAqIEBwYXJhbSB7YW55fSB2YWx1ZSBcclxuICAgICAqL1xyXG4gICAgc2V0KGluZGV4LHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdFtpbmRleF0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCB2YWx1ZSB0byBlbmQgb2YgbGlzdFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWUgXHJcbiAgICAgKi9cclxuICAgIGFkZCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHNpemUgb2YgdGhlIGxpc3RcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzaXplKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJ1biB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggdmFsdWUgaW4gdGhlIGxpc3RcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbnRyeVxyXG4gICAgICogQHBhcmFtIHthbnl9IHBhcmVudCAtIFRoZSBvdXRlciBjb250ZXh0IHBhc3NlZCBpbnRvIHRoZSBmdW5jdGlvbiwgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIGFuZCBmYWxzZSB0byBicmVha1xyXG4gICAgICovXHJcbiAgICBmb3JFYWNoKGxpc3RlbmVyLHBhcmVudCkge1xyXG4gICAgICAgIGZvcihsZXQgdmFsIG9mIHRoaXMuX2xpc3QpIHtcclxuICAgICAgICAgICAgaWYoIWxpc3RlbmVyKHZhbCxwYXJlbnQpKXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2Vye1xyXG5cclxuICAgIHN0YXRpYyBkaXNhYmxlRGVidWcoKSB7XHJcbiAgICAgICAgTG9nZ2VyLmRlYnVnRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmFibGVEZWJ1ZygpIHtcclxuICAgICAgICBMb2dnZXIuZGVidWdFbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9nKHZhbHVlKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlYnVnKGRlcHRoLCB2YWx1ZSl7XHJcbiAgICAgICAgaWYoIUxvZ2dlci5kZWJ1Z0VuYWJsZWQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsaW5lID0gJyc7XHJcbiAgICAgICAgbGluZSA9IGxpbmUgKyBkZXB0aDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwIDsgaSA8IGRlcHRoIDsgaSsrKXtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUgKyAnICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpbmUgPSBsaW5lICsgdmFsdWU7XHJcbiAgICAgICAgY29uc29sZS5sb2cobGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHdhcm4odmFsdWUpe1xyXG4gICAgICAgIGNvbnNvbGUud2FybignLS0tLS0tLS0tLS0tLS0tLS0tV0FSTi0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnNvbGUud2Fybih2YWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCctLS0tLS0tLS0tLS0tLS0tLS0vV0FSTi0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlcnJvcih2YWx1ZSl7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignLS0tLS0tLS0tLS0tLS0tLS0tRVJST1ItLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCctLS0tLS0tLS0tLS0tLS0tLS0vRVJST1ItLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2hvd1Bvcyh0ZXh0LHBvc2l0aW9uKXtcclxuICAgICAgICBpZighTG9nZ2VyLmRlYnVnRW5hYmxlZCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGN1cnNvckxpbmUgPSAnJztcclxuICAgICAgICBmb3IobGV0IGkgPSAwIDsgaSA8IHRleHQubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKGkgPT0gcG9zaXRpb24pe1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yTGluZSA9IGN1cnNvckxpbmUgKyAnKyc7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yTGluZSA9IGN1cnNvckxpbmUgKyAnICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yTGluZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yTGluZSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5Mb2dnZXIuZGVidWdFYW5ibGVkID0gZmFsc2U7XHJcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX21hcCA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHNpemUoKXtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fbWFwKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFwW25hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChuYW1lLHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGFpbnMobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4aXN0cyhuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBleGlzdHMobmFtZSl7XHJcbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5fbWFwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yRWFjaChsaXN0ZW5lcixwYXJlbnQpIHtcclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9tYXApIHtcclxuICAgICAgICAgICAgaWYoIWxpc3RlbmVyKGtleSx0aGlzLl9tYXBba2V5XSxwYXJlbnQpKXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5leHBvcnQgY2xhc3MgT2JqZWN0RnVuY3Rpb257XHJcblxyXG4gICAgY29uc3RydWN0b3IodGhlT2JqZWN0LHRoZUZ1bmN0aW9uKXtcclxuICAgICAgICB0aGlzLl9vYmplY3QgPSB0aGVPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5fZnVuY3Rpb24gPSB0aGVGdW5jdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPYmplY3QoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bmN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGwocGFyYW1zKXtcclxuICAgICAgICB0aGlzLl9mdW5jdGlvbi5jYWxsKHRoaXMuX29iamVjdCxwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5leHBvcnQgY2xhc3MgUHJvcGVydHlBY2Nlc3NvcntcclxuXHJcbiAgICBzdGF0aWMgZ2V0VmFsdWUoZGVzdGluYXRpb24sIG5hbWUpIHtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gcGF0aEFycmF5W2ldO1xyXG4gICAgICAgICAgICBpZiAoa2V5IGluIGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uW2tleV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRWYWx1ZShkZXN0aW5hdGlvbiwgbmFtZSwgdmFsdWUpIHtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gcGF0aEFycmF5W2ldO1xyXG4gICAgICAgICAgICBpZihpID09IG4tMSl7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoa2V5IGluIGRlc3RpbmF0aW9uKSB8fCBkZXN0aW5hdGlvbltrZXldID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbltrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmluZ1V0aWxze1xyXG5cclxuICAgIHN0YXRpYyBpc0luQWxwaGFiZXQodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbC5jaGFyQ29kZUF0KDApID49IDY1ICYmIHZhbC5jaGFyQ29kZUF0KDApIDw9IDkwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHZhbC5jaGFyQ29kZUF0KDApID49IDk3ICYmIHZhbC5jaGFyQ29kZUF0KDApIDw9IDEyMiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdmFsLmNoYXJDb2RlQXQoMCkgPj0gNDggJiYgdmFsLmNoYXJDb2RlQXQoMCkgPD0gNTcgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIkxpc3QiLCJ2YWx1ZXMiLCJ1bmRlZmluZWQiLCJBcnJheSIsIl9saXN0IiwiaW5kZXgiLCJ2YWx1ZSIsInB1c2giLCJsZW5ndGgiLCJsaXN0ZW5lciIsInBhcmVudCIsInZhbCIsIkxvZ2dlciIsImRlYnVnRW5hYmxlZCIsImxvZyIsImRlcHRoIiwibGluZSIsImkiLCJ3YXJuIiwiZXJyb3IiLCJ0ZXh0IiwicG9zaXRpb24iLCJjdXJzb3JMaW5lIiwiZGVidWdFYW5ibGVkIiwiTWFwIiwiX21hcCIsIk9iamVjdCIsImtleXMiLCJuYW1lIiwiZXhpc3RzIiwia2V5IiwiT2JqZWN0RnVuY3Rpb24iLCJ0aGVPYmplY3QiLCJ0aGVGdW5jdGlvbiIsIl9vYmplY3QiLCJfZnVuY3Rpb24iLCJwYXJhbXMiLCJjYWxsIiwiUHJvcGVydHlBY2Nlc3NvciIsImRlc3RpbmF0aW9uIiwicGF0aEFycmF5Iiwic3BsaXQiLCJuIiwiU3RyaW5nVXRpbHMiLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7QUFLQSxJQUFhQSxJQUFiOzs7Ozs7O2tCQU9nQkMsTUFBWixFQUFvQjs7O1lBQ2JBLFdBQVdDLFNBQVgsSUFBd0JELGtCQUFrQkUsS0FBN0MsRUFBbUQ7aUJBQzFDQyxLQUFMLEdBQWFILE1BQWI7U0FESixNQUVLO2lCQUNJRyxLQUFMLEdBQWEsRUFBYjs7Ozs7Ozs7Ozs7Ozs7K0JBVUpDLEtBckJSLEVBcUJlO21CQUNBLEtBQUtELEtBQUwsQ0FBV0MsS0FBWCxDQUFQOzs7Ozs7Ozs7Ozs7K0JBU0FBLEtBL0JSLEVBK0JjQyxLQS9CZCxFQStCcUI7aUJBQ1JGLEtBQUwsQ0FBV0MsS0FBWCxJQUFvQkMsS0FBcEI7Ozs7Ozs7Ozs7OzRCQVFBQSxLQXhDUixFQXdDZTtpQkFDRkYsS0FBTCxDQUFXRyxJQUFYLENBQWdCRCxLQUFoQjs7Ozs7Ozs7Ozs7K0JBUUc7bUJBQ0ksS0FBS0YsS0FBTCxDQUFXSSxNQUFsQjs7Ozs7Ozs7Ozs7O2dDQVNJQyxRQTNEWixFQTJEcUJDLE1BM0RyQixFQTJENkI7Ozs7OztxQ0FDTixLQUFLTixLQUFwQiw4SEFBMkI7d0JBQW5CTyxHQUFtQjs7d0JBQ3BCLENBQUNGLFNBQVNFLEdBQVQs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
