(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('coreutil')) :
	typeof define === 'function' && define.amd ? define(['exports', 'coreutil'], factory) :
	(factory((global.xmlparser = global.xmlparser || {}),global.coreutil));
}(this, (function (exports,coreutil$1) { 'use strict';

class ReadAhead{

    static read(value, matcher, cursor, ignoreWhitespace = false){
        let internalCursor = cursor;
        for(let i = 0; i < matcher.length && i < value.length ; i++){
            while(ignoreWhitespace && value.charAt(internalCursor) == ' '){
                internalCursor++;
            }
            if(value.charAt(internalCursor) == matcher.charAt(i)){
                internalCursor++;
            }else{
                return -1;
            }
        }

        return internalCursor - 1;
    }
}

class ElementBody{

    constructor(){
        this._name = null;
        this._namespace = null;
        this._attributes = new coreutil$1.Map();
    }

    getName() {
        return this._name;
    }

    getNamespace() {
        return this._namespace;
    }

    getAttributes() {
        return this._attributes;
    }

    detectPositions(depth, xml, cursor){
        let nameStartpos = cursor;
        let nameEndpos = null;
        let namespaceEndpos = null;
        let namespaceStartpos = null;
        while (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor)) && cursor < xml.length) {
            cursor ++;
        }
        if(xml.charAt(cursor) == ':'){
            coreutil$1.Logger.debug(depth, 'Found namespace');
            namespaceStartpos = nameStartpos;
            namespaceEndpos = cursor-1;
            nameStartpos = cursor+1;
            cursor ++;
            while (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor)) && cursor < xml.length) {
                cursor ++;
            }
        }
        nameEndpos = cursor-1;
        this._name = xml.substring(nameStartpos, nameEndpos+1);
        if(namespaceStartpos != null && namespaceEndpos != null){
                this._namespace = xml.substring(namespaceStartpos, namespaceEndpos+1);
        }
        cursor = this.detectAttributes(depth,xml,cursor);
        return cursor;
    }

    detectAttributes(depth,xml,cursor){
        let detectedAttrNameCursor = null;
        while((detectedAttrNameCursor = this.detectNextStartAttribute(depth, xml, cursor)) != -1){
            cursor = this.detectNextEndAttribute(depth, xml, detectedAttrNameCursor);
            var name = xml.substring(detectedAttrNameCursor,cursor+1);
            coreutil$1.Logger.debug(depth, 'Found attribute from ' + detectedAttrNameCursor + '  to ' + cursor);
            cursor = this.detectValue(name,depth, xml, cursor+1);
        }
        return cursor;
    }


    detectNextStartAttribute(depth, xml, cursor){
        while(xml.charAt(cursor) == ' ' && cursor < xml.length){
            cursor ++;
            if(coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor))){
                return cursor;
            }
        }
        return -1;
    }

    detectNextEndAttribute(depth, xml, cursor){
        while(coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor))){
            cursor ++;
        }
        return cursor -1;
    }

    detectValue(name, depth, xml, cursor){
        let valuePos = cursor;
        if((valuePos = ReadAhead.read(xml,'="',valuePos,true)) == -1){
            this._attributes.set(name,null);
            return cursor;
        }
        valuePos++;
        coreutil$1.Logger.debug(depth, 'Possible attribute value start at ' + valuePos);
        let valueStartPos = valuePos;
        while(this.isAttributeContent(depth, xml, valuePos)){
            valuePos++;
        }
        if(valuePos == cursor){
            this._attributes.set(name, '');
        }else{
            this._attributes.set(name, xml.substring(valueStartPos,valuePos));
        }

        coreutil$1.Logger.debug(depth, 'Found attribute content ending at ' + (valuePos-1));

        if((valuePos = ReadAhead.read(xml,'"',valuePos,true)) != -1){
            valuePos++;
        }else{
            coreutil$1.Logger.error('Missing end quotes on attribute at position ' + valuePos);
        }
        return valuePos;
    }


    isAttributeContent(depth, xml, cursor){
        if(ReadAhead.read(xml,'<',cursor) != -1){
            return false;
        }
        if(ReadAhead.read(xml,'>',cursor) != -1){
            return false;
        }
        if(ReadAhead.read(xml,'"',cursor) != -1){
            return false;
        }
        return true;
    }
}

class XmlCdata{

	constructor(value){
        this._value = value;
    }

    setValue(value) {
        this._value = value;
    }

    getValue() {
        return this._value;
    }

    dump(){
        this.dumpLevel(0);
    }

    dumpLevel(level){
        let spacer = ':';
        for(let space = 0 ; space < level*2 ; space ++){
            spacer = spacer + ' ';
        }

        coreutil$1.Logger.log(spacer + this._value);
        return;
    }

    read(){
        return this._value;
    }
}

class XmlElement{

	constructor(name, namespace, selfClosing, childElements){
        this._name = name;
        this._namespace = namespace;
        this._selfClosing = selfClosing;
        this._childElements = new coreutil$1.List();
        this._attributes = new coreutil$1.Map();
    }

    getName() {
        return this._name;
    }

    getNamespace() {
        return this._namespace;
    }

    getFullName() {
        if(this._namespace == null){
            return this._name;
        }
        return this._namespace + ':' + this._name;
    }

    getAttributes(){
        return this._attributes;
    }

    setAttributes(attributes){
        this._attributes = attributes;
    }

    setAttribute(key,value) {
		this._attributes.set(key,value);
	}

	getAttribute(key) {
		return this._attributes.get(key);
	}

    containsAttribute(key){
        return this._attributes.contains(key);
    }

	clearAttribute(){
		this._attributes = new coreutil$1.Map();
	}

    getChildElements(){
        return this._childElements;
    }

    setChildElements(elements) {
        this._childElements = elements;
    }

    setText(text){
        this._childElements = new coreutil$1.List();
        this.addText(text);
    }

    addText(text){
        let textElement = new XmlCdata(text);
        this._childElements.add(textElement);
    }

    dump(){
        this.dumpLevel(0);
    }

    dumpLevel(level){
        let spacer = ':';
        for(let space = 0 ; space < level*2 ; space ++){
            spacer = spacer + ' ';
        }

        if(this._selfClosing){
            coreutil$1.Logger.log(spacer + '<' + this.getFullName() + this.readAttributes() + '/>');
            return;
        }
        coreutil$1.Logger.log(spacer + '<' + this.getFullName() + this.readAttributes() + '>');
        this._childElements.forEach(function(childElement){
            childElement.dumpLevel(level+1);
            return true;
        });
        coreutil$1.Logger.log(spacer + '</' + this.getFullName() + '>');
    }

    read(){
        let result = '';
        if(this._selfClosing){
            result = result + '<' + this.getFullName() + this.readAttributes() + '/>';
            return result;
        }
        result = result + '<' + this.getFullName() + this.readAttributes() + '>';
        this._childElements.forEach(function(childElement){
            result = result + childElement.read();
            return true;
        });
        result = result + '</' + this.getFullName() + '>';
        return result;
    }

    readAttributes(){
        let result = '';
        this._attributes.forEach(function (key,attribute,parent) {
            result = result + ' ' + attribute.getName();
            if(attribute.getValue() != null){
                result = result + '="' + attribute.getValue() + '"';
             }
             return true;
        },this);
        return result;
    }
}

class XmlAttribute {

  constructor(name,value) {
      this._name = name;
      this._value = value;
  }

  getName(){
      return this._name;
  }

  setName(val){
      this._name = val;
  }

  getValue(){
      return this._value;
  }

  setValue(val){
      this._value = val;
  }
}

class ElementDetector{

    constructor(){
        this._type = 'ElementDetector';
        this._hasChildren = false;
        this._found = false;
        this._xmlCursor = null;
        this._element = null;
    }

    createElement() {
        return this._element;
    }

    getType() {
        return this._type;
    }

    isFound() {
        return this._found;
    }

    hasChildren() {
        return this._hasChildren;
    }

    detect(depth, xmlCursor){
        this._xmlCursor = xmlCursor;
        coreutil$1.Logger.debug(depth, 'Looking for opening element at position ' + xmlCursor.cursor);
        let elementBody = new ElementBody();
        let endpos = ElementDetector.detectOpenElement(depth, xmlCursor.xml, xmlCursor.cursor,elementBody);
        if(endpos != -1) {

            this._element = new XmlElement(elementBody.getName(), elementBody.getNamespace(), false);

            elementBody.getAttributes().forEach(function(attributeName,attributeValue,parent){
                parent._element.getAttributes().set(attributeName,new XmlAttribute(attributeName, attributeValue));
                return true;
            },this);

            coreutil$1.Logger.debug(depth, 'Found opening tag <' + this._element.getFullName() + '> from ' +  xmlCursor.cursor  + ' to ' + endpos);
            xmlCursor.cursor = endpos + 1;

            if(!this.stop(depth)){
                this._hasChildren = true;
            }
            this._found = true;
        }
    }

    stop(depth){
        coreutil$1.Logger.debug(depth, 'Looking for closing element at position ' + this._xmlCursor.cursor);
        let closingElement = ElementDetector.detectEndElement(depth, this._xmlCursor.xml, this._xmlCursor.cursor);
        if(closingElement != -1){
            let closingTagName =  this._xmlCursor.xml.substring(this._xmlCursor.cursor+2,closingElement);
            coreutil$1.Logger.debug(depth, 'Found closing tag </' + closingTagName + '> from ' +  this._xmlCursor.cursor  + ' to ' + closingElement);

            if(this._element.getFullName() != closingTagName){
                coreutil$1.Logger.error('ERR: Mismatch between opening tag <' + this._element.getFullName() + '> and closing tag </' + closingTagName + '> When exiting to parent elemnt');
            }
            this._xmlCursor.cursor = closingElement +1;
            return true;
        }
        return false;
    }

    static detectOpenElement(depth, xml, cursor, elementBody) {
        if((cursor = ReadAhead.read(xml,'<',cursor)) == -1){
            return -1;
        }
        cursor ++;
        cursor = elementBody.detectPositions(depth+1, xml, cursor);
        if((cursor = ReadAhead.read(xml,'>',cursor)) == -1){
            return -1;
        }
        return cursor;
    }

    static detectEndElement(depth, xml, cursor){
        if((cursor = ReadAhead.read(xml,'</',cursor)) == -1){
            return -1;
        }
        cursor ++;
        cursor = new ElementBody().detectPositions(depth+1, xml, cursor);
        if((cursor = ReadAhead.read(xml,'>',cursor)) == -1){
            return -1;
        }
        return cursor;
    }

}

class CdataDetector{

    constructor(){
        this._type = 'CdataDetector';
        this._value = null;
        this._found = false;
    }

    isFound() {
        return this._found;
    }

    getType() {
        return this._type;
    }

    createElement() {
        return new XmlCdata(this._value);
    }

    detect(depth, xmlCursor){
        this._found = false;
        this._value = null;

        let endPos = this.detectContent(depth, xmlCursor.xml, xmlCursor.cursor, xmlCursor.parentDomScaffold);
        if(endPos != -1) {
            this._found = true;
            this.hasChildren = false;
            this._value = xmlCursor.xml.substring(xmlCursor.cursor,endPos);
            xmlCursor.cursor = endPos;
        }
    }

    detectContent(depth, xml, cursor, parentDomScaffold) {
        coreutil$1.Logger.debug(depth, 'Cdata start at ' + cursor);
        let internalStartPos = cursor;
        if(!CdataDetector.isContent(depth, xml, cursor)){
            coreutil$1.Logger.debug(depth, 'No Cdata found');
            return -1;
        }
        while(CdataDetector.isContent(depth, xml, cursor) && cursor < xml.length){
            cursor ++;
        }
        coreutil$1.Logger.debug(depth, 'Cdata end at ' + (cursor-1));
        if(parentDomScaffold == null){
            coreutil$1.Logger.error('ERR: Content not allowed on root level in xml document');
            return -1;
        }
        coreutil$1.Logger.debug(depth, 'Cdata found value is ' + xml.substring(internalStartPos,cursor));
        return cursor;
    }

    static isContent(depth, xml, cursor){
        if(ReadAhead.read(xml,'<',cursor) != -1){
            return false;
        }
        if(ReadAhead.read(xml,'>',cursor) != -1){
            return false;
        }
        return true;
    }
}

class ClosingElementDetector{

    constructor(){
        this._type = 'ClosingElementDetector';
        this._found = false;
        this._element = null;
    }

    createElement() {
        return this._element;
    }

    getType() {
        return this._type;
    }

    isFound() {
        return this._found;
    }

    detect(depth, xmlCursor) {
        coreutil$1.Logger.debug(depth, 'Looking for self closing element at position ' + xmlCursor.cursor);
        let elementBody = new ElementBody();
        let endpos = ClosingElementDetector.detectClosingElement(depth, xmlCursor.xml, xmlCursor.cursor,elementBody);
        if(endpos != -1){
            this._element = new XmlElement(elementBody.getName(), elementBody.getNamespace(), true);

            elementBody.getAttributes().forEach(function(attributeName,attributeValue,parent){
                parent._element.setAttribute(attributeName,new XmlAttribute(attributeName, attributeValue));
                return true;
            },this);

            coreutil$1.Logger.debug(depth, 'Found self closing tag <' + this._element.getFullName() + '/> from ' +  xmlCursor.cursor  + ' to ' + endpos);
            this._found = true;
            xmlCursor.cursor = endpos + 1;
        }
    }

    static detectClosingElement(depth, xml, cursor, elementBody){
        if((cursor = ReadAhead.read(xml,'<',cursor)) == -1){
            return -1;
        }
        cursor ++;
        cursor = elementBody.detectPositions(depth+1, xml, cursor);
        if((cursor = ReadAhead.read(xml,'/>',cursor)) == -1){
            return -1;
        }
        return cursor;
    }
}

class XmlCursor{

    constructor(xml, cursor, parentDomScaffold){
        this.xml = xml;
        this.cursor = cursor;
        this.parentDomScaffold = parentDomScaffold;
    }

    eof(){
        return this.cursor >= this.xml.length;
    }
}

class DomScaffold{


    constructor(){
        this._element = null;
        this._childDomScaffolds = new coreutil$1.List();
        this._detectors = new coreutil$1.List();
        this._elementCreatedListener = null;
        this._detectors.add(new ElementDetector());
        this._detectors.add(new CdataDetector());
        this._detectors.add(new ClosingElementDetector());
    }

    getElement() {
        return this._element;
    }

    load(xml, cursor, elementCreatedListener){
        let xmlCursor = new XmlCursor(xml, cursor, null);
        this.loadDepth(1, xmlCursor, elementCreatedListener);
    }

    loadDepth(depth, xmlCursor, elementCreatedListener){
        coreutil.Logger.showPos(xmlCursor.xml, xmlCursor.cursor);
        coreutil.Logger.debug(depth, 'Starting DomScaffold');
        this._elementCreatedListener = elementCreatedListener;

        if(xmlCursor.eof()){
            coreutil.Logger.debug(depth, 'Reached eof. Exiting');
            return false;
        }

        var elementDetector = null;
        this._detectors.forEach(function(curElementDetector,parent){
            coreutil.Logger.debug(depth, 'Starting ' + curElementDetector.getType());
            curElementDetector.detect(depth + 1,xmlCursor);
            if(!curElementDetector.isFound()){
                return true;
            }
            elementDetector = curElementDetector;
            return false;
        },this);

        if(elementDetector == null){
            xmlCursor.cursor++;
            coreutil.Logger.warn('WARN: No handler was found searching from position: ' + xmlCursor.cursor);
        }

        this._element = elementDetector.createElement();

        if(elementDetector instanceof ElementDetector && elementDetector.hasChildren()) {
            while(!elementDetector.stop(depth + 1) && xmlCursor.cursor < xmlCursor.xml.length){
                let previousParentScaffold = xmlCursor.parentDomScaffold;
                let childScaffold = new DomScaffold();
                xmlCursor.parentDomScaffold = childScaffold;
                childScaffold.loadDepth(depth+1, xmlCursor, this._elementCreatedListener);
                this._childDomScaffolds.add(childScaffold);
                xmlCursor.parentDomScaffold = previousParentScaffold;
            }
        }
        coreutil.Logger.showPos(xmlCursor.xml, xmlCursor.cursor);
    }

    getTree(parentNotifyResult){
        if(this._element == null){
            return null;
        }

        let notifyResult = this.notifyElementCreatedListener(this._element,parentNotifyResult);

        this._childDomScaffolds.forEach(function(childDomScaffold,parent) {
            let childElement = childDomScaffold.getTree(notifyResult);
            if(childElement != null){
                parent._element.getChildElements().add(childElement);
            }
            return true;
        },this);

        return this._element;
    }

    notifyElementCreatedListener(element, parentNotifyResult) {
        if(this._elementCreatedListener != null){
            return this._elementCreatedListener.elementCreated(element, parentNotifyResult);
        }
        return null;
    }

}

class DomTree$1{

    constructor(xml, elementCreatedListener) {
        this._elementCreatedListener = elementCreatedListener;
        this._xml = xml;
        this._rootElement = null;
    }

    getRootElement() {
        return this._rootElement;
    }

    setRootElement(element) {
        this._rootElement = element;
    }

    load(){
        let domScaffold = new DomScaffold();
        domScaffold.load(this._xml,0,this._elementCreatedListener);
        this._rootElement = domScaffold.getTree();
    }

    dump(){
        this._rootElement.dump();
    }

    read(){
        return this._rootElement.read();
    }
}

// C:\git\webclient>
// babel .\src\helloWorld\ --out-file .\out\helloworld\domParser.js --map-sources
// node .\out\helloworld\domParser.js

if(typeof document == 'undefined'){
    coreutil$1.Logger.debugEnabled = true;

    var domTree = new DomTree('<div test2 test3= "" test ="123"><span id="1"><h1>Hello &amp; world</h1></span><p><br hello = "true" hello2/>Hello<br/></p><span>World</span> </div>');
    var now = new Date();
    console.log('Start parsing ' + now.getTime());
    domTree.load();
    now = new Date();
    console.log('End parsing ' + now.getTime());
    domTree.dump();
    now = new Date();
    console.log('Dumped ' + now.getTime());

}

exports.DomTree = DomTree$1;
exports.CdataDetector = CdataDetector;
exports.ClosingElementDetector = ClosingElementDetector;
exports.ElementBody = ElementBody;
exports.ElementDetector = ElementDetector;
exports.DomScaffold = DomScaffold;
exports.ReadAhead = ReadAhead;
exports.XmlCursor = XmlCursor;
exports.XmlAttribute = XmlAttribute;
exports.XmlCdata = XmlCdata;
exports.XmlElement = XmlElement;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1scGFyc2VyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvbWFpbi94bWxwYXJzZXIvcGFyc2VyL3htbC9wYXJzZXIvcmVhZEFoZWFkLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL2RldGVjdG9ycy9lbGVtZW50Qm9keS5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3htbENkYXRhLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwveG1sRWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3htbEF0dHJpYnV0ZS5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3BhcnNlci9kZXRlY3RvcnMvZWxlbWVudERldGVjdG9yLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL2RldGVjdG9ycy9jZGF0YURldGVjdG9yLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL2RldGVjdG9ycy9jbG9zaW5nRWxlbWVudERldGVjdG9yLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL3htbEN1cnNvci5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3BhcnNlci9kb21TY2FmZm9sZC5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL2RvbVRyZWUuanMiLCIuLi9zcmMvdGVzdC94bWxwYXJzZXIvei5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUmVhZEFoZWFke1xyXG5cclxuICAgIHN0YXRpYyByZWFkKHZhbHVlLCBtYXRjaGVyLCBjdXJzb3IsIGlnbm9yZVdoaXRlc3BhY2UgPSBmYWxzZSl7XHJcbiAgICAgICAgbGV0IGludGVybmFsQ3Vyc29yID0gY3Vyc29yO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtYXRjaGVyLmxlbmd0aCAmJiBpIDwgdmFsdWUubGVuZ3RoIDsgaSsrKXtcclxuICAgICAgICAgICAgd2hpbGUoaWdub3JlV2hpdGVzcGFjZSAmJiB2YWx1ZS5jaGFyQXQoaW50ZXJuYWxDdXJzb3IpID09ICcgJyl7XHJcbiAgICAgICAgICAgICAgICBpbnRlcm5hbEN1cnNvcisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZhbHVlLmNoYXJBdChpbnRlcm5hbEN1cnNvcikgPT0gbWF0Y2hlci5jaGFyQXQoaSkpe1xyXG4gICAgICAgICAgICAgICAgaW50ZXJuYWxDdXJzb3IrKztcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnRlcm5hbEN1cnNvciAtIDE7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMb2dnZXIsIE1hcCwgU3RyaW5nVXRpbHN9IGZyb20gXCJjb3JldXRpbFwiXHJcbmltcG9ydCB7UmVhZEFoZWFkfSBmcm9tIFwiLi4vcmVhZEFoZWFkXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBFbGVtZW50Qm9keXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX25hbWVzcGFjZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWVzcGFjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF0dHJpYnV0ZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZWN0UG9zaXRpb25zKGRlcHRoLCB4bWwsIGN1cnNvcil7XHJcbiAgICAgICAgbGV0IG5hbWVTdGFydHBvcyA9IGN1cnNvcjtcclxuICAgICAgICBsZXQgbmFtZUVuZHBvcyA9IG51bGw7XHJcbiAgICAgICAgbGV0IG5hbWVzcGFjZUVuZHBvcyA9IG51bGw7XHJcbiAgICAgICAgbGV0IG5hbWVzcGFjZVN0YXJ0cG9zID0gbnVsbDtcclxuICAgICAgICB3aGlsZSAoU3RyaW5nVXRpbHMuaXNJbkFscGhhYmV0KHhtbC5jaGFyQXQoY3Vyc29yKSkgJiYgY3Vyc29yIDwgeG1sLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjdXJzb3IgKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHhtbC5jaGFyQXQoY3Vyc29yKSA9PSAnOicpe1xyXG4gICAgICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdGb3VuZCBuYW1lc3BhY2UnKTtcclxuICAgICAgICAgICAgbmFtZXNwYWNlU3RhcnRwb3MgPSBuYW1lU3RhcnRwb3M7XHJcbiAgICAgICAgICAgIG5hbWVzcGFjZUVuZHBvcyA9IGN1cnNvci0xO1xyXG4gICAgICAgICAgICBuYW1lU3RhcnRwb3MgPSBjdXJzb3IrMTtcclxuICAgICAgICAgICAgY3Vyc29yICsrO1xyXG4gICAgICAgICAgICB3aGlsZSAoU3RyaW5nVXRpbHMuaXNJbkFscGhhYmV0KHhtbC5jaGFyQXQoY3Vyc29yKSkgJiYgY3Vyc29yIDwgeG1sLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yICsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5hbWVFbmRwb3MgPSBjdXJzb3ItMTtcclxuICAgICAgICB0aGlzLl9uYW1lID0geG1sLnN1YnN0cmluZyhuYW1lU3RhcnRwb3MsIG5hbWVFbmRwb3MrMSk7XHJcbiAgICAgICAgaWYobmFtZXNwYWNlU3RhcnRwb3MgIT0gbnVsbCAmJiBuYW1lc3BhY2VFbmRwb3MgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSB4bWwuc3Vic3RyaW5nKG5hbWVzcGFjZVN0YXJ0cG9zLCBuYW1lc3BhY2VFbmRwb3MrMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnNvciA9IHRoaXMuZGV0ZWN0QXR0cmlidXRlcyhkZXB0aCx4bWwsY3Vyc29yKTtcclxuICAgICAgICByZXR1cm4gY3Vyc29yO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVjdEF0dHJpYnV0ZXMoZGVwdGgseG1sLGN1cnNvcil7XHJcbiAgICAgICAgbGV0IGRldGVjdGVkQXR0ck5hbWVDdXJzb3IgPSBudWxsO1xyXG4gICAgICAgIHdoaWxlKChkZXRlY3RlZEF0dHJOYW1lQ3Vyc29yID0gdGhpcy5kZXRlY3ROZXh0U3RhcnRBdHRyaWJ1dGUoZGVwdGgsIHhtbCwgY3Vyc29yKSkgIT0gLTEpe1xyXG4gICAgICAgICAgICBjdXJzb3IgPSB0aGlzLmRldGVjdE5leHRFbmRBdHRyaWJ1dGUoZGVwdGgsIHhtbCwgZGV0ZWN0ZWRBdHRyTmFtZUN1cnNvcik7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0geG1sLnN1YnN0cmluZyhkZXRlY3RlZEF0dHJOYW1lQ3Vyc29yLGN1cnNvcisxKTtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnRm91bmQgYXR0cmlidXRlIGZyb20gJyArIGRldGVjdGVkQXR0ck5hbWVDdXJzb3IgKyAnICB0byAnICsgY3Vyc29yKTtcclxuICAgICAgICAgICAgY3Vyc29yID0gdGhpcy5kZXRlY3RWYWx1ZShuYW1lLGRlcHRoLCB4bWwsIGN1cnNvcisxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnNvcjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZGV0ZWN0TmV4dFN0YXJ0QXR0cmlidXRlKGRlcHRoLCB4bWwsIGN1cnNvcil7XHJcbiAgICAgICAgd2hpbGUoeG1sLmNoYXJBdChjdXJzb3IpID09ICcgJyAmJiBjdXJzb3IgPCB4bWwubGVuZ3RoKXtcclxuICAgICAgICAgICAgY3Vyc29yICsrO1xyXG4gICAgICAgICAgICBpZihTdHJpbmdVdGlscy5pc0luQWxwaGFiZXQoeG1sLmNoYXJBdChjdXJzb3IpKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBkZXRlY3ROZXh0RW5kQXR0cmlidXRlKGRlcHRoLCB4bWwsIGN1cnNvcil7XHJcbiAgICAgICAgd2hpbGUoU3RyaW5nVXRpbHMuaXNJbkFscGhhYmV0KHhtbC5jaGFyQXQoY3Vyc29yKSkpe1xyXG4gICAgICAgICAgICBjdXJzb3IgKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdXJzb3IgLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZWN0VmFsdWUobmFtZSwgZGVwdGgsIHhtbCwgY3Vyc29yKXtcclxuICAgICAgICBsZXQgdmFsdWVQb3MgPSBjdXJzb3I7XHJcbiAgICAgICAgaWYoKHZhbHVlUG9zID0gUmVhZEFoZWFkLnJlYWQoeG1sLCc9XCInLHZhbHVlUG9zLHRydWUpKSA9PSAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZXMuc2V0KG5hbWUsbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJzb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlUG9zKys7XHJcbiAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnUG9zc2libGUgYXR0cmlidXRlIHZhbHVlIHN0YXJ0IGF0ICcgKyB2YWx1ZVBvcyk7XHJcbiAgICAgICAgbGV0IHZhbHVlU3RhcnRQb3MgPSB2YWx1ZVBvcztcclxuICAgICAgICB3aGlsZSh0aGlzLmlzQXR0cmlidXRlQ29udGVudChkZXB0aCwgeG1sLCB2YWx1ZVBvcykpe1xyXG4gICAgICAgICAgICB2YWx1ZVBvcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih2YWx1ZVBvcyA9PSBjdXJzb3Ipe1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzLnNldChuYW1lLCAnJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZXMuc2V0KG5hbWUsIHhtbC5zdWJzdHJpbmcodmFsdWVTdGFydFBvcyx2YWx1ZVBvcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnRm91bmQgYXR0cmlidXRlIGNvbnRlbnQgZW5kaW5nIGF0ICcgKyAodmFsdWVQb3MtMSkpO1xyXG5cclxuICAgICAgICBpZigodmFsdWVQb3MgPSBSZWFkQWhlYWQucmVhZCh4bWwsJ1wiJyx2YWx1ZVBvcyx0cnVlKSkgIT0gLTEpe1xyXG4gICAgICAgICAgICB2YWx1ZVBvcysrO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoJ01pc3NpbmcgZW5kIHF1b3RlcyBvbiBhdHRyaWJ1dGUgYXQgcG9zaXRpb24gJyArIHZhbHVlUG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlUG9zO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpc0F0dHJpYnV0ZUNvbnRlbnQoZGVwdGgsIHhtbCwgY3Vyc29yKXtcclxuICAgICAgICBpZihSZWFkQWhlYWQucmVhZCh4bWwsJzwnLGN1cnNvcikgIT0gLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKFJlYWRBaGVhZC5yZWFkKHhtbCwnPicsY3Vyc29yKSAhPSAtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoUmVhZEFoZWFkLnJlYWQoeG1sLCdcIicsY3Vyc29yKSAhPSAtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCJjb3JldXRpbFwiXHJcblxyXG5leHBvcnQgY2xhc3MgWG1sQ2RhdGF7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHZhbHVlKXtcclxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRWYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZHVtcCgpe1xyXG4gICAgICAgIHRoaXMuZHVtcExldmVsKDApO1xyXG4gICAgfVxyXG5cclxuICAgIGR1bXBMZXZlbChsZXZlbCl7XHJcbiAgICAgICAgbGV0IHNwYWNlciA9ICc6JztcclxuICAgICAgICBmb3IobGV0IHNwYWNlID0gMCA7IHNwYWNlIDwgbGV2ZWwqMiA7IHNwYWNlICsrKXtcclxuICAgICAgICAgICAgc3BhY2VyID0gc3BhY2VyICsgJyAnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTG9nZ2VyLmxvZyhzcGFjZXIgKyB0aGlzLl92YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMb2dnZXIsIExpc3QsIE1hcH0gZnJvbSBcImNvcmV1dGlsXCJcclxuaW1wb3J0IHtYbWxDZGF0YX0gZnJvbSBcIi4veG1sQ2RhdGFcIlxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBYbWxFbGVtZW50e1xyXG5cclxuXHRjb25zdHJ1Y3RvcihuYW1lLCBuYW1lc3BhY2UsIHNlbGZDbG9zaW5nLCBjaGlsZEVsZW1lbnRzKXtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XHJcbiAgICAgICAgdGhpcy5fc2VsZkNsb3NpbmcgPSBzZWxmQ2xvc2luZztcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRzID0gbmV3IExpc3QoKTtcclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZXNwYWNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RnVsbE5hbWUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fbmFtZXNwYWNlID09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZSArICc6JyArIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXR0cmlidXRlcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcyl7XHJcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QXR0cmlidXRlKGtleSx2YWx1ZSkge1xyXG5cdFx0dGhpcy5fYXR0cmlidXRlcy5zZXQoa2V5LHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGdldEF0dHJpYnV0ZShrZXkpIHtcclxuXHRcdHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzLmdldChrZXkpO1xyXG5cdH1cclxuXHJcbiAgICBjb250YWluc0F0dHJpYnV0ZShrZXkpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzLmNvbnRhaW5zKGtleSk7XHJcbiAgICB9XHJcblxyXG5cdGNsZWFyQXR0cmlidXRlKCl7XHJcblx0XHR0aGlzLl9hdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xyXG5cdH1cclxuXHJcbiAgICBnZXRDaGlsZEVsZW1lbnRzKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkRWxlbWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q2hpbGRFbGVtZW50cyhlbGVtZW50cykge1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudHMgPSBlbGVtZW50cztcclxuICAgIH1cclxuXHJcbiAgICBzZXRUZXh0KHRleHQpe1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudHMgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuYWRkVGV4dCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUZXh0KHRleHQpe1xyXG4gICAgICAgIGxldCB0ZXh0RWxlbWVudCA9IG5ldyBYbWxDZGF0YSh0ZXh0KTtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRzLmFkZCh0ZXh0RWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHVtcCgpe1xyXG4gICAgICAgIHRoaXMuZHVtcExldmVsKDApO1xyXG4gICAgfVxyXG5cclxuICAgIGR1bXBMZXZlbChsZXZlbCl7XHJcbiAgICAgICAgbGV0IHNwYWNlciA9ICc6JztcclxuICAgICAgICBmb3IobGV0IHNwYWNlID0gMCA7IHNwYWNlIDwgbGV2ZWwqMiA7IHNwYWNlICsrKXtcclxuICAgICAgICAgICAgc3BhY2VyID0gc3BhY2VyICsgJyAnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5fc2VsZkNsb3Npbmcpe1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKHNwYWNlciArICc8JyArIHRoaXMuZ2V0RnVsbE5hbWUoKSArIHRoaXMucmVhZEF0dHJpYnV0ZXMoKSArICcvPicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExvZ2dlci5sb2coc3BhY2VyICsgJzwnICsgdGhpcy5nZXRGdWxsTmFtZSgpICsgdGhpcy5yZWFkQXR0cmlidXRlcygpICsgJz4nKTtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oY2hpbGRFbGVtZW50KXtcclxuICAgICAgICAgICAgY2hpbGRFbGVtZW50LmR1bXBMZXZlbChsZXZlbCsxKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTG9nZ2VyLmxvZyhzcGFjZXIgKyAnPC8nICsgdGhpcy5nZXRGdWxsTmFtZSgpICsgJz4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZWFkKCl7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIGlmKHRoaXMuX3NlbGZDbG9zaW5nKXtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgJzwnICsgdGhpcy5nZXRGdWxsTmFtZSgpICsgdGhpcy5yZWFkQXR0cmlidXRlcygpICsgJy8+JztcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgJzwnICsgdGhpcy5nZXRGdWxsTmFtZSgpICsgdGhpcy5yZWFkQXR0cmlidXRlcygpICsgJz4nO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihjaGlsZEVsZW1lbnQpe1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBjaGlsZEVsZW1lbnQucmVhZCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAnPC8nICsgdGhpcy5nZXRGdWxsTmFtZSgpICsgJz4nO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZEF0dHJpYnV0ZXMoKXtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksYXR0cmlidXRlLHBhcmVudCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAnICcgKyBhdHRyaWJ1dGUuZ2V0TmFtZSgpO1xyXG4gICAgICAgICAgICBpZihhdHRyaWJ1dGUuZ2V0VmFsdWUoKSAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArICc9XCInICsgYXR0cmlidXRlLmdldFZhbHVlKCkgKyAnXCInO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBYbWxBdHRyaWJ1dGUge1xyXG5cclxuICBjb25zdHJ1Y3RvcihuYW1lLHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0TmFtZSgpe1xyXG4gICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIHNldE5hbWUodmFsKXtcclxuICAgICAgdGhpcy5fbmFtZSA9IHZhbDtcclxuICB9XHJcblxyXG4gIGdldFZhbHVlKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcclxuICB9XHJcblxyXG4gIHNldFZhbHVlKHZhbCl7XHJcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0xvZ2dlcn0gZnJvbSBcImNvcmV1dGlsXCJcclxuaW1wb3J0IHtSZWFkQWhlYWR9IGZyb20gXCIuLi9yZWFkQWhlYWRcIlxyXG5pbXBvcnQge0VsZW1lbnRCb2R5fSBmcm9tIFwiLi9lbGVtZW50Qm9keVwiXHJcbmltcG9ydCB7WG1sRWxlbWVudH0gZnJvbSBcIi4uLy4uL3htbEVsZW1lbnRcIlxyXG5pbXBvcnQge1htbEF0dHJpYnV0ZX0gZnJvbSBcIi4uLy4uL3htbEF0dHJpYnV0ZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgRWxlbWVudERldGVjdG9ye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9ICdFbGVtZW50RGV0ZWN0b3InO1xyXG4gICAgICAgIHRoaXMuX2hhc0NoaWxkcmVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZm91bmQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl94bWxDdXJzb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0ZvdW5kKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBoYXNDaGlsZHJlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFzQ2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZWN0KGRlcHRoLCB4bWxDdXJzb3Ipe1xyXG4gICAgICAgIHRoaXMuX3htbEN1cnNvciA9IHhtbEN1cnNvcjtcclxuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdMb29raW5nIGZvciBvcGVuaW5nIGVsZW1lbnQgYXQgcG9zaXRpb24gJyArIHhtbEN1cnNvci5jdXJzb3IpO1xyXG4gICAgICAgIGxldCBlbGVtZW50Qm9keSA9IG5ldyBFbGVtZW50Qm9keSgpO1xyXG4gICAgICAgIGxldCBlbmRwb3MgPSBFbGVtZW50RGV0ZWN0b3IuZGV0ZWN0T3BlbkVsZW1lbnQoZGVwdGgsIHhtbEN1cnNvci54bWwsIHhtbEN1cnNvci5jdXJzb3IsZWxlbWVudEJvZHkpO1xyXG4gICAgICAgIGlmKGVuZHBvcyAhPSAtMSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IG5ldyBYbWxFbGVtZW50KGVsZW1lbnRCb2R5LmdldE5hbWUoKSwgZWxlbWVudEJvZHkuZ2V0TmFtZXNwYWNlKCksIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnRCb2R5LmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGF0dHJpYnV0ZU5hbWUsYXR0cmlidXRlVmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5fZWxlbWVudC5nZXRBdHRyaWJ1dGVzKCkuc2V0KGF0dHJpYnV0ZU5hbWUsbmV3IFhtbEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sdGhpcyk7XHJcblxyXG4gICAgICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdGb3VuZCBvcGVuaW5nIHRhZyA8JyArIHRoaXMuX2VsZW1lbnQuZ2V0RnVsbE5hbWUoKSArICc+IGZyb20gJyArICB4bWxDdXJzb3IuY3Vyc29yICArICcgdG8gJyArIGVuZHBvcyk7XHJcbiAgICAgICAgICAgIHhtbEN1cnNvci5jdXJzb3IgPSBlbmRwb3MgKyAxO1xyXG5cclxuICAgICAgICAgICAgaWYoIXRoaXMuc3RvcChkZXB0aCkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFzQ2hpbGRyZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcChkZXB0aCl7XHJcbiAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnTG9va2luZyBmb3IgY2xvc2luZyBlbGVtZW50IGF0IHBvc2l0aW9uICcgKyB0aGlzLl94bWxDdXJzb3IuY3Vyc29yKTtcclxuICAgICAgICBsZXQgY2xvc2luZ0VsZW1lbnQgPSBFbGVtZW50RGV0ZWN0b3IuZGV0ZWN0RW5kRWxlbWVudChkZXB0aCwgdGhpcy5feG1sQ3Vyc29yLnhtbCwgdGhpcy5feG1sQ3Vyc29yLmN1cnNvcik7XHJcbiAgICAgICAgaWYoY2xvc2luZ0VsZW1lbnQgIT0gLTEpe1xyXG4gICAgICAgICAgICBsZXQgY2xvc2luZ1RhZ05hbWUgPSAgdGhpcy5feG1sQ3Vyc29yLnhtbC5zdWJzdHJpbmcodGhpcy5feG1sQ3Vyc29yLmN1cnNvcisyLGNsb3NpbmdFbGVtZW50KTtcclxuICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnRm91bmQgY2xvc2luZyB0YWcgPC8nICsgY2xvc2luZ1RhZ05hbWUgKyAnPiBmcm9tICcgKyAgdGhpcy5feG1sQ3Vyc29yLmN1cnNvciAgKyAnIHRvICcgKyBjbG9zaW5nRWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLl9lbGVtZW50LmdldEZ1bGxOYW1lKCkgIT0gY2xvc2luZ1RhZ05hbWUpe1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKCdFUlI6IE1pc21hdGNoIGJldHdlZW4gb3BlbmluZyB0YWcgPCcgKyB0aGlzLl9lbGVtZW50LmdldEZ1bGxOYW1lKCkgKyAnPiBhbmQgY2xvc2luZyB0YWcgPC8nICsgY2xvc2luZ1RhZ05hbWUgKyAnPiBXaGVuIGV4aXRpbmcgdG8gcGFyZW50IGVsZW1udCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3htbEN1cnNvci5jdXJzb3IgPSBjbG9zaW5nRWxlbWVudCArMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGV0ZWN0T3BlbkVsZW1lbnQoZGVwdGgsIHhtbCwgY3Vyc29yLCBlbGVtZW50Qm9keSkge1xyXG4gICAgICAgIGlmKChjdXJzb3IgPSBSZWFkQWhlYWQucmVhZCh4bWwsJzwnLGN1cnNvcikpID09IC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJzb3IgKys7XHJcbiAgICAgICAgY3Vyc29yID0gZWxlbWVudEJvZHkuZGV0ZWN0UG9zaXRpb25zKGRlcHRoKzEsIHhtbCwgY3Vyc29yKTtcclxuICAgICAgICBpZigoY3Vyc29yID0gUmVhZEFoZWFkLnJlYWQoeG1sLCc+JyxjdXJzb3IpKSA9PSAtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnNvcjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGV0ZWN0RW5kRWxlbWVudChkZXB0aCwgeG1sLCBjdXJzb3Ipe1xyXG4gICAgICAgIGlmKChjdXJzb3IgPSBSZWFkQWhlYWQucmVhZCh4bWwsJzwvJyxjdXJzb3IpKSA9PSAtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3Vyc29yICsrO1xyXG4gICAgICAgIGN1cnNvciA9IG5ldyBFbGVtZW50Qm9keSgpLmRldGVjdFBvc2l0aW9ucyhkZXB0aCsxLCB4bWwsIGN1cnNvcik7XHJcbiAgICAgICAgaWYoKGN1cnNvciA9IFJlYWRBaGVhZC5yZWFkKHhtbCwnPicsY3Vyc29yKSkgPT0gLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdXJzb3I7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiY29yZXV0aWxcIlxyXG5pbXBvcnQge1htbENkYXRhfSBmcm9tIFwiLi4vLi4veG1sQ2RhdGFcIlxyXG5pbXBvcnQge1JlYWRBaGVhZH0gZnJvbSBcIi4uL3JlYWRBaGVhZFwiXHJcblxyXG5leHBvcnQgY2xhc3MgQ2RhdGFEZXRlY3RvcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnQ2RhdGFEZXRlY3Rvcic7XHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2ZvdW5kID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNGb3VuZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgWG1sQ2RhdGEodGhpcy5fdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVjdChkZXB0aCwgeG1sQ3Vyc29yKXtcclxuICAgICAgICB0aGlzLl9mb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IGVuZFBvcyA9IHRoaXMuZGV0ZWN0Q29udGVudChkZXB0aCwgeG1sQ3Vyc29yLnhtbCwgeG1sQ3Vyc29yLmN1cnNvciwgeG1sQ3Vyc29yLnBhcmVudERvbVNjYWZmb2xkKTtcclxuICAgICAgICBpZihlbmRQb3MgIT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NoaWxkcmVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0geG1sQ3Vyc29yLnhtbC5zdWJzdHJpbmcoeG1sQ3Vyc29yLmN1cnNvcixlbmRQb3MpO1xyXG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yID0gZW5kUG9zO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXRlY3RDb250ZW50KGRlcHRoLCB4bWwsIGN1cnNvciwgcGFyZW50RG9tU2NhZmZvbGQpIHtcclxuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdDZGF0YSBzdGFydCBhdCAnICsgY3Vyc29yKTtcclxuICAgICAgICBsZXQgaW50ZXJuYWxTdGFydFBvcyA9IGN1cnNvcjtcclxuICAgICAgICBpZighQ2RhdGFEZXRlY3Rvci5pc0NvbnRlbnQoZGVwdGgsIHhtbCwgY3Vyc29yKSl7XHJcbiAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ05vIENkYXRhIGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUoQ2RhdGFEZXRlY3Rvci5pc0NvbnRlbnQoZGVwdGgsIHhtbCwgY3Vyc29yKSAmJiBjdXJzb3IgPCB4bWwubGVuZ3RoKXtcclxuICAgICAgICAgICAgY3Vyc29yICsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdDZGF0YSBlbmQgYXQgJyArIChjdXJzb3ItMSkpO1xyXG4gICAgICAgIGlmKHBhcmVudERvbVNjYWZmb2xkID09IG51bGwpe1xyXG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoJ0VSUjogQ29udGVudCBub3QgYWxsb3dlZCBvbiByb290IGxldmVsIGluIHhtbCBkb2N1bWVudCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ0NkYXRhIGZvdW5kIHZhbHVlIGlzICcgKyB4bWwuc3Vic3RyaW5nKGludGVybmFsU3RhcnRQb3MsY3Vyc29yKSk7XHJcbiAgICAgICAgcmV0dXJuIGN1cnNvcjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNDb250ZW50KGRlcHRoLCB4bWwsIGN1cnNvcil7XHJcbiAgICAgICAgaWYoUmVhZEFoZWFkLnJlYWQoeG1sLCc8JyxjdXJzb3IpICE9IC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihSZWFkQWhlYWQucmVhZCh4bWwsJz4nLGN1cnNvcikgIT0gLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiY29yZXV0aWxcIlxyXG5pbXBvcnQge1htbEVsZW1lbnR9IGZyb20gXCIuLi8uLi94bWxFbGVtZW50XCJcclxuaW1wb3J0IHtSZWFkQWhlYWR9IGZyb20gXCIuLi9yZWFkQWhlYWRcIlxyXG5pbXBvcnQge0VsZW1lbnRCb2R5fSBmcm9tIFwiLi9lbGVtZW50Qm9keVwiXHJcbmltcG9ydCB7WG1sQXR0cmlidXRlfSBmcm9tIFwiLi4vLi4veG1sQXR0cmlidXRlXCJcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xvc2luZ0VsZW1lbnREZXRlY3RvcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnQ2xvc2luZ0VsZW1lbnREZXRlY3Rvcic7XHJcbiAgICAgICAgdGhpcy5fZm91bmQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFR5cGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNGb3VuZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZWN0KGRlcHRoLCB4bWxDdXJzb3IpIHtcclxuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdMb29raW5nIGZvciBzZWxmIGNsb3NpbmcgZWxlbWVudCBhdCBwb3NpdGlvbiAnICsgeG1sQ3Vyc29yLmN1cnNvcik7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRCb2R5ID0gbmV3IEVsZW1lbnRCb2R5KCk7XHJcbiAgICAgICAgbGV0IGVuZHBvcyA9IENsb3NpbmdFbGVtZW50RGV0ZWN0b3IuZGV0ZWN0Q2xvc2luZ0VsZW1lbnQoZGVwdGgsIHhtbEN1cnNvci54bWwsIHhtbEN1cnNvci5jdXJzb3IsZWxlbWVudEJvZHkpO1xyXG4gICAgICAgIGlmKGVuZHBvcyAhPSAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBuZXcgWG1sRWxlbWVudChlbGVtZW50Qm9keS5nZXROYW1lKCksIGVsZW1lbnRCb2R5LmdldE5hbWVzcGFjZSgpLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnRCb2R5LmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGF0dHJpYnV0ZU5hbWUsYXR0cmlidXRlVmFsdWUscGFyZW50KXtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSxuZXcgWG1sQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSx0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ0ZvdW5kIHNlbGYgY2xvc2luZyB0YWcgPCcgKyB0aGlzLl9lbGVtZW50LmdldEZ1bGxOYW1lKCkgKyAnLz4gZnJvbSAnICsgIHhtbEN1cnNvci5jdXJzb3IgICsgJyB0byAnICsgZW5kcG9zKTtcclxuICAgICAgICAgICAgdGhpcy5fZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yID0gZW5kcG9zICsgMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRldGVjdENsb3NpbmdFbGVtZW50KGRlcHRoLCB4bWwsIGN1cnNvciwgZWxlbWVudEJvZHkpe1xyXG4gICAgICAgIGlmKChjdXJzb3IgPSBSZWFkQWhlYWQucmVhZCh4bWwsJzwnLGN1cnNvcikpID09IC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJzb3IgKys7XHJcbiAgICAgICAgY3Vyc29yID0gZWxlbWVudEJvZHkuZGV0ZWN0UG9zaXRpb25zKGRlcHRoKzEsIHhtbCwgY3Vyc29yKTtcclxuICAgICAgICBpZigoY3Vyc29yID0gUmVhZEFoZWFkLnJlYWQoeG1sLCcvPicsY3Vyc29yKSkgPT0gLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdXJzb3I7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFhtbEN1cnNvcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4bWwsIGN1cnNvciwgcGFyZW50RG9tU2NhZmZvbGQpe1xyXG4gICAgICAgIHRoaXMueG1sID0geG1sO1xyXG4gICAgICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xyXG4gICAgICAgIHRoaXMucGFyZW50RG9tU2NhZmZvbGQgPSBwYXJlbnREb21TY2FmZm9sZDtcclxuICAgIH1cclxuXHJcbiAgICBlb2YoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJzb3IgPj0gdGhpcy54bWwubGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlzdH0gZnJvbSBcImNvcmV1dGlsXCJcclxuaW1wb3J0IHtFbGVtZW50RGV0ZWN0b3J9IGZyb20gXCIuL2RldGVjdG9ycy9lbGVtZW50RGV0ZWN0b3JcIlxyXG5pbXBvcnQge0NkYXRhRGV0ZWN0b3J9IGZyb20gXCIuL2RldGVjdG9ycy9jZGF0YURldGVjdG9yXCJcclxuaW1wb3J0IHtDbG9zaW5nRWxlbWVudERldGVjdG9yfSBmcm9tIFwiLi9kZXRlY3RvcnMvY2xvc2luZ0VsZW1lbnREZXRlY3RvclwiXHJcbmltcG9ydCB7WG1sQ3Vyc29yfSBmcm9tIFwiLi94bWxDdXJzb3JcIlxyXG5cclxuZXhwb3J0IGNsYXNzIERvbVNjYWZmb2xke1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRG9tU2NhZmZvbGRzID0gbmV3IExpc3QoKTtcclxuICAgICAgICB0aGlzLl9kZXRlY3RvcnMgPSBuZXcgTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnRDcmVhdGVkTGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2RldGVjdG9ycy5hZGQobmV3IEVsZW1lbnREZXRlY3RvcigpKTtcclxuICAgICAgICB0aGlzLl9kZXRlY3RvcnMuYWRkKG5ldyBDZGF0YURldGVjdG9yKCkpO1xyXG4gICAgICAgIHRoaXMuX2RldGVjdG9ycy5hZGQobmV3IENsb3NpbmdFbGVtZW50RGV0ZWN0b3IoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKHhtbCwgY3Vyc29yLCBlbGVtZW50Q3JlYXRlZExpc3RlbmVyKXtcclxuICAgICAgICBsZXQgeG1sQ3Vyc29yID0gbmV3IFhtbEN1cnNvcih4bWwsIGN1cnNvciwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5sb2FkRGVwdGgoMSwgeG1sQ3Vyc29yLCBlbGVtZW50Q3JlYXRlZExpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRGVwdGgoZGVwdGgsIHhtbEN1cnNvciwgZWxlbWVudENyZWF0ZWRMaXN0ZW5lcil7XHJcbiAgICAgICAgY29yZXV0aWwuTG9nZ2VyLnNob3dQb3MoeG1sQ3Vyc29yLnhtbCwgeG1sQ3Vyc29yLmN1cnNvcik7XHJcbiAgICAgICAgY29yZXV0aWwuTG9nZ2VyLmRlYnVnKGRlcHRoLCAnU3RhcnRpbmcgRG9tU2NhZmZvbGQnKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50Q3JlYXRlZExpc3RlbmVyID0gZWxlbWVudENyZWF0ZWRMaXN0ZW5lcjtcclxuXHJcbiAgICAgICAgaWYoeG1sQ3Vyc29yLmVvZigpKXtcclxuICAgICAgICAgICAgY29yZXV0aWwuTG9nZ2VyLmRlYnVnKGRlcHRoLCAnUmVhY2hlZCBlb2YuIEV4aXRpbmcnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnREZXRlY3RvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZGV0ZWN0b3JzLmZvckVhY2goZnVuY3Rpb24oY3VyRWxlbWVudERldGVjdG9yLHBhcmVudCl7XHJcbiAgICAgICAgICAgIGNvcmV1dGlsLkxvZ2dlci5kZWJ1ZyhkZXB0aCwgJ1N0YXJ0aW5nICcgKyBjdXJFbGVtZW50RGV0ZWN0b3IuZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgY3VyRWxlbWVudERldGVjdG9yLmRldGVjdChkZXB0aCArIDEseG1sQ3Vyc29yKTtcclxuICAgICAgICAgICAgaWYoIWN1ckVsZW1lbnREZXRlY3Rvci5pc0ZvdW5kKCkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudERldGVjdG9yID0gY3VyRWxlbWVudERldGVjdG9yO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSx0aGlzKTtcclxuXHJcbiAgICAgICAgaWYoZWxlbWVudERldGVjdG9yID09IG51bGwpe1xyXG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yKys7XHJcbiAgICAgICAgICAgIGNvcmV1dGlsLkxvZ2dlci53YXJuKCdXQVJOOiBObyBoYW5kbGVyIHdhcyBmb3VuZCBzZWFyY2hpbmcgZnJvbSBwb3NpdGlvbjogJyArIHhtbEN1cnNvci5jdXJzb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnREZXRlY3Rvci5jcmVhdGVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIGlmKGVsZW1lbnREZXRlY3RvciBpbnN0YW5jZW9mIEVsZW1lbnREZXRlY3RvciAmJiBlbGVtZW50RGV0ZWN0b3IuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICB3aGlsZSghZWxlbWVudERldGVjdG9yLnN0b3AoZGVwdGggKyAxKSAmJiB4bWxDdXJzb3IuY3Vyc29yIDwgeG1sQ3Vyc29yLnhtbC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpb3VzUGFyZW50U2NhZmZvbGQgPSB4bWxDdXJzb3IucGFyZW50RG9tU2NhZmZvbGQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRTY2FmZm9sZCA9IG5ldyBEb21TY2FmZm9sZCgpO1xyXG4gICAgICAgICAgICAgICAgeG1sQ3Vyc29yLnBhcmVudERvbVNjYWZmb2xkID0gY2hpbGRTY2FmZm9sZDtcclxuICAgICAgICAgICAgICAgIGNoaWxkU2NhZmZvbGQubG9hZERlcHRoKGRlcHRoKzEsIHhtbEN1cnNvciwgdGhpcy5fZWxlbWVudENyZWF0ZWRMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZERvbVNjYWZmb2xkcy5hZGQoY2hpbGRTY2FmZm9sZCk7XHJcbiAgICAgICAgICAgICAgICB4bWxDdXJzb3IucGFyZW50RG9tU2NhZmZvbGQgPSBwcmV2aW91c1BhcmVudFNjYWZmb2xkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvcmV1dGlsLkxvZ2dlci5zaG93UG9zKHhtbEN1cnNvci54bWwsIHhtbEN1cnNvci5jdXJzb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRyZWUocGFyZW50Tm90aWZ5UmVzdWx0KXtcclxuICAgICAgICBpZih0aGlzLl9lbGVtZW50ID09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBub3RpZnlSZXN1bHQgPSB0aGlzLm5vdGlmeUVsZW1lbnRDcmVhdGVkTGlzdGVuZXIodGhpcy5fZWxlbWVudCxwYXJlbnROb3RpZnlSZXN1bHQpO1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZERvbVNjYWZmb2xkcy5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkRG9tU2NhZmZvbGQscGFyZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZEVsZW1lbnQgPSBjaGlsZERvbVNjYWZmb2xkLmdldFRyZWUobm90aWZ5UmVzdWx0KTtcclxuICAgICAgICAgICAgaWYoY2hpbGRFbGVtZW50ICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Ll9lbGVtZW50LmdldENoaWxkRWxlbWVudHMoKS5hZGQoY2hpbGRFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBub3RpZnlFbGVtZW50Q3JlYXRlZExpc3RlbmVyKGVsZW1lbnQsIHBhcmVudE5vdGlmeVJlc3VsdCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2VsZW1lbnRDcmVhdGVkTGlzdGVuZXIgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50Q3JlYXRlZExpc3RlbmVyLmVsZW1lbnRDcmVhdGVkKGVsZW1lbnQsIHBhcmVudE5vdGlmeVJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0RvbVNjYWZmb2xkfSBmcm9tIFwiLi9wYXJzZXIvZG9tU2NhZmZvbGRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIERvbVRyZWV7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeG1sLCBlbGVtZW50Q3JlYXRlZExpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudENyZWF0ZWRMaXN0ZW5lciA9IGVsZW1lbnRDcmVhdGVkTGlzdGVuZXI7XHJcbiAgICAgICAgdGhpcy5feG1sID0geG1sO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSb290RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdEVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um9vdEVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKCl7XHJcbiAgICAgICAgbGV0IGRvbVNjYWZmb2xkID0gbmV3IERvbVNjYWZmb2xkKCk7XHJcbiAgICAgICAgZG9tU2NhZmZvbGQubG9hZCh0aGlzLl94bWwsMCx0aGlzLl9lbGVtZW50Q3JlYXRlZExpc3RlbmVyKTtcclxuICAgICAgICB0aGlzLl9yb290RWxlbWVudCA9IGRvbVNjYWZmb2xkLmdldFRyZWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBkdW1wKCl7XHJcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuZHVtcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdEVsZW1lbnQucmVhZCgpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIEM6XFxnaXRcXHdlYmNsaWVudD5cclxuLy8gYmFiZWwgLlxcc3JjXFxoZWxsb1dvcmxkXFwgLS1vdXQtZmlsZSAuXFxvdXRcXGhlbGxvd29ybGRcXGRvbVBhcnNlci5qcyAtLW1hcC1zb3VyY2VzXHJcbi8vIG5vZGUgLlxcb3V0XFxoZWxsb3dvcmxkXFxkb21QYXJzZXIuanNcclxuXHJcbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiY29yZXV0aWxcIlxyXG5cclxuaWYodHlwZW9mIGRvY3VtZW50ID09ICd1bmRlZmluZWQnKXtcclxuICAgIExvZ2dlci5kZWJ1Z0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIHZhciBkb21UcmVlID0gbmV3IERvbVRyZWUoJzxkaXYgdGVzdDIgdGVzdDM9IFwiXCIgdGVzdCA9XCIxMjNcIj48c3BhbiBpZD1cIjFcIj48aDE+SGVsbG8gJmFtcDsgd29ybGQ8L2gxPjwvc3Bhbj48cD48YnIgaGVsbG8gPSBcInRydWVcIiBoZWxsbzIvPkhlbGxvPGJyLz48L3A+PHNwYW4+V29ybGQ8L3NwYW4+IDwvZGl2PicpO1xyXG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnU3RhcnQgcGFyc2luZyAnICsgbm93LmdldFRpbWUoKSk7XHJcbiAgICBkb21UcmVlLmxvYWQoKTtcclxuICAgIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnRW5kIHBhcnNpbmcgJyArIG5vdy5nZXRUaW1lKCkpO1xyXG4gICAgZG9tVHJlZS5kdW1wKCk7XHJcbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc29sZS5sb2coJ0R1bXBlZCAnICsgbm93LmdldFRpbWUoKSk7XHJcblxyXG59XHJcbiJdLCJuYW1lcyI6WyJNYXAiLCJTdHJpbmdVdGlscyIsIkxvZ2dlciIsIkxpc3QiLCJEb21UcmVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxNQUFNLFNBQVM7O0lBRWxCLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUN6RCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEQsTUFBTSxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztnQkFDMUQsY0FBYyxFQUFFLENBQUM7YUFDcEI7WUFDRCxHQUFHLEtBQUssQ0FBQyxNQUFNLENB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
