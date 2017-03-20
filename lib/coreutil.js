(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.coreutil = global.coreutil || {})));
}(this, (function (exports) { 'use strict';

/* jshint esversion: 6 */

/**
 * Generic List class
 */
class List {

    /**
     * Create new list and optionally assign existing array
     * 
     * @param {Array} values 
     */
    constructor(values) {
        if(values !== undefined && values instanceof Array){
            this._list = values;
        }else{
            this._list = [];
        }
    }

    /**
     * Get value of position
     * 
     * @param {number} index 
     * @return {any}
     */
    get(index) {
        return this._list[index];
    }

    /**
     * Set value on position
     * 
     * @param {number} index 
     * @param {any} value 
     */
    set(index,value) {
        this._list[index] = value;
    }

    /**
     * Add value to end of list
     * 
     * @param {any} value 
     */
    add(value) {
        this._list.push(value);
    }

    /**
     * Get the size of the list
     * 
     * @return {number}
     */
    size() {
        return this._list.length;
    }

    /**
     * Run the function for each value in the list
     * 
     * @param {function} listener - The function to call for each entry
     * @param {any} parent - The outer context passed into the function, function should return true to continue and false to break
     */
    forEach(listener,parent) {
        for(let val of this._list) {
            if(!listener(val,parent)){
                break;
            }
        }
    }

}

/* jshint esversion: 6 */

class Logger{

    static disableDebug() {
        Logger.debugEnabled = false;
    }

    static enableDebug() {
        Logger.debugEnabled = true;
    }

    static log(value){
        console.log(value);
    }

    static debug(depth, value){
        if(!Logger.debugEnabled){
            return;
        }
        let line = '';
        line = line + depth;
        for(let i = 0 ; i < depth ; i++){
            line = line + ' ';
        }
        line = line + value;
        console.log(line);
    }

    static warn(value){
        console.warn('------------------WARN------------------');
        console.warn(value);
        console.warn('------------------/WARN------------------');
    }

    static error(value){
        console.error('------------------ERROR------------------');
        console.error(value);
        console.error('------------------/ERROR------------------');
    }

    static showPos(text,position){
        if(!Logger.debugEnabled){
            return;
        }
        let cursorLine = '';
        for(let i = 0 ; i < text.length ; i++) {
            if(i == position){
                cursorLine = cursorLine + '+';
            }else{
                cursorLine = cursorLine + ' ';
            }
        }
        console.log(cursorLine);
        console.log(text);
        console.log(cursorLine);

    }

}
Logger.debugEanbled = false;

/* jshint esversion: 6 */

class Map {

    constructor() {
        this._map = {};
    }

    size(){
        return Object.keys(this._map).length;
    }

    get(name) {
        return this._map[name];
    }

    set(name,value) {
        this._map[name] = value;
    }

    contains(name) {
        return this.exists(name);
    }

    exists(name){
        if (name in this._map) {
            return true;
        }
        return false;
    }

    forEach(listener,parent) {
        for(let key in this._map) {
            if(!listener(key,this._map[key],parent)){
                break;
            }
        }
    }

}

/* jshint esversion: 6 */

class ObjectFunction{

    constructor(theObject,theFunction){
        this._object = theObject;
        this._function = theFunction;
    }

    getObject(){
        return this._object;
    }

    getFunction(){
        return this._function;
    }

    call(params){
        this._function.call(this._object,params);
    }

}

/* jshint esversion: 6 */

class PropertyAccessor{

    static getValue(destination, name) {
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

    static setValue(destination, name, value) {
        var pathArray = name.split('.');
        for (var i = 0, n = pathArray.length; i < n; ++i) {
            var key = pathArray[i];
            if(i == n-1){
                destination[key] = value;
                return;
            }
            if (!(key in destination) || destination[key] === null) {
                destination[key] = {};
            }
            destination = destination[key];
        }
    }

}

/* jshint esversion: 6 */

class StringUtils{

    static isInAlphabet(val) {
        if (val.charCodeAt(0) >= 65 && val.charCodeAt(0) <= 90) {
            return true;
        }
        if ( val.charCodeAt(0) >= 97 && val.charCodeAt(0) <= 122 ) {
            return true;
        }
        if ( val.charCodeAt(0) >= 48 && val.charCodeAt(0) <= 57 ) {
            return true;
        }
        return false;
    }
}

exports.List = List;
exports.Logger = Logger;
exports.Map = Map;
exports.ObjectFunction = ObjectFunction;
exports.PropertyAccessor = PropertyAccessor;
exports.StringUtils = StringUtils;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluL2NvcmV1dGlsL2xpc3QuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9sb2dnZXIuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9tYXAuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9vYmplY3RGdW5jdGlvbi5qcyIsIi4uL3NyYy9tYWluL2NvcmV1dGlsL3Byb3BlcnR5QWNjZXNzb3IuanMiLCIuLi9zcmMvbWFpbi9jb3JldXRpbC9zdHJpbmdVdGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG4vKipcclxuICogR2VuZXJpYyBMaXN0IGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTGlzdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgbmV3IGxpc3QgYW5kIG9wdGlvbmFsbHkgYXNzaWduIGV4aXN0aW5nIGFycmF5XHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodmFsdWVzKSB7XHJcbiAgICAgICAgaWYodmFsdWVzICE9PSB1bmRlZmluZWQgJiYgdmFsdWVzIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gdmFsdWVzO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHZhbHVlIG9mIHBvc2l0aW9uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBcclxuICAgICAqIEByZXR1cm4ge2FueX1cclxuICAgICAqL1xyXG4gICAgZ2V0KGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHZhbHVlIG9uIHBvc2l0aW9uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBcclxuICAgICAqIEBwYXJhbSB7YW55fSB2YWx1ZSBcclxuICAgICAqL1xyXG4gICAgc2V0KGluZGV4LHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdFtpbmRleF0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCB2YWx1ZSB0byBlbmQgb2YgbGlzdFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWUgXHJcbiAgICAgKi9cclxuICAgIGFkZCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHNpemUgb2YgdGhlIGxpc3RcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzaXplKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJ1biB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggdmFsdWUgaW4gdGhlIGxpc3RcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbnRyeVxyXG4gICAgICogQHBhcmFtIHthbnl9IHBhcmVudCAtIFRoZSBvdXRlciBjb250ZXh0IHBhc3NlZCBpbnRvIHRoZSBmdW5jdGlvbiwgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIGFuZCBmYWxzZSB0byBicmVha1xyXG4gICAgICovXHJcbiAgICBmb3JFYWNoKGxpc3RlbmVyLHBhcmVudCkge1xyXG4gICAgICAgIGZvcihsZXQgdmFsIG9mIHRoaXMuX2xpc3QpIHtcclxuICAgICAgICAgICAgaWYoIWxpc3RlbmVyKHZhbCxwYXJlbnQpKXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2Vye1xyXG5cclxuICAgIHN0YXRpYyBkaXNhYmxlRGVidWcoKSB7XHJcbiAgICAgICAgTG9nZ2VyLmRlYnVnRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmFibGVEZWJ1ZygpIHtcclxuICAgICAgICBMb2dnZXIuZGVidWdFbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9nKHZhbHVlKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlYnVnKGRlcHRoLCB2YWx1ZSl7XHJcbiAgICAgICAgaWYoIUxvZ2dlci5kZWJ1Z0VuYWJsZWQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsaW5lID0gJyc7XHJcbiAgICAgICAgbGluZSA9IGxpbmUgKyBkZXB0aDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwIDsgaSA8IGRlcHRoIDsgaSsrKXtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmUgKyAnICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpbmUgPSBsaW5lICsgdmFsdWU7XHJcbiAgICAgICAgY29uc29sZS5sb2cobGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHdhcm4odmFsdWUpe1xyXG4gICAgICAgIGNvbnNvbGUud2FybignLS0tLS0tLS0tLS0tLS0tLS0tV0FSTi0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnNvbGUud2Fybih2YWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCctLS0tLS0tLS0tLS0tLS0tLS0vV0FSTi0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlcnJvcih2YWx1ZSl7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignLS0tLS0tLS0tLS0tLS0tLS0tRVJST1ItLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCctLS0tLS0tLS0tLS0tLS0tLS0vRVJST1ItLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2hvd1Bvcyh0ZXh0LHBvc2l0aW9uKXtcclxuICAgICAgICBpZighTG9nZ2VyLmRlYnVnRW5hYmxlZCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGN1cnNvckxpbmUgPSAnJztcclxuICAgICAgICBmb3IobGV0IGkgPSAwIDsgaSA8IHRleHQubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKGkgPT0gcG9zaXRpb24pe1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yTGluZSA9IGN1cnNvckxpbmUgKyAnKyc7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yTGluZSA9IGN1cnNvckxpbmUgKyAnICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yTGluZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yTGluZSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5Mb2dnZXIuZGVidWdFYW5ibGVkID0gZmFsc2U7XHJcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX21hcCA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHNpemUoKXtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fbWFwKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFwW25hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChuYW1lLHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGFpbnMobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4aXN0cyhuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBleGlzdHMobmFtZSl7XHJcbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5fbWFwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yRWFjaChsaXN0ZW5lcixwYXJlbnQpIHtcclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9tYXApIHtcclxuICAgICAgICAgICAgaWYoIWxpc3RlbmVyKGtleSx0aGlzLl9tYXBba2V5XSxwYXJlbnQpKXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5leHBvcnQgY2xhc3MgT2JqZWN0RnVuY3Rpb257XHJcblxyXG4gICAgY29uc3RydWN0b3IodGhlT2JqZWN0LHRoZUZ1bmN0aW9uKXtcclxuICAgICAgICB0aGlzLl9vYmplY3QgPSB0aGVPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5fZnVuY3Rpb24gPSB0aGVGdW5jdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPYmplY3QoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bmN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGwocGFyYW1zKXtcclxuICAgICAgICB0aGlzLl9mdW5jdGlvbi5jYWxsKHRoaXMuX29iamVjdCxwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5leHBvcnQgY2xhc3MgUHJvcGVydHlBY2Nlc3NvcntcclxuXHJcbiAgICBzdGF0aWMgZ2V0VmFsdWUoZGVzdGluYXRpb24sIG5hbWUpIHtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gcGF0aEFycmF5W2ldO1xyXG4gICAgICAgICAgICBpZiAoa2V5IGluIGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uW2tleV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRWYWx1ZShkZXN0aW5hdGlvbiwgbmFtZSwgdmFsdWUpIHtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gcGF0aEFycmF5W2ldO1xyXG4gICAgICAgICAgICBpZihpID09IG4tMSl7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoa2V5IGluIGRlc3RpbmF0aW9uKSB8fCBkZXN0aW5hdGlvbltrZXldID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbltrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmluZ1V0aWxze1xyXG5cclxuICAgIHN0YXRpYyBpc0luQWxwaGFiZXQodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbC5jaGFyQ29kZUF0KDApID49IDY1ICYmIHZhbC5jaGFyQ29kZUF0KDApIDw9IDkwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHZhbC5jaGFyQ29kZUF0KDApID49IDk3ICYmIHZhbC5jaGFyQ29kZUF0KDApIDw9IDEyMiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdmFsLmNoYXJDb2RlQXQoMCkgPj0gNDggJiYgdmFsLmNoYXJDb2RlQXQoMCkgPD0gNTcgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7OztBQUtBLEFBQU8sTUFBTSxJQUFJLENBQUM7Ozs7Ozs7SUFPZCxXQUFXLENBQUMsTUFBTSxFQUFFO1FBQ2hCLEdB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
