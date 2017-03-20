(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('xmlparser'), require('coreutil')) :
	typeof define === 'function' && define.amd ? define(['exports', 'xmlparser', 'coreutil'], factory) :
	(factory((global.justright = global.justright || {}),global.xmlparser,global.coreutil));
}(this, (function (exports,xmlparser,coreutil) { 'use strict';

/* jshint esversion: 6 */

/**
 * A base class for enclosing an HTMLElement
 */
class BaseElement {

    /**
     * Constructor
     *
     * @param {XmlElement|string|HTMLElement} value
     * @param {XmlElement} parent
     */
    constructor(value, parent) {
        
        /** @type {HTMLElement} */
        this._element = null;
        
        if(value instanceof xmlparser.XmlElement) {
            this._element = this.createFromXmlElement(value, parent);
            return;
        }
        if(typeof value === "string"){
            this._element = document.createElement(value);
            return;
        }
        if(value instanceof HTMLElement){
            this._element = value;
            return;
        }
        console.error("Unrecognized value for Element");
        console.log(value);
    }

    /**
     * Creates a browser Element from the XmlElement
     *
     * @param {XmlElement} xmlElement
     * @param {XmlElement} parentElement
     * @return {HTMLElement}
     */
    createFromXmlElement(xmlElement, parentElement) {
        let element = null;
        if(xmlElement.getNamespace()){
            // Not complete
            element = document.createElement("http://nsuri",xmlElement.getFullName());
        }else{
            element = document.createElement(xmlElement.getName());
        }
        if(parentElement && parentElement.getMappedElement() !== null) {
            parentElement.getMappedElement().appendChild(element);
        }
        xmlElement.getAttributes().forEach(function(key,value){
            element.setAttribute(key,value.getValue());
            return true;
        });
        return element;
    }

    /**
     * Attach a function to an event in the enclosed element
     *
     * @param {string} eventType
     * @param {function} functionParam
     */
    attachEvent(eventType, functionParam) {
        this._element[eventType] = functionParam;
    }

    /**
     * Get the enclosed element
     *
     * @return {HTMLElement}
     */
    getMappedElement() {
        return this._element;
    }

    getFullName() {
        return this._element.tagName;
    }

    getTop(){
        return this._element.getBoundingClientRect().top;
    }

    getBottom(){
        return this._element.getBoundingClientRect().bottom;
    }

    getLeft(){
        return this._element.getBoundingClientRect().left;
    }

    getRight(){
        return this._element.getBoundingClientRect().right;
    }

    getWidth(){
        return this._element.offsetWidth;
    }

    getHeight(){
        return this._element.offsetHeight;
    }

    setAttribute(key,value) {
        this._element.setAttribute(key,value);
    }

    getAttribute(key) {
        return this._element.getAttribute(key);
    }

    containsAttribute(key){
        return this._element.hasAttribute(key);
    }

    removeAttribute(key){
        this._element.removeAttribute(key);
    }

    setStyle(key,value){
        this._element.style[key] = value;
    }

    getStyle(key){
        return this._element.style[key];
    }

    removeStyle(key){
        this._element.style[key] = null;
    }

    set(input){
        if(this._element.parentNode === null){
            console.error("The element has no parent, can not swap it for value");
            return;
        }
        if(input instanceof BaseElement) {
            this._element.parentNode.replaceChild(input.getMappedElement(),this._element);
            return;
        }
        if(input && typeof input.getRootElement === "function") {
            this._element.parentNode.replaceChild(input.getRootElement().getMappedElement(),this._element);
            this._element = input.getRootElement().getMappedElement();
            return;
        }
        if(typeof input == "string") {
            this._element.parentNode.replaceChild(document.createTextNode(input),this._element);
            return;
        }
        if(input instanceof Text) {
            this._element.parentNode.replaceChild(input,this._element);
            return;
        }
        if(input instanceof Element) {
            this._element.parentNode.replaceChild(input,this._element);
            return;
        }
    }

    clear(){
        while (this._element.firstChild) {
            this._element.removeChild(this._element.firstChild);
        }
    }

    setChild(input) {
        this.clear();
        this.addChild(input);
    }

    addChild(input) {
        if (input instanceof BaseElement) {
            this._element.appendChild(input.getMappedElement());
            return;
        }
        if (input && typeof input.getRootElement === "function") {
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

    prependChild(input) {
        if(this._element.firstChild === null) {
            this.addChild(input);
        }
        if (input instanceof BaseElement) {
            this._element.insertBefore(input.getMappedElement(),this._element.firstChild);
            return;
        }
        if (input && typeof input.getRootElement === "function") {
            this._element.insertBefore(input.getRootElement().getMappedElement(),this._element.firstChild);
            return;
        }
        if (typeof input == "string") {
            this._element.insertBefore(document.createTextNode(input),this._element.firstChild);
            return;
        }
        if (input instanceof Text) {
            this._element.insertBefore(input,this._element.firstChild);
            return;
        }
        if (input instanceof Element) {
            this._element.insertBefore(input,this._element.firstChild);
            return;
        }
    }
}

/* jshint esversion: 6 */

/**
 * Shared properties of input elements
 */
class AbstractInputElement extends BaseElement{

    /**
     * Constructor
     *
     * @param {object} value
     * @param {XmlElement} parent
     */
    constructor(value, parent) {
        super(value, parent);
    }

    /**
     * Get the value of the inputs name
     *
     * @return {string}
     */
    getName() {
        return this._element.name;
    }

    /**
     * Set the value of inputs name
     *
     * @param {string} value
     */
    setName(value) {
        this._element.name = value;
    }

    /**
     * 
     */
    getValue(){
        return this._element.value;
    }

    setValue(value){
        this._element.value = value;
    }
}

/* jshint esversion: 6 */

class CheckboxInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

    setChecked(value){
        this._element.checked = value;
    }

    isChecked(){
        return this._element.checked;
    }
}

/* jshint esversion: 6 */

class RadioInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

    setChecked(value){
        this._element.checked = value;
    }

    isChecked(){
        return this._element.checked;
    }
}

/* jshint esversion: 6 */

class PasswordInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

}

/* jshint esversion: 6 */

class TextInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

}

/* jshint esversion: 6 */

class TextareaInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

    getInnerHTML(){
        return this._element.innerHTML;
    }

    setInnerHTML(value){
        this._element.innerHTML = value;
    }

    addChild(input) {
        super.addChild(input);
        this.setValue(this.getInnerHTML());
    }

    prependChild(input) {
        super.prependChild(input);
        this.setValue(this.getInnerHTML());
    }

}

/* jshint esversion: 6 */

class TextnodeElement {

    constructor(value, parent) {
        if(value instanceof xmlparser.XmlCdata) {
            this._element = this.createFromXmlCdata(value, parent);
        }
        if(typeof value === "string"){
            this._element = document.createTextNode(value);
        }
    }

    createFromXmlCdata(cdataElement, parentElement) {
        let element = document.createTextNode(cdataElement.getValue());
        if(parentElement !== null && parentElement.getMappedElement() !== null) {
            parentElement.getMappedElement().appendChild(element);
        }
        return element;
    }

    setValue(value) {
        this._textnode = value;
    }

    getValue() {
        return this._textnode;
    }

    getMappedElement() {
        return this._textnode;
    }

}

/* jshint esversion: 6 */

class SimpleElement extends BaseElement{

    constructor(element, parent) {
        super(element, parent);
    }

    getInnerHTML(){
        return this._element.innerHTML;
    }

    setInnerHTML(value){
        this._element.innerHTML = value;
    }

}

/* jshint esversion: 6 */

class ElementMapper {

    static map(input, parent) {
        if(ElementMapper.mapsToRadio(input)){ return new RadioInputElement(input, parent); }
        if(ElementMapper.mapsToCheckbox(input)){ return new CheckboxInputElement(input, parent); }
        if(ElementMapper.mapsToPassword(input)){ return new PasswordInputElement(input, parent); }
        if(ElementMapper.mapsToSubmit(input)){ return new TextInputElement(input, parent); }
        if(ElementMapper.mapsToTextarea(input)){ return new TextareaInputElement(input, parent); }
        if(ElementMapper.mapsToText(input)){ return new TextInputElement(input, parent); }
        if(ElementMapper.mapsToTextnode(input)){ return new TextnodeElement(input, parent); }
        if(ElementMapper.mapsToSimple(input)){ return new SimpleElement(input, parent); }
        console.log("Mapping to simple by default " + input);
        return new SimpleElement(input, parent);
    }

    static mapsToRadio(input){
        return (input instanceof HTMLInputElement && input.type == "radio") ||
            (input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "radio");
    }

    static mapsToCheckbox(input){
        return (input instanceof HTMLInputElement && input.type == "checkbox") ||
            (input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "checkbox");
    }

    static mapsToPassword(input){
        return (input instanceof HTMLInputElement && input.type == "password") ||
            (input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "password");
    }

    static mapsToSubmit(input){
        return (input instanceof HTMLInputElement && input.type == "submit") ||
            (input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "submit");
    }

    static mapsToText(input){
        return (input instanceof HTMLInputElement && input.type == "text") ||
            (input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "text");
    }

    static mapsToTextnode(input){
        return (input instanceof Node && input.nodeType === "TEXT_NODE") ||
            (input instanceof xmlparser.XmlCdata);
    }

    static mapsToTextarea(input){
        return (input instanceof HTMLTextAreaElement) ||
            (input instanceof xmlparser.XmlElement && input.getName() === "textarea");
    }

    static mapsToSimple(input){
        return (input instanceof HTMLElement) ||
            (input instanceof xmlparser.XmlElement);
    }
}

/* jshint esversion: 6 */

class Template{

    constructor(templateSource){
        this._templateSource = templateSource;
    }

    getTemplateSource(){
        return this._templateSource;
    }

}

/* jshint esversion: 6 */

class TemplateManager{

    constructor(){
        this._templateMap = new coreutil.Map();
        this._templateQueueSize = 0;
        this._callback = null;
    }

    set(name,template){
        this._templateMap.set(name, template);
    }

    get(name){
        return this._templateMap.get(name);
    }

    contains(name){
        return this._templateMap.contains(name);
    }

    done(callback){
        this._callback = callback;
        this.doCallback(this);
    }

    doCallback(tmo){
        if(tmo._callback !== null && tmo._templateQueueSize === tmo._templateMap.size()){
            var tempCallback = tmo._callback.call();
            tmo._callback = null;
            tempCallback.call();
        }
    }

    load(name,url){
        var obj = this;
        if(!this.contains(name)) {
            this._templateQueueSize ++;
            qwest.get(url).then(function(xhr,response){
                obj.set(name, new Template(response));
                obj.doCallback(obj);
            });
        }else{
            obj.doCallback(obj);
        }
    }

}

var templates = new TemplateManager();

/* jshint esversion: 6 */

class EventWrapper{

    constructor(event){
        this._event = event;
        if(this._event.type.toLowerCase() == "dragstart"){
            this._event.dataTransfer.setData('text/plain', null);
        }
    }

    preventDefault(){
        this._event.preventDefault();
    }

    getOffsetX(){
        return this._event.offsetX;
    }

    getOffsetY(){
        return this._event.offsetY;
    }

    getClientX(){
        return this._event.clientX;
    }

    getClientY(){
        return this._event.clientY;
    }

    getTarget(){
        return ElementMapper.map(this._event.target);
    }

}

/* jshint esversion: 6 */

class EventMapper{

    constructor(){
        this._listeners = new coreutil.Map();
        this._beforeListeners = new coreutil.Map();
        this._afterListeners = new coreutil.Map();
    }

    attach(element,eventType,eventName,suffixedEventName){
        element.attachEvent(eventType, function(event) { events.trigger(suffixedEventName,eventName,event); });
    }

    listen(eventName,handlerObject,handlerFunction){
        eventName = eventName + "_" + this.resolveIdSuffix(handlerObject);
        if(!this._listeners.exists(eventName)){
            this._listeners.set(eventName,new coreutil.List());
        }
        var objectFunction = new coreutil.ObjectFunction(handlerObject,handlerFunction);
        this._listeners.get(eventName).add(objectFunction);
    }

    resolveIdSuffix(handlerObject){
        if(handlerObject.getIdSuffix !== undefined){
            return handlerObject.getIdSuffix();
        }
        if(handlerObject.getComponent !== undefined){
            return handlerObject.getComponent().getIdSuffix();
        }
        console.error("Unable to register event as the handler object is neither a component nor exposes any via getComponent");
        return null;
    }

    listenBefore(eventName,handlerObject,handlerFunction){
        if(!this._beforeListeners.exists(eventName)){
            this._beforeListeners.set(eventName,new coreutil.List());
        }
        var objectFunction = new coreutil.ObjectFunction(handlerObject,handlerFunction);
        this._beforeListeners.get(eventName).add(objectFunction);
    }

    listenAfter(eventName,handlerObject,handlerFunction){
        if(!this._afterListeners.exists(eventName)){
            this._afterListeners.set(eventName,new coreutil.List());
        }
        this._afterListeners.get(eventName).add(new coreutil.ObjectFunction(handlerObject,handlerFunction));
    }

    trigger(suffixedEventName, eventName, event){
        this.handleBefore(eventName, event);
        if(this._listeners.exists(suffixedEventName)){
            var currentListeners = new coreutil.List();
            this._listeners.get(suffixedEventName).forEach(function(value, parent){
                currentListeners.add(value);
                return true;
            },this);
            currentListeners.forEach(function(value, parent){
                value.call(new EventWrapper(event));
                return true;
            },this);
        }
        this.handleAfter(eventName, event);
    }

    handleBefore(eventName, event){
        this.handleGlobal(this._beforeListeners,eventName, event);
    }

    handleAfter(eventName, event){
        this.handleGlobal(this._afterListeners,eventName, event);
    }

    handleGlobal(listeners, eventName, event){
        if(listeners.exists(eventName)){
            var currentListeners = new coreutil.List();
            listeners.get(eventName).forEach(function(value,parent){
                currentListeners.add(value);
                return true;
            },this);
            currentListeners.forEach(function(value,parent){
                value.call(new EventWrapper(event));
                return true;
            },this);
        }
    }
}

var events = new EventMapper();

/* jshint esversion: 6 */

class Component {

    constructor(templateName) {
        var template = null;
        if(typeof templateName === "string"){
            template = templates.get(templateName);
        }
        this._mapperMap = new coreutil.Map();
        this._idSuffix = componentCounter++;
        this._rootElement = null;
        this._events = new coreutil.List();
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
        new xmlparser.DomTree(template.getTemplateSource(),this).load();
    }

    getRootElement() {
        return this._rootElement;
    }

    getIdSuffix(){
        return this._idSuffix;
    }

    idAttributeWithSuffix (id) {
        if(this._idSuffix !== null) {
            return id + "-" + this._idSuffix;
        }
        return id;
    }

    elementCreated (xmlElement, parentWrapper) {
        var element = ElementMapper.map(xmlElement, parentWrapper);

        this.addToElementIdMap(xmlElement,element);
        this.registerElementEvents(xmlElement,element);

        if(this._rootElement === null && element !== null) {
            this._rootElement = element;
        }

        return element;
    }

    registerElementEvents(xmlElement,element){
        this._events.forEach(function(eventType,parent){
            if(!(xmlElement instanceof xmlparser.XmlElement)) {
                return true;
            }
            if(xmlElement.containsAttribute(eventType)) {
                var eventName = xmlElement.getAttribute(eventType).getValue();
                var suffixedEventName = eventName + "_" + parent._idSuffix;
                events.attach(element,eventType,eventName,suffixedEventName);
            }
            return true;
        },this);
    }

    addToElementIdMap(xmlElement,element) {
        var id = null;
        if(!(xmlElement instanceof xmlparser.XmlElement)) {
            return;
        }
        if(xmlElement.containsAttribute("id")) {
            var idAttribute = xmlElement.getAttribute("id");
            id = idAttribute.getValue();
            idAttribute.setValue(this.idAttributeWithSuffix(idAttribute.getValue()));
        }

        if(id !== null) {
            this._mapperMap.set(id,element);
        }
    }

    get(id) {
        return this._mapperMap.get(id);
    }

    set (id, value) {
        this._mapperMap.get(id).set(value);
    }

    clearChildren(id){
        this._mapperMap.get(id).clear();
    }

    setChild (id, value) {
        this._mapperMap.get(id).setChild(value);
    }

    addChild (id, value) {
        this._mapperMap.get(id).addChild(value);
    }

    prependChild (id, value) {
        this._mapperMap.get(id).prependChild(value);
    }

}

var componentCounter = 0;

/* jshint esversion: 6 */

class HTML{

    static custom(elementName){
        var xmlElement = new xmlparser.XmlElement(elementName);
        return ElementMapper.map(xmlElement);
    }

    static applyStyles(element,classValue,styleValue){
        if(classValue !== null){
            element.setAttribute("class",classValue);
        }
        if(styleValue !== null){
            element.setAttribute("style",styleValue);
        }
    }

    static a(name,href,classValue,styleValue){
        var element = HTML.custom("a");
        element.addChild(name);
        element.setAttribute("href",href);
        HTML.applyStyles(element,classValue,styleValue);
        return element;
    }
}

/* jshint esversion: 6 */

class InputMapping{

    constructor(model,validator) {
        this._model = model;
        this._validator = validator;
        this._pullers = new coreutil.List();
        this._pushers = new coreutil.List();
    }

    and(field){
        return this.to(field);
    }

    to(field) {
        var fieldDestination = this._model;
        var validator = this._validator;

        var puller = function(event) {
            if (field instanceof AbstractInputElement) {
                var fieldValue = field.getValue();
                if (field instanceof RadioInputElement) {
                    if(field.isChecked()){
                        coreutil.PropertyAccessor.setValue(fieldDestination,field.getName(),field.getValue());
                    }
                } else if (field instanceof CheckboxInputElement) {
                    if(field.isChecked()) {
                        coreutil.PropertyAccessor.setValue(fieldDestination,field.getName(),field.getValue());
                    } else {
                        coreutil.PropertyAccessor.setValue(fieldDestination,field.getName(),null);
                    }
                } else {
                    coreutil.PropertyAccessor.setValue(fieldDestination,field.getName(),field.getValue());
                }
            }
            if(validator !== undefined  && validator !== null){
                validator.validate(field);
            }
        };
        field.attachEvent("onchange",puller);
        field.attachEvent("onkeyup",puller);
        puller.call();

        var pusher = function() {
            var value = coreutil.PropertyAccessor.getValue(fieldDestination,field.getName());
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

    pull(){
        this._pullers.forEach(function(value,parent) {
            value.call(parent);
            return true;
        },this);
    }

    push(){
        this._pushers.forEach(function(value,parent) {
            value.call(parent);
            return true;
        },this);
    }
}

/* jshint esversion: 6 */

class InputMapper {

    constructor() {
        this._inputMappingList = new coreutil.List();
    }

    link(model,schema){
        var inputMapping = new InputMapping(model,schema);
        this._inputMappingList.add(inputMapping);
        return inputMapping;
    }

    pullAll(){
        this._inputMappingList.forEach(function(mapping,parent) {
            mapping.pull();
            return true;
        },this);
    }

    pushAll(){
        this._inputMappingList.forEach(function(mapping,parent) {
            mapping.push();
            return true;
        },this);
    }
}

var inputs = new InputMapper();

/* jshint esversion: 6 */

class URL{

    constructor(value){
        this._protocol = null;
        this._host = null;
        this._port = null;
        this._pathList = new coreutil.List();
        this._parameterMap = new coreutil.Map();
        if(value === null){
            return;
        }
        var remaining = this.determineProtocol(value);
        if(remaining === null){
            return;
        }
        if(this._protocol !== null){
            remaining = this.determineHost(remaining);
        }
        if(remaining === null){
            return;
        }
        if(this._host !== null){
            remaining = this.determinePort(remaining);
        }
        if(remaining === null){
            return;
        }
        remaining = this.determinePath(remaining);
        if(remaining === null){
            return;
        }
        this.determineParameters(remaining);
    }

    getProtocol(){
        return this._protocol;
    }

    getHost(){
        return this._host;
    }

    getPort(){
        return this._port;
    }

    getPathList(){
        return this._pathList;
    }

    getParameter(key){
        return this._parameterMap.get(key);
    }

    setParameter(key,value){
        this._parameterMap.set(key,value);
    }

    determineProtocol(value){
        if(!value.includes("//")){
            return value;
        }
        var parts = value.split("//");
        if(parts[0].includes("/")){
            return value;
        }
        this._protocol = parts[0];
        if(parts.length==1){
            return null;
        }
        return value.replace(parts[0] + "//","");
    }

    determineHost(value){
        var parts = value.split("/");
        var hostPart = parts[0];
        if(hostPart.includes(":")){
            hostPart = hostPart.split(":")[0];
        }
        this._host = hostPart;
        if(parts.length > 1){
            return value.replace(hostPart,"");
        }
        return null;
    }

    determinePort(value){
        if(!value.startsWith(":")){
            return value;
        }
        var portPart = value.split("/")[0].substring(1);
        this._port = portPart;
        return value.replace(":" + portPart,"");
    }

    determinePath(value){
        var remaining = null;
        if(value.includes("?")){
            var parts = value.split("?");
            if(parts.length > 1){
                remaining = value.replace(parts[0] + "?","");
            }
            value = parts[0];
        }
        var pathParts = new coreutil.List(value.split("/"));
        pathParts.forEach(function(value,parent){
            if(parent._pathList === null){
                parent._pathList = new coreutil.List();
            }
            parent._pathList.add(decodeURI(value));
            return true;
        },this);
        return remaining;
    }

    determineParameters(value){
        var partList = new coreutil.List(value.split("&"));
        var parameterMap = new coreutil.Map();
        partList.forEach(function(value,parent){
            var keyValue = value.split("=");
            if(keyValue.length >= 2){
                parameterMap.set(decodeURI(keyValue[0]),decodeURI(keyValue[1]));
            }
            return true;
        },this);
        this._parameterMap = parameterMap;
    }

    toString(){
        var value = "";
        if(this._protocol !== null){
            value = value + this._protocol + "//";
        }
        if(this._host !== null){
            value = value + this._host;
        }
        if(this._port !== null){
            value = value + ":" + this._port;
        }

        var firstPathPart = true;
        this._pathList.forEach(function(pathPart,parent){
            if(!firstPathPart){
                value = value + "/";
            }
            firstPathPart = false;
            value = value + pathPart;
            return true;
        },this);

        var firstParameter = true;
        this._parameterMap.forEach(function(parameterKey,parameterValue,parent){
            if(firstParameter){
                firstParameter=false;
                value = value + "?";
            }else{
                value = value + "&";
            }
            value = value + encodeURI(parameterKey) + "=" + encodeURI(parameterValue);
        },this);
        return value;
    }

}

exports.AbstractInputElement = AbstractInputElement;
exports.BaseElement = BaseElement;
exports.CheckboxInputElement = CheckboxInputElement;
exports.ElementMapper = ElementMapper;
exports.PasswordInputElement = PasswordInputElement;
exports.RadioInputElement = RadioInputElement;
exports.SimpleElement = SimpleElement;
exports.TextareaInputElement = TextareaInputElement;
exports.TextInputElement = TextInputElement;
exports.TextnodeElement = TextnodeElement;
exports.Component = Component;
exports.EventMapper = EventMapper;
exports.events = events;
exports.EventWrapper = EventWrapper;
exports.HTML = HTML;
exports.InputMapper = InputMapper;
exports.inputs = inputs;
exports.InputMapping = InputMapping;
exports.Template = Template;
exports.TemplateManager = TemplateManager;
exports.templates = templates;
exports.URL = URL;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0LmpzIiwic291cmNlcyI6WyIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9iYXNlRWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2Fic3RyYWN0SW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvY2hlY2tib3hJbnB1dEVsZW1lbnQuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9yYWRpb0lucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL3Bhc3N3b3JkSW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvdGV4dElucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL3RleHRhcmVhSW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvdGV4dG5vZGVFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvc2ltcGxlRWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2VsZW1lbnRNYXBwZXIuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvdGVtcGxhdGUvdGVtcGxhdGUuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvdGVtcGxhdGUvdGVtcGxhdGVNYW5hZ2VyLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2V2ZW50L2V2ZW50V3JhcHBlci5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9ldmVudC9ldmVudE1hbmFnZXIuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvY29tcG9uZW50L2NvbXBvbmVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9odG1sL2h0bWwuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvaW5wdXQvaW5wdXRNYXBwaW5nLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2lucHV0L2lucHV0TWFwcGVyLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L3V0aWwvdXJsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmltcG9ydCB7WG1sRWxlbWVudH0gZnJvbSBcInhtbHBhcnNlclwiO1xyXG5cclxuLyoqXHJcbiAqIEEgYmFzZSBjbGFzcyBmb3IgZW5jbG9zaW5nIGFuIEhUTUxFbGVtZW50XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFzZUVsZW1lbnQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1htbEVsZW1lbnR8c3RyaW5nfEhUTUxFbGVtZW50fSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtYbWxFbGVtZW50fSBwYXJlbnRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodmFsdWUsIHBhcmVudCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBYbWxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLmNyZWF0ZUZyb21YbWxFbGVtZW50KHZhbHVlLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnJlY29nbml6ZWQgdmFsdWUgZm9yIEVsZW1lbnRcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGJyb3dzZXIgRWxlbWVudCBmcm9tIHRoZSBYbWxFbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtYbWxFbGVtZW50fSB4bWxFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge1htbEVsZW1lbnR9IHBhcmVudEVsZW1lbnRcclxuICAgICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcm9tWG1sRWxlbWVudCh4bWxFbGVtZW50LCBwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIGlmKHhtbEVsZW1lbnQuZ2V0TmFtZXNwYWNlKCkpe1xyXG4gICAgICAgICAgICAvLyBOb3QgY29tcGxldGVcclxuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJodHRwOi8vbnN1cmlcIix4bWxFbGVtZW50LmdldEZ1bGxOYW1lKCkpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh4bWxFbGVtZW50LmdldE5hbWUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHBhcmVudEVsZW1lbnQgJiYgcGFyZW50RWxlbWVudC5nZXRNYXBwZWRFbGVtZW50KCkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcGFyZW50RWxlbWVudC5nZXRNYXBwZWRFbGVtZW50KCkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhtbEVsZW1lbnQuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24oa2V5LHZhbHVlKXtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LHZhbHVlLmdldFZhbHVlKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaCBhIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IGluIHRoZSBlbmNsb3NlZCBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuY3Rpb25QYXJhbVxyXG4gICAgICovXHJcbiAgICBhdHRhY2hFdmVudChldmVudFR5cGUsIGZ1bmN0aW9uUGFyYW0pIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50W2V2ZW50VHlwZV0gPSBmdW5jdGlvblBhcmFtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBlbmNsb3NlZCBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIGdldE1hcHBlZEVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RnVsbE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUb3AoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Qm90dG9tKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExlZnQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJpZ2h0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0V2lkdGgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIZWlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QXR0cmlidXRlKGtleSx2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGtleSx2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXR0cmlidXRlKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmdldEF0dHJpYnV0ZShrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRhaW5zQXR0cmlidXRlKGtleSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuaGFzQXR0cmlidXRlKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQXR0cmlidXRlKGtleSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdHlsZShrZXksdmFsdWUpe1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGVba2V5XSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFN0eWxlKGtleSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuc3R5bGVba2V5XTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVTdHlsZShrZXkpe1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGVba2V5XSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGlucHV0KXtcclxuICAgICAgICBpZih0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlIGVsZW1lbnQgaGFzIG5vIHBhcmVudCwgY2FuIG5vdCBzd2FwIGl0IGZvciB2YWx1ZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIEJhc2VFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoaW5wdXQuZ2V0TWFwcGVkRWxlbWVudCgpLHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlucHV0ICYmIHR5cGVvZiBpbnB1dC5nZXRSb290RWxlbWVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoaW5wdXQuZ2V0Um9vdEVsZW1lbnQoKS5nZXRNYXBwZWRFbGVtZW50KCksdGhpcy5fZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBpbnB1dC5nZXRSb290RWxlbWVudCgpLmdldE1hcHBlZEVsZW1lbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlucHV0KSx0aGlzLl9lbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIFRleHQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChpbnB1dCx0aGlzLl9lbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChpbnB1dCx0aGlzLl9lbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHdoaWxlICh0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRDaGlsZChpbnB1dCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZChpbnB1dCkge1xyXG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEJhc2VFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQuZ2V0TWFwcGVkRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXQgJiYgdHlwZW9mIGlucHV0LmdldFJvb3RFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChpbnB1dC5nZXRSb290RWxlbWVudCgpLmdldE1hcHBlZEVsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaW5wdXQpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBUZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGVuZENoaWxkKGlucHV0KSB7XHJcbiAgICAgICAgaWYodGhpcy5fZWxlbWVudC5maXJzdENoaWxkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBCYXNlRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dC5nZXRNYXBwZWRFbGVtZW50KCksdGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXQgJiYgdHlwZW9mIGlucHV0LmdldFJvb3RFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQuZ2V0Um9vdEVsZW1lbnQoKS5nZXRNYXBwZWRFbGVtZW50KCksdGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaW5wdXQpLHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgVGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dCx0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQsdGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5pbXBvcnQge0Jhc2VFbGVtZW50fSBmcm9tIFwiLi9iYXNlRWxlbWVudFwiO1xyXG5cclxuLyoqXHJcbiAqIFNoYXJlZCBwcm9wZXJ0aWVzIG9mIGlucHV0IGVsZW1lbnRzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RJbnB1dEVsZW1lbnQgZXh0ZW5kcyBCYXNlRWxlbWVudHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge1htbEVsZW1lbnR9IHBhcmVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIodmFsdWUsIHBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dHMgbmFtZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB2YWx1ZSBvZiBpbnB1dHMgbmFtZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBzZXROYW1lKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5uYW1lID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmltcG9ydCB7QWJzdHJhY3RJbnB1dEVsZW1lbnR9IGZyb20gXCIuL2Fic3RyYWN0SW5wdXRFbGVtZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hJbnB1dEVsZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdElucHV0RWxlbWVudHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50LCBwYXJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENoZWNrZWQodmFsdWUpe1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQ2hlY2tlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmNoZWNrZWQ7XHJcbiAgICB9XHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4vYWJzdHJhY3RJbnB1dEVsZW1lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSYWRpb0lucHV0RWxlbWVudCBleHRlbmRzIEFic3RyYWN0SW5wdXRFbGVtZW50e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2hlY2tlZCh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jaGVja2VkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNDaGVja2VkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuY2hlY2tlZDtcclxuICAgIH1cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5pbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi9hYnN0cmFjdElucHV0RWxlbWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhc3N3b3JkSW5wdXRFbGVtZW50IGV4dGVuZHMgQWJzdHJhY3RJbnB1dEVsZW1lbnR7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcGFyZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4vYWJzdHJhY3RJbnB1dEVsZW1lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0SW5wdXRFbGVtZW50IGV4dGVuZHMgQWJzdHJhY3RJbnB1dEVsZW1lbnR7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcGFyZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4vYWJzdHJhY3RJbnB1dEVsZW1lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0YXJlYUlucHV0RWxlbWVudCBleHRlbmRzIEFic3RyYWN0SW5wdXRFbGVtZW50e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW5uZXJIVE1MKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgfVxyXG5cclxuICAgIHNldElubmVySFRNTCh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZChpbnB1dCkge1xyXG4gICAgICAgIHN1cGVyLmFkZENoaWxkKGlucHV0KTtcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuZ2V0SW5uZXJIVE1MKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBlbmRDaGlsZChpbnB1dCkge1xyXG4gICAgICAgIHN1cGVyLnByZXBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmdldElubmVySFRNTCgpKTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtYbWxDZGF0YX0gZnJvbSBcInhtbHBhcnNlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRub2RlRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWUsIHBhcmVudCkge1xyXG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgWG1sQ2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHRoaXMuY3JlYXRlRnJvbVhtbENkYXRhKHZhbHVlLCBwYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGcm9tWG1sQ2RhdGEoY2RhdGFFbGVtZW50LCBwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjZGF0YUVsZW1lbnQuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgaWYocGFyZW50RWxlbWVudCAhPT0gbnVsbCAmJiBwYXJlbnRFbGVtZW50LmdldE1hcHBlZEVsZW1lbnQoKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBwYXJlbnRFbGVtZW50LmdldE1hcHBlZEVsZW1lbnQoKS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl90ZXh0bm9kZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0bm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRNYXBwZWRFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0bm9kZTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtCYXNlRWxlbWVudH0gZnJvbSBcIi4vYmFzZUVsZW1lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaW1wbGVFbGVtZW50IGV4dGVuZHMgQmFzZUVsZW1lbnR7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbm5lckhUTUwoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5uZXJIVE1MKHZhbHVlKXtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5pbXBvcnQge1htbENkYXRhLFhtbEVsZW1lbnR9IGZyb20gXCJ4bWxwYXJzZXJcIjtcclxuaW1wb3J0IHtSYWRpb0lucHV0RWxlbWVudH0gZnJvbSBcIi4vcmFkaW9JbnB1dEVsZW1lbnRcIjtcclxuaW1wb3J0IHtDaGVja2JveElucHV0RWxlbWVudH0gZnJvbSBcIi4vY2hlY2tib3hJbnB1dEVsZW1lbnRcIjtcclxuaW1wb3J0IHtQYXNzd29yZElucHV0RWxlbWVudH0gZnJvbSBcIi4vcGFzc3dvcmRJbnB1dEVsZW1lbnRcIjtcclxuaW1wb3J0IHtUZXh0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi90ZXh0SW5wdXRFbGVtZW50XCI7XHJcbmltcG9ydCB7VGV4dGFyZWFJbnB1dEVsZW1lbnR9IGZyb20gXCIuL3RleHRhcmVhSW5wdXRFbGVtZW50XCI7XHJcbmltcG9ydCB7VGV4dG5vZGVFbGVtZW50fSBmcm9tIFwiLi90ZXh0bm9kZUVsZW1lbnRcIjtcclxuaW1wb3J0IHtTaW1wbGVFbGVtZW50fSBmcm9tIFwiLi9zaW1wbGVFbGVtZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRWxlbWVudE1hcHBlciB7XHJcblxyXG4gICAgc3RhdGljIG1hcChpbnB1dCwgcGFyZW50KSB7XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9SYWRpbyhpbnB1dCkpeyByZXR1cm4gbmV3IFJhZGlvSW5wdXRFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9DaGVja2JveChpbnB1dCkpeyByZXR1cm4gbmV3IENoZWNrYm94SW5wdXRFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9QYXNzd29yZChpbnB1dCkpeyByZXR1cm4gbmV3IFBhc3N3b3JkSW5wdXRFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9TdWJtaXQoaW5wdXQpKXsgcmV0dXJuIG5ldyBUZXh0SW5wdXRFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9UZXh0YXJlYShpbnB1dCkpeyByZXR1cm4gbmV3IFRleHRhcmVhSW5wdXRFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9UZXh0KGlucHV0KSl7IHJldHVybiBuZXcgVGV4dElucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvVGV4dG5vZGUoaW5wdXQpKXsgcmV0dXJuIG5ldyBUZXh0bm9kZUVsZW1lbnQoaW5wdXQsIHBhcmVudCk7IH1cclxuICAgICAgICBpZihFbGVtZW50TWFwcGVyLm1hcHNUb1NpbXBsZShpbnB1dCkpeyByZXR1cm4gbmV3IFNpbXBsZUVsZW1lbnQoaW5wdXQsIHBhcmVudCk7IH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIk1hcHBpbmcgdG8gc2ltcGxlIGJ5IGRlZmF1bHQgXCIgKyBpbnB1dCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTaW1wbGVFbGVtZW50KGlucHV0LCBwYXJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXBzVG9SYWRpbyhpbnB1dCl7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcInJhZGlvXCIpIHx8XHJcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQgJiYgaW5wdXQuZ2V0TmFtZSgpID09PSBcImlucHV0XCIgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS5nZXRWYWx1ZSgpID09PSBcInJhZGlvXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXBzVG9DaGVja2JveChpbnB1dCl7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcImNoZWNrYm94XCIpIHx8XHJcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQgJiYgaW5wdXQuZ2V0TmFtZSgpID09PSBcImlucHV0XCIgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS5nZXRWYWx1ZSgpID09PSBcImNoZWNrYm94XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXBzVG9QYXNzd29yZChpbnB1dCl7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcInBhc3N3b3JkXCIpIHx8XHJcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQgJiYgaW5wdXQuZ2V0TmFtZSgpID09PSBcImlucHV0XCIgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS5nZXRWYWx1ZSgpID09PSBcInBhc3N3b3JkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXBzVG9TdWJtaXQoaW5wdXQpe1xyXG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGlucHV0LnR5cGUgPT0gXCJzdWJtaXRcIikgfHxcclxuICAgICAgICAgICAgKGlucHV0IGluc3RhbmNlb2YgWG1sRWxlbWVudCAmJiBpbnB1dC5nZXROYW1lKCkgPT09IFwiaW5wdXRcIiAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLmdldFZhbHVlKCkgPT09IFwic3VibWl0XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXBzVG9UZXh0KGlucHV0KXtcclxuICAgICAgICByZXR1cm4gKGlucHV0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBpbnB1dC50eXBlID09IFwidGV4dFwiKSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJpbnB1dFwiICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikuZ2V0VmFsdWUoKSA9PT0gXCJ0ZXh0XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXBzVG9UZXh0bm9kZShpbnB1dCl7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIE5vZGUgJiYgaW5wdXQubm9kZVR5cGUgPT09IFwiVEVYVF9OT0RFXCIpIHx8XHJcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbENkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvVGV4dGFyZWEoaW5wdXQpe1xyXG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJ0ZXh0YXJlYVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvU2ltcGxlKGlucHV0KXtcclxuICAgICAgICByZXR1cm4gKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8XHJcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZVNvdXJjZSl7XHJcbiAgICAgICAgdGhpcy5fdGVtcGxhdGVTb3VyY2UgPSB0ZW1wbGF0ZVNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZW1wbGF0ZVNvdXJjZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZVNvdXJjZTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtNYXB9IGZyb20gXCJjb3JldXRpbFwiO1xyXG5pbXBvcnQge1RlbXBsYXRlfSBmcm9tIFwiLi90ZW1wbGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlTWFuYWdlcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlUXVldWVTaXplID0gMDtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KG5hbWUsdGVtcGxhdGUpe1xyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwLnNldChuYW1lLCB0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KG5hbWUpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZU1hcC5nZXQobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGFpbnMobmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlTWFwLmNvbnRhaW5zKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvbmUoY2FsbGJhY2spe1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5kb0NhbGxiYWNrKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvQ2FsbGJhY2sodG1vKXtcclxuICAgICAgICBpZih0bW8uX2NhbGxiYWNrICE9PSBudWxsICYmIHRtby5fdGVtcGxhdGVRdWV1ZVNpemUgPT09IHRtby5fdGVtcGxhdGVNYXAuc2l6ZSgpKXtcclxuICAgICAgICAgICAgdmFyIHRlbXBDYWxsYmFjayA9IHRtby5fY2FsbGJhY2suY2FsbCgpO1xyXG4gICAgICAgICAgICB0bW8uX2NhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgdGVtcENhbGxiYWNrLmNhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChuYW1lLHVybCl7XHJcbiAgICAgICAgdmFyIG9iaiA9IHRoaXM7XHJcbiAgICAgICAgaWYoIXRoaXMuY29udGFpbnMobmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVRdWV1ZVNpemUgKys7XHJcbiAgICAgICAgICAgIHF3ZXN0LmdldCh1cmwpLnRoZW4oZnVuY3Rpb24oeGhyLHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIG9iai5zZXQobmFtZSwgbmV3IFRlbXBsYXRlKHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICBvYmouZG9DYWxsYmFjayhvYmopO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgb2JqLmRvQ2FsbGJhY2sob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgdmFyIHRlbXBsYXRlcyA9IG5ldyBUZW1wbGF0ZU1hbmFnZXIoKTtcclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtFbGVtZW50TWFwcGVyfSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50TWFwcGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRXcmFwcGVye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9ldmVudCA9IGV2ZW50O1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50LnR5cGUudG9Mb3dlckNhc2UoKSA9PSBcImRyYWdzdGFydFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmVudERlZmF1bHQoKXtcclxuICAgICAgICB0aGlzLl9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9mZnNldFgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQub2Zmc2V0WDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPZmZzZXRZKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50Lm9mZnNldFk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2xpZW50WCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudC5jbGllbnRYO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENsaWVudFkoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQuY2xpZW50WTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUYXJnZXQoKXtcclxuICAgICAgICByZXR1cm4gRWxlbWVudE1hcHBlci5tYXAodGhpcy5fZXZlbnQudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtMaXN0LE1hcCxPYmplY3RGdW5jdGlvbn0gZnJvbSBcImNvcmV1dGlsXCI7XHJcbmltcG9ydCB7RXZlbnRXcmFwcGVyfSBmcm9tIFwiLi9ldmVudFdyYXBwZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hcHBlcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLl9iZWZvcmVMaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5fYWZ0ZXJMaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoKGVsZW1lbnQsZXZlbnRUeXBlLGV2ZW50TmFtZSxzdWZmaXhlZEV2ZW50TmFtZSl7XHJcbiAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudChldmVudFR5cGUsIGZ1bmN0aW9uKGV2ZW50KSB7IGV2ZW50cy50cmlnZ2VyKHN1ZmZpeGVkRXZlbnROYW1lLGV2ZW50TmFtZSxldmVudCk7IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlbihldmVudE5hbWUsaGFuZGxlck9iamVjdCxoYW5kbGVyRnVuY3Rpb24pe1xyXG4gICAgICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZSArIFwiX1wiICsgdGhpcy5yZXNvbHZlSWRTdWZmaXgoaGFuZGxlck9iamVjdCk7XHJcbiAgICAgICAgaWYoIXRoaXMuX2xpc3RlbmVycy5leGlzdHMoZXZlbnROYW1lKSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zZXQoZXZlbnROYW1lLG5ldyBMaXN0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgb2JqZWN0RnVuY3Rpb24gPSBuZXcgT2JqZWN0RnVuY3Rpb24oaGFuZGxlck9iamVjdCxoYW5kbGVyRnVuY3Rpb24pO1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5nZXQoZXZlbnROYW1lKS5hZGQob2JqZWN0RnVuY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVJZFN1ZmZpeChoYW5kbGVyT2JqZWN0KXtcclxuICAgICAgICBpZihoYW5kbGVyT2JqZWN0LmdldElkU3VmZml4ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlck9iamVjdC5nZXRJZFN1ZmZpeCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoYW5kbGVyT2JqZWN0LmdldENvbXBvbmVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJPYmplY3QuZ2V0Q29tcG9uZW50KCkuZ2V0SWRTdWZmaXgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byByZWdpc3RlciBldmVudCBhcyB0aGUgaGFuZGxlciBvYmplY3QgaXMgbmVpdGhlciBhIGNvbXBvbmVudCBub3IgZXhwb3NlcyBhbnkgdmlhIGdldENvbXBvbmVudFwiKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW5CZWZvcmUoZXZlbnROYW1lLGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKXtcclxuICAgICAgICBpZighdGhpcy5fYmVmb3JlTGlzdGVuZXJzLmV4aXN0cyhldmVudE5hbWUpKXtcclxuICAgICAgICAgICAgdGhpcy5fYmVmb3JlTGlzdGVuZXJzLnNldChldmVudE5hbWUsbmV3IExpc3QoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBvYmplY3RGdW5jdGlvbiA9IG5ldyBPYmplY3RGdW5jdGlvbihoYW5kbGVyT2JqZWN0LGhhbmRsZXJGdW5jdGlvbik7XHJcbiAgICAgICAgdGhpcy5fYmVmb3JlTGlzdGVuZXJzLmdldChldmVudE5hbWUpLmFkZChvYmplY3RGdW5jdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgbGlzdGVuQWZ0ZXIoZXZlbnROYW1lLGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKXtcclxuICAgICAgICBpZighdGhpcy5fYWZ0ZXJMaXN0ZW5lcnMuZXhpc3RzKGV2ZW50TmFtZSkpe1xyXG4gICAgICAgICAgICB0aGlzLl9hZnRlckxpc3RlbmVycy5zZXQoZXZlbnROYW1lLG5ldyBMaXN0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hZnRlckxpc3RlbmVycy5nZXQoZXZlbnROYW1lKS5hZGQobmV3IE9iamVjdEZ1bmN0aW9uKGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJpZ2dlcihzdWZmaXhlZEV2ZW50TmFtZSwgZXZlbnROYW1lLCBldmVudCl7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVCZWZvcmUoZXZlbnROYW1lLCBldmVudCk7XHJcbiAgICAgICAgaWYodGhpcy5fbGlzdGVuZXJzLmV4aXN0cyhzdWZmaXhlZEV2ZW50TmFtZSkpe1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudExpc3RlbmVycyA9IG5ldyBMaXN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5nZXQoc3VmZml4ZWRFdmVudE5hbWUpLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIHBhcmVudCl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGlzdGVuZXJzLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSx0aGlzKTtcclxuICAgICAgICAgICAgY3VycmVudExpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBwYXJlbnQpe1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuY2FsbChuZXcgRXZlbnRXcmFwcGVyKGV2ZW50KSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSx0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5oYW5kbGVBZnRlcihldmVudE5hbWUsIGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVCZWZvcmUoZXZlbnROYW1lLCBldmVudCl7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVHbG9iYWwodGhpcy5fYmVmb3JlTGlzdGVuZXJzLGV2ZW50TmFtZSwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUFmdGVyKGV2ZW50TmFtZSwgZXZlbnQpe1xyXG4gICAgICAgIHRoaXMuaGFuZGxlR2xvYmFsKHRoaXMuX2FmdGVyTGlzdGVuZXJzLGV2ZW50TmFtZSwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUdsb2JhbChsaXN0ZW5lcnMsIGV2ZW50TmFtZSwgZXZlbnQpe1xyXG4gICAgICAgIGlmKGxpc3RlbmVycy5leGlzdHMoZXZlbnROYW1lKSl7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TGlzdGVuZXJzID0gbmV3IExpc3QoKTtcclxuICAgICAgICAgICAgbGlzdGVuZXJzLmdldChldmVudE5hbWUpLmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LHRoaXMpO1xyXG4gICAgICAgICAgICBjdXJyZW50TGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmNhbGwobmV3IEV2ZW50V3JhcHBlcihldmVudCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIGV2ZW50cyA9IG5ldyBFdmVudE1hcHBlcigpO1xyXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXHJcblxyXG5pbXBvcnQge01hcCxMaXN0fSBmcm9tIFwiY29yZXV0aWxcIjtcclxuaW1wb3J0IHtEb21UcmVlLFhtbEVsZW1lbnR9IGZyb20gXCJ4bWxwYXJzZXJcIjtcclxuaW1wb3J0IHtFbGVtZW50TWFwcGVyfSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50TWFwcGVyXCI7XHJcbmltcG9ydCB7dGVtcGxhdGVzfSBmcm9tIFwiLi4vdGVtcGxhdGUvdGVtcGxhdGVNYW5hZ2VyXCI7XHJcbmltcG9ydCB7ZXZlbnRzfSBmcm9tIFwiLi4vZXZlbnQvZXZlbnRNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZU5hbWUpIHtcclxuICAgICAgICB2YXIgdGVtcGxhdGUgPSBudWxsO1xyXG4gICAgICAgIGlmKHR5cGVvZiB0ZW1wbGF0ZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlcy5nZXQodGVtcGxhdGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbWFwcGVyTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuX2lkU3VmZml4ID0gY29tcG9uZW50Q291bnRlcisrO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9ldmVudHMgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbmNsaWNrXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbm1vdXNlZG93blwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25tb3VzZXVwXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbmRyYWdcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcIm9uZHJhZ2VuZFwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25kcmFnc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcIm9uZHJvcFwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25kcmFnb3ZlclwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25tb3VzZW1vdmVcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcIm9ubW91c2VvdmVyXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbm1vdXNlb3V0XCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbm1vdXNlZW50ZXJcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcInRvdWNoc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcInRvdWNoZW5kXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJ0b3VjaG1vdmVcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcInRvdWNoY2FuY2VsXCIpO1xyXG4gICAgICAgIG5ldyBEb21UcmVlKHRlbXBsYXRlLmdldFRlbXBsYXRlU291cmNlKCksdGhpcykubG9hZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJvb3RFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290RWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZFN1ZmZpeCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZFN1ZmZpeDtcclxuICAgIH1cclxuXHJcbiAgICBpZEF0dHJpYnV0ZVdpdGhTdWZmaXggKGlkKSB7XHJcbiAgICAgICAgaWYodGhpcy5faWRTdWZmaXggIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkICsgXCItXCIgKyB0aGlzLl9pZFN1ZmZpeDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRDcmVhdGVkICh4bWxFbGVtZW50LCBwYXJlbnRXcmFwcGVyKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBFbGVtZW50TWFwcGVyLm1hcCh4bWxFbGVtZW50LCBwYXJlbnRXcmFwcGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUb0VsZW1lbnRJZE1hcCh4bWxFbGVtZW50LGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50RXZlbnRzKHhtbEVsZW1lbnQsZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3Jvb3RFbGVtZW50ID09PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJFbGVtZW50RXZlbnRzKHhtbEVsZW1lbnQsZWxlbWVudCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnRUeXBlLHBhcmVudCl7XHJcbiAgICAgICAgICAgIGlmKCEoeG1sRWxlbWVudCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih4bWxFbGVtZW50LmNvbnRhaW5zQXR0cmlidXRlKGV2ZW50VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSB4bWxFbGVtZW50LmdldEF0dHJpYnV0ZShldmVudFR5cGUpLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VmZml4ZWRFdmVudE5hbWUgPSBldmVudE5hbWUgKyBcIl9cIiArIHBhcmVudC5faWRTdWZmaXg7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuYXR0YWNoKGVsZW1lbnQsZXZlbnRUeXBlLGV2ZW50TmFtZSxzdWZmaXhlZEV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUb0VsZW1lbnRJZE1hcCh4bWxFbGVtZW50LGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgaWQgPSBudWxsO1xyXG4gICAgICAgIGlmKCEoeG1sRWxlbWVudCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoeG1sRWxlbWVudC5jb250YWluc0F0dHJpYnV0ZShcImlkXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciBpZEF0dHJpYnV0ZSA9IHhtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIik7XHJcbiAgICAgICAgICAgIGlkID0gaWRBdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgaWRBdHRyaWJ1dGUuc2V0VmFsdWUodGhpcy5pZEF0dHJpYnV0ZVdpdGhTdWZmaXgoaWRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaWQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFwcGVyTWFwLnNldChpZCxlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCAoaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwcGVyTWFwLmdldChpZCkuc2V0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckNoaWxkcmVuKGlkKXtcclxuICAgICAgICB0aGlzLl9tYXBwZXJNYXAuZ2V0KGlkKS5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENoaWxkIChpZCwgdmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9tYXBwZXJNYXAuZ2V0KGlkKS5zZXRDaGlsZCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2hpbGQgKGlkLCB2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpLmFkZENoaWxkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVwZW5kQ2hpbGQgKGlkLCB2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpLnByZXBlbmRDaGlsZCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG52YXIgY29tcG9uZW50Q291bnRlciA9IDA7XHJcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmltcG9ydCB7WG1sRWxlbWVudH0gZnJvbSBcInhtbHBhcnNlclwiO1xyXG5pbXBvcnQge0VsZW1lbnRNYXBwZXJ9IGZyb20gXCIuLi9icm93c2VyL2VsZW1lbnRNYXBwZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIVE1Me1xyXG5cclxuICAgIHN0YXRpYyBjdXN0b20oZWxlbWVudE5hbWUpe1xyXG4gICAgICAgIHZhciB4bWxFbGVtZW50ID0gbmV3IFhtbEVsZW1lbnQoZWxlbWVudE5hbWUpO1xyXG4gICAgICAgIHJldHVybiBFbGVtZW50TWFwcGVyLm1hcCh4bWxFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXBwbHlTdHlsZXMoZWxlbWVudCxjbGFzc1ZhbHVlLHN0eWxlVmFsdWUpe1xyXG4gICAgICAgIGlmKGNsYXNzVmFsdWUgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsY2xhc3NWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlVmFsdWUgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhKG5hbWUsaHJlZixjbGFzc1ZhbHVlLHN0eWxlVmFsdWUpe1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gSFRNTC5jdXN0b20oXCJhXCIpO1xyXG4gICAgICAgIGVsZW1lbnQuYWRkQ2hpbGQobmFtZSk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsaHJlZik7XHJcbiAgICAgICAgSFRNTC5hcHBseVN0eWxlcyhlbGVtZW50LGNsYXNzVmFsdWUsc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbn1cclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtQcm9wZXJ0eUFjY2Vzc29yLExpc3R9IGZyb20gXCJjb3JldXRpbFwiO1xyXG5pbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9hYnN0cmFjdElucHV0RWxlbWVudFwiO1xyXG5pbXBvcnQge1JhZGlvSW5wdXRFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9yYWRpb0lucHV0RWxlbWVudFwiO1xyXG5pbXBvcnQge0NoZWNrYm94SW5wdXRFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9jaGVja2JveElucHV0RWxlbWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0TWFwcGluZ3tcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCx2YWxpZGF0b3IpIHtcclxuICAgICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRvciA9IHZhbGlkYXRvcjtcclxuICAgICAgICB0aGlzLl9wdWxsZXJzID0gbmV3IExpc3QoKTtcclxuICAgICAgICB0aGlzLl9wdXNoZXJzID0gbmV3IExpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmQoZmllbGQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvKGZpZWxkKTtcclxuICAgIH1cclxuXHJcbiAgICB0byhmaWVsZCkge1xyXG4gICAgICAgIHZhciBmaWVsZERlc3RpbmF0aW9uID0gdGhpcy5fbW9kZWw7XHJcbiAgICAgICAgdmFyIHZhbGlkYXRvciA9IHRoaXMuX3ZhbGlkYXRvcjtcclxuXHJcbiAgICAgICAgdmFyIHB1bGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChmaWVsZCBpbnN0YW5jZW9mIEFic3RyYWN0SW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRWYWx1ZSA9IGZpZWxkLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBSYWRpb0lucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGZpZWxkLmlzQ2hlY2tlZCgpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHlBY2Nlc3Nvci5zZXRWYWx1ZShmaWVsZERlc3RpbmF0aW9uLGZpZWxkLmdldE5hbWUoKSxmaWVsZC5nZXRWYWx1ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkIGluc3RhbmNlb2YgQ2hlY2tib3hJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihmaWVsZC5pc0NoZWNrZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eUFjY2Vzc29yLnNldFZhbHVlKGZpZWxkRGVzdGluYXRpb24sZmllbGQuZ2V0TmFtZSgpLGZpZWxkLmdldFZhbHVlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5QWNjZXNzb3Iuc2V0VmFsdWUoZmllbGREZXN0aW5hdGlvbixmaWVsZC5nZXROYW1lKCksbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eUFjY2Vzc29yLnNldFZhbHVlKGZpZWxkRGVzdGluYXRpb24sZmllbGQuZ2V0TmFtZSgpLGZpZWxkLmdldFZhbHVlKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvciAhPT0gdW5kZWZpbmVkICAmJiB2YWxpZGF0b3IgIT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yLnZhbGlkYXRlKGZpZWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZmllbGQuYXR0YWNoRXZlbnQoXCJvbmNoYW5nZVwiLHB1bGxlcik7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIscHVsbGVyKTtcclxuICAgICAgICBwdWxsZXIuY2FsbCgpO1xyXG5cclxuICAgICAgICB2YXIgcHVzaGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IFByb3BlcnR5QWNjZXNzb3IuZ2V0VmFsdWUoZmllbGREZXN0aW5hdGlvbixmaWVsZC5nZXROYW1lKCkpO1xyXG4gICAgICAgICAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBBYnN0cmFjdElucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgUmFkaW9JbnB1dEVsZW1lbnQgfHwgZmllbGQgaW5zdGFuY2VvZiBDaGVja2JveElucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnNldENoZWNrZWQodmFsdWUgPT0gZmllbGQuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHVsbGVycy5hZGQocHVsbGVyKTtcclxuICAgICAgICB0aGlzLl9wdXNoZXJzLmFkZChwdXNoZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWxsKCl7XHJcbiAgICAgICAgdGhpcy5fcHVsbGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLHBhcmVudCkge1xyXG4gICAgICAgICAgICB2YWx1ZS5jYWxsKHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaCgpe1xyXG4gICAgICAgIHRoaXMuX3B1c2hlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpIHtcclxuICAgICAgICAgICAgdmFsdWUuY2FsbChwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cclxuXHJcbmltcG9ydCB7TGlzdH0gZnJvbSBcImNvcmV1dGlsXCI7XHJcbmltcG9ydCB7SW5wdXRNYXBwaW5nfSBmcm9tIFwiLi9pbnB1dE1hcHBpbmdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dE1hcHBlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5faW5wdXRNYXBwaW5nTGlzdCA9IG5ldyBMaXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGluayhtb2RlbCxzY2hlbWEpe1xyXG4gICAgICAgIHZhciBpbnB1dE1hcHBpbmcgPSBuZXcgSW5wdXRNYXBwaW5nKG1vZGVsLHNjaGVtYSk7XHJcbiAgICAgICAgdGhpcy5faW5wdXRNYXBwaW5nTGlzdC5hZGQoaW5wdXRNYXBwaW5nKTtcclxuICAgICAgICByZXR1cm4gaW5wdXRNYXBwaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHB1bGxBbGwoKXtcclxuICAgICAgICB0aGlzLl9pbnB1dE1hcHBpbmdMaXN0LmZvckVhY2goZnVuY3Rpb24obWFwcGluZyxwYXJlbnQpIHtcclxuICAgICAgICAgICAgbWFwcGluZy5wdWxsKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaEFsbCgpe1xyXG4gICAgICAgIHRoaXMuX2lucHV0TWFwcGluZ0xpc3QuZm9yRWFjaChmdW5jdGlvbihtYXBwaW5nLHBhcmVudCkge1xyXG4gICAgICAgICAgICBtYXBwaW5nLnB1c2goKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBpbnB1dHMgPSBuZXcgSW5wdXRNYXBwZXIoKTtcclxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG5cclxuaW1wb3J0IHtMaXN0LE1hcH0gZnJvbSBcImNvcmV1dGlsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVVJMe1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKXtcclxuICAgICAgICB0aGlzLl9wcm90b2NvbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faG9zdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcG9ydCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcGF0aExpc3QgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuX3BhcmFtZXRlck1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICBpZih2YWx1ZSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHRoaXMuZGV0ZXJtaW5lUHJvdG9jb2wodmFsdWUpO1xyXG4gICAgICAgIGlmKHJlbWFpbmluZyA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fcHJvdG9jb2wgIT09IG51bGwpe1xyXG4gICAgICAgICAgICByZW1haW5pbmcgPSB0aGlzLmRldGVybWluZUhvc3QocmVtYWluaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmVtYWluaW5nID09PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9ob3N0ICE9PSBudWxsKXtcclxuICAgICAgICAgICAgcmVtYWluaW5nID0gdGhpcy5kZXRlcm1pbmVQb3J0KHJlbWFpbmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJlbWFpbmluZyA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtYWluaW5nID0gdGhpcy5kZXRlcm1pbmVQYXRoKHJlbWFpbmluZyk7XHJcbiAgICAgICAgaWYocmVtYWluaW5nID09PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRldGVybWluZVBhcmFtZXRlcnMocmVtYWluaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm90b2NvbCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm90b2NvbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIb3N0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hvc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UG9ydCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3J0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGhMaXN0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGhMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhcmFtZXRlcihrZXkpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJhbWV0ZXJNYXAuZ2V0KGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UGFyYW1ldGVyKGtleSx2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fcGFyYW1ldGVyTWFwLnNldChrZXksdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluZVByb3RvY29sKHZhbHVlKXtcclxuICAgICAgICBpZighdmFsdWUuaW5jbHVkZXMoXCIvL1wiKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcnRzID0gdmFsdWUuc3BsaXQoXCIvL1wiKTtcclxuICAgICAgICBpZihwYXJ0c1swXS5pbmNsdWRlcyhcIi9cIikpe1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Byb3RvY29sID0gcGFydHNbMF07XHJcbiAgICAgICAgaWYocGFydHMubGVuZ3RoPT0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKHBhcnRzWzBdICsgXCIvL1wiLFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluZUhvc3QodmFsdWUpe1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICB2YXIgaG9zdFBhcnQgPSBwYXJ0c1swXTtcclxuICAgICAgICBpZihob3N0UGFydC5pbmNsdWRlcyhcIjpcIikpe1xyXG4gICAgICAgICAgICBob3N0UGFydCA9IGhvc3RQYXJ0LnNwbGl0KFwiOlwiKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faG9zdCA9IGhvc3RQYXJ0O1xyXG4gICAgICAgIGlmKHBhcnRzLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZShob3N0UGFydCxcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5lUG9ydCh2YWx1ZSl7XHJcbiAgICAgICAgaWYoIXZhbHVlLnN0YXJ0c1dpdGgoXCI6XCIpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcG9ydFBhcnQgPSB2YWx1ZS5zcGxpdChcIi9cIilbMF0uc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIHRoaXMuX3BvcnQgPSBwb3J0UGFydDtcclxuICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZShcIjpcIiArIHBvcnRQYXJ0LFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluZVBhdGgodmFsdWUpe1xyXG4gICAgICAgIHZhciByZW1haW5pbmcgPSBudWxsO1xyXG4gICAgICAgIGlmKHZhbHVlLmluY2x1ZGVzKFwiP1wiKSl7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiP1wiKTtcclxuICAgICAgICAgICAgaWYocGFydHMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgICAgICByZW1haW5pbmcgPSB2YWx1ZS5yZXBsYWNlKHBhcnRzWzBdICsgXCI/XCIsXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWUgPSBwYXJ0c1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhdGhQYXJ0cyA9IG5ldyBMaXN0KHZhbHVlLnNwbGl0KFwiL1wiKSk7XHJcbiAgICAgICAgcGF0aFBhcnRzLmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgaWYocGFyZW50Ll9wYXRoTGlzdCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuX3BhdGhMaXN0ID0gbmV3IExpc3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnQuX3BhdGhMaXN0LmFkZChkZWNvZGVVUkkodmFsdWUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgICAgICByZXR1cm4gcmVtYWluaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluZVBhcmFtZXRlcnModmFsdWUpe1xyXG4gICAgICAgIHZhciBwYXJ0TGlzdCA9IG5ldyBMaXN0KHZhbHVlLnNwbGl0KFwiJlwiKSk7XHJcbiAgICAgICAgdmFyIHBhcmFtZXRlck1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICBwYXJ0TGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLHBhcmVudCl7XHJcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IHZhbHVlLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgaWYoa2V5VmFsdWUubGVuZ3RoID49IDIpe1xyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyTWFwLnNldChkZWNvZGVVUkkoa2V5VmFsdWVbMF0pLGRlY29kZVVSSShrZXlWYWx1ZVsxXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fcGFyYW1ldGVyTWFwID0gcGFyYW1ldGVyTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gXCJcIjtcclxuICAgICAgICBpZih0aGlzLl9wcm90b2NvbCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyB0aGlzLl9wcm90b2NvbCArIFwiLy9cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5faG9zdCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyB0aGlzLl9ob3N0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9wb3J0ICE9PSBudWxsKXtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIFwiOlwiICsgdGhpcy5fcG9ydDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmaXJzdFBhdGhQYXJ0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9wYXRoTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHBhdGhQYXJ0LHBhcmVudCl7XHJcbiAgICAgICAgICAgIGlmKCFmaXJzdFBhdGhQYXJ0KXtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBcIi9cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaXJzdFBhdGhQYXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBwYXRoUGFydDtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuXHJcbiAgICAgICAgdmFyIGZpcnN0UGFyYW1ldGVyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9wYXJhbWV0ZXJNYXAuZm9yRWFjaChmdW5jdGlvbihwYXJhbWV0ZXJLZXkscGFyYW1ldGVyVmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgaWYoZmlyc3RQYXJhbWV0ZXIpe1xyXG4gICAgICAgICAgICAgICAgZmlyc3RQYXJhbWV0ZXI9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlICsgXCI/XCI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIFwiJlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBlbmNvZGVVUkkocGFyYW1ldGVyS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJKHBhcmFtZXRlclZhbHVlKTtcclxuICAgICAgICB9LHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuIl0sIm5hbWVzIjpbIlhtbEVsZW1lbnQiLCJYbWxDZGF0YSIsIk1hcCIsIkxpc3QiLCJPYmplY3RGdW5jdGlvbiIsIkRvbVRyZWUiLCJQcm9wZXJ0eUFjY2Vzc29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQSxBQUVBOzs7QUFHQSxBQUFPLE1BQU0sV0FBVyxDQUFDOzs7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QzdELEtBQUssWUFBWUQsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUM7S0FDekg7O0lBRUQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxVQUFVO2FBQ2hFLEtBQUssWUFBWUEsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssVUFBVSxDQUFDLENBQUM7S0FDNUg7O0lBRUQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxVQUFVO2FBQ2hFLEtBQUssWUFBWUEsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssVUFBVSxDQUFDLENBQUM7S0FDNUg7O0lBRUQsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxRQUFRO2FBQzlELEtBQUssWUFBWUEsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssUUFBUSxDQUFDLENBQUM7S0FDMUg7O0lBRUQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUks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
