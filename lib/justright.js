(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('xmlparser'), require('coreutil')) :
	typeof define === 'function' && define.amd ? define(['exports', 'xmlparser', 'coreutil'], factory) :
	(factory((global.justright = global.justright || {}),global.xmlparser,global.coreutil));
}(this, (function (exports,xmlparser,coreutil) { 'use strict';

class BaseElement {

    constructor(value, parent) {
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

    createFromXmlElement(xmlElement, parentElement) {
        let element = null;
        if(xmlElement.getNamespace() != null){
            // Not complete
            element = document.createElement("http://nsuri",xmlElement.getFullName());
        }else{
            element = document.createElement(xmlElement.getName());
        }
        if(parentElement != null && parentElement.getMappedElement() != null) {
            parentElement.getMappedElement().appendChild(element);
        }
        xmlElement.getAttributes().forEach(function(key,value){
            element.setAttribute(key,value.getValue());
            return true;
        });
        return element;
    }

    attachEvent(eventType, functionParam) {
        this._element[eventType] = functionParam;
    }

    getMappedElement() {
        return this._element;
    }

    setMappedElement(mappedElement) {
        return this._element = mappedElement;
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
        if(this._element.parentNode == null){
            console.error("The element has no parent, can not swap it for value");
            return;
        }
        if(input instanceof BaseElement) {
            this._element.parentNode.replaceChild(input.getMappedElement(),this._element);
            return;
        }
        if(input !== undefined && input !== undefined && typeof input.getRootElement === "function") {
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
        if (input !== undefined && input !== undefined && typeof input.getRootElement === "function") {
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
            return
        }
    }

    prependChild(input) {
        if(this._element.firstChild == null) {
            this.addChild(input);
        }
        if (input instanceof BaseElement) {
            this._element.insertBefore(input.getMappedElement(),this._element.firstChild);
            return;
        }
        if (input !== undefined && input !== undefined && typeof input.getRootElement === "function") {
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

class AbstractInputElement extends BaseElement{

    constructor(element, parent) {
        super(element, parent);
    }

    getName() {
        return this._element.name;
    }

    setName(value) {
        return this._element.value;
    }


    getValue(){
        return this._element.value;
    }

    setValue(value){
        this._element.value = value;
    }
}

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

class PasswordInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

}

class TextInputElement extends AbstractInputElement{

    constructor(element, parent) {
        super(element, parent);
    }

}

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
        if(parentElement != null && parentElement.getMappedElement() != null) {
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

class Template{

    constructor(templateSource){
        this._templateSource = templateSource;
    }

    getTemplateSource(){
        return this._templateSource;
    }

}

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

    done(callback){
        this._callback = callback;
        this.doCallback(this);
    }

    doCallback(tmo){
        if(tmo._callback != null && tmo._templateQueueSize == tmo._templateMap.size()){
            var tempCallback = tmo._callback.call();
            tmo._callback = null;
            tempCallback.call();
        }
    }

    load(name,url){
        var obj = this;
        if(this.get(name) == null) {
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
        if(handlerObject.getIdSuffix != undefined){
            return handlerObject.getIdSuffix();
        }
        if(handlerObject.getComponent != undefined){
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
        if(this._idSuffix != null) {
            return id + "-" + this._idSuffix;
        }
        return id;
    }

    elementCreated (xmlElement, parentWrapper) {
        var element = ElementMapper.map(xmlElement, parentWrapper);

        this.addToElementIdMap(xmlElement,element);
        this.registerElementEvents(xmlElement,element);

        if(this._rootElement == null && element != null) {
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

        if(id != null) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0LmpzIiwic291cmNlcyI6WyIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9iYXNlRWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2Fic3RyYWN0SW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvY2hlY2tib3hJbnB1dEVsZW1lbnQuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9yYWRpb0lucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL3Bhc3N3b3JkSW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvdGV4dElucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL3RleHRhcmVhSW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvdGV4dG5vZGVFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvc2ltcGxlRWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2VsZW1lbnRNYXBwZXIuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvdGVtcGxhdGUvdGVtcGxhdGUuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvdGVtcGxhdGUvdGVtcGxhdGVNYW5hZ2VyLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2V2ZW50L2V2ZW50V3JhcHBlci5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9ldmVudC9ldmVudE1hbmFnZXIuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvY29tcG9uZW50L2NvbXBvbmVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9odG1sL2h0bWwuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvaW5wdXQvaW5wdXRNYXBwaW5nLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2lucHV0L2lucHV0TWFwcGVyLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L3V0aWwvdXJsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7WG1sRWxlbWVudH0gZnJvbSBcInhtbHBhcnNlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZUVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBwYXJlbnQpIHtcclxuICAgICAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIFhtbEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHRoaXMuY3JlYXRlRnJvbVhtbEVsZW1lbnQodmFsdWUsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpe1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVucmVjb2duaXplZCB2YWx1ZSBmb3IgRWxlbWVudFwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRnJvbVhtbEVsZW1lbnQoeG1sRWxlbWVudCwgcGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICBpZih4bWxFbGVtZW50LmdldE5hbWVzcGFjZSgpICE9IG51bGwpe1xyXG4gICAgICAgICAgICAvLyBOb3QgY29tcGxldGVcclxuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJodHRwOi8vbnN1cmlcIix4bWxFbGVtZW50LmdldEZ1bGxOYW1lKCkpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh4bWxFbGVtZW50LmdldE5hbWUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHBhcmVudEVsZW1lbnQgIT0gbnVsbCAmJiBwYXJlbnRFbGVtZW50LmdldE1hcHBlZEVsZW1lbnQoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuZ2V0TWFwcGVkRWxlbWVudCgpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB4bWxFbGVtZW50LmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSx2YWx1ZSl7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSx2YWx1ZS5nZXRWYWx1ZSgpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoRXZlbnQoZXZlbnRUeXBlLCBmdW5jdGlvblBhcmFtKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudFtldmVudFR5cGVdID0gZnVuY3Rpb25QYXJhbTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRNYXBwZWRFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1hcHBlZEVsZW1lbnQobWFwcGVkRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50ID0gbWFwcGVkRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGdWxsTmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRvcCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCb3R0b20oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGVmdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXaWR0aCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhlaWdodCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyaWJ1dGUoa2V5LHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdHRyaWJ1dGUoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuZ2V0QXR0cmlidXRlKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGFpbnNBdHRyaWJ1dGUoa2V5KXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5oYXNBdHRyaWJ1dGUoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBdHRyaWJ1dGUoa2V5KXtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN0eWxlKGtleSx2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtrZXldID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3R5bGUoa2V5KXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5zdHlsZVtrZXldO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVN0eWxlKGtleSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtrZXldID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQoaW5wdXQpe1xyXG4gICAgICAgIGlmKHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZSA9PSBudWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBlbGVtZW50IGhhcyBubyBwYXJlbnQsIGNhbiBub3Qgc3dhcCBpdCBmb3IgdmFsdWVcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaW5wdXQgaW5zdGFuY2VvZiBCYXNlRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGlucHV0LmdldE1hcHBlZEVsZW1lbnQoKSx0aGlzLl9lbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGlucHV0LmdldFJvb3RFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChpbnB1dC5nZXRSb290RWxlbWVudCgpLmdldE1hcHBlZEVsZW1lbnQoKSx0aGlzLl9lbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IGlucHV0LmdldFJvb3RFbGVtZW50KCkuZ2V0TWFwcGVkRWxlbWVudCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaW5wdXQpLHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgVGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGlucHV0LHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGlucHV0LHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldENoaWxkKGlucHV0KSB7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoaW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGlucHV0KSB7XHJcbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQmFzZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChpbnB1dC5nZXRNYXBwZWRFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkICYmIGlucHV0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGlucHV0LmdldFJvb3RFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChpbnB1dC5nZXRSb290RWxlbWVudCgpLmdldE1hcHBlZEVsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaW5wdXQpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBUZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcmVwZW5kQ2hpbGQoaW5wdXQpIHtcclxuICAgICAgICBpZih0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQmFzZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQuZ2V0TWFwcGVkRWxlbWVudCgpLHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlucHV0ICE9PSB1bmRlZmluZWQgJiYgaW5wdXQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgaW5wdXQuZ2V0Um9vdEVsZW1lbnQgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dC5nZXRSb290RWxlbWVudCgpLmdldE1hcHBlZEVsZW1lbnQoKSx0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lmluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpbnB1dCksdGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBUZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuaW5zZXJ0QmVmb3JlKGlucHV0LHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dCx0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7QmFzZUVsZW1lbnR9IGZyb20gXCIuL2Jhc2VFbGVtZW50XCJcclxuXHJcbmV4cG9ydCBjbGFzcyBBYnN0cmFjdElucHV0RWxlbWVudCBleHRlbmRzIEJhc2VFbGVtZW50e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE5hbWUodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC52YWx1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7QWJzdHJhY3RJbnB1dEVsZW1lbnR9IGZyb20gXCIuL2Fic3RyYWN0SW5wdXRFbGVtZW50XCJcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGVja2JveElucHV0RWxlbWVudCBleHRlbmRzIEFic3RyYWN0SW5wdXRFbGVtZW50e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2hlY2tlZCh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jaGVja2VkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNDaGVja2VkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuY2hlY2tlZDtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi9hYnN0cmFjdElucHV0RWxlbWVudFwiXHJcblxyXG5leHBvcnQgY2xhc3MgUmFkaW9JbnB1dEVsZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdElucHV0RWxlbWVudHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50LCBwYXJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENoZWNrZWQodmFsdWUpe1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQ2hlY2tlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmNoZWNrZWQ7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4vYWJzdHJhY3RJbnB1dEVsZW1lbnRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFBhc3N3b3JkSW5wdXRFbGVtZW50IGV4dGVuZHMgQWJzdHJhY3RJbnB1dEVsZW1lbnR7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcGFyZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4vYWJzdHJhY3RJbnB1dEVsZW1lbnRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRJbnB1dEVsZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdElucHV0RWxlbWVudHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50LCBwYXJlbnQpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi9hYnN0cmFjdElucHV0RWxlbWVudFwiXHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dGFyZWFJbnB1dEVsZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdElucHV0RWxlbWVudHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnQpIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50LCBwYXJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElubmVySFRNTCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmlubmVySFRNTDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJbm5lckhUTUwodmFsdWUpe1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2hpbGQoaW5wdXQpIHtcclxuICAgICAgICBzdXBlci5hZGRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmdldElubmVySFRNTCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVwZW5kQ2hpbGQoaW5wdXQpIHtcclxuICAgICAgICBzdXBlci5wcmVwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5nZXRJbm5lckhUTUwoKSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7WG1sQ2RhdGF9IGZyb20gXCJ4bWxwYXJzZXJcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRub2RlRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWUsIHBhcmVudCkge1xyXG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgWG1sQ2RhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHRoaXMuY3JlYXRlRnJvbVhtbENkYXRhKHZhbHVlLCBwYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGcm9tWG1sQ2RhdGEoY2RhdGFFbGVtZW50LCBwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjZGF0YUVsZW1lbnQuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgaWYocGFyZW50RWxlbWVudCAhPSBudWxsICYmIHBhcmVudEVsZW1lbnQuZ2V0TWFwcGVkRWxlbWVudCgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcGFyZW50RWxlbWVudC5nZXRNYXBwZWRFbGVtZW50KCkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dG5vZGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRWYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TWFwcGVkRWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dG5vZGU7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7QmFzZUVsZW1lbnR9IGZyb20gXCIuL2Jhc2VFbGVtZW50XCJcclxuXHJcbmV4cG9ydCBjbGFzcyBTaW1wbGVFbGVtZW50IGV4dGVuZHMgQmFzZUVsZW1lbnR7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbm5lckhUTUwoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5uZXJIVE1MKHZhbHVlKXtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1htbENkYXRhLFhtbEVsZW1lbnR9IGZyb20gXCJ4bWxwYXJzZXJcIlxyXG5pbXBvcnQge1JhZGlvSW5wdXRFbGVtZW50fSBmcm9tIFwiLi9yYWRpb0lucHV0RWxlbWVudFwiXHJcbmltcG9ydCB7Q2hlY2tib3hJbnB1dEVsZW1lbnR9IGZyb20gXCIuL2NoZWNrYm94SW5wdXRFbGVtZW50XCJcclxuaW1wb3J0IHtQYXNzd29yZElucHV0RWxlbWVudH0gZnJvbSBcIi4vcGFzc3dvcmRJbnB1dEVsZW1lbnRcIlxyXG5pbXBvcnQge1RleHRJbnB1dEVsZW1lbnR9IGZyb20gXCIuL3RleHRJbnB1dEVsZW1lbnRcIlxyXG5pbXBvcnQge1RleHRhcmVhSW5wdXRFbGVtZW50fSBmcm9tIFwiLi90ZXh0YXJlYUlucHV0RWxlbWVudFwiXHJcbmltcG9ydCB7VGV4dG5vZGVFbGVtZW50fSBmcm9tIFwiLi90ZXh0bm9kZUVsZW1lbnRcIlxyXG5pbXBvcnQge1NpbXBsZUVsZW1lbnR9IGZyb20gXCIuL3NpbXBsZUVsZW1lbnRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIEVsZW1lbnRNYXBwZXIge1xyXG5cclxuICAgIHN0YXRpYyBtYXAoaW5wdXQsIHBhcmVudCkge1xyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvUmFkaW8oaW5wdXQpKXsgcmV0dXJuIG5ldyBSYWRpb0lucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvQ2hlY2tib3goaW5wdXQpKXsgcmV0dXJuIG5ldyBDaGVja2JveElucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvUGFzc3dvcmQoaW5wdXQpKXsgcmV0dXJuIG5ldyBQYXNzd29yZElucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvU3VibWl0KGlucHV0KSl7IHJldHVybiBuZXcgVGV4dElucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvVGV4dGFyZWEoaW5wdXQpKXsgcmV0dXJuIG5ldyBUZXh0YXJlYUlucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxyXG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvVGV4dChpbnB1dCkpeyByZXR1cm4gbmV3IFRleHRJbnB1dEVsZW1lbnQoaW5wdXQsIHBhcmVudCk7IH1cclxuICAgICAgICBpZihFbGVtZW50TWFwcGVyLm1hcHNUb1RleHRub2RlKGlucHV0KSl7IHJldHVybiBuZXcgVGV4dG5vZGVFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9TaW1wbGUoaW5wdXQpKXsgcmV0dXJuIG5ldyBTaW1wbGVFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJNYXBwaW5nIHRvIHNpbXBsZSBieSBkZWZhdWx0IFwiICsgaW5wdXQpO1xyXG4gICAgICAgIHJldHVybiBuZXcgU2ltcGxlRWxlbWVudChpbnB1dCwgcGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvUmFkaW8oaW5wdXQpe1xyXG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGlucHV0LnR5cGUgPT0gXCJyYWRpb1wiKSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJpbnB1dFwiICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikuZ2V0VmFsdWUoKSA9PT0gXCJyYWRpb1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvQ2hlY2tib3goaW5wdXQpe1xyXG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGlucHV0LnR5cGUgPT0gXCJjaGVja2JveFwiKSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJpbnB1dFwiICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikuZ2V0VmFsdWUoKSA9PT0gXCJjaGVja2JveFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvUGFzc3dvcmQoaW5wdXQpe1xyXG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGlucHV0LnR5cGUgPT0gXCJwYXNzd29yZFwiKSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJpbnB1dFwiICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikuZ2V0VmFsdWUoKSA9PT0gXCJwYXNzd29yZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvU3VibWl0KGlucHV0KXtcclxuICAgICAgICByZXR1cm4gKGlucHV0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBpbnB1dC50eXBlID09IFwic3VibWl0XCIpIHx8XHJcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQgJiYgaW5wdXQuZ2V0TmFtZSgpID09PSBcImlucHV0XCIgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS5nZXRWYWx1ZSgpID09PSBcInN1Ym1pdFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvVGV4dChpbnB1dCl7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcInRleHRcIikgfHxcclxuICAgICAgICAgICAgKGlucHV0IGluc3RhbmNlb2YgWG1sRWxlbWVudCAmJiBpbnB1dC5nZXROYW1lKCkgPT09IFwiaW5wdXRcIiAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLmdldFZhbHVlKCkgPT09IFwidGV4dFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwc1RvVGV4dG5vZGUoaW5wdXQpe1xyXG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBOb2RlICYmIGlucHV0Lm5vZGVUeXBlID09PSBcIlRFWFRfTk9ERVwiKSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxDZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcHNUb1RleHRhcmVhKGlucHV0KXtcclxuICAgICAgICByZXR1cm4gKGlucHV0IGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkgfHxcclxuICAgICAgICAgICAgKGlucHV0IGluc3RhbmNlb2YgWG1sRWxlbWVudCAmJiBpbnB1dC5nZXROYW1lKCkgPT09IFwidGV4dGFyZWFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcHNUb1NpbXBsZShpbnB1dCl7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fFxyXG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50KTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVGVtcGxhdGV7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGVtcGxhdGVTb3VyY2Upe1xyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlU291cmNlID0gdGVtcGxhdGVTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGVTb3VyY2UoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVTb3VyY2U7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7TWFwfSBmcm9tIFwiY29yZXV0aWxcIlxyXG5pbXBvcnQge1RlbXBsYXRlfSBmcm9tIFwiLi90ZW1wbGF0ZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVNYW5hZ2Vye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5fdGVtcGxhdGVNYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5fdGVtcGxhdGVRdWV1ZVNpemUgPSAwO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQobmFtZSx0ZW1wbGF0ZSl7XHJcbiAgICAgICAgdGhpcy5fdGVtcGxhdGVNYXAuc2V0KG5hbWUsIHRlbXBsYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQobmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlTWFwLmdldChuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBkb25lKGNhbGxiYWNrKXtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuZG9DYWxsYmFjayh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBkb0NhbGxiYWNrKHRtbyl7XHJcbiAgICAgICAgaWYodG1vLl9jYWxsYmFjayAhPSBudWxsICYmIHRtby5fdGVtcGxhdGVRdWV1ZVNpemUgPT0gdG1vLl90ZW1wbGF0ZU1hcC5zaXplKCkpe1xyXG4gICAgICAgICAgICB2YXIgdGVtcENhbGxiYWNrID0gdG1vLl9jYWxsYmFjay5jYWxsKCk7XHJcbiAgICAgICAgICAgIHRtby5fY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICB0ZW1wQ2FsbGJhY2suY2FsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKG5hbWUsdXJsKXtcclxuICAgICAgICB2YXIgb2JqID0gdGhpcztcclxuICAgICAgICBpZih0aGlzLmdldChuYW1lKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlUXVldWVTaXplICsrO1xyXG4gICAgICAgICAgICBxd2VzdC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uKHhocixyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICBvYmouc2V0KG5hbWUsIG5ldyBUZW1wbGF0ZShyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgb2JqLmRvQ2FsbGJhY2sob2JqKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIG9iai5kb0NhbGxiYWNrKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHZhciB0ZW1wbGF0ZXMgPSBuZXcgVGVtcGxhdGVNYW5hZ2VyKCk7XHJcbiIsImltcG9ydCB7RWxlbWVudE1hcHBlcn0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudE1hcHBlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRXcmFwcGVye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9ldmVudCA9IGV2ZW50O1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50LnR5cGUudG9Mb3dlckNhc2UoKSA9PSBcImRyYWdzdGFydFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmVudERlZmF1bHQoKXtcclxuICAgICAgICB0aGlzLl9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9mZnNldFgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQub2Zmc2V0WDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPZmZzZXRZKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50Lm9mZnNldFk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2xpZW50WCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudC5jbGllbnRYO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENsaWVudFkoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQuY2xpZW50WTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUYXJnZXQoKXtcclxuICAgICAgICByZXR1cm4gRWxlbWVudE1hcHBlci5tYXAodGhpcy5fZXZlbnQudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtMaXN0LE1hcCxPYmplY3RGdW5jdGlvbn0gZnJvbSBcImNvcmV1dGlsXCJcclxuaW1wb3J0IHtFdmVudFdyYXBwZXJ9IGZyb20gXCIuL2V2ZW50V3JhcHBlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRNYXBwZXJ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5fYmVmb3JlTGlzdGVuZXJzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuX2FmdGVyTGlzdGVuZXJzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChlbGVtZW50LGV2ZW50VHlwZSxldmVudE5hbWUsc3VmZml4ZWRFdmVudE5hbWUpe1xyXG4gICAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoZXZlbnRUeXBlLCBmdW5jdGlvbihldmVudCkgeyBldmVudHMudHJpZ2dlcihzdWZmaXhlZEV2ZW50TmFtZSxldmVudE5hbWUsZXZlbnQpOyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW4oZXZlbnROYW1lLGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKXtcclxuICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWUgKyBcIl9cIiArIHRoaXMucmVzb2x2ZUlkU3VmZml4KGhhbmRsZXJPYmplY3QpO1xyXG4gICAgICAgIGlmKCF0aGlzLl9saXN0ZW5lcnMuZXhpc3RzKGV2ZW50TmFtZSkpe1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc2V0KGV2ZW50TmFtZSxuZXcgTGlzdCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG9iamVjdEZ1bmN0aW9uID0gbmV3IE9iamVjdEZ1bmN0aW9uKGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKTtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KGV2ZW50TmFtZSkuYWRkKG9iamVjdEZ1bmN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlSWRTdWZmaXgoaGFuZGxlck9iamVjdCl7XHJcbiAgICAgICAgaWYoaGFuZGxlck9iamVjdC5nZXRJZFN1ZmZpeCAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlck9iamVjdC5nZXRJZFN1ZmZpeCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoYW5kbGVyT2JqZWN0LmdldENvbXBvbmVudCAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlck9iamVjdC5nZXRDb21wb25lbnQoKS5nZXRJZFN1ZmZpeCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIHJlZ2lzdGVyIGV2ZW50IGFzIHRoZSBoYW5kbGVyIG9iamVjdCBpcyBuZWl0aGVyIGEgY29tcG9uZW50IG5vciBleHBvc2VzIGFueSB2aWEgZ2V0Q29tcG9uZW50XCIpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlbkJlZm9yZShldmVudE5hbWUsaGFuZGxlck9iamVjdCxoYW5kbGVyRnVuY3Rpb24pe1xyXG4gICAgICAgIGlmKCF0aGlzLl9iZWZvcmVMaXN0ZW5lcnMuZXhpc3RzKGV2ZW50TmFtZSkpe1xyXG4gICAgICAgICAgICB0aGlzLl9iZWZvcmVMaXN0ZW5lcnMuc2V0KGV2ZW50TmFtZSxuZXcgTGlzdCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG9iamVjdEZ1bmN0aW9uID0gbmV3IE9iamVjdEZ1bmN0aW9uKGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKTtcclxuICAgICAgICB0aGlzLl9iZWZvcmVMaXN0ZW5lcnMuZ2V0KGV2ZW50TmFtZSkuYWRkKG9iamVjdEZ1bmN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW5BZnRlcihldmVudE5hbWUsaGFuZGxlck9iamVjdCxoYW5kbGVyRnVuY3Rpb24pe1xyXG4gICAgICAgIGlmKCF0aGlzLl9hZnRlckxpc3RlbmVycy5leGlzdHMoZXZlbnROYW1lKSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2FmdGVyTGlzdGVuZXJzLnNldChldmVudE5hbWUsbmV3IExpc3QoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2FmdGVyTGlzdGVuZXJzLmdldChldmVudE5hbWUpLmFkZChuZXcgT2JqZWN0RnVuY3Rpb24oaGFuZGxlck9iamVjdCxoYW5kbGVyRnVuY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmlnZ2VyKHN1ZmZpeGVkRXZlbnROYW1lLCBldmVudE5hbWUsIGV2ZW50KXtcclxuICAgICAgICB0aGlzLmhhbmRsZUJlZm9yZShldmVudE5hbWUsIGV2ZW50KTtcclxuICAgICAgICBpZih0aGlzLl9saXN0ZW5lcnMuZXhpc3RzKHN1ZmZpeGVkRXZlbnROYW1lKSl7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TGlzdGVuZXJzID0gbmV3IExpc3QoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmdldChzdWZmaXhlZEV2ZW50TmFtZSkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgcGFyZW50KXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LHRoaXMpO1xyXG4gICAgICAgICAgICBjdXJyZW50TGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIHBhcmVudCl7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5jYWxsKG5ldyBFdmVudFdyYXBwZXIoZXZlbnQpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmhhbmRsZUFmdGVyKGV2ZW50TmFtZSwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUJlZm9yZShldmVudE5hbWUsIGV2ZW50KXtcclxuICAgICAgICB0aGlzLmhhbmRsZUdsb2JhbCh0aGlzLl9iZWZvcmVMaXN0ZW5lcnMsZXZlbnROYW1lLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQWZ0ZXIoZXZlbnROYW1lLCBldmVudCl7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVHbG9iYWwodGhpcy5fYWZ0ZXJMaXN0ZW5lcnMsZXZlbnROYW1lLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlR2xvYmFsKGxpc3RlbmVycywgZXZlbnROYW1lLCBldmVudCl7XHJcbiAgICAgICAgaWYobGlzdGVuZXJzLmV4aXN0cyhldmVudE5hbWUpKXtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRMaXN0ZW5lcnMgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnMuZ2V0KGV2ZW50TmFtZSkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExpc3RlbmVycy5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sdGhpcyk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpe1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuY2FsbChuZXcgRXZlbnRXcmFwcGVyKGV2ZW50KSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSx0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgZXZlbnRzID0gbmV3IEV2ZW50TWFwcGVyKCk7XHJcbiIsImltcG9ydCB7TWFwLExpc3R9IGZyb20gXCJjb3JldXRpbFwiXHJcbmltcG9ydCB7RG9tVHJlZSxYbWxFbGVtZW50fSBmcm9tIFwieG1scGFyc2VyXCJcclxuaW1wb3J0IHtFbGVtZW50TWFwcGVyfSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50TWFwcGVyXCJcclxuaW1wb3J0IHt0ZW1wbGF0ZXN9IGZyb20gXCIuLi90ZW1wbGF0ZS90ZW1wbGF0ZU1hbmFnZXJcIlxyXG5pbXBvcnQge2V2ZW50c30gZnJvbSBcIi4uL2V2ZW50L2V2ZW50TWFuYWdlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZU5hbWUpIHtcclxuICAgICAgICB2YXIgdGVtcGxhdGUgPSBudWxsO1xyXG4gICAgICAgIGlmKHR5cGVvZiB0ZW1wbGF0ZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlcy5nZXQodGVtcGxhdGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbWFwcGVyTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuX2lkU3VmZml4ID0gY29tcG9uZW50Q291bnRlcisrO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9ldmVudHMgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbmNsaWNrXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbm1vdXNlZG93blwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25tb3VzZXVwXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbmRyYWdcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcIm9uZHJhZ2VuZFwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25kcmFnc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcIm9uZHJvcFwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25kcmFnb3ZlclwiKTtcclxuICAgICAgICB0aGlzLl9ldmVudHMuYWRkKFwib25tb3VzZW1vdmVcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcIm9ubW91c2VvdmVyXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbm1vdXNlb3V0XCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJvbm1vdXNlZW50ZXJcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcInRvdWNoc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcInRvdWNoZW5kXCIpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cy5hZGQoXCJ0b3VjaG1vdmVcIik7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmFkZChcInRvdWNoY2FuY2VsXCIpO1xyXG4gICAgICAgIG5ldyBEb21UcmVlKHRlbXBsYXRlLmdldFRlbXBsYXRlU291cmNlKCksdGhpcykubG9hZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJvb3RFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290RWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZFN1ZmZpeCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZFN1ZmZpeDtcclxuICAgIH1cclxuXHJcbiAgICBpZEF0dHJpYnV0ZVdpdGhTdWZmaXggKGlkKSB7XHJcbiAgICAgICAgaWYodGhpcy5faWRTdWZmaXggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaWQgKyBcIi1cIiArIHRoaXMuX2lkU3VmZml4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudENyZWF0ZWQgKHhtbEVsZW1lbnQsIHBhcmVudFdyYXBwZXIpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IEVsZW1lbnRNYXBwZXIubWFwKHhtbEVsZW1lbnQsIHBhcmVudFdyYXBwZXIpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFRvRWxlbWVudElkTWFwKHhtbEVsZW1lbnQsZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnRFdmVudHMoeG1sRWxlbWVudCxlbGVtZW50KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fcm9vdEVsZW1lbnQgPT0gbnVsbCAmJiBlbGVtZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJFbGVtZW50RXZlbnRzKHhtbEVsZW1lbnQsZWxlbWVudCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnRUeXBlLHBhcmVudCl7XHJcbiAgICAgICAgICAgIGlmKCEoeG1sRWxlbWVudCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih4bWxFbGVtZW50LmNvbnRhaW5zQXR0cmlidXRlKGV2ZW50VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSB4bWxFbGVtZW50LmdldEF0dHJpYnV0ZShldmVudFR5cGUpLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VmZml4ZWRFdmVudE5hbWUgPSBldmVudE5hbWUgKyBcIl9cIiArIHBhcmVudC5faWRTdWZmaXg7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuYXR0YWNoKGVsZW1lbnQsZXZlbnRUeXBlLGV2ZW50TmFtZSxzdWZmaXhlZEV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUb0VsZW1lbnRJZE1hcCh4bWxFbGVtZW50LGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgaWQgPSBudWxsO1xyXG4gICAgICAgIGlmKCEoeG1sRWxlbWVudCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoeG1sRWxlbWVudC5jb250YWluc0F0dHJpYnV0ZShcImlkXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciBpZEF0dHJpYnV0ZSA9IHhtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIik7XHJcbiAgICAgICAgICAgIGlkID0gaWRBdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgaWRBdHRyaWJ1dGUuc2V0VmFsdWUodGhpcy5pZEF0dHJpYnV0ZVdpdGhTdWZmaXgoaWRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaWQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXBwZXJNYXAuc2V0KGlkLGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQoaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFwcGVyTWFwLmdldChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IChpZCwgdmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9tYXBwZXJNYXAuZ2V0KGlkKS5zZXQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyQ2hpbGRyZW4oaWQpe1xyXG4gICAgICAgIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2hpbGQgKGlkLCB2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpLnNldENoaWxkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGlsZCAoaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwcGVyTWFwLmdldChpZCkuYWRkQ2hpbGQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBlbmRDaGlsZCAoaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwcGVyTWFwLmdldChpZCkucHJlcGVuZENoaWxkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbnZhciBjb21wb25lbnRDb3VudGVyID0gMDtcclxuIiwiaW1wb3J0IHtYbWxFbGVtZW50fSBmcm9tIFwieG1scGFyc2VyXCJcclxuaW1wb3J0IHtFbGVtZW50TWFwcGVyfSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50TWFwcGVyXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBIVE1Me1xyXG5cclxuICAgIHN0YXRpYyBjdXN0b20oZWxlbWVudE5hbWUpe1xyXG4gICAgICAgIHZhciB4bWxFbGVtZW50ID0gbmV3IFhtbEVsZW1lbnQoZWxlbWVudE5hbWUpO1xyXG4gICAgICAgIHJldHVybiBFbGVtZW50TWFwcGVyLm1hcCh4bWxFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXBwbHlTdHlsZXMoZWxlbWVudCxjbGFzc1ZhbHVlLHN0eWxlVmFsdWUpe1xyXG4gICAgICAgIGlmKGNsYXNzVmFsdWUgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsY2xhc3NWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlVmFsdWUgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhKG5hbWUsaHJlZixjbGFzc1ZhbHVlLHN0eWxlVmFsdWUpe1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gSFRNTC5jdXN0b20oXCJhXCIpO1xyXG4gICAgICAgIGVsZW1lbnQuYWRkQ2hpbGQobmFtZSk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsaHJlZik7XHJcbiAgICAgICAgSFRNTC5hcHBseVN0eWxlcyhlbGVtZW50LGNsYXNzVmFsdWUsc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtQcm9wZXJ0eUFjY2Vzc29yLExpc3R9IGZyb20gXCJjb3JldXRpbFwiO1xyXG5pbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9hYnN0cmFjdElucHV0RWxlbWVudFwiXHJcbmltcG9ydCB7UmFkaW9JbnB1dEVsZW1lbnR9IGZyb20gXCIuLi9icm93c2VyL3JhZGlvSW5wdXRFbGVtZW50XCJcclxuaW1wb3J0IHtDaGVja2JveElucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvY2hlY2tib3hJbnB1dEVsZW1lbnRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0TWFwcGluZ3tcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCx2YWxpZGF0b3IpIHtcclxuICAgICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRvciA9IHZhbGlkYXRvcjtcclxuICAgICAgICB0aGlzLl9wdWxsZXJzID0gbmV3IExpc3QoKTtcclxuICAgICAgICB0aGlzLl9wdXNoZXJzID0gbmV3IExpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmQoZmllbGQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvKGZpZWxkKTtcclxuICAgIH1cclxuXHJcbiAgICB0byhmaWVsZCkge1xyXG4gICAgICAgIHZhciBmaWVsZERlc3RpbmF0aW9uID0gdGhpcy5fbW9kZWw7XHJcbiAgICAgICAgdmFyIHZhbGlkYXRvciA9IHRoaXMuX3ZhbGlkYXRvcjtcclxuXHJcbiAgICAgICAgdmFyIHB1bGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChmaWVsZCBpbnN0YW5jZW9mIEFic3RyYWN0SW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRWYWx1ZSA9IGZpZWxkLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBSYWRpb0lucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGZpZWxkLmlzQ2hlY2tlZCgpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHlBY2Nlc3Nvci5zZXRWYWx1ZShmaWVsZERlc3RpbmF0aW9uLGZpZWxkLmdldE5hbWUoKSxmaWVsZC5nZXRWYWx1ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkIGluc3RhbmNlb2YgQ2hlY2tib3hJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihmaWVsZC5pc0NoZWNrZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eUFjY2Vzc29yLnNldFZhbHVlKGZpZWxkRGVzdGluYXRpb24sZmllbGQuZ2V0TmFtZSgpLGZpZWxkLmdldFZhbHVlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5QWNjZXNzb3Iuc2V0VmFsdWUoZmllbGREZXN0aW5hdGlvbixmaWVsZC5nZXROYW1lKCksbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eUFjY2Vzc29yLnNldFZhbHVlKGZpZWxkRGVzdGluYXRpb24sZmllbGQuZ2V0TmFtZSgpLGZpZWxkLmdldFZhbHVlKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvciAhPT0gdW5kZWZpbmVkICAmJiB2YWxpZGF0b3IgIT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yLnZhbGlkYXRlKGZpZWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZmllbGQuYXR0YWNoRXZlbnQoXCJvbmNoYW5nZVwiLHB1bGxlcik7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIscHVsbGVyKTtcclxuICAgICAgICBwdWxsZXIuY2FsbCgpO1xyXG5cclxuICAgICAgICB2YXIgcHVzaGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IFByb3BlcnR5QWNjZXNzb3IuZ2V0VmFsdWUoZmllbGREZXN0aW5hdGlvbixmaWVsZC5nZXROYW1lKCkpO1xyXG4gICAgICAgICAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBBYnN0cmFjdElucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgUmFkaW9JbnB1dEVsZW1lbnQgfHwgZmllbGQgaW5zdGFuY2VvZiBDaGVja2JveElucHV0RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnNldENoZWNrZWQodmFsdWUgPT0gZmllbGQuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHVsbGVycy5hZGQocHVsbGVyKTtcclxuICAgICAgICB0aGlzLl9wdXNoZXJzLmFkZChwdXNoZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWxsKCl7XHJcbiAgICAgICAgdGhpcy5fcHVsbGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLHBhcmVudCkge1xyXG4gICAgICAgICAgICB2YWx1ZS5jYWxsKHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaCgpe1xyXG4gICAgICAgIHRoaXMuX3B1c2hlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpIHtcclxuICAgICAgICAgICAgdmFsdWUuY2FsbChwYXJlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlzdH0gZnJvbSBcImNvcmV1dGlsXCI7XHJcbmltcG9ydCB7SW5wdXRNYXBwaW5nfSBmcm9tIFwiLi9pbnB1dE1hcHBpbmdcIlxyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0TWFwcGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9pbnB1dE1hcHBpbmdMaXN0ID0gbmV3IExpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBsaW5rKG1vZGVsLHNjaGVtYSl7XHJcbiAgICAgICAgdmFyIGlucHV0TWFwcGluZyA9IG5ldyBJbnB1dE1hcHBpbmcobW9kZWwsc2NoZW1hKTtcclxuICAgICAgICB0aGlzLl9pbnB1dE1hcHBpbmdMaXN0LmFkZChpbnB1dE1hcHBpbmcpO1xyXG4gICAgICAgIHJldHVybiBpbnB1dE1hcHBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVsbEFsbCgpe1xyXG4gICAgICAgIHRoaXMuX2lucHV0TWFwcGluZ0xpc3QuZm9yRWFjaChmdW5jdGlvbihtYXBwaW5nLHBhcmVudCkge1xyXG4gICAgICAgICAgICBtYXBwaW5nLnB1bGwoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoQWxsKCl7XHJcbiAgICAgICAgdGhpcy5faW5wdXRNYXBwaW5nTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG1hcHBpbmcscGFyZW50KSB7XHJcbiAgICAgICAgICAgIG1hcHBpbmcucHVzaCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIGlucHV0cyA9IG5ldyBJbnB1dE1hcHBlcigpO1xyXG4iLCJpbXBvcnQge0xpc3QsTWFwfSBmcm9tIFwiY29yZXV0aWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVUkx7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWUpe1xyXG4gICAgICAgIHRoaXMuX3Byb3RvY29sID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9ob3N0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wb3J0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wYXRoTGlzdCA9IG5ldyBMaXN0KCk7XHJcbiAgICAgICAgdGhpcy5fcGFyYW1ldGVyTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIGlmKHZhbHVlID09PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVtYWluaW5nID0gdGhpcy5kZXRlcm1pbmVQcm90b2NvbCh2YWx1ZSk7XHJcbiAgICAgICAgaWYocmVtYWluaW5nID09PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9wcm90b2NvbCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJlbWFpbmluZyA9IHRoaXMuZGV0ZXJtaW5lSG9zdChyZW1haW5pbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihyZW1haW5pbmcgPT09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2hvc3QgIT09IG51bGwpe1xyXG4gICAgICAgICAgICByZW1haW5pbmcgPSB0aGlzLmRldGVybWluZVBvcnQocmVtYWluaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmVtYWluaW5nID09PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZW1haW5pbmcgPSB0aGlzLmRldGVybWluZVBhdGgocmVtYWluaW5nKTtcclxuICAgICAgICBpZihyZW1haW5pbmcgPT09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGV0ZXJtaW5lUGFyYW1ldGVycyhyZW1haW5pbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb3RvY29sKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3RvY29sO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhvc3QoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5faG9zdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQb3J0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aExpc3QoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aExpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFyYW1ldGVyKGtleSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmFtZXRlck1hcC5nZXQoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQYXJhbWV0ZXIoa2V5LHZhbHVlKXtcclxuICAgICAgICB0aGlzLl9wYXJhbWV0ZXJNYXAuc2V0KGtleSx2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5lUHJvdG9jb2wodmFsdWUpe1xyXG4gICAgICAgIGlmKCF2YWx1ZS5pbmNsdWRlcyhcIi8vXCIpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGFydHMgPSB2YWx1ZS5zcGxpdChcIi8vXCIpO1xyXG4gICAgICAgIGlmKHBhcnRzWzBdLmluY2x1ZGVzKFwiL1wiKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJvdG9jb2wgPSBwYXJ0c1swXTtcclxuICAgICAgICBpZihwYXJ0cy5sZW5ndGg9PTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UocGFydHNbMF0gKyBcIi8vXCIsXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5lSG9zdCh2YWx1ZSl7XHJcbiAgICAgICAgdmFyIHBhcnRzID0gdmFsdWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciBob3N0UGFydCA9IHBhcnRzWzBdO1xyXG4gICAgICAgIGlmKGhvc3RQYXJ0LmluY2x1ZGVzKFwiOlwiKSl7XHJcbiAgICAgICAgICAgIGhvc3RQYXJ0ID0gaG9zdFBhcnQuc3BsaXQoXCI6XCIpWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ob3N0ID0gaG9zdFBhcnQ7XHJcbiAgICAgICAgaWYocGFydHMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKGhvc3RQYXJ0LFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBkZXRlcm1pbmVQb3J0KHZhbHVlKXtcclxuICAgICAgICBpZighdmFsdWUuc3RhcnRzV2l0aChcIjpcIikpe1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwb3J0UGFydCA9IHZhbHVlLnNwbGl0KFwiL1wiKVswXS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgdGhpcy5fcG9ydCA9IHBvcnRQYXJ0O1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKFwiOlwiICsgcG9ydFBhcnQsXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5lUGF0aCh2YWx1ZSl7XHJcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IG51bGw7XHJcbiAgICAgICAgaWYodmFsdWUuaW5jbHVkZXMoXCI/XCIpKXtcclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gdmFsdWUuc3BsaXQoXCI/XCIpO1xyXG4gICAgICAgICAgICBpZihwYXJ0cy5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgICAgIHJlbWFpbmluZyA9IHZhbHVlLnJlcGxhY2UocGFydHNbMF0gKyBcIj9cIixcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnRzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGF0aFBhcnRzID0gbmV3IExpc3QodmFsdWUuc3BsaXQoXCIvXCIpKTtcclxuICAgICAgICBwYXRoUGFydHMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpe1xyXG4gICAgICAgICAgICBpZihwYXJlbnQuX3BhdGhMaXN0ID09PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5fcGF0aExpc3QgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudC5fcGF0aExpc3QuYWRkKGRlY29kZVVSSSh2YWx1ZSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMpO1xyXG4gICAgICAgIHJldHVybiByZW1haW5pbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5lUGFyYW1ldGVycyh2YWx1ZSl7XHJcbiAgICAgICAgdmFyIHBhcnRMaXN0ID0gbmV3IExpc3QodmFsdWUuc3BsaXQoXCImXCIpKTtcclxuICAgICAgICB2YXIgcGFyYW1ldGVyTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHBhcnRMaXN0LmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgdmFyIGtleVZhbHVlID0gdmFsdWUuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICBpZihrZXlWYWx1ZS5sZW5ndGggPj0gMil7XHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXAuc2V0KGRlY29kZVVSSShrZXlWYWx1ZVswXSksZGVjb2RlVVJJKGtleVZhbHVlWzFdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgICAgICB0aGlzLl9wYXJhbWV0ZXJNYXAgPSBwYXJhbWV0ZXJNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICB2YXIgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIGlmKHRoaXMuX3Byb3RvY29sICE9PSBudWxsKXtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIHRoaXMuX3Byb3RvY29sICsgXCIvL1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9ob3N0ICE9PSBudWxsKXtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIHRoaXMuX2hvc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3BvcnQgIT09IG51bGwpe1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlICsgXCI6XCIgKyB0aGlzLl9wb3J0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZpcnN0UGF0aFBhcnQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3BhdGhMaXN0LmZvckVhY2goZnVuY3Rpb24ocGF0aFBhcnQscGFyZW50KXtcclxuICAgICAgICAgICAgaWYoIWZpcnN0UGF0aFBhcnQpe1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIFwiL1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpcnN0UGF0aFBhcnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIHBhdGhQYXJ0O1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMpO1xyXG5cclxuICAgICAgICB2YXIgZmlyc3RQYXJhbWV0ZXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3BhcmFtZXRlck1hcC5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtZXRlcktleSxwYXJhbWV0ZXJWYWx1ZSxwYXJlbnQpe1xyXG4gICAgICAgICAgICBpZihmaXJzdFBhcmFtZXRlcil7XHJcbiAgICAgICAgICAgICAgICBmaXJzdFBhcmFtZXRlcj1mYWxzZTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBcIj9cIjtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlICsgXCImXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIGVuY29kZVVSSShwYXJhbWV0ZXJLZXkpICsgXCI9XCIgKyBlbmNvZGVVUkkocGFyYW1ldGVyVmFsdWUpO1xyXG4gICAgICAgIH0sdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXSwibmFtZXMiOlsiWG1sRWxlbWVudCIsIlhtbENkYXRhIiwiTWFwIiwiTGlzdCIsIk9iamVjdEZ1bmN0aW9uIiwiRG9tVHJlZSIsIlByb3BlcnR5QWNjZXNzb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVPLE1BQU0sV0FBVyxDQUFDOztJQUVyQixXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUN2QixHQUFHLEtBQUssWUFBWUEsb0JBQVUsRUFBRTtZQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekQsT0FBTztTQUNWO1FBQ0QsR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLE9BQU87U0FDVjtRQUNELEdBQUcsS0FBSyxZQUFZLFdBQVcsQ0FBQztZQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixPQUFPO1NBQ1Y7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0Qjs7SUFFRCxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFO1FBQzVDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztRQUNuQixHQUFHLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxJQUFJLENBQUM7O1lBRWpDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUM3RSxJQUFJO1lBQ0QsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDMUQ7UUFDRCxHQUFHLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLGdCQUFnQixFQUFFLElBQUksSUFBSSxFQUFFO1lBQ2xFLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RDtRQUNELFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE9BQU8sSUFBSSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUM7S0FDbEI7O0lBRUQsV0FBVyxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUU7UUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxhQUFhLENBQUM7S0FDNUM7O0lBRUQsZ0JBQWdCLEdBQUc7UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDeEI7O0lBRUQsZ0JBQWdCLENBQUMsYUFBYSxFQUFFO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUM7S0FDeEM7O0lBRUQsV0FBVyxHQUFHO1FBQ1YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztLQUNoQzs7SUFFRCxNQUFNLEVBQUU7UUFDSixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLENBQUM7S0FDcEQ7O0lBRUQsU0FBUyxFQUFFO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDO0tBQ3ZEOztJQUVELE9BQU8sRUFBRTtRQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQztLQUNyRDs7SUFFRCxRQUFRLEVBQUU7UUFDTixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDdEQ7O0lBRUQsUUFBUSxFQUFFO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztLQUNwQzs7SUFFRCxTQUFTLEVBQUU7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0tBQ3JDOztJQUVELFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6Qzs7SUFFRCxZQUFZLENBQUMsR0FBRyxFQUFFO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQzs7SUFFRCxpQkFBaUIsQ0FBQyxHQUFHLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQzs7SUFFRCxlQUFlLENBQUMsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3RDOztJQUVELFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3BDOztJQUVELFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25DOztJQUVELFdBQVcsQ0FBQyxHQUFHLENBQUM7UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDbkM7O0lBRUQsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNOLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUN0RSxPQUFPO1NBQ1Y7UUFDRCxHQUFHLEtBQUssWUFBWSxXQUFXLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5RSxPQUFPO1NBQ1Y7UUFDRCxHQUFHLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssQ0FBQyxjQUFjLEtBQUssVUFBVSxFQUFFO1lBQ3pGLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxRCxPQUFPO1NBQ1Y7UUFDRCxHQUFHLE9BQU8sS0FBSyxJQUFJLFFBQVEsRUFBRTtZQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEYsT0FBTztTQUNWO1FBQ0QsR0FBRyxLQUFLLFlBQVksSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELE9BQU87U0FDVjtRQUNELEdBQUcsS0FBSyxZQUFZLE9BQU8sRUFBRTtZQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxPQUFPO1NBQ1Y7S0FDSjs7SUFFRCxLQUFLLEVBQUU7UUFDSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDdkQ7S0FDSjs7SUFFRCxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4Qjs7SUFFRCxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQ1osSUFBSSxLQUFLLFlBQVksV0FBVyxFQUFFO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7WUFDcEQsT0FBTztTQUNWO1FBQ0QsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRTtZQUMxRixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLE9BQU87U0FDVjtRQUNELElBQUksT0FBTyxLQUFLLElBQUksUUFBUSxFQUFFO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxRCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsT0FBTztTQUNWO1FBQ0QsSUFBSSxLQUFLLFlBQVksT0FBTyxFQUFFO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLE1BQU07U0FDVDtLQUNKOztJQUVELFlBQVksQ0FBQyxLQUFLLEVBQUU7UUFDaEIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QjtRQUNELElBQUksS0FBSyxZQUFZLFdBQVcsRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlFLE9BQU87U0FDVjtRQUNELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxDQUFDLGNBQWMsS0FBSyxVQUFVLEVBQUU7WUFDMUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRixPQUFPO1NBQ1Y7UUFDRCxJQUFJLE9BQU8sS0FBSyxJQUFJLFFBQVEsRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEYsT0FBTztTQUNWO1FBQ0QsSUFBSSxLQUFLLFlBQVksSUFBSSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNELE9BQU87U0FDVjtRQUNELElBQUksS0FBSyxZQUFZLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxPQUFPO1NBQ1Y7S0FDSjtDQUNKOztBQ2hNTSxNQUFNLG9CQUFvQixTQUFTLFdBQVc7O0lBRWpELFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO1FBQ3pCLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDMUI7O0lBRUQsT0FBTyxHQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztLQUM3Qjs7SUFFRCxPQUFPLENBQUMsS0FBSyxFQUFFO1FBQ1gsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztLQUM5Qjs7O0lBR0QsUUFBUSxFQUFFO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztLQUM5Qjs7SUFFRCxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQy9CO0NBQ0o7O0FDdEJNLE1BQU0sb0JBQW9CLFNBQVMsb0JBQW9COztJQUUxRCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUN6QixLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOztJQUVELFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDakM7O0lBRUQsU0FBUyxFQUFFO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztLQUNoQztDQUNKOztBQ2JNLE1BQU0saUJBQWlCLFNBQVMsb0JBQW9COztJQUV2RCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUN6QixLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOztJQUVELFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDakM7O0lBRUQsU0FBUyxFQUFFO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztLQUNoQztDQUNKOztBQ2JNLE1BQU0sb0JBQW9CLFNBQVMsb0JBQW9COztJQUUxRCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUN6QixLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOztDQUVKOztBQ05NLE1BQU0sZ0JBQWdCLFNBQVMsb0JBQW9COztJQUV0RCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUN6QixLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOztDQUVKOztBQ05NLE1BQU0sb0JBQW9CLFNBQVMsb0JBQW9COztJQUUxRCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUN6QixLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOztJQUVELFlBQVksRUFBRTtRQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7S0FDbEM7O0lBRUQsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUNuQzs7SUFFRCxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQ1osS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQ3RDOztJQUVELFlBQVksQ0FBQyxLQUFLLEVBQUU7UUFDaEIsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQ3RDOztDQUVKOztBQ3hCTSxNQUFNLGVBQWUsQ0FBQzs7SUFFekIsV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDdkIsR0FBRyxLQUFLLFlBQVlDLGtCQUFRLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xEO0tBQ0o7O0lBRUQsa0JBQWtCLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRTtRQUM1QyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELEdBQUcsYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDbEUsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsT0FBTyxPQUFPLENBQUM7S0FDbEI7O0lBRUQsUUFBUSxDQUFDLEtBQUssRUFBRTtRQUNaLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQzFCOztJQUVELFFBQVEsR0FBRztRQUNQLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN6Qjs7SUFFRCxnQkFBZ0IsR0FBRztRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN6Qjs7Q0FFSjs7QUMvQk0sTUFBTSxhQUFhLFNBQVMsV0FBVzs7SUFFMUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7UUFDekIsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMxQjs7SUFFRCxZQUFZLEVBQUU7UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0tBQ2xDOztJQUVELFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDbkM7O0NBRUo7O0FDUE0sTUFBTSxhQUFhLENBQUM7O0lBRXZCLE9BQU8sR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDdEIsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO1FBQ3BGLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTtRQUMxRixHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksb0JBQW9CLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUU7UUFDMUYsR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO1FBQ3BGLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTtRQUMxRixHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUU7UUFDbEYsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTtRQUNyRixHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO1FBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDM0M7O0lBRUQsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxPQUFPO2FBQzdELEtBQUssWUFBWUQsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUM7S0FDekg7O0lBRUQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxVQUFVO2FBQ2hFLEtBQUssWUFBWUEsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssVUFBVSxDQUFDLENBQUM7S0FDNUg7O0lBRUQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxVQUFVO2FBQ2hFLEtBQUssWUFBWUEsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssVUFBVSxDQUFDLENBQUM7S0FDNUg7O0lBRUQsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxRQUFRO2FBQzlELEtBQUssWUFBWUEsb0JBQVUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssUUFBUSxDQUFDLENBQUM7S0FDMUg7O0lBRUQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLFlBQVksZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNO2FBQzVELEtBQUssWUFBWUEsb0JBQVUs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
