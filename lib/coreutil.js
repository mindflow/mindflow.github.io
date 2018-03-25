(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.coreutil = {})));
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
      }, {
          key: "addAll",
          value: function addAll(sourceMap) {
              sourceMap.forEach(function (key, value, parent) {
                  parent.set(key, value);
              }, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluL2NvcmV1dGlsL2xpc3QuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9sb2dnZXIuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9tYXAuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9vYmplY3RGdW5jdGlvbi5qcyIsIi4uL3NyYy9tYWluL2NvcmV1dGlsL3Byb3BlcnR5QWNjZXNzb3IuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9zdHJpbmdVdGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbi8qKlxuICogR2VuZXJpYyBMaXN0IGNsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBMaXN0IHtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBuZXcgbGlzdCBhbmQgb3B0aW9uYWxseSBhc3NpZ24gZXhpc3RpbmcgYXJyYXlcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodmFsdWVzKSB7XG4gICAgICAgIGlmKHZhbHVlcyAhPT0gdW5kZWZpbmVkICYmIHZhbHVlcyBpbnN0YW5jZW9mIEFycmF5KXtcbiAgICAgICAgICAgIHRoaXMuX2xpc3QgPSB2YWx1ZXM7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHZhbHVlIG9mIHBvc2l0aW9uXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFxuICAgICAqIEByZXR1cm4ge2FueX1cbiAgICAgKi9cbiAgICBnZXQoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RbaW5kZXhdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB2YWx1ZSBvbiBwb3NpdGlvblxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWUgXG4gICAgICovXG4gICAgc2V0KGluZGV4LHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2xpc3RbaW5kZXhdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHZhbHVlIHRvIGVuZCBvZiBsaXN0XG4gICAgICogXG4gICAgICogQHBhcmFtIHthbnl9IHZhbHVlIFxuICAgICAqL1xuICAgIGFkZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9saXN0LnB1c2godmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc2l6ZSBvZiB0aGUgbGlzdFxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdC5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBmdW5jdGlvbiBmb3IgZWFjaCB2YWx1ZSBpbiB0aGUgbGlzdFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZW50cnlcbiAgICAgKiBAcGFyYW0ge2FueX0gcGFyZW50IC0gVGhlIG91dGVyIGNvbnRleHQgcGFzc2VkIGludG8gdGhlIGZ1bmN0aW9uLCBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgdG8gY29udGludWUgYW5kIGZhbHNlIHRvIGJyZWFrXG4gICAgICovXG4gICAgZm9yRWFjaChsaXN0ZW5lcixwYXJlbnQpIHtcbiAgICAgICAgZm9yKGxldCB2YWwgb2YgdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgaWYoIWxpc3RlbmVyKHZhbCxwYXJlbnQpKXtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5leHBvcnQgY2xhc3MgTG9nZ2Vye1xuXG4gICAgc3RhdGljIGRpc2FibGVEZWJ1ZygpIHtcbiAgICAgICAgTG9nZ2VyLmRlYnVnRW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBlbmFibGVEZWJ1ZygpIHtcbiAgICAgICAgTG9nZ2VyLmRlYnVnRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvZyh2YWx1ZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVidWcoZGVwdGgsIHZhbHVlKXtcbiAgICAgICAgaWYoIUxvZ2dlci5kZWJ1Z0VuYWJsZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsaW5lID0gJyc7XG4gICAgICAgIGxpbmUgPSBsaW5lICsgZGVwdGg7XG4gICAgICAgIGZvcihsZXQgaSA9IDAgOyBpIDwgZGVwdGggOyBpKyspe1xuICAgICAgICAgICAgbGluZSA9IGxpbmUgKyAnICc7XG4gICAgICAgIH1cbiAgICAgICAgbGluZSA9IGxpbmUgKyB2YWx1ZTtcbiAgICAgICAgY29uc29sZS5sb2cobGluZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdhcm4odmFsdWUpe1xuICAgICAgICBjb25zb2xlLndhcm4oJy0tLS0tLS0tLS0tLS0tLS0tLVdBUk4tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgICAgY29uc29sZS53YXJuKHZhbHVlKTtcbiAgICAgICAgY29uc29sZS53YXJuKCctLS0tLS0tLS0tLS0tLS0tLS0vV0FSTi0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgIH1cblxuICAgIHN0YXRpYyBlcnJvcih2YWx1ZSl7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJy0tLS0tLS0tLS0tLS0tLS0tLUVSUk9SLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsdWUpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCctLS0tLS0tLS0tLS0tLS0tLS0vRVJST1ItLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2hvd1Bvcyh0ZXh0LHBvc2l0aW9uKXtcbiAgICAgICAgaWYoIUxvZ2dlci5kZWJ1Z0VuYWJsZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJzb3JMaW5lID0gJyc7XG4gICAgICAgIGZvcihsZXQgaSA9IDAgOyBpIDwgdGV4dC5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgICAgIGlmKGkgPT0gcG9zaXRpb24pe1xuICAgICAgICAgICAgICAgIGN1cnNvckxpbmUgPSBjdXJzb3JMaW5lICsgJysnO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY3Vyc29yTGluZSA9IGN1cnNvckxpbmUgKyAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yTGluZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJzb3JMaW5lKTtcblxuICAgIH1cblxufVxuTG9nZ2VyLmRlYnVnRWFuYmxlZCA9IGZhbHNlO1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5leHBvcnQgY2xhc3MgTWFwIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSB7fTtcbiAgICB9XG5cbiAgICBzaXplKCl7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9tYXApLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwW25hbWVdO1xuICAgIH1cblxuICAgIHNldChuYW1lLHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX21hcFtuYW1lXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGNvbnRhaW5zKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhpc3RzKG5hbWUpO1xuICAgIH1cblxuICAgIGV4aXN0cyhuYW1lKXtcbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5fbWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yRWFjaChsaXN0ZW5lcixwYXJlbnQpIHtcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy5fbWFwKSB7XG4gICAgICAgICAgICBpZighbGlzdGVuZXIoa2V5LHRoaXMuX21hcFtrZXldLHBhcmVudCkpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQWxsKHNvdXJjZU1hcCl7XG4gICAgICAgIHNvdXJjZU1hcC5mb3JFYWNoKGZ1bmN0aW9uKGtleSx2YWx1ZSxwYXJlbnQpIHtcbiAgICAgICAgICAgIHBhcmVudC5zZXQoa2V5LHZhbHVlKTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuZXhwb3J0IGNsYXNzIE9iamVjdEZ1bmN0aW9ue1xuXG4gICAgY29uc3RydWN0b3IodGhlT2JqZWN0LHRoZUZ1bmN0aW9uKXtcbiAgICAgICAgdGhpcy5fb2JqZWN0ID0gdGhlT2JqZWN0O1xuICAgICAgICB0aGlzLl9mdW5jdGlvbiA9IHRoZUZ1bmN0aW9uO1xuICAgIH1cblxuICAgIGdldE9iamVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0O1xuICAgIH1cblxuICAgIGdldEZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9mdW5jdGlvbjtcbiAgICB9XG5cbiAgICBjYWxsKHBhcmFtcyl7XG4gICAgICAgIHRoaXMuX2Z1bmN0aW9uLmNhbGwodGhpcy5fb2JqZWN0LHBhcmFtcyk7XG4gICAgfVxuXG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eUFjY2Vzc29ye1xuXG4gICAgc3RhdGljIGdldFZhbHVlKGRlc3RpbmF0aW9uLCBuYW1lKSB7XG4gICAgICAgIHZhciBwYXRoQXJyYXkgPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IHBhdGhBcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChrZXkgaW4gZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uW2tleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgfVxuXG4gICAgc3RhdGljIHNldFZhbHVlKGRlc3RpbmF0aW9uLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgcGF0aEFycmF5ID0gbmFtZS5zcGxpdCgnLicpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHBhdGhBcnJheS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwYXRoQXJyYXlbaV07XG4gICAgICAgICAgICBpZihpID09IG4tMSl7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGtleSBpbiBkZXN0aW5hdGlvbikgfHwgZGVzdGluYXRpb25ba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25ba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5leHBvcnQgY2xhc3MgU3RyaW5nVXRpbHN7XG5cbiAgICBzdGF0aWMgaXNJbkFscGhhYmV0KHZhbCkge1xuICAgICAgICBpZiAodmFsLmNoYXJDb2RlQXQoMCkgPj0gNjUgJiYgdmFsLmNoYXJDb2RlQXQoMCkgPD0gOTApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdmFsLmNoYXJDb2RlQXQoMCkgPj0gOTcgJiYgdmFsLmNoYXJDb2RlQXQoMCkgPD0gMTIyICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB2YWwuY2hhckNvZGVBdCgwKSA+PSA0OCAmJiB2YWwuY2hhckNvZGVBdCgwKSA8PSA1NyApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiTGlzdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsIkFycmF5IiwiX2xpc3QiLCJpbmRleCIsInZhbHVlIiwicHVzaCIsImxlbmd0aCIsImxpc3RlbmVyIiwicGFyZW50IiwidmFsIiwiTG9nZ2VyIiwiZGVidWdFbmFibGVkIiwiY29uc29sZSIsImxvZyIsImRlcHRoIiwibGluZSIsImkiLCJ3YXJuIiwiZXJyb3IiLCJ0ZXh0IiwicG9zaXRpb24iLCJjdXJzb3JMaW5lIiwiZGVidWdFYW5ibGVkIiwiTWFwIiwiX21hcCIsIk9iamVjdCIsImtleXMiLCJuYW1lIiwiZXhpc3RzIiwia2V5Iiwic291cmNlTWFwIiwiZm9yRWFjaCIsInNldCIsIk9iamVjdEZ1bmN0aW9uIiwidGhlT2JqZWN0IiwidGhlRnVuY3Rpb24iLCJfb2JqZWN0IiwiX2Z1bmN0aW9uIiwicGFyYW1zIiwiY2FsbCIsIlByb3BlcnR5QWNjZXNzb3IiLCJkZXN0aW5hdGlvbiIsInBhdGhBcnJheSIsInNwbGl0IiwibiIsIlN0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
