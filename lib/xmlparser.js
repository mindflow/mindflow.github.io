(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('coreutil')) :
  typeof define === 'function' && define.amd ? define(['exports', 'coreutil'], factory) :
  (factory((global.xmlparser = {}),global.coreutil));
}(this, (function (exports,coreutil$1) { 'use strict';

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

  var ReadAhead = function () {
      function ReadAhead() {
          classCallCheck(this, ReadAhead);
      }

      createClass(ReadAhead, null, [{
          key: 'read',
          value: function read(value, matcher, cursor) {
              var ignoreWhitespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

              var internalCursor = cursor;
              for (var i = 0; i < matcher.length && i < value.length; i++) {
                  while (ignoreWhitespace && value.charAt(internalCursor) == ' ') {
                      internalCursor++;
                  }
                  if (value.charAt(internalCursor) == matcher.charAt(i)) {
                      internalCursor++;
                  } else {
                      return -1;
                  }
              }

              return internalCursor - 1;
          }
      }]);
      return ReadAhead;
  }();

  /* jshint esversion: 6 */

  var XmlAttribute = function () {
      function XmlAttribute(name, namespace, value) {
          classCallCheck(this, XmlAttribute);

          this._name = name;
          this._namespace = namespace;
          this._value = value;
      }

      createClass(XmlAttribute, [{
          key: "getName",
          value: function getName() {
              return this._name;
          }
      }, {
          key: "setName",
          value: function setName(val) {
              this._name = val;
          }
      }, {
          key: "getNamespace",
          value: function getNamespace() {
              return this._namespace;
          }
      }, {
          key: "setNamespace",
          value: function setNamespace(val) {
              this._namespace = val;
          }
      }, {
          key: "getValue",
          value: function getValue() {
              return this._value;
          }
      }, {
          key: "setValue",
          value: function setValue(val) {
              this._value = val;
          }
      }]);
      return XmlAttribute;
  }();

  /* jshint esversion: 6 */

  var ElementBody = function () {
      function ElementBody() {
          classCallCheck(this, ElementBody);

          this._name = null;
          this._namespace = null;
          this._attributes = new coreutil$1.Map();
      }

      createClass(ElementBody, [{
          key: "getName",
          value: function getName() {
              return this._name;
          }
      }, {
          key: "getNamespace",
          value: function getNamespace() {
              return this._namespace;
          }
      }, {
          key: "getAttributes",
          value: function getAttributes() {
              return this._attributes;
          }
      }, {
          key: "detectPositions",
          value: function detectPositions(depth, xml, cursor) {
              var nameStartpos = cursor;
              var nameEndpos = null;
              while (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor)) && cursor < xml.length) {
                  cursor++;
              }
              if (xml.charAt(cursor) == ':') {
                  coreutil$1.Logger.debug(depth, 'Found namespace');
                  cursor++;
                  while (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor)) && cursor < xml.length) {
                      cursor++;
                  }
              }
              nameEndpos = cursor - 1;
              this._name = xml.substring(nameStartpos, nameEndpos + 1);
              if (this._name.indexOf(":") > -1) {
                  this._namespace = this._name.split(":")[0];
                  this._name = this._name.split(":")[1];
              }
              cursor = this.detectAttributes(depth, xml, cursor);
              return cursor;
          }
      }, {
          key: "detectAttributes",
          value: function detectAttributes(depth, xml, cursor) {
              var detectedAttrNameCursor = null;
              while ((detectedAttrNameCursor = this.detectNextStartAttribute(depth, xml, cursor)) != -1) {
                  cursor = this.detectNextEndAttribute(depth, xml, detectedAttrNameCursor);
                  var namespace = null;
                  var name = xml.substring(detectedAttrNameCursor, cursor + 1);

                  if (name.indexOf(":") > -1) {
                      namespace = name.split(":")[0];
                      name = name.split(":")[1];
                  }

                  coreutil$1.Logger.debug(depth, 'Found attribute from ' + detectedAttrNameCursor + '  to ' + cursor);
                  cursor = this.detectValue(name, namespace, depth, xml, cursor + 1);
              }
              return cursor;
          }
      }, {
          key: "detectNextStartAttribute",
          value: function detectNextStartAttribute(depth, xml, cursor) {
              while (xml.charAt(cursor) == ' ' && cursor < xml.length) {
                  cursor++;
                  if (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor))) {
                      return cursor;
                  }
              }
              return -1;
          }
      }, {
          key: "detectNextEndAttribute",
          value: function detectNextEndAttribute(depth, xml, cursor) {
              while (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor))) {
                  cursor++;
              }
              if (xml.charAt(cursor) == ":") {
                  cursor++;
                  while (coreutil$1.StringUtils.isInAlphabet(xml.charAt(cursor))) {
                      cursor++;
                  }
              }
              return cursor - 1;
          }
      }, {
          key: "detectValue",
          value: function detectValue(name, namespace, depth, xml, cursor) {
              var valuePos = cursor;
              var fullname = name;
              if (namespace !== null) {
                  fullname = namespace + ":" + name;
              }
              if ((valuePos = ReadAhead.read(xml, '="', valuePos, true)) == -1) {
                  this._attributes.set(fullname, new XmlAttribute(name, namespace, null));
                  return cursor;
              }
              valuePos++;
              coreutil$1.Logger.debug(depth, 'Possible attribute value start at ' + valuePos);
              var valueStartPos = valuePos;
              while (this.isAttributeContent(depth, xml, valuePos)) {
                  valuePos++;
              }
              if (valuePos == cursor) {
                  this._attributes.set(fullname, new XmlAttribute(name, namespace, ''));
              } else {
                  this._attributes.set(fullname, new XmlAttribute(name, namespace, xml.substring(valueStartPos, valuePos)));
              }

              coreutil$1.Logger.debug(depth, 'Found attribute content ending at ' + (valuePos - 1));

              if ((valuePos = ReadAhead.read(xml, '"', valuePos, true)) != -1) {
                  valuePos++;
              } else {
                  coreutil$1.Logger.error('Missing end quotes on attribute at position ' + valuePos);
              }
              return valuePos;
          }
      }, {
          key: "isAttributeContent",
          value: function isAttributeContent(depth, xml, cursor) {
              if (ReadAhead.read(xml, '<', cursor) != -1) {
                  return false;
              }
              if (ReadAhead.read(xml, '>', cursor) != -1) {
                  return false;
              }
              if (ReadAhead.read(xml, '"', cursor) != -1) {
                  return false;
              }
              return true;
          }
      }]);
      return ElementBody;
  }();

  /* jshint esversion: 6 */

  var XmlCdata = function () {
      function XmlCdata(value) {
          classCallCheck(this, XmlCdata);

          this._value = value;
      }

      createClass(XmlCdata, [{
          key: 'setValue',
          value: function setValue(value) {
              this._value = value;
          }
      }, {
          key: 'getValue',
          value: function getValue() {
              return this._value;
          }
      }, {
          key: 'dump',
          value: function dump() {
              this.dumpLevel(0);
          }
      }, {
          key: 'dumpLevel',
          value: function dumpLevel(level) {
              var spacer = ':';
              for (var space = 0; space < level * 2; space++) {
                  spacer = spacer + ' ';
              }

              coreutil$1.Logger.log(spacer + this._value);
              return;
          }
      }, {
          key: 'read',
          value: function read() {
              return this._value;
          }
      }]);
      return XmlCdata;
  }();

  /* jshint esversion: 6 */

  var XmlElement = function () {
      function XmlElement(name, namespace, namespaceUriMap, selfClosing, childElements) {
          classCallCheck(this, XmlElement);

          this._name = name;
          this._namespace = namespace;
          this._selfClosing = selfClosing;
          this._childElements = new coreutil$1.List();
          this._attributes = new coreutil$1.Map();
          this._namespaceUriMap = namespaceUriMap;
          this._namespaceUri = null;
          if (this._namespace !== null && this._namespace !== undefined) {
              this._namespaceUri = this._namespaceUriMap.get(this._namespace);
          }
      }

      createClass(XmlElement, [{
          key: "getName",
          value: function getName() {
              return this._name;
          }
      }, {
          key: "getNamespace",
          value: function getNamespace() {
              return this._namespace;
          }
      }, {
          key: "getNamespaceUri",
          value: function getNamespaceUri() {
              return this._namespaceUri;
          }
      }, {
          key: "getFullName",
          value: function getFullName() {
              if (this._namespace === null) {
                  return this._name;
              }

              return this._namespace + ':' + this._name;
          }
      }, {
          key: "getAttributes",
          value: function getAttributes() {
              return this._attributes;
          }
      }, {
          key: "setAttributes",
          value: function setAttributes(attributes) {
              this._attributes = attributes;
          }
      }, {
          key: "setAttribute",
          value: function setAttribute(key, value) {
              this._attributes.set(key, value);
          }
      }, {
          key: "getAttribute",
          value: function getAttribute(key) {
              return this._attributes.get(key);
          }
      }, {
          key: "containsAttribute",
          value: function containsAttribute(key) {
              return this._attributes.contains(key);
          }
      }, {
          key: "clearAttribute",
          value: function clearAttribute() {
              this._attributes = new coreutil$1.Map();
          }
      }, {
          key: "getChildElements",
          value: function getChildElements() {
              return this._childElements;
          }
      }, {
          key: "setChildElements",
          value: function setChildElements(elements) {
              this._childElements = elements;
          }
      }, {
          key: "setText",
          value: function setText(text) {
              this._childElements = new coreutil$1.List();
              this.addText(text);
          }
      }, {
          key: "addText",
          value: function addText(text) {
              var textElement = new XmlCdata(text);
              this._childElements.add(textElement);
          }
      }, {
          key: "dump",
          value: function dump() {
              this.dumpLevel(0);
          }
      }, {
          key: "dumpLevel",
          value: function dumpLevel(level) {
              var spacer = ':';
              for (var space = 0; space < level * 2; space++) {
                  spacer = spacer + ' ';
              }

              if (this._selfClosing) {
                  coreutil$1.Logger.log(spacer + '<' + this.getFullName() + this.readAttributes() + '/>');
                  return;
              }
              coreutil$1.Logger.log(spacer + '<' + this.getFullName() + this.readAttributes() + '>');
              this._childElements.forEach(function (childElement) {
                  childElement.dumpLevel(level + 1);
                  return true;
              });
              coreutil$1.Logger.log(spacer + '</' + this.getFullName() + '>');
          }
      }, {
          key: "read",
          value: function read() {
              var result = '';
              if (this._selfClosing) {
                  result = result + '<' + this.getFullName() + this.readAttributes() + '/>';
                  return result;
              }
              result = result + '<' + this.getFullName() + this.readAttributes() + '>';
              this._childElements.forEach(function (childElement) {
                  result = result + childElement.read();
                  return true;
              });
              result = result + '</' + this.getFullName() + '>';
              return result;
          }
      }, {
          key: "readAttributes",
          value: function readAttributes() {
              var result = '';
              this._attributes.forEach(function (key, attribute, parent) {
                  var fullname = attribute.getName();
                  if (attribute.getNamespace() !== null) {
                      fullname = attribute.getNamespace() + ":" + attribute.getName();
                  }
                  result = result + ' ' + fullname;
                  if (attribute.getValue() !== null) {
                      result = result + '="' + attribute.getValue() + '"';
                  }
                  return true;
              }, this);
              return result;
          }
      }]);
      return XmlElement;
  }();

  /* jshint esversion: 6 */

  var ElementDetector = function () {
      function ElementDetector(namespaceUriMap) {
          classCallCheck(this, ElementDetector);

          this._type = 'ElementDetector';
          this._namespaceUriMap = namespaceUriMap;
          this._hasChildren = false;
          this._found = false;
          this._xmlCursor = null;
          this._element = null;
      }

      createClass(ElementDetector, [{
          key: "createElement",
          value: function createElement() {
              return this._element;
          }
      }, {
          key: "getType",
          value: function getType() {
              return this._type;
          }
      }, {
          key: "isFound",
          value: function isFound() {
              return this._found;
          }
      }, {
          key: "hasChildren",
          value: function hasChildren() {
              return this._hasChildren;
          }
      }, {
          key: "detect",
          value: function detect(depth, xmlCursor) {
              this._xmlCursor = xmlCursor;
              coreutil$1.Logger.debug(depth, 'Looking for opening element at position ' + xmlCursor.cursor);
              var elementBody = new ElementBody();
              var endpos = ElementDetector.detectOpenElement(depth, xmlCursor.xml, xmlCursor.cursor, elementBody);
              if (endpos != -1) {

                  this._element = new XmlElement(elementBody.getName(), elementBody.getNamespace(), this._namespaceUriMap, false);

                  elementBody.getAttributes().forEach(function (attributeName, attributeValue, parent) {
                      parent._element.getAttributes().set(attributeName, attributeValue);
                      return true;
                  }, this);

                  coreutil$1.Logger.debug(depth, 'Found opening tag <' + this._element.getFullName() + '> from ' + xmlCursor.cursor + ' to ' + endpos);
                  xmlCursor.cursor = endpos + 1;

                  if (!this.stop(depth)) {
                      this._hasChildren = true;
                  }
                  this._found = true;
              }
          }
      }, {
          key: "stop",
          value: function stop(depth) {
              coreutil$1.Logger.debug(depth, 'Looking for closing element at position ' + this._xmlCursor.cursor);
              var closingElement = ElementDetector.detectEndElement(depth, this._xmlCursor.xml, this._xmlCursor.cursor);
              if (closingElement != -1) {
                  var closingTagName = this._xmlCursor.xml.substring(this._xmlCursor.cursor + 2, closingElement);
                  coreutil$1.Logger.debug(depth, 'Found closing tag </' + closingTagName + '> from ' + this._xmlCursor.cursor + ' to ' + closingElement);

                  if (this._element.getFullName() != closingTagName) {
                      coreutil$1.Logger.error('ERR: Mismatch between opening tag <' + this._element.getFullName() + '> and closing tag </' + closingTagName + '> When exiting to parent elemnt');
                  }
                  this._xmlCursor.cursor = closingElement + 1;
                  return true;
              }
              return false;
          }
      }], [{
          key: "detectOpenElement",
          value: function detectOpenElement(depth, xml, cursor, elementBody) {
              if ((cursor = ReadAhead.read(xml, '<', cursor)) == -1) {
                  return -1;
              }
              cursor++;
              cursor = elementBody.detectPositions(depth + 1, xml, cursor);
              if ((cursor = ReadAhead.read(xml, '>', cursor)) == -1) {
                  return -1;
              }
              return cursor;
          }
      }, {
          key: "detectEndElement",
          value: function detectEndElement(depth, xml, cursor) {
              if ((cursor = ReadAhead.read(xml, '</', cursor)) == -1) {
                  return -1;
              }
              cursor++;
              cursor = new ElementBody().detectPositions(depth + 1, xml, cursor);
              if ((cursor = ReadAhead.read(xml, '>', cursor)) == -1) {
                  return -1;
              }
              return cursor;
          }
      }]);
      return ElementDetector;
  }();

  /* jshint esversion: 6 */

  var CdataDetector = function () {
      function CdataDetector() {
          classCallCheck(this, CdataDetector);

          this._type = 'CdataDetector';
          this._value = null;
          this._found = false;
      }

      createClass(CdataDetector, [{
          key: "isFound",
          value: function isFound() {
              return this._found;
          }
      }, {
          key: "getType",
          value: function getType() {
              return this._type;
          }
      }, {
          key: "createElement",
          value: function createElement() {
              return new XmlCdata(this._value);
          }
      }, {
          key: "detect",
          value: function detect(depth, xmlCursor) {
              this._found = false;
              this._value = null;

              var endPos = this.detectContent(depth, xmlCursor.xml, xmlCursor.cursor, xmlCursor.parentDomScaffold);
              if (endPos != -1) {
                  this._found = true;
                  this.hasChildren = false;
                  this._value = xmlCursor.xml.substring(xmlCursor.cursor, endPos);
                  xmlCursor.cursor = endPos;
              }
          }
      }, {
          key: "detectContent",
          value: function detectContent(depth, xml, cursor, parentDomScaffold) {
              coreutil$1.Logger.debug(depth, 'Cdata start at ' + cursor);
              var internalStartPos = cursor;
              if (!CdataDetector.isContent(depth, xml, cursor)) {
                  coreutil$1.Logger.debug(depth, 'No Cdata found');
                  return -1;
              }
              while (CdataDetector.isContent(depth, xml, cursor) && cursor < xml.length) {
                  cursor++;
              }
              coreutil$1.Logger.debug(depth, 'Cdata end at ' + (cursor - 1));
              if (parentDomScaffold === null) {
                  coreutil$1.Logger.error('ERR: Content not allowed on root level in xml document');
                  return -1;
              }
              coreutil$1.Logger.debug(depth, 'Cdata found value is ' + xml.substring(internalStartPos, cursor));
              return cursor;
          }
      }], [{
          key: "isContent",
          value: function isContent(depth, xml, cursor) {
              if (ReadAhead.read(xml, '<', cursor) != -1) {
                  return false;
              }
              if (ReadAhead.read(xml, '>', cursor) != -1) {
                  return false;
              }
              return true;
          }
      }]);
      return CdataDetector;
  }();

  /* jshint esversion: 6 */

  var ClosingElementDetector = function () {
      function ClosingElementDetector(namespaceUriMap) {
          classCallCheck(this, ClosingElementDetector);

          this._type = 'ClosingElementDetector';
          this._namespaceUriMap = namespaceUriMap;
          this._found = false;
          this._element = null;
      }

      createClass(ClosingElementDetector, [{
          key: "createElement",
          value: function createElement() {
              return this._element;
          }
      }, {
          key: "getType",
          value: function getType() {
              return this._type;
          }
      }, {
          key: "isFound",
          value: function isFound() {
              return this._found;
          }
      }, {
          key: "detect",
          value: function detect(depth, xmlCursor) {
              coreutil$1.Logger.debug(depth, 'Looking for self closing element at position ' + xmlCursor.cursor);
              var elementBody = new ElementBody();
              var endpos = ClosingElementDetector.detectClosingElement(depth, xmlCursor.xml, xmlCursor.cursor, elementBody);
              if (endpos != -1) {
                  this._element = new XmlElement(elementBody.getName(), elementBody.getNamespace(), this._namespaceUriMap, true);

                  elementBody.getAttributes().forEach(function (attributeName, attributeValue, parent) {
                      parent._element.setAttribute(attributeName, attributeValue);
                      return true;
                  }, this);

                  coreutil$1.Logger.debug(depth, 'Found self closing tag <' + this._element.getFullName() + '/> from ' + xmlCursor.cursor + ' to ' + endpos);
                  this._found = true;
                  xmlCursor.cursor = endpos + 1;
              }
          }
      }], [{
          key: "detectClosingElement",
          value: function detectClosingElement(depth, xml, cursor, elementBody) {
              if ((cursor = ReadAhead.read(xml, '<', cursor)) == -1) {
                  return -1;
              }
              cursor++;
              cursor = elementBody.detectPositions(depth + 1, xml, cursor);
              if ((cursor = ReadAhead.read(xml, '/>', cursor)) == -1) {
                  return -1;
              }
              return cursor;
          }
      }]);
      return ClosingElementDetector;
  }();

  /* jshint esversion: 6 */

  var XmlCursor = function () {
      function XmlCursor(xml, cursor, parentDomScaffold) {
          classCallCheck(this, XmlCursor);

          this.xml = xml;
          this.cursor = cursor;
          this.parentDomScaffold = parentDomScaffold;
      }

      createClass(XmlCursor, [{
          key: "eof",
          value: function eof() {
              return this.cursor >= this.xml.length;
          }
      }]);
      return XmlCursor;
  }();

  /* jshint esversion: 6 */

  var DomScaffold = function () {
      function DomScaffold(namespaceUriMap) {
          classCallCheck(this, DomScaffold);

          this._namespaceUriMap = namespaceUriMap;
          this._element = null;
          this._childDomScaffolds = new coreutil$1.List();
          this._detectors = new coreutil$1.List();
          this._elementCreatedListener = null;
          this._detectors.add(new ElementDetector(this._namespaceUriMap));
          this._detectors.add(new CdataDetector());
          this._detectors.add(new ClosingElementDetector(this._namespaceUriMap));
      }

      createClass(DomScaffold, [{
          key: "getElement",
          value: function getElement() {
              return this._element;
          }
      }, {
          key: "load",
          value: function load(xml, cursor, elementCreatedListener) {
              var xmlCursor = new XmlCursor(xml, cursor, null);
              this.loadDepth(1, xmlCursor, elementCreatedListener);
          }
      }, {
          key: "loadDepth",
          value: function loadDepth(depth, xmlCursor, elementCreatedListener) {
              coreutil.Logger.showPos(xmlCursor.xml, xmlCursor.cursor);
              coreutil.Logger.debug(depth, 'Starting DomScaffold');
              this._elementCreatedListener = elementCreatedListener;

              if (xmlCursor.eof()) {
                  coreutil.Logger.debug(depth, 'Reached eof. Exiting');
                  return false;
              }

              var elementDetector = null;
              this._detectors.forEach(function (curElementDetector, parent) {
                  coreutil.Logger.debug(depth, 'Starting ' + curElementDetector.getType());
                  curElementDetector.detect(depth + 1, xmlCursor);
                  if (!curElementDetector.isFound()) {
                      return true;
                  }
                  elementDetector = curElementDetector;
                  return false;
              }, this);

              if (elementDetector === null) {
                  xmlCursor.cursor++;
                  coreutil.Logger.warn('WARN: No handler was found searching from position: ' + xmlCursor.cursor);
              }

              this._element = elementDetector.createElement();

              if (elementDetector instanceof ElementDetector && elementDetector.hasChildren()) {
                  var namespaceUriMap = new coreutil$1.Map();
                  namespaceUriMap.addAll(this._namespaceUriMap);
                  elementDetector.createElement().getAttributes().forEach(function (name, curAttribute, parent) {
                      if ("xmlns" === curAttribute.getNamespace()) {
                          namespaceUriMap.set(curAttribute.getName(), curAttribute.getValue());
                      }
                  }, this);
                  while (!elementDetector.stop(depth + 1) && xmlCursor.cursor < xmlCursor.xml.length) {
                      var previousParentScaffold = xmlCursor.parentDomScaffold;
                      var childScaffold = new DomScaffold(namespaceUriMap);
                      xmlCursor.parentDomScaffold = childScaffold;
                      childScaffold.loadDepth(depth + 1, xmlCursor, this._elementCreatedListener);
                      this._childDomScaffolds.add(childScaffold);
                      xmlCursor.parentDomScaffold = previousParentScaffold;
                  }
              }
              coreutil.Logger.showPos(xmlCursor.xml, xmlCursor.cursor);
          }
      }, {
          key: "getTree",
          value: function getTree(parentNotifyResult) {
              if (this._element === null) {
                  return null;
              }

              var notifyResult = this.notifyElementCreatedListener(this._element, parentNotifyResult);

              this._childDomScaffolds.forEach(function (childDomScaffold, parent) {
                  var childElement = childDomScaffold.getTree(notifyResult);
                  if (childElement !== null) {
                      parent._element.getChildElements().add(childElement);
                  }
                  return true;
              }, this);

              return this._element;
          }
      }, {
          key: "notifyElementCreatedListener",
          value: function notifyElementCreatedListener(element, parentNotifyResult) {
              if (this._elementCreatedListener !== null && this._elementCreatedListener !== undefined) {
                  return this._elementCreatedListener.elementCreated(element, parentNotifyResult);
              }
              return null;
          }
      }]);
      return DomScaffold;
  }();

  /* jshint esversion: 6 */

  var DomTree = function () {
      function DomTree(xml, elementCreatedListener) {
          classCallCheck(this, DomTree);

          this._elementCreatedListener = elementCreatedListener;
          this._xml = xml;
          this._rootElement = null;
      }

      createClass(DomTree, [{
          key: "getRootElement",
          value: function getRootElement() {
              return this._rootElement;
          }
      }, {
          key: "setRootElement",
          value: function setRootElement(element) {
              this._rootElement = element;
          }
      }, {
          key: "load",
          value: function load() {
              var domScaffold = new DomScaffold(new coreutil$1.Map());
              domScaffold.load(this._xml, 0, this._elementCreatedListener);
              this._rootElement = domScaffold.getTree();
          }
      }, {
          key: "dump",
          value: function dump() {
              this._rootElement.dump();
          }
      }, {
          key: "read",
          value: function read() {
              return this._rootElement.read();
          }
      }]);
      return DomTree;
  }();

  /* jshint esversion: 6 */

  exports.DomTree = DomTree;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1scGFyc2VyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvbWFpbi94bWxwYXJzZXIvcGFyc2VyL3htbC9wYXJzZXIvcmVhZEFoZWFkLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwveG1sQXR0cmlidXRlLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL2RldGVjdG9ycy9lbGVtZW50Qm9keS5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3htbENkYXRhLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwveG1sRWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3BhcnNlci9kZXRlY3RvcnMvZWxlbWVudERldGVjdG9yLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL2RldGVjdG9ycy9jZGF0YURldGVjdG9yLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL2RldGVjdG9ycy9jbG9zaW5nRWxlbWVudERldGVjdG9yLmpzIiwiLi4vc3JjL21haW4veG1scGFyc2VyL3BhcnNlci94bWwvcGFyc2VyL3htbEN1cnNvci5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL3BhcnNlci9kb21TY2FmZm9sZC5qcyIsIi4uL3NyYy9tYWluL3htbHBhcnNlci9wYXJzZXIveG1sL2RvbVRyZWUuanMiLCIuLi9zcmMvbWFpbi94bWxwYXJzZXIveG1sUGFyc2VyRXhjZXB0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuZXhwb3J0IGNsYXNzIFJlYWRBaGVhZHtcblxuICAgIHN0YXRpYyByZWFkKHZhbHVlLCBtYXRjaGVyLCBjdXJzb3IsIGlnbm9yZVdoaXRlc3BhY2UgPSBmYWxzZSl7XG4gICAgICAgIGxldCBpbnRlcm5hbEN1cnNvciA9IGN1cnNvcjtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1hdGNoZXIubGVuZ3RoICYmIGkgPCB2YWx1ZS5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgd2hpbGUoaWdub3JlV2hpdGVzcGFjZSAmJiB2YWx1ZS5jaGFyQXQoaW50ZXJuYWxDdXJzb3IpID09ICcgJyl7XG4gICAgICAgICAgICAgICAgaW50ZXJuYWxDdXJzb3IrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHZhbHVlLmNoYXJBdChpbnRlcm5hbEN1cnNvcikgPT0gbWF0Y2hlci5jaGFyQXQoaSkpe1xuICAgICAgICAgICAgICAgIGludGVybmFsQ3Vyc29yKys7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW50ZXJuYWxDdXJzb3IgLSAxO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuZXhwb3J0IGNsYXNzIFhtbEF0dHJpYnV0ZSB7XG5cbiAgY29uc3RydWN0b3IobmFtZSxuYW1lc3BhY2UsdmFsdWUpIHtcbiAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5fbmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldE5hbWUoKXtcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0TmFtZSh2YWwpe1xuICAgICAgdGhpcy5fbmFtZSA9IHZhbDtcbiAgfVxuXG4gIGdldE5hbWVzcGFjZSgpe1xuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XG4gIH1cblxuICBzZXROYW1lc3BhY2UodmFsKXtcbiAgICB0aGlzLl9uYW1lc3BhY2UgPSB2YWw7XG4gIH1cblxuICBnZXRWYWx1ZSgpe1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsKXtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsO1xuICB9XG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7TG9nZ2VyLCBNYXAsIFN0cmluZ1V0aWxzfSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7UmVhZEFoZWFkfSBmcm9tIFwiLi4vcmVhZEFoZWFkXCI7XG5pbXBvcnQge1htbEF0dHJpYnV0ZX0gZnJvbSBcIi4uLy4uL3htbEF0dHJpYnV0ZVwiO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudEJvZHl7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl9uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbmFtZXNwYWNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBnZXROYW1lc3BhY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XG4gICAgfVxuXG4gICAgZ2V0QXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgZGV0ZWN0UG9zaXRpb25zKGRlcHRoLCB4bWwsIGN1cnNvcil7XG4gICAgICAgIGxldCBuYW1lU3RhcnRwb3MgPSBjdXJzb3I7XG4gICAgICAgIGxldCBuYW1lRW5kcG9zID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKFN0cmluZ1V0aWxzLmlzSW5BbHBoYWJldCh4bWwuY2hhckF0KGN1cnNvcikpICYmIGN1cnNvciA8IHhtbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGN1cnNvciArKztcbiAgICAgICAgfVxuICAgICAgICBpZih4bWwuY2hhckF0KGN1cnNvcikgPT0gJzonKXtcbiAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ0ZvdW5kIG5hbWVzcGFjZScpO1xuICAgICAgICAgICAgY3Vyc29yICsrO1xuICAgICAgICAgICAgd2hpbGUgKFN0cmluZ1V0aWxzLmlzSW5BbHBoYWJldCh4bWwuY2hhckF0KGN1cnNvcikpICYmIGN1cnNvciA8IHhtbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjdXJzb3IgKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmFtZUVuZHBvcyA9IGN1cnNvci0xO1xuICAgICAgICB0aGlzLl9uYW1lID0geG1sLnN1YnN0cmluZyhuYW1lU3RhcnRwb3MsIG5hbWVFbmRwb3MrMSk7XG4gICAgICAgIGlmKHRoaXMuX25hbWUuaW5kZXhPZihcIjpcIikgPiAtMSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZXNwYWNlID0gdGhpcy5fbmFtZS5zcGxpdChcIjpcIilbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHRoaXMuX25hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgICB9XG4gICAgICAgIGN1cnNvciA9IHRoaXMuZGV0ZWN0QXR0cmlidXRlcyhkZXB0aCx4bWwsY3Vyc29yKTtcbiAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICB9XG5cbiAgICBkZXRlY3RBdHRyaWJ1dGVzKGRlcHRoLHhtbCxjdXJzb3Ipe1xuICAgICAgICBsZXQgZGV0ZWN0ZWRBdHRyTmFtZUN1cnNvciA9IG51bGw7XG4gICAgICAgIHdoaWxlKChkZXRlY3RlZEF0dHJOYW1lQ3Vyc29yID0gdGhpcy5kZXRlY3ROZXh0U3RhcnRBdHRyaWJ1dGUoZGVwdGgsIHhtbCwgY3Vyc29yKSkgIT0gLTEpe1xuICAgICAgICAgICAgY3Vyc29yID0gdGhpcy5kZXRlY3ROZXh0RW5kQXR0cmlidXRlKGRlcHRoLCB4bWwsIGRldGVjdGVkQXR0ck5hbWVDdXJzb3IpO1xuICAgICAgICAgICAgbGV0IG5hbWVzcGFjZSA9IG51bGw7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHhtbC5zdWJzdHJpbmcoZGV0ZWN0ZWRBdHRyTmFtZUN1cnNvcixjdXJzb3IrMSk7XG5cbiAgICAgICAgICAgIGlmKG5hbWUuaW5kZXhPZihcIjpcIikgPiAtMSl7XG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbmFtZS5zcGxpdChcIjpcIilbMF07XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgICAgICAgfSAgXG5cbiAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ0ZvdW5kIGF0dHJpYnV0ZSBmcm9tICcgKyBkZXRlY3RlZEF0dHJOYW1lQ3Vyc29yICsgJyAgdG8gJyArIGN1cnNvcik7XG4gICAgICAgICAgICBjdXJzb3IgPSB0aGlzLmRldGVjdFZhbHVlKG5hbWUsbmFtZXNwYWNlLGRlcHRoLCB4bWwsIGN1cnNvcisxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgIH1cblxuXG4gICAgZGV0ZWN0TmV4dFN0YXJ0QXR0cmlidXRlKGRlcHRoLCB4bWwsIGN1cnNvcil7XG4gICAgICAgIHdoaWxlKHhtbC5jaGFyQXQoY3Vyc29yKSA9PSAnICcgJiYgY3Vyc29yIDwgeG1sLmxlbmd0aCl7XG4gICAgICAgICAgICBjdXJzb3IgKys7XG4gICAgICAgICAgICBpZihTdHJpbmdVdGlscy5pc0luQWxwaGFiZXQoeG1sLmNoYXJBdChjdXJzb3IpKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZGV0ZWN0TmV4dEVuZEF0dHJpYnV0ZShkZXB0aCwgeG1sLCBjdXJzb3Ipe1xuICAgICAgICB3aGlsZShTdHJpbmdVdGlscy5pc0luQWxwaGFiZXQoeG1sLmNoYXJBdChjdXJzb3IpKSl7XG4gICAgICAgICAgICBjdXJzb3IgKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYoeG1sLmNoYXJBdChjdXJzb3IpID09IFwiOlwiKXtcbiAgICAgICAgICAgIGN1cnNvciArKztcbiAgICAgICAgICAgIHdoaWxlKFN0cmluZ1V0aWxzLmlzSW5BbHBoYWJldCh4bWwuY2hhckF0KGN1cnNvcikpKXtcbiAgICAgICAgICAgICAgICBjdXJzb3IgKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnNvciAtMTtcbiAgICB9XG5cbiAgICBkZXRlY3RWYWx1ZShuYW1lLCBuYW1lc3BhY2UsIGRlcHRoLCB4bWwsIGN1cnNvcil7XG4gICAgICAgIGxldCB2YWx1ZVBvcyA9IGN1cnNvcjtcbiAgICAgICAgbGV0IGZ1bGxuYW1lID0gbmFtZTtcbiAgICAgICAgaWYobmFtZXNwYWNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBmdWxsbmFtZSA9IG5hbWVzcGFjZSArIFwiOlwiICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZigodmFsdWVQb3MgPSBSZWFkQWhlYWQucmVhZCh4bWwsJz1cIicsdmFsdWVQb3MsdHJ1ZSkpID09IC0xKXtcbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZXMuc2V0KGZ1bGxuYW1lLG5ldyBYbWxBdHRyaWJ1dGUobmFtZSxuYW1lc3BhY2UsbnVsbCkpO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZVBvcysrO1xuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdQb3NzaWJsZSBhdHRyaWJ1dGUgdmFsdWUgc3RhcnQgYXQgJyArIHZhbHVlUG9zKTtcbiAgICAgICAgbGV0IHZhbHVlU3RhcnRQb3MgPSB2YWx1ZVBvcztcbiAgICAgICAgd2hpbGUodGhpcy5pc0F0dHJpYnV0ZUNvbnRlbnQoZGVwdGgsIHhtbCwgdmFsdWVQb3MpKXtcbiAgICAgICAgICAgIHZhbHVlUG9zKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYodmFsdWVQb3MgPT0gY3Vyc29yKXtcbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZXMuc2V0KGZ1bGxuYW1lLCBuZXcgWG1sQXR0cmlidXRlKG5hbWUsbmFtZXNwYWNlLCcnKSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5fYXR0cmlidXRlcy5zZXQoZnVsbG5hbWUsIG5ldyBYbWxBdHRyaWJ1dGUobmFtZSxuYW1lc3BhY2UseG1sLnN1YnN0cmluZyh2YWx1ZVN0YXJ0UG9zLHZhbHVlUG9zKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnRm91bmQgYXR0cmlidXRlIGNvbnRlbnQgZW5kaW5nIGF0ICcgKyAodmFsdWVQb3MtMSkpO1xuXG4gICAgICAgIGlmKCh2YWx1ZVBvcyA9IFJlYWRBaGVhZC5yZWFkKHhtbCwnXCInLHZhbHVlUG9zLHRydWUpKSAhPSAtMSl7XG4gICAgICAgICAgICB2YWx1ZVBvcysrO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcignTWlzc2luZyBlbmQgcXVvdGVzIG9uIGF0dHJpYnV0ZSBhdCBwb3NpdGlvbiAnICsgdmFsdWVQb3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZVBvcztcbiAgICB9XG5cblxuICAgIGlzQXR0cmlidXRlQ29udGVudChkZXB0aCwgeG1sLCBjdXJzb3Ipe1xuICAgICAgICBpZihSZWFkQWhlYWQucmVhZCh4bWwsJzwnLGN1cnNvcikgIT0gLTEpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmKFJlYWRBaGVhZC5yZWFkKHhtbCwnPicsY3Vyc29yKSAhPSAtMSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYoUmVhZEFoZWFkLnJlYWQoeG1sLCdcIicsY3Vyc29yKSAhPSAtMSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge0xvZ2dlcn0gZnJvbSBcImNvcmV1dGlsXCJcblxuZXhwb3J0IGNsYXNzIFhtbENkYXRhe1xuXG5cdGNvbnN0cnVjdG9yKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgZHVtcCgpe1xuICAgICAgICB0aGlzLmR1bXBMZXZlbCgwKTtcbiAgICB9XG5cbiAgICBkdW1wTGV2ZWwobGV2ZWwpe1xuICAgICAgICBsZXQgc3BhY2VyID0gJzonO1xuICAgICAgICBmb3IobGV0IHNwYWNlID0gMCA7IHNwYWNlIDwgbGV2ZWwqMiA7IHNwYWNlICsrKXtcbiAgICAgICAgICAgIHNwYWNlciA9IHNwYWNlciArICcgJztcbiAgICAgICAgfVxuXG4gICAgICAgIExvZ2dlci5sb2coc3BhY2VyICsgdGhpcy5fdmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVhZCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge0xvZ2dlciwgTGlzdCwgTWFwfSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7WG1sQ2RhdGF9IGZyb20gXCIuL3htbENkYXRhXCI7XG5cbmV4cG9ydCBjbGFzcyBYbWxFbGVtZW50e1xuXG5cdGNvbnN0cnVjdG9yKG5hbWUsIG5hbWVzcGFjZSwgbmFtZXNwYWNlVXJpTWFwLCBzZWxmQ2xvc2luZywgY2hpbGRFbGVtZW50cyl7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gICAgICAgIHRoaXMuX3NlbGZDbG9zaW5nID0gc2VsZkNsb3Npbmc7XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudHMgPSBuZXcgTGlzdCgpO1xuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9uYW1lc3BhY2VVcmlNYXAgPSBuYW1lc3BhY2VVcmlNYXA7XG4gICAgICAgIHRoaXMuX25hbWVzcGFjZVVyaSA9IG51bGw7XG4gICAgICAgIGlmKHRoaXMuX25hbWVzcGFjZSAhPT0gbnVsbCAmJiB0aGlzLl9uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0aGlzLl9uYW1lc3BhY2VVcmkgPSB0aGlzLl9uYW1lc3BhY2VVcmlNYXAuZ2V0KHRoaXMuX25hbWVzcGFjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBnZXROYW1lc3BhY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XG4gICAgfVxuXG4gICAgZ2V0TmFtZXNwYWNlVXJpKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VVcmk7XG4gICAgfVxuXG4gICAgZ2V0RnVsbE5hbWUoKSB7XG4gICAgICAgIGlmKHRoaXMuX25hbWVzcGFjZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2UgKyAnOicgKyB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIGdldEF0dHJpYnV0ZXMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzKXtcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgc2V0QXR0cmlidXRlKGtleSx2YWx1ZSkge1xuXHRcdHRoaXMuX2F0dHJpYnV0ZXMuc2V0KGtleSx2YWx1ZSk7XG5cdH1cblxuXHRnZXRBdHRyaWJ1dGUoa2V5KSB7XG5cdFx0cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXMuZ2V0KGtleSk7XG5cdH1cblxuICAgIGNvbnRhaW5zQXR0cmlidXRlKGtleSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzLmNvbnRhaW5zKGtleSk7XG4gICAgfVxuXG5cdGNsZWFyQXR0cmlidXRlKCl7XG5cdFx0dGhpcy5fYXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcblx0fVxuXG4gICAgZ2V0Q2hpbGRFbGVtZW50cygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRFbGVtZW50cztcbiAgICB9XG5cbiAgICBzZXRDaGlsZEVsZW1lbnRzKGVsZW1lbnRzKSB7XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudHMgPSBlbGVtZW50cztcbiAgICB9XG5cbiAgICBzZXRUZXh0KHRleHQpe1xuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRzID0gbmV3IExpc3QoKTtcbiAgICAgICAgdGhpcy5hZGRUZXh0KHRleHQpO1xuICAgIH1cblxuICAgIGFkZFRleHQodGV4dCl7XG4gICAgICAgIGxldCB0ZXh0RWxlbWVudCA9IG5ldyBYbWxDZGF0YSh0ZXh0KTtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50cy5hZGQodGV4dEVsZW1lbnQpO1xuICAgIH1cblxuICAgIGR1bXAoKXtcbiAgICAgICAgdGhpcy5kdW1wTGV2ZWwoMCk7XG4gICAgfVxuXG4gICAgZHVtcExldmVsKGxldmVsKXtcbiAgICAgICAgbGV0IHNwYWNlciA9ICc6JztcbiAgICAgICAgZm9yKGxldCBzcGFjZSA9IDAgOyBzcGFjZSA8IGxldmVsKjIgOyBzcGFjZSArKyl7XG4gICAgICAgICAgICBzcGFjZXIgPSBzcGFjZXIgKyAnICc7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLl9zZWxmQ2xvc2luZyl7XG4gICAgICAgICAgICBMb2dnZXIubG9nKHNwYWNlciArICc8JyArIHRoaXMuZ2V0RnVsbE5hbWUoKSArIHRoaXMucmVhZEF0dHJpYnV0ZXMoKSArICcvPicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIExvZ2dlci5sb2coc3BhY2VyICsgJzwnICsgdGhpcy5nZXRGdWxsTmFtZSgpICsgdGhpcy5yZWFkQXR0cmlidXRlcygpICsgJz4nKTtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkRWxlbWVudCl7XG4gICAgICAgICAgICBjaGlsZEVsZW1lbnQuZHVtcExldmVsKGxldmVsKzEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBMb2dnZXIubG9nKHNwYWNlciArICc8LycgKyB0aGlzLmdldEZ1bGxOYW1lKCkgKyAnPicpO1xuICAgIH1cblxuICAgIHJlYWQoKXtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBpZih0aGlzLl9zZWxmQ2xvc2luZyl7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAnPCcgKyB0aGlzLmdldEZ1bGxOYW1lKCkgKyB0aGlzLnJlYWRBdHRyaWJ1dGVzKCkgKyAnLz4nO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAnPCcgKyB0aGlzLmdldEZ1bGxOYW1lKCkgKyB0aGlzLnJlYWRBdHRyaWJ1dGVzKCkgKyAnPic7XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihjaGlsZEVsZW1lbnQpe1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgY2hpbGRFbGVtZW50LnJlYWQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgJzwvJyArIHRoaXMuZ2V0RnVsbE5hbWUoKSArICc+JztcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZWFkQXR0cmlidXRlcygpe1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIHRoaXMuX2F0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LGF0dHJpYnV0ZSxwYXJlbnQpIHtcbiAgICAgICAgICAgIGxldCBmdWxsbmFtZSA9IGF0dHJpYnV0ZS5nZXROYW1lKCk7XG4gICAgICAgICAgICBpZihhdHRyaWJ1dGUuZ2V0TmFtZXNwYWNlKCkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZSA9IGF0dHJpYnV0ZS5nZXROYW1lc3BhY2UoKSArIFwiOlwiICsgYXR0cmlidXRlLmdldE5hbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArICcgJyArIGZ1bGxuYW1lO1xuICAgICAgICAgICAgaWYoYXR0cmlidXRlLmdldFZhbHVlKCkgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArICc9XCInICsgYXR0cmlidXRlLmdldFZhbHVlKCkgKyAnXCInO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7UmVhZEFoZWFkfSBmcm9tIFwiLi4vcmVhZEFoZWFkXCI7XG5pbXBvcnQge0VsZW1lbnRCb2R5fSBmcm9tIFwiLi9lbGVtZW50Qm9keVwiO1xuaW1wb3J0IHtYbWxFbGVtZW50fSBmcm9tIFwiLi4vLi4veG1sRWxlbWVudFwiO1xuaW1wb3J0IHtYbWxBdHRyaWJ1dGV9IGZyb20gXCIuLi8uLi94bWxBdHRyaWJ1dGVcIjtcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZXRlY3RvcntcblxuICAgIGNvbnN0cnVjdG9yKG5hbWVzcGFjZVVyaU1hcCl7XG4gICAgICAgIHRoaXMuX3R5cGUgPSAnRWxlbWVudERldGVjdG9yJztcbiAgICAgICAgdGhpcy5fbmFtZXNwYWNlVXJpTWFwID0gbmFtZXNwYWNlVXJpTWFwO1xuICAgICAgICB0aGlzLl9oYXNDaGlsZHJlbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mb3VuZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl94bWxDdXJzb3IgPSBudWxsO1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICB9XG5cbiAgICBjcmVhdGVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgICB9XG5cbiAgICBnZXRUeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9XG5cbiAgICBpc0ZvdW5kKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm91bmQ7XG4gICAgfVxuXG4gICAgaGFzQ2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNDaGlsZHJlbjtcbiAgICB9XG5cbiAgICBkZXRlY3QoZGVwdGgsIHhtbEN1cnNvcil7XG4gICAgICAgIHRoaXMuX3htbEN1cnNvciA9IHhtbEN1cnNvcjtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnTG9va2luZyBmb3Igb3BlbmluZyBlbGVtZW50IGF0IHBvc2l0aW9uICcgKyB4bWxDdXJzb3IuY3Vyc29yKTtcbiAgICAgICAgbGV0IGVsZW1lbnRCb2R5ID0gbmV3IEVsZW1lbnRCb2R5KCk7XG4gICAgICAgIGxldCBlbmRwb3MgPSBFbGVtZW50RGV0ZWN0b3IuZGV0ZWN0T3BlbkVsZW1lbnQoZGVwdGgsIHhtbEN1cnNvci54bWwsIHhtbEN1cnNvci5jdXJzb3IsZWxlbWVudEJvZHkpO1xuICAgICAgICBpZihlbmRwb3MgIT0gLTEpIHtcblxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IG5ldyBYbWxFbGVtZW50KGVsZW1lbnRCb2R5LmdldE5hbWUoKSwgZWxlbWVudEJvZHkuZ2V0TmFtZXNwYWNlKCksIHRoaXMuX25hbWVzcGFjZVVyaU1hcCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBlbGVtZW50Qm9keS5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbihhdHRyaWJ1dGVOYW1lLGF0dHJpYnV0ZVZhbHVlLHBhcmVudCl7XG4gICAgICAgICAgICAgICAgcGFyZW50Ll9lbGVtZW50LmdldEF0dHJpYnV0ZXMoKS5zZXQoYXR0cmlidXRlTmFtZSxhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LHRoaXMpO1xuXG4gICAgICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdGb3VuZCBvcGVuaW5nIHRhZyA8JyArIHRoaXMuX2VsZW1lbnQuZ2V0RnVsbE5hbWUoKSArICc+IGZyb20gJyArICB4bWxDdXJzb3IuY3Vyc29yICArICcgdG8gJyArIGVuZHBvcyk7XG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yID0gZW5kcG9zICsgMTtcblxuICAgICAgICAgICAgaWYoIXRoaXMuc3RvcChkZXB0aCkpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc0NoaWxkcmVuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0b3AoZGVwdGgpe1xuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdMb29raW5nIGZvciBjbG9zaW5nIGVsZW1lbnQgYXQgcG9zaXRpb24gJyArIHRoaXMuX3htbEN1cnNvci5jdXJzb3IpO1xuICAgICAgICBsZXQgY2xvc2luZ0VsZW1lbnQgPSBFbGVtZW50RGV0ZWN0b3IuZGV0ZWN0RW5kRWxlbWVudChkZXB0aCwgdGhpcy5feG1sQ3Vyc29yLnhtbCwgdGhpcy5feG1sQ3Vyc29yLmN1cnNvcik7XG4gICAgICAgIGlmKGNsb3NpbmdFbGVtZW50ICE9IC0xKXtcbiAgICAgICAgICAgIGxldCBjbG9zaW5nVGFnTmFtZSA9ICB0aGlzLl94bWxDdXJzb3IueG1sLnN1YnN0cmluZyh0aGlzLl94bWxDdXJzb3IuY3Vyc29yKzIsY2xvc2luZ0VsZW1lbnQpO1xuICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnRm91bmQgY2xvc2luZyB0YWcgPC8nICsgY2xvc2luZ1RhZ05hbWUgKyAnPiBmcm9tICcgKyAgdGhpcy5feG1sQ3Vyc29yLmN1cnNvciAgKyAnIHRvICcgKyBjbG9zaW5nRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuX2VsZW1lbnQuZ2V0RnVsbE5hbWUoKSAhPSBjbG9zaW5nVGFnTmFtZSl7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKCdFUlI6IE1pc21hdGNoIGJldHdlZW4gb3BlbmluZyB0YWcgPCcgKyB0aGlzLl9lbGVtZW50LmdldEZ1bGxOYW1lKCkgKyAnPiBhbmQgY2xvc2luZyB0YWcgPC8nICsgY2xvc2luZ1RhZ05hbWUgKyAnPiBXaGVuIGV4aXRpbmcgdG8gcGFyZW50IGVsZW1udCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5feG1sQ3Vyc29yLmN1cnNvciA9IGNsb3NpbmdFbGVtZW50ICsxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZXRlY3RPcGVuRWxlbWVudChkZXB0aCwgeG1sLCBjdXJzb3IsIGVsZW1lbnRCb2R5KSB7XG4gICAgICAgIGlmKChjdXJzb3IgPSBSZWFkQWhlYWQucmVhZCh4bWwsJzwnLGN1cnNvcikpID09IC0xKXtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBjdXJzb3IgKys7XG4gICAgICAgIGN1cnNvciA9IGVsZW1lbnRCb2R5LmRldGVjdFBvc2l0aW9ucyhkZXB0aCsxLCB4bWwsIGN1cnNvcik7XG4gICAgICAgIGlmKChjdXJzb3IgPSBSZWFkQWhlYWQucmVhZCh4bWwsJz4nLGN1cnNvcikpID09IC0xKXtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZXRlY3RFbmRFbGVtZW50KGRlcHRoLCB4bWwsIGN1cnNvcil7XG4gICAgICAgIGlmKChjdXJzb3IgPSBSZWFkQWhlYWQucmVhZCh4bWwsJzwvJyxjdXJzb3IpKSA9PSAtMSl7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgY3Vyc29yICsrO1xuICAgICAgICBjdXJzb3IgPSBuZXcgRWxlbWVudEJvZHkoKS5kZXRlY3RQb3NpdGlvbnMoZGVwdGgrMSwgeG1sLCBjdXJzb3IpO1xuICAgICAgICBpZigoY3Vyc29yID0gUmVhZEFoZWFkLnJlYWQoeG1sLCc+JyxjdXJzb3IpKSA9PSAtMSl7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7WG1sQ2RhdGF9IGZyb20gXCIuLi8uLi94bWxDZGF0YVwiO1xuaW1wb3J0IHtSZWFkQWhlYWR9IGZyb20gXCIuLi9yZWFkQWhlYWRcIjtcblxuZXhwb3J0IGNsYXNzIENkYXRhRGV0ZWN0b3J7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl90eXBlID0gJ0NkYXRhRGV0ZWN0b3InO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2ZvdW5kID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNGb3VuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvdW5kO1xuICAgIH1cblxuICAgIGdldFR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgWG1sQ2RhdGEodGhpcy5fdmFsdWUpO1xuICAgIH1cblxuICAgIGRldGVjdChkZXB0aCwgeG1sQ3Vyc29yKXtcbiAgICAgICAgdGhpcy5fZm91bmQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuXG4gICAgICAgIGxldCBlbmRQb3MgPSB0aGlzLmRldGVjdENvbnRlbnQoZGVwdGgsIHhtbEN1cnNvci54bWwsIHhtbEN1cnNvci5jdXJzb3IsIHhtbEN1cnNvci5wYXJlbnREb21TY2FmZm9sZCk7XG4gICAgICAgIGlmKGVuZFBvcyAhPSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB4bWxDdXJzb3IueG1sLnN1YnN0cmluZyh4bWxDdXJzb3IuY3Vyc29yLGVuZFBvcyk7XG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yID0gZW5kUG9zO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGV0ZWN0Q29udGVudChkZXB0aCwgeG1sLCBjdXJzb3IsIHBhcmVudERvbVNjYWZmb2xkKSB7XG4gICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ0NkYXRhIHN0YXJ0IGF0ICcgKyBjdXJzb3IpO1xuICAgICAgICBsZXQgaW50ZXJuYWxTdGFydFBvcyA9IGN1cnNvcjtcbiAgICAgICAgaWYoIUNkYXRhRGV0ZWN0b3IuaXNDb250ZW50KGRlcHRoLCB4bWwsIGN1cnNvcikpe1xuICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnTm8gQ2RhdGEgZm91bmQnKTtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZShDZGF0YURldGVjdG9yLmlzQ29udGVudChkZXB0aCwgeG1sLCBjdXJzb3IpICYmIGN1cnNvciA8IHhtbC5sZW5ndGgpe1xuICAgICAgICAgICAgY3Vyc29yICsrO1xuICAgICAgICB9XG4gICAgICAgIExvZ2dlci5kZWJ1ZyhkZXB0aCwgJ0NkYXRhIGVuZCBhdCAnICsgKGN1cnNvci0xKSk7XG4gICAgICAgIGlmKHBhcmVudERvbVNjYWZmb2xkID09PSBudWxsKXtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcignRVJSOiBDb250ZW50IG5vdCBhbGxvd2VkIG9uIHJvb3QgbGV2ZWwgaW4geG1sIGRvY3VtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgTG9nZ2VyLmRlYnVnKGRlcHRoLCAnQ2RhdGEgZm91bmQgdmFsdWUgaXMgJyArIHhtbC5zdWJzdHJpbmcoaW50ZXJuYWxTdGFydFBvcyxjdXJzb3IpKTtcbiAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNDb250ZW50KGRlcHRoLCB4bWwsIGN1cnNvcil7XG4gICAgICAgIGlmKFJlYWRBaGVhZC5yZWFkKHhtbCwnPCcsY3Vyc29yKSAhPSAtMSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYoUmVhZEFoZWFkLnJlYWQoeG1sLCc+JyxjdXJzb3IpICE9IC0xKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7WG1sRWxlbWVudH0gZnJvbSBcIi4uLy4uL3htbEVsZW1lbnRcIjtcbmltcG9ydCB7UmVhZEFoZWFkfSBmcm9tIFwiLi4vcmVhZEFoZWFkXCI7XG5pbXBvcnQge0VsZW1lbnRCb2R5fSBmcm9tIFwiLi9lbGVtZW50Qm9keVwiO1xuaW1wb3J0IHtYbWxBdHRyaWJ1dGV9IGZyb20gXCIuLi8uLi94bWxBdHRyaWJ1dGVcIjtcblxuZXhwb3J0IGNsYXNzIENsb3NpbmdFbGVtZW50RGV0ZWN0b3J7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lc3BhY2VVcmlNYXApe1xuICAgICAgICB0aGlzLl90eXBlID0gJ0Nsb3NpbmdFbGVtZW50RGV0ZWN0b3InO1xuICAgICAgICB0aGlzLl9uYW1lc3BhY2VVcmlNYXAgPSBuYW1lc3BhY2VVcmlNYXA7XG4gICAgICAgIHRoaXMuX2ZvdW5kID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICAgIH1cblxuICAgIGdldFR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIGlzRm91bmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3VuZDtcbiAgICB9XG5cbiAgICBkZXRlY3QoZGVwdGgsIHhtbEN1cnNvcikge1xuICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdMb29raW5nIGZvciBzZWxmIGNsb3NpbmcgZWxlbWVudCBhdCBwb3NpdGlvbiAnICsgeG1sQ3Vyc29yLmN1cnNvcik7XG4gICAgICAgIGxldCBlbGVtZW50Qm9keSA9IG5ldyBFbGVtZW50Qm9keSgpO1xuICAgICAgICBsZXQgZW5kcG9zID0gQ2xvc2luZ0VsZW1lbnREZXRlY3Rvci5kZXRlY3RDbG9zaW5nRWxlbWVudChkZXB0aCwgeG1sQ3Vyc29yLnhtbCwgeG1sQ3Vyc29yLmN1cnNvcixlbGVtZW50Qm9keSk7XG4gICAgICAgIGlmKGVuZHBvcyAhPSAtMSl7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gbmV3IFhtbEVsZW1lbnQoZWxlbWVudEJvZHkuZ2V0TmFtZSgpLCBlbGVtZW50Qm9keS5nZXROYW1lc3BhY2UoKSwgdGhpcy5fbmFtZXNwYWNlVXJpTWFwLCB0cnVlKTtcblxuICAgICAgICAgICAgZWxlbWVudEJvZHkuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24oYXR0cmlidXRlTmFtZSxhdHRyaWJ1dGVWYWx1ZSxwYXJlbnQpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSxhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LHRoaXMpO1xuXG4gICAgICAgICAgICBMb2dnZXIuZGVidWcoZGVwdGgsICdGb3VuZCBzZWxmIGNsb3NpbmcgdGFnIDwnICsgdGhpcy5fZWxlbWVudC5nZXRGdWxsTmFtZSgpICsgJy8+IGZyb20gJyArICB4bWxDdXJzb3IuY3Vyc29yICArICcgdG8gJyArIGVuZHBvcyk7XG4gICAgICAgICAgICB0aGlzLl9mb3VuZCA9IHRydWU7XG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yID0gZW5kcG9zICsgMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBkZXRlY3RDbG9zaW5nRWxlbWVudChkZXB0aCwgeG1sLCBjdXJzb3IsIGVsZW1lbnRCb2R5KXtcbiAgICAgICAgaWYoKGN1cnNvciA9IFJlYWRBaGVhZC5yZWFkKHhtbCwnPCcsY3Vyc29yKSkgPT0gLTEpe1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGN1cnNvciArKztcbiAgICAgICAgY3Vyc29yID0gZWxlbWVudEJvZHkuZGV0ZWN0UG9zaXRpb25zKGRlcHRoKzEsIHhtbCwgY3Vyc29yKTtcbiAgICAgICAgaWYoKGN1cnNvciA9IFJlYWRBaGVhZC5yZWFkKHhtbCwnLz4nLGN1cnNvcikpID09IC0xKXtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuZXhwb3J0IGNsYXNzIFhtbEN1cnNvcntcblxuICAgIGNvbnN0cnVjdG9yKHhtbCwgY3Vyc29yLCBwYXJlbnREb21TY2FmZm9sZCl7XG4gICAgICAgIHRoaXMueG1sID0geG1sO1xuICAgICAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICAgICAgdGhpcy5wYXJlbnREb21TY2FmZm9sZCA9IHBhcmVudERvbVNjYWZmb2xkO1xuICAgIH1cblxuICAgIGVvZigpe1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJzb3IgPj0gdGhpcy54bWwubGVuZ3RoO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtNYXAsIExpc3R9IGZyb20gXCJjb3JldXRpbFwiO1xuaW1wb3J0IHtFbGVtZW50RGV0ZWN0b3J9IGZyb20gXCIuL2RldGVjdG9ycy9lbGVtZW50RGV0ZWN0b3JcIjtcbmltcG9ydCB7Q2RhdGFEZXRlY3Rvcn0gZnJvbSBcIi4vZGV0ZWN0b3JzL2NkYXRhRGV0ZWN0b3JcIjtcbmltcG9ydCB7Q2xvc2luZ0VsZW1lbnREZXRlY3Rvcn0gZnJvbSBcIi4vZGV0ZWN0b3JzL2Nsb3NpbmdFbGVtZW50RGV0ZWN0b3JcIjtcbmltcG9ydCB7WG1sQ3Vyc29yfSBmcm9tIFwiLi94bWxDdXJzb3JcIjtcblxuZXhwb3J0IGNsYXNzIERvbVNjYWZmb2xke1xuXG4gICAgY29uc3RydWN0b3IobmFtZXNwYWNlVXJpTWFwKXtcbiAgICAgICAgdGhpcy5fbmFtZXNwYWNlVXJpTWFwID0gbmFtZXNwYWNlVXJpTWFwO1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY2hpbGREb21TY2FmZm9sZHMgPSBuZXcgTGlzdCgpO1xuICAgICAgICB0aGlzLl9kZXRlY3RvcnMgPSBuZXcgTGlzdCgpO1xuICAgICAgICB0aGlzLl9lbGVtZW50Q3JlYXRlZExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGV0ZWN0b3JzLmFkZChuZXcgRWxlbWVudERldGVjdG9yKHRoaXMuX25hbWVzcGFjZVVyaU1hcCkpO1xuICAgICAgICB0aGlzLl9kZXRlY3RvcnMuYWRkKG5ldyBDZGF0YURldGVjdG9yKCkpO1xuICAgICAgICB0aGlzLl9kZXRlY3RvcnMuYWRkKG5ldyBDbG9zaW5nRWxlbWVudERldGVjdG9yKHRoaXMuX25hbWVzcGFjZVVyaU1hcCkpO1xuICAgIH1cblxuICAgIGdldEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICAgIH1cblxuICAgIGxvYWQoeG1sLCBjdXJzb3IsIGVsZW1lbnRDcmVhdGVkTGlzdGVuZXIpe1xuICAgICAgICBsZXQgeG1sQ3Vyc29yID0gbmV3IFhtbEN1cnNvcih4bWwsIGN1cnNvciwgbnVsbCk7XG4gICAgICAgIHRoaXMubG9hZERlcHRoKDEsIHhtbEN1cnNvciwgZWxlbWVudENyZWF0ZWRMaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgbG9hZERlcHRoKGRlcHRoLCB4bWxDdXJzb3IsIGVsZW1lbnRDcmVhdGVkTGlzdGVuZXIpe1xuICAgICAgICBjb3JldXRpbC5Mb2dnZXIuc2hvd1Bvcyh4bWxDdXJzb3IueG1sLCB4bWxDdXJzb3IuY3Vyc29yKTtcbiAgICAgICAgY29yZXV0aWwuTG9nZ2VyLmRlYnVnKGRlcHRoLCAnU3RhcnRpbmcgRG9tU2NhZmZvbGQnKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudENyZWF0ZWRMaXN0ZW5lciA9IGVsZW1lbnRDcmVhdGVkTGlzdGVuZXI7XG5cbiAgICAgICAgaWYoeG1sQ3Vyc29yLmVvZigpKXtcbiAgICAgICAgICAgIGNvcmV1dGlsLkxvZ2dlci5kZWJ1ZyhkZXB0aCwgJ1JlYWNoZWQgZW9mLiBFeGl0aW5nJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudERldGVjdG9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGV0ZWN0b3JzLmZvckVhY2goZnVuY3Rpb24oY3VyRWxlbWVudERldGVjdG9yLHBhcmVudCl7XG4gICAgICAgICAgICBjb3JldXRpbC5Mb2dnZXIuZGVidWcoZGVwdGgsICdTdGFydGluZyAnICsgY3VyRWxlbWVudERldGVjdG9yLmdldFR5cGUoKSk7XG4gICAgICAgICAgICBjdXJFbGVtZW50RGV0ZWN0b3IuZGV0ZWN0KGRlcHRoICsgMSx4bWxDdXJzb3IpO1xuICAgICAgICAgICAgaWYoIWN1ckVsZW1lbnREZXRlY3Rvci5pc0ZvdW5kKCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudERldGVjdG9yID0gY3VyRWxlbWVudERldGVjdG9yO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LHRoaXMpO1xuXG4gICAgICAgIGlmKGVsZW1lbnREZXRlY3RvciA9PT0gbnVsbCl7XG4gICAgICAgICAgICB4bWxDdXJzb3IuY3Vyc29yKys7XG4gICAgICAgICAgICBjb3JldXRpbC5Mb2dnZXIud2FybignV0FSTjogTm8gaGFuZGxlciB3YXMgZm91bmQgc2VhcmNoaW5nIGZyb20gcG9zaXRpb246ICcgKyB4bWxDdXJzb3IuY3Vyc29yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50RGV0ZWN0b3IuY3JlYXRlRWxlbWVudCgpO1xuXG4gICAgICAgIGlmKGVsZW1lbnREZXRlY3RvciBpbnN0YW5jZW9mIEVsZW1lbnREZXRlY3RvciAmJiBlbGVtZW50RGV0ZWN0b3IuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgbGV0IG5hbWVzcGFjZVVyaU1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIG5hbWVzcGFjZVVyaU1hcC5hZGRBbGwodGhpcy5fbmFtZXNwYWNlVXJpTWFwKTtcbiAgICAgICAgICAgIGVsZW1lbnREZXRlY3Rvci5jcmVhdGVFbGVtZW50KCkuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24obmFtZSxjdXJBdHRyaWJ1dGUscGFyZW50KXtcbiAgICAgICAgICAgICAgICBpZihcInhtbG5zXCIgPT09IGN1ckF0dHJpYnV0ZS5nZXROYW1lc3BhY2UoKSl7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZVVyaU1hcC5zZXQoY3VyQXR0cmlidXRlLmdldE5hbWUoKSxjdXJBdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIHdoaWxlKCFlbGVtZW50RGV0ZWN0b3Iuc3RvcChkZXB0aCArIDEpICYmIHhtbEN1cnNvci5jdXJzb3IgPCB4bWxDdXJzb3IueG1sLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgbGV0IHByZXZpb3VzUGFyZW50U2NhZmZvbGQgPSB4bWxDdXJzb3IucGFyZW50RG9tU2NhZmZvbGQ7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkU2NhZmZvbGQgPSBuZXcgRG9tU2NhZmZvbGQobmFtZXNwYWNlVXJpTWFwKTtcbiAgICAgICAgICAgICAgICB4bWxDdXJzb3IucGFyZW50RG9tU2NhZmZvbGQgPSBjaGlsZFNjYWZmb2xkO1xuICAgICAgICAgICAgICAgIGNoaWxkU2NhZmZvbGQubG9hZERlcHRoKGRlcHRoKzEsIHhtbEN1cnNvciwgdGhpcy5fZWxlbWVudENyZWF0ZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGREb21TY2FmZm9sZHMuYWRkKGNoaWxkU2NhZmZvbGQpO1xuICAgICAgICAgICAgICAgIHhtbEN1cnNvci5wYXJlbnREb21TY2FmZm9sZCA9IHByZXZpb3VzUGFyZW50U2NhZmZvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29yZXV0aWwuTG9nZ2VyLnNob3dQb3MoeG1sQ3Vyc29yLnhtbCwgeG1sQ3Vyc29yLmN1cnNvcik7XG4gICAgfVxuXG4gICAgZ2V0VHJlZShwYXJlbnROb3RpZnlSZXN1bHQpe1xuICAgICAgICBpZih0aGlzLl9lbGVtZW50ID09PSBudWxsKXtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5vdGlmeVJlc3VsdCA9IHRoaXMubm90aWZ5RWxlbWVudENyZWF0ZWRMaXN0ZW5lcih0aGlzLl9lbGVtZW50LHBhcmVudE5vdGlmeVJlc3VsdCk7XG5cbiAgICAgICAgdGhpcy5fY2hpbGREb21TY2FmZm9sZHMuZm9yRWFjaChmdW5jdGlvbihjaGlsZERvbVNjYWZmb2xkLHBhcmVudCkge1xuICAgICAgICAgICAgbGV0IGNoaWxkRWxlbWVudCA9IGNoaWxkRG9tU2NhZmZvbGQuZ2V0VHJlZShub3RpZnlSZXN1bHQpO1xuICAgICAgICAgICAgaWYoY2hpbGRFbGVtZW50ICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuX2VsZW1lbnQuZ2V0Q2hpbGRFbGVtZW50cygpLmFkZChjaGlsZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gICAgfVxuXG4gICAgbm90aWZ5RWxlbWVudENyZWF0ZWRMaXN0ZW5lcihlbGVtZW50LCBwYXJlbnROb3RpZnlSZXN1bHQpIHtcbiAgICAgICAgaWYodGhpcy5fZWxlbWVudENyZWF0ZWRMaXN0ZW5lciAhPT0gbnVsbCAmJiB0aGlzLl9lbGVtZW50Q3JlYXRlZExpc3RlbmVyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRDcmVhdGVkTGlzdGVuZXIuZWxlbWVudENyZWF0ZWQoZWxlbWVudCwgcGFyZW50Tm90aWZ5UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtEb21TY2FmZm9sZH0gZnJvbSBcIi4vcGFyc2VyL2RvbVNjYWZmb2xkXCI7XG5pbXBvcnQge01hcH0gZnJvbSBcImNvcmV1dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBEb21UcmVle1xuXG4gICAgY29uc3RydWN0b3IoeG1sLCBlbGVtZW50Q3JlYXRlZExpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRDcmVhdGVkTGlzdGVuZXIgPSBlbGVtZW50Q3JlYXRlZExpc3RlbmVyO1xuICAgICAgICB0aGlzLl94bWwgPSB4bWw7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRSb290RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RFbGVtZW50O1xuICAgIH1cblxuICAgIHNldFJvb3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cblxuICAgIGxvYWQoKXtcbiAgICAgICAgbGV0IGRvbVNjYWZmb2xkID0gbmV3IERvbVNjYWZmb2xkKG5ldyBNYXAoKSk7XG4gICAgICAgIGRvbVNjYWZmb2xkLmxvYWQodGhpcy5feG1sLDAsdGhpcy5fZWxlbWVudENyZWF0ZWRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gZG9tU2NhZmZvbGQuZ2V0VHJlZSgpO1xuICAgIH1cblxuICAgIGR1bXAoKXtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuZHVtcCgpO1xuICAgIH1cblxuICAgIHJlYWQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RFbGVtZW50LnJlYWQoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmNsYXNzIFhtbFBhcnNlckV4Y2VwdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSl7XG4gICAgfVxuXG59XG4iXSwibmFtZXMiOlsiUmVhZEFoZWFkIiwidmFsdWUiLCJtYXRjaGVyIiwiY3Vyc29yIiwiaWdub3JlV2hpdGVzcGFjZSIsImludGVybmFsQ3Vyc29yIiwiaSIsImxlbmd0aCIsImNoYXJBdCIsIlhtbEF0dHJpYnV0ZSIsIm5hbWUiLCJuYW1lc3BhY2UiLCJfbmFtZSIsIl9uYW1lc3BhY2UiLCJfdmFsdWUiLCJ2YWwiLCJFbGVtZW50Qm9keSIsIl9hdHRyaWJ1dGVzIiwiTWFwIiwiZGVwdGgiLCJ4bWwiLCJuYW1lU3RhcnRwb3MiLCJuYW1lRW5kcG9zIiwiU3RyaW5nVXRpbHMiLCJpc0luQWxwaGFiZXQiLCJMb2dnZXIiLCJkZWJ1ZyIsInN1YnN0cmluZyIsImluZGV4T2YiLCJzcGxpdCIsImRldGVjdEF0dHJpYnV0ZXMiLCJkZXRlY3RlZEF0dHJOYW1lQ3Vyc29yIiwiZGV0ZWN0TmV4dFN0YXJ0QXR0cmlidXRlIiwiZGV0ZWN0TmV4dEVuZEF0dHJpYnV0ZSIsImRldGVjdFZhbHVlIiwidmFsdWVQb3MiLCJmdWxsbmFtZSIsInJlYWQiLCJzZXQiLCJ2YWx1ZVN0YXJ0UG9zIiwiaXNBdHRyaWJ1dGVDb250ZW50IiwiZXJyb3IiLCJYbWxDZGF0YSIsImR1bXBMZXZlbCIsImxldmVsIiwic3BhY2VyIiwic3BhY2UiLCJsb2ciLCJYbWxFbGVtZW50IiwibmFtZXNwYWNlVXJpTWFwIiwic2VsZkNsb3NpbmciLCJjaGlsZEVsZW1lbnRzIiwiX3NlbGZDbG9zaW5nIiwiX2NoaWxkRWxlbWVudHMiLCJMaXN0IiwiX25hbWVzcGFjZVVyaU1hcCIsIl9uYW1lc3BhY2VVcmkiLCJ1bmRlZmluZWQiLCJnZXQiLCJhdHRyaWJ1dGVzIiwia2V5IiwiY29udGFpbnMiLCJlbGVtZW50cyIsInRleHQiLCJhZGRUZXh0IiwidGV4dEVsZW1lbnQiLCJhZGQiLCJnZXRGdWxsTmFtZSIsInJlYWRBdHRyaWJ1dGVzIiwiZm9yRWFjaCIsImNoaWxkRWxlbWVudCIsInJlc3VsdCIsImF0dHJpYnV0ZSIsInBhcmVudCIsImdldE5hbWUiLCJnZXROYW1lc3BhY2UiLCJnZXRWYWx1ZSIsIkVsZW1lbnREZXRlY3RvciIsIl90eXBlIiwiX2hhc0NoaWxkcmVuIiwiX2ZvdW5kIiwiX3htbEN1cnNvciIsIl9lbGVtZW50IiwieG1sQ3Vyc29yIiwiZWxlbWVudEJvZHkiLCJlbmRwb3MiLCJkZXRlY3RPcGVuRWxlbWVudCIsImdldEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVOYW1lIiwiYXR0cmlidXRlVmFsdWUiLCJzdG9wIiwiY2xvc2luZ0VsZW1lbnQiLCJkZXRlY3RFbmRFbGVtZW50IiwiY2xvc2luZ1RhZ05hbWUiLCJkZXRlY3RQb3NpdGlvbnMiLCJDZGF0YURldGVjdG9yIiwiZW5kUG9zIiwiZGV0ZWN0Q29udGVudCIsInBhcmVudERvbVNjYWZmb2xkIiwiaGFzQ2hpbGRyZW4iLCJpbnRlcm5hbFN0YXJ0UG9zIiwiaXNDb250ZW50IiwiQ2xvc2luZ0VsZW1lbnREZXRlY3RvciIsImRldGVjdENsb3NpbmdFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiWG1sQ3Vyc29yIiwiRG9tU2NhZmZvbGQiLCJfY2hpbGREb21TY2FmZm9sZHMiLCJfZGV0ZWN0b3JzIiwiX2VsZW1lbnRDcmVhdGVkTGlzdGVuZXIiLCJlbGVtZW50Q3JlYXRlZExpc3RlbmVyIiwibG9hZERlcHRoIiwiY29yZXV0aWwiLCJzaG93UG9zIiwiZW9mIiwiZWxlbWVudERldGVjdG9yIiwiY3VyRWxlbWVudERldGVjdG9yIiwiZ2V0VHlwZSIsImRldGVjdCIsImlzRm91bmQiLCJ3YXJuIiwiY3JlYXRlRWxlbWVudCIsImFkZEFsbCIsImN1ckF0dHJpYnV0ZSIsInByZXZpb3VzUGFyZW50U2NhZmZvbGQiLCJjaGlsZFNjYWZmb2xkIiwicGFyZW50Tm90aWZ5UmVzdWx0Iiwibm90aWZ5UmVzdWx0Iiwibm90aWZ5RWxlbWVudENyZWF0ZWRMaXN0ZW5lciIsImNoaWxkRG9tU2NhZmZvbGQiLCJnZXRUcmVlIiwiZ2V0Q2hpbGRFbGVtZW50cyIsImVsZW1lbnQiLCJlbGVtZW50Q3JlYXRlZCIsIkRvbVRyZWUiLCJfeG1sIiwiX3Jvb3RFbGVtZW50IiwiZG9tU2NhZmZvbGQiLCJsb2FkIiwiZHVtcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7O0FBRUEsTUFBYUEsU0FBYjtFQUFBO0VBQUE7RUFBQTs7RUFBQTtFQUFBO0VBQUEsNkJBRWdCQyxLQUZoQixFQUV1QkMs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
