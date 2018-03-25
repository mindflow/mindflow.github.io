(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('xmlparser'), require('coreutil')) :
  typeof define === 'function' && define.amd ? define(['exports', 'xmlparser', 'coreutil'], factory) :
  (factory((global.justright = {}),global.xmlparser,global.coreutil));
}(this, (function (exports,xmlparser,coreutil) { 'use strict';

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

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Attribute = function () {
      function Attribute(attribute) {
          classCallCheck(this, Attribute);

          this._attribute = attribute;
      }

      createClass(Attribute, [{
          key: "getValue",
          value: function getValue() {
              return this._attribute.value;
          }
      }, {
          key: "getName",
          value: function getName() {
              return this._attribute.name;
          }
      }, {
          key: "getNamespace",
          value: function getNamespace() {
              return this._attribute.name;
          }
      }]);
      return Attribute;
  }();

  /* jshint esversion: 6 */

  /**
   * A base class for enclosing an HTMLElement
   */
  var BaseElement = function () {

      /**
       * Constructor
       *
       * @param {XmlElement|string|HTMLElement} value
       * @param {XmlElement} parent
       */
      function BaseElement(value, parent) {
          classCallCheck(this, BaseElement);


          /** @type {HTMLElement} */
          this._element = null;
          this._attributeMap = null;

          if (value instanceof xmlparser.XmlElement) {
              this._element = this.createFromXmlElement(value, parent);
              return;
          }
          if (typeof value === "string") {
              this._element = document.createElement(value);
              return;
          }
          if (value instanceof HTMLElement) {
              this._element = value;
              return;
          }
          console.error("Unrecognized value for Element");
          console.error(value);
      }

      createClass(BaseElement, [{
          key: "loadAttributes",
          value: function loadAttributes() {
              if (this._element.attributes === null || this._element.attributes === undefined) {
                  this._attributeMap = new coreutil.Map();
                  return;
              }
              if (this._attributeMap === null || this._attributeMap === undefined) {
                  this._attributeMap = new coreutil.Map();
                  for (var i = 0; i < this._element.attributes.length; i++) {
                      this._attributeMap.set(this._element.attributes[i].name, new Attribute(this._element.attributes[i]));
                  }
              }
          }

          /**
           * Creates a browser Element from the XmlElement
           *
           * @param {XmlElement} xmlElement
           * @param {XmlElement} parentElement
           * @return {HTMLElement}
           */

      }, {
          key: "createFromXmlElement",
          value: function createFromXmlElement(xmlElement, parentElement) {
              var element = null;
              if (xmlElement.getNamespace()) {
                  element = document.createElementNS(xmlElement.getNamespaceUri(), xmlElement.getFullName());
              } else {
                  element = document.createElement(xmlElement.getName());
              }
              if (parentElement && parentElement.getMappedElement() !== null) {
                  parentElement.getMappedElement().appendChild(element);
              }
              xmlElement.getAttributes().forEach(function (key, value) {
                  element.setAttribute(key, value.getValue());
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

      }, {
          key: "attachEvent",
          value: function attachEvent(eventType, functionParam) {
              this._element[eventType] = functionParam;
          }

          /**
           * Get the enclosed element
           *
           * @return {HTMLElement}
           */

      }, {
          key: "getMappedElement",
          value: function getMappedElement() {
              return this._element;
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
          key: "getAttributes",
          value: function getAttributes() {
              this.loadAttributes();
              return this._attributeMap;
          }
      }, {
          key: "setAttributeValue",
          value: function setAttributeValue(key, value) {
              this._element.setAttribute(key, value);
          }
      }, {
          key: "getAttributeValue",
          value: function getAttributeValue(key) {
              return this._element.getAttribute(key);
          }
      }, {
          key: "containsAttribute",
          value: function containsAttribute(key) {
              return this._element.hasAttribute(key);
          }
      }, {
          key: "removeAttribute",
          value: function removeAttribute(key) {
              this._element.removeAttribute(key);
          }
      }, {
          key: "setStyle",
          value: function setStyle(key, value) {
              this._element.style[key] = value;
          }
      }, {
          key: "getStyle",
          value: function getStyle(key) {
              return this._element.style[key];
          }
      }, {
          key: "removeStyle",
          value: function removeStyle(key) {
              this._element.style[key] = null;
          }
      }, {
          key: "set",
          value: function set$$1(input) {
              if (this._element.parentNode === null) {
                  console.error("The element has no parent, can not swap it for value");
                  return;
              }
              if (input instanceof BaseElement) {
                  this._element.parentNode.replaceChild(input.getMappedElement(), this._element);
                  return;
              }
              if (input && typeof input.getRootElement === "function") {
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
      }, {
          key: "prependChild",
          value: function prependChild(input) {
              if (this._element.firstChild === null) {
                  this.addChild(input);
              }
              if (input instanceof BaseElement) {
                  this._element.insertBefore(input.getMappedElement(), this._element.firstChild);
                  return;
              }
              if (input && typeof input.getRootElement === "function") {
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
      return BaseElement;
  }();

  /* jshint esversion: 6 */

  /**
   * Shared properties of input elements
   */
  var AbstractInputElement = function (_BaseElement) {
      inherits(AbstractInputElement, _BaseElement);

      /**
       * Constructor
       *
       * @param {object} value
       * @param {XmlElement} parent
       */
      function AbstractInputElement(value, parent) {
          classCallCheck(this, AbstractInputElement);
          return possibleConstructorReturn(this, (AbstractInputElement.__proto__ || Object.getPrototypeOf(AbstractInputElement)).call(this, value, parent));
      }

      /**
       * Get the value of the inputs name
       *
       * @return {string}
       */


      createClass(AbstractInputElement, [{
          key: "getName",
          value: function getName() {
              return this._element.name;
          }

          /**
           * Set the value of inputs name
           *
           * @param {string} value
           */

      }, {
          key: "setName",
          value: function setName(value) {
              this._element.name = value;
          }

          /**
           * 
           */

      }, {
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

  /* jshint esversion: 6 */

  var CheckboxInputElement = function (_AbstractInputElement) {
      inherits(CheckboxInputElement, _AbstractInputElement);

      function CheckboxInputElement(element, parent) {
          classCallCheck(this, CheckboxInputElement);
          return possibleConstructorReturn(this, (CheckboxInputElement.__proto__ || Object.getPrototypeOf(CheckboxInputElement)).call(this, element, parent));
      }

      createClass(CheckboxInputElement, [{
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

  /* jshint esversion: 6 */

  var PasswordInputElement = function (_AbstractInputElement) {
      inherits(PasswordInputElement, _AbstractInputElement);

      function PasswordInputElement(element, parent) {
          classCallCheck(this, PasswordInputElement);
          return possibleConstructorReturn(this, (PasswordInputElement.__proto__ || Object.getPrototypeOf(PasswordInputElement)).call(this, element, parent));
      }

      return PasswordInputElement;
  }(AbstractInputElement);

  /* jshint esversion: 6 */

  var RadioInputElement = function (_AbstractInputElement) {
      inherits(RadioInputElement, _AbstractInputElement);

      function RadioInputElement(element, parent) {
          classCallCheck(this, RadioInputElement);
          return possibleConstructorReturn(this, (RadioInputElement.__proto__ || Object.getPrototypeOf(RadioInputElement)).call(this, element, parent));
      }

      createClass(RadioInputElement, [{
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

  /* jshint esversion: 6 */

  var SimpleElement = function (_BaseElement) {
      inherits(SimpleElement, _BaseElement);

      function SimpleElement(element, parent) {
          classCallCheck(this, SimpleElement);
          return possibleConstructorReturn(this, (SimpleElement.__proto__ || Object.getPrototypeOf(SimpleElement)).call(this, element, parent));
      }

      createClass(SimpleElement, [{
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

  /* jshint esversion: 6 */

  var TextareaInputElement = function (_AbstractInputElement) {
      inherits(TextareaInputElement, _AbstractInputElement);

      function TextareaInputElement(element, parent) {
          classCallCheck(this, TextareaInputElement);
          return possibleConstructorReturn(this, (TextareaInputElement.__proto__ || Object.getPrototypeOf(TextareaInputElement)).call(this, element, parent));
      }

      createClass(TextareaInputElement, [{
          key: "getInnerHTML",
          value: function getInnerHTML() {
              return this._element.innerHTML;
          }
      }, {
          key: "setInnerHTML",
          value: function setInnerHTML(value) {
              this._element.innerHTML = value;
          }
      }, {
          key: "addChild",
          value: function addChild(input) {
              get(TextareaInputElement.prototype.__proto__ || Object.getPrototypeOf(TextareaInputElement.prototype), "addChild", this).call(this, input);
              this.setValue(this.getInnerHTML());
          }
      }, {
          key: "prependChild",
          value: function prependChild(input) {
              get(TextareaInputElement.prototype.__proto__ || Object.getPrototypeOf(TextareaInputElement.prototype), "prependChild", this).call(this, input);
              this.setValue(this.getInnerHTML());
          }
      }]);
      return TextareaInputElement;
  }(AbstractInputElement);

  /* jshint esversion: 6 */

  var TextInputElement = function (_AbstractInputElement) {
      inherits(TextInputElement, _AbstractInputElement);

      function TextInputElement(element, parent) {
          classCallCheck(this, TextInputElement);
          return possibleConstructorReturn(this, (TextInputElement.__proto__ || Object.getPrototypeOf(TextInputElement)).call(this, element, parent));
      }

      return TextInputElement;
  }(AbstractInputElement);

  /* jshint esversion: 6 */

  var TextnodeElement = function () {
      function TextnodeElement(value, parent) {
          classCallCheck(this, TextnodeElement);

          if (value instanceof xmlparser.XmlCdata) {
              this._element = this.createFromXmlCdata(value, parent);
          }
          if (typeof value === "string") {
              this._element = document.createTextNode(value);
          }
      }

      createClass(TextnodeElement, [{
          key: "createFromXmlCdata",
          value: function createFromXmlCdata(cdataElement, parentElement) {
              var element = document.createTextNode(cdataElement.getValue());
              if (parentElement !== null && parentElement.getMappedElement() !== null) {
                  parentElement.getMappedElement().appendChild(element);
              }
              return element;
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

  /* jshint esversion: 6 */

  var ElementMapper = function () {
      function ElementMapper() {
          classCallCheck(this, ElementMapper);
      }

      createClass(ElementMapper, null, [{
          key: "map",
          value: function map(input, parent) {
              if (ElementMapper.mapsToRadio(input)) {
                  return new RadioInputElement(input, parent);
              }
              if (ElementMapper.mapsToCheckbox(input)) {
                  return new CheckboxInputElement(input, parent);
              }
              if (ElementMapper.mapsToPassword(input)) {
                  return new PasswordInputElement(input, parent);
              }
              if (ElementMapper.mapsToSubmit(input)) {
                  return new TextInputElement(input, parent);
              }
              if (ElementMapper.mapsToTextarea(input)) {
                  return new TextareaInputElement(input, parent);
              }
              if (ElementMapper.mapsToText(input)) {
                  return new TextInputElement(input, parent);
              }
              if (ElementMapper.mapsToTextnode(input)) {
                  return new TextnodeElement(input, parent);
              }
              if (ElementMapper.mapsToSimple(input)) {
                  return new SimpleElement(input, parent);
              }
              console.log("Mapping to simple by default " + input);
              return new SimpleElement(input, parent);
          }
      }, {
          key: "mapsToRadio",
          value: function mapsToRadio(input) {
              return input instanceof HTMLInputElement && input.type == "radio" || input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "radio";
          }
      }, {
          key: "mapsToCheckbox",
          value: function mapsToCheckbox(input) {
              return input instanceof HTMLInputElement && input.type == "checkbox" || input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "checkbox";
          }
      }, {
          key: "mapsToPassword",
          value: function mapsToPassword(input) {
              return input instanceof HTMLInputElement && input.type == "password" || input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "password";
          }
      }, {
          key: "mapsToSubmit",
          value: function mapsToSubmit(input) {
              return input instanceof HTMLInputElement && input.type == "submit" || input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "submit";
          }
      }, {
          key: "mapsToText",
          value: function mapsToText(input) {
              return input instanceof HTMLInputElement && input.type == "text" || input instanceof xmlparser.XmlElement && input.getName() === "input" && input.getAttribute("type").getValue() === "text";
          }
      }, {
          key: "mapsToTextnode",
          value: function mapsToTextnode(input) {
              return input instanceof Node && input.nodeType === "TEXT_NODE" || input instanceof xmlparser.XmlCdata;
          }
      }, {
          key: "mapsToTextarea",
          value: function mapsToTextarea(input) {
              return input instanceof HTMLTextAreaElement || input instanceof xmlparser.XmlElement && input.getName() === "textarea";
          }
      }, {
          key: "mapsToSimple",
          value: function mapsToSimple(input) {
              return input instanceof HTMLElement || input instanceof xmlparser.XmlElement;
          }
      }]);
      return ElementMapper;
  }();

  /* jshint esversion: 6 */

  var Event = function () {
      function Event(event) {
          classCallCheck(this, Event);

          this._event = event;
          if (this._event.type.toLowerCase() == "dragstart") {
              this._event.dataTransfer.setData('text/plain', null);
          }
      }

      createClass(Event, [{
          key: "preventDefault",
          value: function preventDefault() {
              this._event.preventDefault();
          }
      }, {
          key: "getOffsetX",
          value: function getOffsetX() {
              return this._event.offsetX;
          }
      }, {
          key: "getOffsetY",
          value: function getOffsetY() {
              return this._event.offsetY;
          }
      }, {
          key: "getClientX",
          value: function getClientX() {
              return this._event.clientX;
          }
      }, {
          key: "getClientY",
          value: function getClientY() {
              return this._event.clientY;
          }
      }, {
          key: "getTarget",
          value: function getTarget() {
              return ElementMapper.map(this._event.target);
          }
      }]);
      return Event;
  }();

  /* jshint esversion: 6 */

  var Template = function () {
      function Template(templateSource) {
          classCallCheck(this, Template);

          this._templateSource = templateSource;
      }

      createClass(Template, [{
          key: "getTemplateSource",
          value: function getTemplateSource() {
              return this._templateSource;
          }
      }]);
      return Template;
  }();

  /* jshint esversion: 6 */

  var TemplateManager = function () {
      function TemplateManager() {
          classCallCheck(this, TemplateManager);

          this._templateMap = new coreutil.Map();
          this._templateQueueSize = 0;
          this._callback = null;
      }

      createClass(TemplateManager, [{
          key: "set",
          value: function set$$1(name, template) {
              this._templateMap.set(name, template);
          }
      }, {
          key: "get",
          value: function get$$1(name) {
              return this._templateMap.get(name);
          }
      }, {
          key: "contains",
          value: function contains(name) {
              return this._templateMap.contains(name);
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
              if (tmo._callback !== null && tmo._callback !== undefined && tmo._templateQueueSize === tmo._templateMap.size()) {
                  var tempCallback = tmo._callback;
                  tmo._callback = null;
                  tempCallback.call();
              }
          }
      }, {
          key: "load",
          value: function load(name, url) {
              var obj = this;
              if (!this.contains(name)) {
                  this._templateQueueSize++;
                  qwest.get(url).then(function (xhr, response) {
                      obj.set(name, new Template(response));
                      setTimeout(function () {
                          obj.doCallback(obj);
                      }, 0);
                  });
              } else {
                  obj.doCallback(obj);
              }
          }
      }]);
      return TemplateManager;
  }();

  var templates = new TemplateManager();

  /* jshint esversion: 6 */

  var EventRegistry = function () {
      function EventRegistry() {
          classCallCheck(this, EventRegistry);

          this._listeners = new coreutil.Map();
          this._beforeListeners = new coreutil.Map();
          this._afterListeners = new coreutil.Map();
      }

      createClass(EventRegistry, [{
          key: "attach",
          value: function attach(element, eventType, eventName, suffixedEventName) {
              element.attachEvent(eventType, function (event) {
                  eventRegistry.trigger(suffixedEventName, eventName, event);
              });
          }
      }, {
          key: "listen",
          value: function listen(eventName, handlerObject, handlerFunction) {
              eventName = eventName + "_" + this.resolveIdSuffix(handlerObject);
              if (!this._listeners.exists(eventName)) {
                  this._listeners.set(eventName, new coreutil.List());
              }
              var objectFunction = new coreutil.ObjectFunction(handlerObject, handlerFunction);
              this._listeners.get(eventName).add(objectFunction);
          }
      }, {
          key: "resolveIdSuffix",
          value: function resolveIdSuffix(handlerObject) {
              if (handlerObject.getIdSuffix !== undefined) {
                  return handlerObject.getIdSuffix();
              }
              if (handlerObject.getComponent !== undefined) {
                  return handlerObject.getComponent().getIdSuffix();
              }
              coreutil.Logger.error("Unable to register event as the handler object is neither a component nor exposes any via getComponent");
              return null;
          }
      }, {
          key: "listenBefore",
          value: function listenBefore(eventName, handlerObject, handlerFunction) {
              if (!this._beforeListeners.exists(eventName)) {
                  this._beforeListeners.set(eventName, new coreutil.List());
              }
              var objectFunction = new coreutil.ObjectFunction(handlerObject, handlerFunction);
              this._beforeListeners.get(eventName).add(objectFunction);
          }
      }, {
          key: "listenAfter",
          value: function listenAfter(eventName, handlerObject, handlerFunction) {
              if (!this._afterListeners.exists(eventName)) {
                  this._afterListeners.set(eventName, new coreutil.List());
              }
              this._afterListeners.get(eventName).add(new coreutil.ObjectFunction(handlerObject, handlerFunction));
          }
      }, {
          key: "trigger",
          value: function trigger(suffixedEventName, eventName, event) {
              this.handleBefore(eventName, event);
              if (this._listeners.exists(suffixedEventName)) {
                  var currentListeners = new coreutil.List();
                  this._listeners.get(suffixedEventName).forEach(function (value, parent) {
                      currentListeners.add(value);
                      return true;
                  }, this);
                  currentListeners.forEach(function (value, parent) {
                      value.call(new Event(event));
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
                  var currentListeners = new coreutil.List();
                  listeners.get(eventName).forEach(function (value, parent) {
                      currentListeners.add(value);
                      return true;
                  }, this);
                  currentListeners.forEach(function (value, parent) {
                      value.call(new Event(event));
                      return true;
                  }, this);
              }
          }
      }]);
      return EventRegistry;
  }();

  var eventRegistry = new EventRegistry();

  /* jshint esversion: 6 */

  var Component = function () {
      function Component(templateName) {
          classCallCheck(this, Component);

          var template = null;
          if (typeof templateName === "string") {
              template = templates.get(templateName);
          }
          this._mapperMap = new coreutil.Map();
          this._idSuffix = componentCounter++;
          this._rootElement = null;
          new xmlparser.DomTree(template.getTemplateSource(), this).load();
      }

      createClass(Component, [{
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
              if (this._idSuffix !== null) {
                  return id + "-" + this._idSuffix;
              }
              return id;
          }
      }, {
          key: "elementCreated",
          value: function elementCreated(xmlElement, parentWrapper) {
              var element = ElementMapper.map(xmlElement, parentWrapper);

              this.addToElementIdMap(element);
              this.registerElementEvents(element);

              if (this._rootElement === null && element !== null) {
                  this._rootElement = element;
              }

              return element;
          }
      }, {
          key: "registerElementEvents",
          value: function registerElementEvents(element) {
              if (element === null || element === undefined || !(element instanceof BaseElement)) {
                  return;
              }
              element.getAttributes().forEach(function (attributeKey, attribute, parent) {
                  if (attribute !== null && attribute !== undefined && attribute.getValue().startsWith("//event:")) {
                      var eventName = attribute.getValue();
                      var eventType = attribute.getName();
                      var suffixedEventName = eventName + "_" + parent._idSuffix;
                      eventRegistry.attach(element, eventType, eventName, suffixedEventName);
                  }
                  return true;
              }, this);
          }
      }, {
          key: "addToElementIdMap",
          value: function addToElementIdMap(element) {
              if (element === null || element === undefined || !(element instanceof BaseElement)) {
                  return;
              }
              var id = null;
              if (element.containsAttribute("id")) {
                  id = element.getAttributeValue("id");
                  element.setAttributeValue("id", this.idAttributeWithSuffix(id));
              }

              if (id !== null) {
                  this._mapperMap.set(id, element);
              }
          }
      }, {
          key: "get",
          value: function get$$1(id) {
              return this._mapperMap.get(id);
          }
      }, {
          key: "set",
          value: function set$$1(id, value) {
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

  var componentCounter = 0;

  /* jshint esversion: 6 */

  var HTML = function () {
      function HTML() {
          classCallCheck(this, HTML);
      }

      createClass(HTML, null, [{
          key: "custom",
          value: function custom(elementName) {
              var xmlElement = new xmlparser.XmlElement(elementName);
              return ElementMapper.map(xmlElement);
          }
      }, {
          key: "applyStyles",
          value: function applyStyles(element, classValue, styleValue) {
              if (classValue !== null) {
                  element.setAttributeValue("class", classValue);
              }
              if (styleValue !== null) {
                  element.setAttributeValue("style", styleValue);
              }
          }
      }, {
          key: "a",
          value: function a(name, href, classValue, styleValue) {
              var element = HTML.custom("a");
              element.addChild(name);
              element.setAttributeValue("href", href);
              HTML.applyStyles(element, classValue, styleValue);
              return element;
          }
      }]);
      return HTML;
  }();

  /* jshint esversion: 6 */

  var InputMapping = function () {
      function InputMapping(model, validator) {
          classCallCheck(this, InputMapping);

          this._model = model;
          this._validator = validator;
          this._pullers = new coreutil.List();
          this._pushers = new coreutil.List();
      }

      createClass(InputMapping, [{
          key: "and",
          value: function and(field) {
              return this.to(field);
          }
      }, {
          key: "to",
          value: function to(field) {
              var fieldDestination = this._model;
              var validator = this._validator;

              var puller = function puller(event) {
                  if (field instanceof AbstractInputElement) {
                      var fieldValue = field.getValue();
                      if (field instanceof RadioInputElement) {
                          if (field.isChecked()) {
                              coreutil.PropertyAccessor.setValue(fieldDestination, field.getName(), field.getValue());
                          }
                      } else if (field instanceof CheckboxInputElement) {
                          if (field.isChecked()) {
                              coreutil.PropertyAccessor.setValue(fieldDestination, field.getName(), field.getValue());
                          } else {
                              coreutil.PropertyAccessor.setValue(fieldDestination, field.getName(), null);
                          }
                      } else {
                          coreutil.PropertyAccessor.setValue(fieldDestination, field.getName(), field.getValue());
                      }
                  }
                  if (validator !== undefined && validator !== null) {
                      validator.validate(field);
                  }
              };
              field.attachEvent("onchange", puller);
              field.attachEvent("onkeyup", puller);
              puller.call();

              var pusher = function pusher() {
                  var value = coreutil.PropertyAccessor.getValue(fieldDestination, field.getName());
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

  /* jshint esversion: 6 */

  var InputMapper = function () {
      function InputMapper() {
          classCallCheck(this, InputMapper);

          this._inputMappingList = new coreutil.List();
      }

      createClass(InputMapper, [{
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

  var inputs = new InputMapper();

  /* jshint esversion: 6 */

  var URL = function () {
      function URL(value) {
          classCallCheck(this, URL);

          this._protocol = null;
          this._host = null;
          this._port = null;
          this._pathList = new coreutil.List();
          this._parameterMap = new coreutil.Map();
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

      createClass(URL, [{
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
              var pathParts = new coreutil.List(value.split("/"));
              pathParts.forEach(function (value, parent) {
                  if (parent._pathList === null) {
                      parent._pathList = new coreutil.List();
                  }
                  parent._pathList.add(decodeURI(value));
                  return true;
              }, this);
              return remaining;
          }
      }, {
          key: "determineParameters",
          value: function determineParameters(value) {
              var partList = new coreutil.List(value.split("&"));
              var parameterMap = new coreutil.Map();
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

  exports.AbstractInputElement = AbstractInputElement;
  exports.Attribute = Attribute;
  exports.BaseElement = BaseElement;
  exports.CheckboxInputElement = CheckboxInputElement;
  exports.PasswordInputElement = PasswordInputElement;
  exports.RadioInputElement = RadioInputElement;
  exports.SimpleElement = SimpleElement;
  exports.TextareaInputElement = TextareaInputElement;
  exports.TextInputElement = TextInputElement;
  exports.TextnodeElement = TextnodeElement;
  exports.Event = Event;
  exports.Component = Component;
  exports.ElementMapper = ElementMapper;
  exports.EventRegistry = EventRegistry;
  exports.eventRegistry = eventRegistry;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVzdHJpZ2h0LmpzIiwic291cmNlcyI6WyIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9lbGVtZW50L2F0dHJpYnV0ZS5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2VsZW1lbnQvYmFzZUVsZW1lbnQuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9lbGVtZW50L2Fic3RyYWN0SW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvZWxlbWVudC9jaGVja2JveElucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2VsZW1lbnQvcGFzc3dvcmRJbnB1dEVsZW1lbnQuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvYnJvd3Nlci9lbGVtZW50L3JhZGlvSW5wdXRFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvZWxlbWVudC9zaW1wbGVFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2Jyb3dzZXIvZWxlbWVudC90ZXh0YXJlYUlucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2VsZW1lbnQvdGV4dElucHV0RWxlbWVudC5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2VsZW1lbnQvdGV4dG5vZGVFbGVtZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2VsZW1lbnQvZWxlbWVudE1hcHBlci5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9icm93c2VyL2V2ZW50L2V2ZW50LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L3RlbXBsYXRlL3RlbXBsYXRlTWFuYWdlci5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9ldmVudC9ldmVudFJlZ2lzdHJ5LmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2NvbXBvbmVudC9jb21wb25lbnQuanMiLCIuLi9zcmMvbWFpbi9qdXN0cmlnaHQvaHRtbC9odG1sLmpzIiwiLi4vc3JjL21haW4vanVzdHJpZ2h0L2lucHV0L2lucHV0TWFwcGluZy5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC9pbnB1dC9pbnB1dE1hcHBlci5qcyIsIi4uL3NyYy9tYWluL2p1c3RyaWdodC91dGlsL3VybC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQXR0cmlidXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGUpIHtcclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGUgPSBhdHRyaWJ1dGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGUubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lc3BhY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZS5uYW1lO1xyXG4gICAgfVxyXG59IiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge1htbEVsZW1lbnR9IGZyb20gXCJ4bWxwYXJzZXJcIjtcbmltcG9ydCB7TWFwLCBMaXN0fSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7QXR0cmlidXRlfSBmcm9tIFwiLi9hdHRyaWJ1dGVcIjtcblxuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGVuY2xvc2luZyBhbiBIVE1MRWxlbWVudFxuICovXG5leHBvcnQgY2xhc3MgQmFzZUVsZW1lbnQge1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7WG1sRWxlbWVudHxzdHJpbmd8SFRNTEVsZW1lbnR9IHZhbHVlXG4gICAgICogQHBhcmFtIHtYbWxFbGVtZW50fSBwYXJlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgcGFyZW50KSB7XG4gICAgICAgIFxuICAgICAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlTWFwID0gbnVsbDtcbiAgICAgICAgXG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgWG1sRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHRoaXMuY3JlYXRlRnJvbVhtbEVsZW1lbnQodmFsdWUsIHBhcmVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5yZWNvZ25pemVkIHZhbHVlIGZvciBFbGVtZW50XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKHZhbHVlKTtcbiAgICB9XG5cbiAgICBsb2FkQXR0cmlidXRlcygpIHtcbiAgICAgICAgaWYodGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzID09PSBudWxsIHx8IHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9hdHRyaWJ1dGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5fYXR0cmlidXRlTWFwID09PSBudWxsIHx8IHRoaXMuX2F0dHJpYnV0ZU1hcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9hdHRyaWJ1dGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZU1hcC5zZXQodGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzW2ldLm5hbWUsbmV3IEF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50LmF0dHJpYnV0ZXNbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBicm93c2VyIEVsZW1lbnQgZnJvbSB0aGUgWG1sRWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtYbWxFbGVtZW50fSB4bWxFbGVtZW50XG4gICAgICogQHBhcmFtIHtYbWxFbGVtZW50fSBwYXJlbnRFbGVtZW50XG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgY3JlYXRlRnJvbVhtbEVsZW1lbnQoeG1sRWxlbWVudCwgcGFyZW50RWxlbWVudCkge1xuICAgICAgICBsZXQgZWxlbWVudCA9IG51bGw7XG4gICAgICAgIGlmKHhtbEVsZW1lbnQuZ2V0TmFtZXNwYWNlKCkpe1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxFbGVtZW50LmdldE5hbWVzcGFjZVVyaSgpLHhtbEVsZW1lbnQuZ2V0RnVsbE5hbWUoKSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoeG1sRWxlbWVudC5nZXROYW1lKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHBhcmVudEVsZW1lbnQgJiYgcGFyZW50RWxlbWVudC5nZXRNYXBwZWRFbGVtZW50KCkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuZ2V0TWFwcGVkRWxlbWVudCgpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHhtbEVsZW1lbnQuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24oa2V5LHZhbHVlKXtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSx2YWx1ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGEgZnVuY3Rpb24gdG8gYW4gZXZlbnQgaW4gdGhlIGVuY2xvc2VkIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jdGlvblBhcmFtXG4gICAgICovXG4gICAgYXR0YWNoRXZlbnQoZXZlbnRUeXBlLCBmdW5jdGlvblBhcmFtKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRbZXZlbnRUeXBlXSA9IGZ1bmN0aW9uUGFyYW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBlbmNsb3NlZCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXRNYXBwZWRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgICB9XG5cbiAgICBnZXRGdWxsTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZTtcbiAgICB9XG5cbiAgICBnZXRUb3AoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICB9XG5cbiAgICBnZXRCb3R0b20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIH1cblxuICAgIGdldFJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodDtcbiAgICB9XG5cbiAgICBnZXRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0QXR0cmlidXRlcygpIHtcbiAgICAgICAgdGhpcy5sb2FkQXR0cmlidXRlcygpO1xuICAgICAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlTWFwO1xuICAgIH1cblxuICAgIHNldEF0dHJpYnV0ZVZhbHVlKGtleSx2YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShrZXksdmFsdWUpO1xuICAgIH1cblxuICAgIGdldEF0dHJpYnV0ZVZhbHVlKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5nZXRBdHRyaWJ1dGUoa2V5KTtcbiAgICB9XG5cbiAgICBjb250YWluc0F0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuaGFzQXR0cmlidXRlKGtleSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlKGtleSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgIH1cblxuICAgIHNldFN0eWxlKGtleSx2YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXRTdHlsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuc3R5bGVba2V5XTtcbiAgICB9XG5cbiAgICByZW1vdmVTdHlsZShrZXkpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtrZXldID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXQoaW5wdXQpIHtcbiAgICAgICAgaWYodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgZWxlbWVudCBoYXMgbm8gcGFyZW50LCBjYW4gbm90IHN3YXAgaXQgZm9yIHZhbHVlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgQmFzZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoaW5wdXQuZ2V0TWFwcGVkRWxlbWVudCgpLHRoaXMuX2VsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGlucHV0ICYmIHR5cGVvZiBpbnB1dC5nZXRSb290RWxlbWVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGlucHV0LmdldFJvb3RFbGVtZW50KCkuZ2V0TWFwcGVkRWxlbWVudCgpLHRoaXMuX2VsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IGlucHV0LmdldFJvb3RFbGVtZW50KCkuZ2V0TWFwcGVkRWxlbWVudCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlucHV0KSx0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoaW5wdXQsdGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5wdXQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGlucHV0LHRoaXMuX2VsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENoaWxkKGlucHV0KSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChpbnB1dCk7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGQoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQmFzZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQuZ2V0TWFwcGVkRWxlbWVudCgpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgJiYgdHlwZW9mIGlucHV0LmdldFJvb3RFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQuZ2V0Um9vdEVsZW1lbnQoKS5nZXRNYXBwZWRFbGVtZW50KCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpbnB1dCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJlcGVuZENoaWxkKGlucHV0KSB7XG4gICAgICAgIGlmKHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQmFzZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuaW5zZXJ0QmVmb3JlKGlucHV0LmdldE1hcHBlZEVsZW1lbnQoKSx0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCAmJiB0eXBlb2YgaW5wdXQuZ2V0Um9vdEVsZW1lbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQuZ2V0Um9vdEVsZW1lbnQoKS5nZXRNYXBwZWRFbGVtZW50KCksdGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlucHV0KSx0aGlzLl9lbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuaW5zZXJ0QmVmb3JlKGlucHV0LHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQsdGhpcy5fZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtCYXNlRWxlbWVudH0gZnJvbSBcIi4vYmFzZUVsZW1lbnRcIjtcblxuLyoqXG4gKiBTaGFyZWQgcHJvcGVydGllcyBvZiBpbnB1dCBlbGVtZW50c1xuICovXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RJbnB1dEVsZW1lbnQgZXh0ZW5kcyBCYXNlRWxlbWVudHtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWVcbiAgICAgKiBAcGFyYW0ge1htbEVsZW1lbnR9IHBhcmVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBwYXJlbnQpIHtcbiAgICAgICAgc3VwZXIodmFsdWUsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXRzIG5hbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdmFsdWUgb2YgaW5wdXRzIG5hbWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldE5hbWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5uYW1lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICovXG4gICAgZ2V0VmFsdWUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQudmFsdWU7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUodmFsdWUpe1xuICAgICAgICB0aGlzLl9lbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi9hYnN0cmFjdElucHV0RWxlbWVudFwiO1xuXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hJbnB1dEVsZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdElucHV0RWxlbWVudHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50LCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHNldENoZWNrZWQodmFsdWUpe1xuICAgICAgICB0aGlzLl9lbGVtZW50LmNoZWNrZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBpc0NoZWNrZWQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuY2hlY2tlZDtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7QWJzdHJhY3RJbnB1dEVsZW1lbnR9IGZyb20gXCIuL2Fic3RyYWN0SW5wdXRFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBQYXNzd29yZElucHV0RWxlbWVudCBleHRlbmRzIEFic3RyYWN0SW5wdXRFbGVtZW50e1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XG4gICAgfVxuXG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7QWJzdHJhY3RJbnB1dEVsZW1lbnR9IGZyb20gXCIuL2Fic3RyYWN0SW5wdXRFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBSYWRpb0lucHV0RWxlbWVudCBleHRlbmRzIEFic3RyYWN0SW5wdXRFbGVtZW50e1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgc2V0Q2hlY2tlZCh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY2hlY2tlZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlzQ2hlY2tlZCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5jaGVja2VkO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtCYXNlRWxlbWVudH0gZnJvbSBcIi4vYmFzZUVsZW1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIFNpbXBsZUVsZW1lbnQgZXh0ZW5kcyBCYXNlRWxlbWVudHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xuICAgICAgICBzdXBlcihlbGVtZW50LCBwYXJlbnQpO1xuICAgIH1cblxuICAgIGdldElubmVySFRNTCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgc2V0SW5uZXJIVE1MKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4vYWJzdHJhY3RJbnB1dEVsZW1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRhcmVhSW5wdXRFbGVtZW50IGV4dGVuZHMgQWJzdHJhY3RJbnB1dEVsZW1lbnR7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgcGFyZW50KTtcbiAgICB9XG5cbiAgICBnZXRJbm5lckhUTUwoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHNldElubmVySFRNTCh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGQoaW5wdXQpIHtcbiAgICAgICAgc3VwZXIuYWRkQ2hpbGQoaW5wdXQpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuZ2V0SW5uZXJIVE1MKCkpO1xuICAgIH1cblxuICAgIHByZXBlbmRDaGlsZChpbnB1dCkge1xuICAgICAgICBzdXBlci5wcmVwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuZ2V0SW5uZXJIVE1MKCkpO1xuICAgIH1cblxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge0Fic3RyYWN0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi9hYnN0cmFjdElucHV0RWxlbWVudFwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dElucHV0RWxlbWVudCBleHRlbmRzIEFic3RyYWN0SW5wdXRFbGVtZW50e1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50KSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHBhcmVudCk7XG4gICAgfVxuXG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7WG1sQ2RhdGF9IGZyb20gXCJ4bWxwYXJzZXJcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRub2RlRWxlbWVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgcGFyZW50KSB7XG4gICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgWG1sQ2RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLmNyZWF0ZUZyb21YbWxDZGF0YSh2YWx1ZSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUZyb21YbWxDZGF0YShjZGF0YUVsZW1lbnQsIHBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjZGF0YUVsZW1lbnQuZ2V0VmFsdWUoKSk7XG4gICAgICAgIGlmKHBhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgcGFyZW50RWxlbWVudC5nZXRNYXBwZWRFbGVtZW50KCkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuZ2V0TWFwcGVkRWxlbWVudCgpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3RleHRub2RlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0bm9kZTtcbiAgICB9XG5cbiAgICBnZXRNYXBwZWRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dG5vZGU7XG4gICAgfVxuXG59XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7WG1sQ2RhdGEsWG1sRWxlbWVudH0gZnJvbSBcInhtbHBhcnNlclwiO1xuaW1wb3J0IHtSYWRpb0lucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9yYWRpb0lucHV0RWxlbWVudFwiO1xuaW1wb3J0IHtDaGVja2JveElucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9jaGVja2JveElucHV0RWxlbWVudFwiO1xuaW1wb3J0IHtQYXNzd29yZElucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9wYXNzd29yZElucHV0RWxlbWVudFwiO1xuaW1wb3J0IHtUZXh0SW5wdXRFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50L3RleHRJbnB1dEVsZW1lbnRcIjtcbmltcG9ydCB7VGV4dGFyZWFJbnB1dEVsZW1lbnR9IGZyb20gXCIuLi9icm93c2VyL2VsZW1lbnQvdGV4dGFyZWFJbnB1dEVsZW1lbnRcIjtcbmltcG9ydCB7VGV4dG5vZGVFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50L3RleHRub2RlRWxlbWVudFwiO1xuaW1wb3J0IHtTaW1wbGVFbGVtZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9lbGVtZW50L3NpbXBsZUVsZW1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnRNYXBwZXIge1xuXG4gICAgc3RhdGljIG1hcChpbnB1dCwgcGFyZW50KSB7XG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvUmFkaW8oaW5wdXQpKXsgcmV0dXJuIG5ldyBSYWRpb0lucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxuICAgICAgICBpZihFbGVtZW50TWFwcGVyLm1hcHNUb0NoZWNrYm94KGlucHV0KSl7IHJldHVybiBuZXcgQ2hlY2tib3hJbnB1dEVsZW1lbnQoaW5wdXQsIHBhcmVudCk7IH1cbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9QYXNzd29yZChpbnB1dCkpeyByZXR1cm4gbmV3IFBhc3N3b3JkSW5wdXRFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvU3VibWl0KGlucHV0KSl7IHJldHVybiBuZXcgVGV4dElucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxuICAgICAgICBpZihFbGVtZW50TWFwcGVyLm1hcHNUb1RleHRhcmVhKGlucHV0KSl7IHJldHVybiBuZXcgVGV4dGFyZWFJbnB1dEVsZW1lbnQoaW5wdXQsIHBhcmVudCk7IH1cbiAgICAgICAgaWYoRWxlbWVudE1hcHBlci5tYXBzVG9UZXh0KGlucHV0KSl7IHJldHVybiBuZXcgVGV4dElucHV0RWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxuICAgICAgICBpZihFbGVtZW50TWFwcGVyLm1hcHNUb1RleHRub2RlKGlucHV0KSl7IHJldHVybiBuZXcgVGV4dG5vZGVFbGVtZW50KGlucHV0LCBwYXJlbnQpOyB9XG4gICAgICAgIGlmKEVsZW1lbnRNYXBwZXIubWFwc1RvU2ltcGxlKGlucHV0KSl7IHJldHVybiBuZXcgU2ltcGxlRWxlbWVudChpbnB1dCwgcGFyZW50KTsgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIk1hcHBpbmcgdG8gc2ltcGxlIGJ5IGRlZmF1bHQgXCIgKyBpbnB1dCk7XG4gICAgICAgIHJldHVybiBuZXcgU2ltcGxlRWxlbWVudChpbnB1dCwgcGFyZW50KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFwc1RvUmFkaW8oaW5wdXQpe1xuICAgICAgICByZXR1cm4gKGlucHV0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBpbnB1dC50eXBlID09IFwicmFkaW9cIikgfHxcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQgJiYgaW5wdXQuZ2V0TmFtZSgpID09PSBcImlucHV0XCIgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS5nZXRWYWx1ZSgpID09PSBcInJhZGlvXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYXBzVG9DaGVja2JveChpbnB1dCl7XG4gICAgICAgIHJldHVybiAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGlucHV0LnR5cGUgPT0gXCJjaGVja2JveFwiKSB8fFxuICAgICAgICAgICAgKGlucHV0IGluc3RhbmNlb2YgWG1sRWxlbWVudCAmJiBpbnB1dC5nZXROYW1lKCkgPT09IFwiaW5wdXRcIiAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLmdldFZhbHVlKCkgPT09IFwiY2hlY2tib3hcIik7XG4gICAgfVxuXG4gICAgc3RhdGljIG1hcHNUb1Bhc3N3b3JkKGlucHV0KXtcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcInBhc3N3b3JkXCIpIHx8XG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJpbnB1dFwiICYmIGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIikuZ2V0VmFsdWUoKSA9PT0gXCJwYXNzd29yZFwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFwc1RvU3VibWl0KGlucHV0KXtcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcInN1Ym1pdFwiKSB8fFxuICAgICAgICAgICAgKGlucHV0IGluc3RhbmNlb2YgWG1sRWxlbWVudCAmJiBpbnB1dC5nZXROYW1lKCkgPT09IFwiaW5wdXRcIiAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLmdldFZhbHVlKCkgPT09IFwic3VibWl0XCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYXBzVG9UZXh0KGlucHV0KXtcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PSBcInRleHRcIikgfHxcbiAgICAgICAgICAgIChpbnB1dCBpbnN0YW5jZW9mIFhtbEVsZW1lbnQgJiYgaW5wdXQuZ2V0TmFtZSgpID09PSBcImlucHV0XCIgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS5nZXRWYWx1ZSgpID09PSBcInRleHRcIik7XG4gICAgfVxuXG4gICAgc3RhdGljIG1hcHNUb1RleHRub2RlKGlucHV0KXtcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIE5vZGUgJiYgaW5wdXQubm9kZVR5cGUgPT09IFwiVEVYVF9OT0RFXCIpIHx8XG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxDZGF0YSk7XG4gICAgfVxuXG4gICAgc3RhdGljIG1hcHNUb1RleHRhcmVhKGlucHV0KXtcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHx8XG4gICAgICAgICAgICAoaW5wdXQgaW5zdGFuY2VvZiBYbWxFbGVtZW50ICYmIGlucHV0LmdldE5hbWUoKSA9PT0gXCJ0ZXh0YXJlYVwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFwc1RvU2ltcGxlKGlucHV0KXtcbiAgICAgICAgcmV0dXJuIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fFxuICAgICAgICAgICAgKGlucHV0IGluc3RhbmNlb2YgWG1sRWxlbWVudCk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge0VsZW1lbnRNYXBwZXJ9IGZyb20gXCIuLi8uLi9lbGVtZW50L2VsZW1lbnRNYXBwZXJcIjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50e1xuXG4gICAgY29uc3RydWN0b3IoZXZlbnQpe1xuICAgICAgICB0aGlzLl9ldmVudCA9IGV2ZW50O1xuICAgICAgICBpZih0aGlzLl9ldmVudC50eXBlLnRvTG93ZXJDYXNlKCkgPT0gXCJkcmFnc3RhcnRcIil7XG4gICAgICAgICAgICB0aGlzLl9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dC9wbGFpbicsIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJldmVudERlZmF1bHQoKXtcbiAgICAgICAgdGhpcy5fZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBnZXRPZmZzZXRYKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudC5vZmZzZXRYO1xuICAgIH1cblxuICAgIGdldE9mZnNldFkoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50Lm9mZnNldFk7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50WCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQuY2xpZW50WDtcbiAgICB9XG5cbiAgICBnZXRDbGllbnRZKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudC5jbGllbnRZO1xuICAgIH1cblxuICAgIGdldFRhcmdldCgpe1xuICAgICAgICByZXR1cm4gRWxlbWVudE1hcHBlci5tYXAodGhpcy5fZXZlbnQudGFyZ2V0KTtcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRle1xuXG4gICAgY29uc3RydWN0b3IodGVtcGxhdGVTb3VyY2Upe1xuICAgICAgICB0aGlzLl90ZW1wbGF0ZVNvdXJjZSA9IHRlbXBsYXRlU291cmNlO1xuICAgIH1cblxuICAgIGdldFRlbXBsYXRlU291cmNlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZVNvdXJjZTtcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtNYXB9IGZyb20gXCJjb3JldXRpbFwiO1xuaW1wb3J0IHtUZW1wbGF0ZX0gZnJvbSBcIi4vdGVtcGxhdGVcIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlTWFuYWdlcntcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl90ZW1wbGF0ZVF1ZXVlU2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXQobmFtZSx0ZW1wbGF0ZSl7XG4gICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwLnNldChuYW1lLCB0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgZ2V0KG5hbWUpe1xuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVNYXAuZ2V0KG5hbWUpO1xuICAgIH1cblxuICAgIGNvbnRhaW5zKG5hbWUpe1xuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVNYXAuY29udGFpbnMobmFtZSk7XG4gICAgfVxuXG4gICAgZG9uZShjYWxsYmFjayl7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuZG9DYWxsYmFjayh0aGlzKTtcbiAgICB9XG5cbiAgICBkb0NhbGxiYWNrKHRtbyl7XG4gICAgICAgIGlmKHRtby5fY2FsbGJhY2sgIT09IG51bGwgJiYgdG1vLl9jYWxsYmFjayAhPT0gdW5kZWZpbmVkICAmJiB0bW8uX3RlbXBsYXRlUXVldWVTaXplID09PSB0bW8uX3RlbXBsYXRlTWFwLnNpemUoKSl7XG4gICAgICAgICAgICB2YXIgdGVtcENhbGxiYWNrID0gdG1vLl9jYWxsYmFjaztcbiAgICAgICAgICAgIHRtby5fY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICAgICAgdGVtcENhbGxiYWNrLmNhbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWQobmFtZSx1cmwpe1xuICAgICAgICB2YXIgb2JqID0gdGhpcztcbiAgICAgICAgaWYoIXRoaXMuY29udGFpbnMobmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlUXVldWVTaXplICsrO1xuICAgICAgICAgICAgcXdlc3QuZ2V0KHVybCkudGhlbihmdW5jdGlvbih4aHIscmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIG9iai5zZXQobmFtZSwgbmV3IFRlbXBsYXRlKHJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe29iai5kb0NhbGxiYWNrKG9iaik7fSwwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIG9iai5kb0NhbGxiYWNrKG9iaik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IHZhciB0ZW1wbGF0ZXMgPSBuZXcgVGVtcGxhdGVNYW5hZ2VyKCk7XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCB7TGlzdCxNYXAsT2JqZWN0RnVuY3Rpb24sIExvZ2dlcn0gZnJvbSBcImNvcmV1dGlsXCI7XG5pbXBvcnQge0V2ZW50fSBmcm9tIFwiLi4vYnJvd3Nlci9ldmVudC9ldmVudFwiO1xuXG5leHBvcnQgY2xhc3MgRXZlbnRSZWdpc3RyeSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9iZWZvcmVMaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX2FmdGVyTGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGF0dGFjaChlbGVtZW50LGV2ZW50VHlwZSxldmVudE5hbWUsc3VmZml4ZWRFdmVudE5hbWUpIHtcbiAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudChldmVudFR5cGUsIGZ1bmN0aW9uKGV2ZW50KSB7IGV2ZW50UmVnaXN0cnkudHJpZ2dlcihzdWZmaXhlZEV2ZW50TmFtZSxldmVudE5hbWUsZXZlbnQpOyB9KTtcbiAgICB9XG5cbiAgICBsaXN0ZW4oZXZlbnROYW1lLGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKSB7XG4gICAgICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZSArIFwiX1wiICsgdGhpcy5yZXNvbHZlSWRTdWZmaXgoaGFuZGxlck9iamVjdCk7XG4gICAgICAgIGlmKCF0aGlzLl9saXN0ZW5lcnMuZXhpc3RzKGV2ZW50TmFtZSkpe1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChldmVudE5hbWUsbmV3IExpc3QoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9iamVjdEZ1bmN0aW9uID0gbmV3IE9iamVjdEZ1bmN0aW9uKGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmdldChldmVudE5hbWUpLmFkZChvYmplY3RGdW5jdGlvbik7XG4gICAgfVxuXG4gICAgcmVzb2x2ZUlkU3VmZml4KGhhbmRsZXJPYmplY3QpIHtcbiAgICAgICAgaWYoaGFuZGxlck9iamVjdC5nZXRJZFN1ZmZpeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlck9iamVjdC5nZXRJZFN1ZmZpeCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGhhbmRsZXJPYmplY3QuZ2V0Q29tcG9uZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyT2JqZWN0LmdldENvbXBvbmVudCgpLmdldElkU3VmZml4KCk7XG4gICAgICAgIH1cbiAgICAgICAgTG9nZ2VyLmVycm9yKFwiVW5hYmxlIHRvIHJlZ2lzdGVyIGV2ZW50IGFzIHRoZSBoYW5kbGVyIG9iamVjdCBpcyBuZWl0aGVyIGEgY29tcG9uZW50IG5vciBleHBvc2VzIGFueSB2aWEgZ2V0Q29tcG9uZW50XCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsaXN0ZW5CZWZvcmUoZXZlbnROYW1lLGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLl9iZWZvcmVMaXN0ZW5lcnMuZXhpc3RzKGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2JlZm9yZUxpc3RlbmVycy5zZXQoZXZlbnROYW1lLG5ldyBMaXN0KCkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvYmplY3RGdW5jdGlvbiA9IG5ldyBPYmplY3RGdW5jdGlvbihoYW5kbGVyT2JqZWN0LGhhbmRsZXJGdW5jdGlvbik7XG4gICAgICAgIHRoaXMuX2JlZm9yZUxpc3RlbmVycy5nZXQoZXZlbnROYW1lKS5hZGQob2JqZWN0RnVuY3Rpb24pO1xuICAgIH1cblxuICAgIGxpc3RlbkFmdGVyKGV2ZW50TmFtZSxoYW5kbGVyT2JqZWN0LGhhbmRsZXJGdW5jdGlvbikge1xuICAgICAgICBpZighdGhpcy5fYWZ0ZXJMaXN0ZW5lcnMuZXhpc3RzKGV2ZW50TmFtZSkpe1xuICAgICAgICAgICAgdGhpcy5fYWZ0ZXJMaXN0ZW5lcnMuc2V0KGV2ZW50TmFtZSxuZXcgTGlzdCgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hZnRlckxpc3RlbmVycy5nZXQoZXZlbnROYW1lKS5hZGQobmV3IE9iamVjdEZ1bmN0aW9uKGhhbmRsZXJPYmplY3QsaGFuZGxlckZ1bmN0aW9uKSk7XG4gICAgfVxuXG4gICAgdHJpZ2dlcihzdWZmaXhlZEV2ZW50TmFtZSwgZXZlbnROYW1lLCBldmVudCkge1xuICAgICAgICB0aGlzLmhhbmRsZUJlZm9yZShldmVudE5hbWUsIGV2ZW50KTtcbiAgICAgICAgaWYodGhpcy5fbGlzdGVuZXJzLmV4aXN0cyhzdWZmaXhlZEV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TGlzdGVuZXJzID0gbmV3IExpc3QoKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5nZXQoc3VmZml4ZWRFdmVudE5hbWUpLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIHBhcmVudCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpc3RlbmVycy5hZGQodmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgcGFyZW50KXtcbiAgICAgICAgICAgICAgICB2YWx1ZS5jYWxsKG5ldyBFdmVudChldmVudCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhhbmRsZUFmdGVyKGV2ZW50TmFtZSwgZXZlbnQpO1xuICAgIH1cblxuICAgIGhhbmRsZUJlZm9yZShldmVudE5hbWUsIGV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlR2xvYmFsKHRoaXMuX2JlZm9yZUxpc3RlbmVycyxldmVudE5hbWUsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBoYW5kbGVBZnRlcihldmVudE5hbWUsIGV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlR2xvYmFsKHRoaXMuX2FmdGVyTGlzdGVuZXJzLGV2ZW50TmFtZSwgZXZlbnQpO1xuICAgIH1cblxuICAgIGhhbmRsZUdsb2JhbChsaXN0ZW5lcnMsIGV2ZW50TmFtZSwgZXZlbnQpIHtcbiAgICAgICAgaWYobGlzdGVuZXJzLmV4aXN0cyhldmVudE5hbWUpKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudExpc3RlbmVycyA9IG5ldyBMaXN0KCk7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuZ2V0KGV2ZW50TmFtZSkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuYWRkKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sdGhpcyk7XG4gICAgICAgICAgICBjdXJyZW50TGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KXtcbiAgICAgICAgICAgICAgICB2YWx1ZS5jYWxsKG5ldyBFdmVudChldmVudCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHZhciBldmVudFJlZ2lzdHJ5ID0gbmV3IEV2ZW50UmVnaXN0cnkoKTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtNYXAsTGlzdH0gZnJvbSBcImNvcmV1dGlsXCI7XG5pbXBvcnQge0RvbVRyZWUsWG1sRWxlbWVudH0gZnJvbSBcInhtbHBhcnNlclwiO1xuaW1wb3J0IHtFbGVtZW50TWFwcGVyfSBmcm9tIFwiLi4vZWxlbWVudC9lbGVtZW50TWFwcGVyXCI7XG5pbXBvcnQge3RlbXBsYXRlc30gZnJvbSBcIi4uL3RlbXBsYXRlL3RlbXBsYXRlTWFuYWdlclwiO1xuaW1wb3J0IHtldmVudFJlZ2lzdHJ5fSBmcm9tIFwiLi4vZXZlbnQvZXZlbnRSZWdpc3RyeVwiO1xuaW1wb3J0IHtCYXNlRWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9iYXNlRWxlbWVudFwiO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHRlbXBsYXRlTmFtZSkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBudWxsO1xuICAgICAgICBpZih0eXBlb2YgdGVtcGxhdGVOYW1lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGVzLmdldCh0ZW1wbGF0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hcHBlck1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5faWRTdWZmaXggPSBjb21wb25lbnRDb3VudGVyKys7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgbmV3IERvbVRyZWUodGVtcGxhdGUuZ2V0VGVtcGxhdGVTb3VyY2UoKSx0aGlzKS5sb2FkKCk7XG4gICAgfVxuXG4gICAgZ2V0Um9vdEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb290RWxlbWVudDtcbiAgICB9XG5cbiAgICBnZXRJZFN1ZmZpeCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5faWRTdWZmaXg7XG4gICAgfVxuXG4gICAgaWRBdHRyaWJ1dGVXaXRoU3VmZml4IChpZCkge1xuICAgICAgICBpZih0aGlzLl9pZFN1ZmZpeCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGlkICsgXCItXCIgKyB0aGlzLl9pZFN1ZmZpeDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgZWxlbWVudENyZWF0ZWQgKHhtbEVsZW1lbnQsIHBhcmVudFdyYXBwZXIpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBFbGVtZW50TWFwcGVyLm1hcCh4bWxFbGVtZW50LCBwYXJlbnRXcmFwcGVyKTtcblxuICAgICAgICB0aGlzLmFkZFRvRWxlbWVudElkTWFwKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudEV2ZW50cyhlbGVtZW50KTtcblxuICAgICAgICBpZih0aGlzLl9yb290RWxlbWVudCA9PT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290RWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICByZWdpc3RlckVsZW1lbnRFdmVudHMoZWxlbWVudCl7XG4gICAgICAgIGlmKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8ICEoZWxlbWVudCBpbnN0YW5jZW9mIEJhc2VFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZUtleSxhdHRyaWJ1dGUscGFyZW50KXtcbiAgICAgICAgICAgIGlmKGF0dHJpYnV0ZSAhPT0gbnVsbCAmJiBhdHRyaWJ1dGUgIT09IHVuZGVmaW5lZCAmJiBhdHRyaWJ1dGUuZ2V0VmFsdWUoKS5zdGFydHNXaXRoKFwiLy9ldmVudDpcIikpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0cmlidXRlLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50VHlwZSA9IGF0dHJpYnV0ZS5nZXROYW1lKCk7XG4gICAgICAgICAgICAgICAgdmFyIHN1ZmZpeGVkRXZlbnROYW1lID0gZXZlbnROYW1lICsgXCJfXCIgKyBwYXJlbnQuX2lkU3VmZml4O1xuICAgICAgICAgICAgICAgIGV2ZW50UmVnaXN0cnkuYXR0YWNoKGVsZW1lbnQsZXZlbnRUeXBlLGV2ZW50TmFtZSxzdWZmaXhlZEV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICAgICBcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICBhZGRUb0VsZW1lbnRJZE1hcChlbGVtZW50KSB7XG4gICAgICAgIGlmKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8ICEoZWxlbWVudCBpbnN0YW5jZW9mIEJhc2VFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZCA9IG51bGw7XG4gICAgICAgIGlmKGVsZW1lbnQuY29udGFpbnNBdHRyaWJ1dGUoXCJpZFwiKSkge1xuICAgICAgICAgICAgaWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZVZhbHVlKFwiaWRcIik7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZVZhbHVlKFwiaWRcIix0aGlzLmlkQXR0cmlidXRlV2l0aFN1ZmZpeChpZCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoaWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcHBlck1hcC5zZXQoaWQsZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpO1xuICAgIH1cblxuICAgIHNldCAoaWQsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpLnNldCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgY2xlYXJDaGlsZHJlbihpZCl7XG4gICAgICAgIHRoaXMuX21hcHBlck1hcC5nZXQoaWQpLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGQgKGlkLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9tYXBwZXJNYXAuZ2V0KGlkKS5zZXRDaGlsZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGQgKGlkLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9tYXBwZXJNYXAuZ2V0KGlkKS5hZGRDaGlsZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJlcGVuZENoaWxkIChpZCwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbWFwcGVyTWFwLmdldChpZCkucHJlcGVuZENoaWxkKHZhbHVlKTtcbiAgICB9XG5cbn1cblxudmFyIGNvbXBvbmVudENvdW50ZXIgPSAwO1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge1htbEVsZW1lbnR9IGZyb20gXCJ4bWxwYXJzZXJcIjtcbmltcG9ydCB7RWxlbWVudE1hcHBlcn0gZnJvbSBcIi4uL2VsZW1lbnQvZWxlbWVudE1hcHBlclwiO1xuXG5leHBvcnQgY2xhc3MgSFRNTHtcblxuICAgIHN0YXRpYyBjdXN0b20oZWxlbWVudE5hbWUpe1xuICAgICAgICB2YXIgeG1sRWxlbWVudCA9IG5ldyBYbWxFbGVtZW50KGVsZW1lbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIEVsZW1lbnRNYXBwZXIubWFwKHhtbEVsZW1lbnQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhcHBseVN0eWxlcyhlbGVtZW50LGNsYXNzVmFsdWUsc3R5bGVWYWx1ZSl7XG4gICAgICAgIGlmKGNsYXNzVmFsdWUgIT09IG51bGwpe1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVWYWx1ZShcImNsYXNzXCIsY2xhc3NWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3R5bGVWYWx1ZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZVZhbHVlKFwic3R5bGVcIixzdHlsZVZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhKG5hbWUsaHJlZixjbGFzc1ZhbHVlLHN0eWxlVmFsdWUpe1xuICAgICAgICB2YXIgZWxlbWVudCA9IEhUTUwuY3VzdG9tKFwiYVwiKTtcbiAgICAgICAgZWxlbWVudC5hZGRDaGlsZChuYW1lKTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVWYWx1ZShcImhyZWZcIixocmVmKTtcbiAgICAgICAgSFRNTC5hcHBseVN0eWxlcyhlbGVtZW50LGNsYXNzVmFsdWUsc3R5bGVWYWx1ZSk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtQcm9wZXJ0eUFjY2Vzc29yLExpc3R9IGZyb20gXCJjb3JldXRpbFwiO1xuaW1wb3J0IHtBYnN0cmFjdElucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9hYnN0cmFjdElucHV0RWxlbWVudFwiO1xuaW1wb3J0IHtSYWRpb0lucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9yYWRpb0lucHV0RWxlbWVudFwiO1xuaW1wb3J0IHtDaGVja2JveElucHV0RWxlbWVudH0gZnJvbSBcIi4uL2Jyb3dzZXIvZWxlbWVudC9jaGVja2JveElucHV0RWxlbWVudFwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRNYXBwaW5ne1xuXG4gICAgY29uc3RydWN0b3IobW9kZWwsdmFsaWRhdG9yKSB7XG4gICAgICAgIHRoaXMuX21vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRvciA9IHZhbGlkYXRvcjtcbiAgICAgICAgdGhpcy5fcHVsbGVycyA9IG5ldyBMaXN0KCk7XG4gICAgICAgIHRoaXMuX3B1c2hlcnMgPSBuZXcgTGlzdCgpO1xuICAgIH1cblxuICAgIGFuZChmaWVsZCl7XG4gICAgICAgIHJldHVybiB0aGlzLnRvKGZpZWxkKTtcbiAgICB9XG5cbiAgICB0byhmaWVsZCkge1xuICAgICAgICB2YXIgZmllbGREZXN0aW5hdGlvbiA9IHRoaXMuX21vZGVsO1xuICAgICAgICB2YXIgdmFsaWRhdG9yID0gdGhpcy5fdmFsaWRhdG9yO1xuXG4gICAgICAgIHZhciBwdWxsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgQWJzdHJhY3RJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRWYWx1ZSA9IGZpZWxkLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgUmFkaW9JbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZmllbGQuaXNDaGVja2VkKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHlBY2Nlc3Nvci5zZXRWYWx1ZShmaWVsZERlc3RpbmF0aW9uLGZpZWxkLmdldE5hbWUoKSxmaWVsZC5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQgaW5zdGFuY2VvZiBDaGVja2JveElucHV0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZihmaWVsZC5pc0NoZWNrZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHlBY2Nlc3Nvci5zZXRWYWx1ZShmaWVsZERlc3RpbmF0aW9uLGZpZWxkLmdldE5hbWUoKSxmaWVsZC5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5QWNjZXNzb3Iuc2V0VmFsdWUoZmllbGREZXN0aW5hdGlvbixmaWVsZC5nZXROYW1lKCksbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eUFjY2Vzc29yLnNldFZhbHVlKGZpZWxkRGVzdGluYXRpb24sZmllbGQuZ2V0TmFtZSgpLGZpZWxkLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHZhbGlkYXRvciAhPT0gdW5kZWZpbmVkICAmJiB2YWxpZGF0b3IgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvci52YWxpZGF0ZShmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZpZWxkLmF0dGFjaEV2ZW50KFwib25jaGFuZ2VcIixwdWxsZXIpO1xuICAgICAgICBmaWVsZC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIixwdWxsZXIpO1xuICAgICAgICBwdWxsZXIuY2FsbCgpO1xuXG4gICAgICAgIHZhciBwdXNoZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IFByb3BlcnR5QWNjZXNzb3IuZ2V0VmFsdWUoZmllbGREZXN0aW5hdGlvbixmaWVsZC5nZXROYW1lKCkpO1xuICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgQWJzdHJhY3RJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBSYWRpb0lucHV0RWxlbWVudCB8fCBmaWVsZCBpbnN0YW5jZW9mIENoZWNrYm94SW5wdXRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnNldENoZWNrZWQodmFsdWUgPT0gZmllbGQuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3B1bGxlcnMuYWRkKHB1bGxlcik7XG4gICAgICAgIHRoaXMuX3B1c2hlcnMuYWRkKHB1c2hlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVsbCgpe1xuICAgICAgICB0aGlzLl9wdWxsZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KSB7XG4gICAgICAgICAgICB2YWx1ZS5jYWxsKHBhcmVudCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICBwdXNoKCl7XG4gICAgICAgIHRoaXMuX3B1c2hlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhbHVlLmNhbGwocGFyZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuaW1wb3J0IHtMaXN0fSBmcm9tIFwiY29yZXV0aWxcIjtcbmltcG9ydCB7SW5wdXRNYXBwaW5nfSBmcm9tIFwiLi9pbnB1dE1hcHBpbmdcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0TWFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9pbnB1dE1hcHBpbmdMaXN0ID0gbmV3IExpc3QoKTtcbiAgICB9XG5cbiAgICBsaW5rKG1vZGVsLHNjaGVtYSl7XG4gICAgICAgIHZhciBpbnB1dE1hcHBpbmcgPSBuZXcgSW5wdXRNYXBwaW5nKG1vZGVsLHNjaGVtYSk7XG4gICAgICAgIHRoaXMuX2lucHV0TWFwcGluZ0xpc3QuYWRkKGlucHV0TWFwcGluZyk7XG4gICAgICAgIHJldHVybiBpbnB1dE1hcHBpbmc7XG4gICAgfVxuXG4gICAgcHVsbEFsbCgpe1xuICAgICAgICB0aGlzLl9pbnB1dE1hcHBpbmdMaXN0LmZvckVhY2goZnVuY3Rpb24obWFwcGluZyxwYXJlbnQpIHtcbiAgICAgICAgICAgIG1hcHBpbmcucHVsbCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgcHVzaEFsbCgpe1xuICAgICAgICB0aGlzLl9pbnB1dE1hcHBpbmdMaXN0LmZvckVhY2goZnVuY3Rpb24obWFwcGluZyxwYXJlbnQpIHtcbiAgICAgICAgICAgIG1hcHBpbmcucHVzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgfVxufVxuXG5leHBvcnQgdmFyIGlucHV0cyA9IG5ldyBJbnB1dE1hcHBlcigpO1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQge0xpc3QsTWFwfSBmcm9tIFwiY29yZXV0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFVSTHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fcHJvdG9jb2wgPSBudWxsO1xuICAgICAgICB0aGlzLl9ob3N0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcG9ydCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3BhdGhMaXN0ID0gbmV3IExpc3QoKTtcbiAgICAgICAgdGhpcy5fcGFyYW1ldGVyTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBpZih2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHRoaXMuZGV0ZXJtaW5lUHJvdG9jb2wodmFsdWUpO1xuICAgICAgICBpZihyZW1haW5pbmcgPT09IG51bGwpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3Byb3RvY29sICE9PSBudWxsKXtcbiAgICAgICAgICAgIHJlbWFpbmluZyA9IHRoaXMuZGV0ZXJtaW5lSG9zdChyZW1haW5pbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHJlbWFpbmluZyA9PT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5faG9zdCAhPT0gbnVsbCl7XG4gICAgICAgICAgICByZW1haW5pbmcgPSB0aGlzLmRldGVybWluZVBvcnQocmVtYWluaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZihyZW1haW5pbmcgPT09IG51bGwpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlbWFpbmluZyA9IHRoaXMuZGV0ZXJtaW5lUGF0aChyZW1haW5pbmcpO1xuICAgICAgICBpZihyZW1haW5pbmcgPT09IG51bGwpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGV0ZXJtaW5lUGFyYW1ldGVycyhyZW1haW5pbmcpO1xuICAgIH1cblxuICAgIGdldFByb3RvY29sKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm90b2NvbDtcbiAgICB9XG5cbiAgICBnZXRIb3N0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9ob3N0O1xuICAgIH1cblxuICAgIGdldFBvcnQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvcnQ7XG4gICAgfVxuXG4gICAgZ2V0UGF0aExpc3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGhMaXN0O1xuICAgIH1cblxuICAgIGdldFBhcmFtZXRlcihrZXkpe1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1ldGVyTWFwLmdldChrZXkpO1xuICAgIH1cblxuICAgIHNldFBhcmFtZXRlcihrZXksdmFsdWUpe1xuICAgICAgICB0aGlzLl9wYXJhbWV0ZXJNYXAuc2V0KGtleSx2YWx1ZSk7XG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lUHJvdG9jb2wodmFsdWUpe1xuICAgICAgICBpZighdmFsdWUuaW5jbHVkZXMoXCIvL1wiKSl7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcnRzID0gdmFsdWUuc3BsaXQoXCIvL1wiKTtcbiAgICAgICAgaWYocGFydHNbMF0uaW5jbHVkZXMoXCIvXCIpKXtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcm90b2NvbCA9IHBhcnRzWzBdO1xuICAgICAgICBpZihwYXJ0cy5sZW5ndGg9PTEpe1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UocGFydHNbMF0gKyBcIi8vXCIsXCJcIik7XG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lSG9zdCh2YWx1ZSl7XG4gICAgICAgIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgdmFyIGhvc3RQYXJ0ID0gcGFydHNbMF07XG4gICAgICAgIGlmKGhvc3RQYXJ0LmluY2x1ZGVzKFwiOlwiKSl7XG4gICAgICAgICAgICBob3N0UGFydCA9IGhvc3RQYXJ0LnNwbGl0KFwiOlwiKVswXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ob3N0ID0gaG9zdFBhcnQ7XG4gICAgICAgIGlmKHBhcnRzLmxlbmd0aCA+IDEpe1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoaG9zdFBhcnQsXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lUG9ydCh2YWx1ZSl7XG4gICAgICAgIGlmKCF2YWx1ZS5zdGFydHNXaXRoKFwiOlwiKSl7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBvcnRQYXJ0ID0gdmFsdWUuc3BsaXQoXCIvXCIpWzBdLnN1YnN0cmluZygxKTtcbiAgICAgICAgdGhpcy5fcG9ydCA9IHBvcnRQYXJ0O1xuICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZShcIjpcIiArIHBvcnRQYXJ0LFwiXCIpO1xuICAgIH1cblxuICAgIGRldGVybWluZVBhdGgodmFsdWUpe1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gbnVsbDtcbiAgICAgICAgaWYodmFsdWUuaW5jbHVkZXMoXCI/XCIpKXtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiP1wiKTtcbiAgICAgICAgICAgIGlmKHBhcnRzLmxlbmd0aCA+IDEpe1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZyA9IHZhbHVlLnJlcGxhY2UocGFydHNbMF0gKyBcIj9cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gcGFydHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhdGhQYXJ0cyA9IG5ldyBMaXN0KHZhbHVlLnNwbGl0KFwiL1wiKSk7XG4gICAgICAgIHBhdGhQYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLHBhcmVudCl7XG4gICAgICAgICAgICBpZihwYXJlbnQuX3BhdGhMaXN0ID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuX3BhdGhMaXN0ID0gbmV3IExpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5fcGF0aExpc3QuYWRkKGRlY29kZVVSSSh2YWx1ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sdGhpcyk7XG4gICAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lUGFyYW1ldGVycyh2YWx1ZSl7XG4gICAgICAgIHZhciBwYXJ0TGlzdCA9IG5ldyBMaXN0KHZhbHVlLnNwbGl0KFwiJlwiKSk7XG4gICAgICAgIHZhciBwYXJhbWV0ZXJNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHBhcnRMaXN0LmZvckVhY2goZnVuY3Rpb24odmFsdWUscGFyZW50KXtcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IHZhbHVlLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgIGlmKGtleVZhbHVlLmxlbmd0aCA+PSAyKXtcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXAuc2V0KGRlY29kZVVSSShrZXlWYWx1ZVswXSksZGVjb2RlVVJJKGtleVZhbHVlWzFdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgdGhpcy5fcGFyYW1ldGVyTWFwID0gcGFyYW1ldGVyTWFwO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHZhciB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIGlmKHRoaXMuX3Byb3RvY29sICE9PSBudWxsKXtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyB0aGlzLl9wcm90b2NvbCArIFwiLy9cIjtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLl9ob3N0ICE9PSBudWxsKXtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyB0aGlzLl9ob3N0O1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3BvcnQgIT09IG51bGwpe1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSArIFwiOlwiICsgdGhpcy5fcG9ydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaXJzdFBhdGhQYXJ0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcGF0aExpc3QuZm9yRWFjaChmdW5jdGlvbihwYXRoUGFydCxwYXJlbnQpe1xuICAgICAgICAgICAgaWYoIWZpcnN0UGF0aFBhcnQpe1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBcIi9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpcnN0UGF0aFBhcnQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBwYXRoUGFydDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LHRoaXMpO1xuXG4gICAgICAgIHZhciBmaXJzdFBhcmFtZXRlciA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BhcmFtZXRlck1hcC5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtZXRlcktleSxwYXJhbWV0ZXJWYWx1ZSxwYXJlbnQpe1xuICAgICAgICAgICAgaWYoZmlyc3RQYXJhbWV0ZXIpe1xuICAgICAgICAgICAgICAgIGZpcnN0UGFyYW1ldGVyPWZhbHNlO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBcIj9cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBcIiZcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBlbmNvZGVVUkkocGFyYW1ldGVyS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJKHBhcmFtZXRlclZhbHVlKTtcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxufVxuIl0sIm5hbWVzIjpbIkF0dHJpYnV0ZSIsImF0dHJpYnV0ZSIsIl9hdHRyaWJ1dGUiLCJ2YWx1ZSIsIm5hbWUiLCJCYXNlRWxlbWVudCIsInBhcmVudCIsIl9lbGVtZW50IiwiX2F0dHJpYnV0ZU1hcCIsIlhtbEVsZW1lbnQiLCJjcmVhdGVGcm9tWG1sRWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkhUTUxFbGVtZW50IiwiY29uc29sZSIsImVycm9yIiwiYXR0cmlidXRlcyIsInVuZGVmaW5lZCIsIk1hcCIsImkiLCJsZW5ndGgiLCJzZXQiLCJ4bWxFbGVtZW50IiwicGFyZW50RWxlbWVudCIsImVsZW1lbnQiLCJnZXROYW1lc3BhY2UiLCJjcmVhdGVFbGVtZW50TlMiLCJnZXROYW1lc3BhY2VVcmkiLCJnZXRGdWxsTmFtZSIsImdldE5hbWUiLCJnZXRNYXBwZWRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJnZXRBdHRyaWJ1dGVzIiwiZm9yRWFjaCIsImtleSIsInNldEF0dHJpYnV0ZSIsImdldFZhbHVlIiwiZXZlbnRUeXBlIiwiZnVuY3Rpb25QYXJhbSIsInRhZ05hbWUiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImxvYWRBdHRyaWJ1dGVzIiwiZ2V0QXR0cmlidXRlIiwiaGFzQXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwic3R5bGUiLCJpbnB1dCIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJnZXRSb290RWxlbWVudCIsImNyZWF0ZVRleHROb2RlIiwiVGV4dCIsIkVsZW1lbnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJjbGVhciIsImFkZENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwiQWJzdHJhY3RJbnB1dEVsZW1lbnQiLCJDaGVja2JveElucHV0RWxlbWVudCIsImNoZWNrZWQiLCJQYXNzd29yZElucHV0RWxlbWVudCIsIlJhZGlvSW5wdXRFbGVtZW50IiwiU2ltcGxlRWxlbWVudCIsImlubmVySFRNTCIsIlRleHRhcmVhSW5wdXRFbGVtZW50Iiwic2V0VmFsdWUiLCJnZXRJbm5lckhUTUwiLCJUZXh0SW5wdXRFbGVtZW50IiwiVGV4dG5vZGVFbGVtZW50IiwiWG1sQ2RhdGEiLCJjcmVhdGVGcm9tWG1sQ2RhdGEiLCJjZGF0YUVsZW1lbnQiLCJfdGV4dG5vZGUiLCJFbGVtZW50TWFwcGVyIiwibWFwc1RvUmFkaW8iLCJtYXBzVG9DaGVja2JveCIsIm1hcHNUb1Bhc3N3b3JkIiwibWFwc1RvU3VibWl0IiwibWFwc1RvVGV4dGFyZWEiLCJtYXBzVG9UZXh0IiwibWFwc1RvVGV4dG5vZGUiLCJtYXBzVG9TaW1wbGUiLCJsb2ciLCJIVE1MSW5wdXRFbGVtZW50IiwidHlwZSIsIk5vZGUiLCJub2RlVHlwZSIsIkhUTUxUZXh0QXJlYUVsZW1lbnQiLCJFdmVudCIsImV2ZW50IiwiX2V2ZW50IiwidG9Mb3dlckNhc2UiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwicHJldmVudERlZmF1bHQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsImNsaWVudFgiLCJjbGllbnRZIiwibWFwIiwidGFyZ2V0IiwiVGVtcGxhdGUiLCJ0ZW1wbGF0ZVNvdXJjZSIsIl90ZW1wbGF0ZVNvdXJjZSIsIlRlbXBsYXRlTWFuYWdlciIsIl90ZW1wbGF0ZU1hcCIsIl90ZW1wbGF0ZVF1ZXVlU2l6ZSIsIl9jYWxsYmFjayIsInRlbXBsYXRlIiwiZ2V0IiwiY29udGFpbnMiLCJjYWxsYmFjayIsImRvQ2FsbGJhY2siLCJ0bW8iLCJzaXplIiwidGVtcENhbGxiYWNrIiwiY2FsbCIsInVybCIsIm9iaiIsInF3ZXN0IiwidGhlbiIsInhociIsInJlc3BvbnNlIiwic2V0VGltZW91dCIsInRlbXBsYXRlcyIsIkV2ZW50UmVnaXN0cnkiLCJfbGlzdGVuZXJzIiwiX2JlZm9yZUxpc3RlbmVycyIsIl9hZnRlckxpc3RlbmVycyIsImV2ZW50TmFtZSIsInN1ZmZpeGVkRXZlbnROYW1lIiwiYXR0YWNoRXZlbnQiLCJldmVudFJlZ2lzdHJ5IiwidHJpZ2dlciIsImhhbmRsZXJPYmplY3QiLCJoYW5kbGVyRnVuY3Rpb24iLCJyZXNvbHZlSWRTdWZmaXgiLCJleGlzdHMiLCJMaXN0Iiwib2JqZWN0RnVuY3Rpb24iLCJPYmplY3RGdW5jdGlvbiIsImFkZCIsImdldElkU3VmZml4IiwiZ2V0Q29tcG9uZW50IiwiTG9nZ2VyIiwiaGFuZGxlQmVmb3JlIiwiY3VycmVudExpc3RlbmVycyIsImhhbmRsZUFmdGVyIiwiaGFuZGxlR2xvYmFsIiwibGlzdGVuZXJzIiwiQ29tcG9uZW50IiwidGVtcGxhdGVOYW1lIiwiX21hcHBlck1hcCIsIl9pZFN1ZmZpeCIsImNvbXBvbmVudENvdW50ZXIiLCJfcm9vdEVsZW1lbnQiLCJEb21UcmVlIiwiZ2V0VGVtcGxhdGVTb3VyY2UiLCJsb2FkIiwiaWQiLCJwYXJlbnRXcmFwcGVyIiwiYWRkVG9FbGVtZW50SWRNYXAiLCJyZWdpc3RlckVsZW1lbnRFdmVudHMiLCJhdHRyaWJ1dGVLZXkiLCJzdGFydHNXaXRoIiwiYXR0YWNoIiwiY29udGFpbnNBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGVWYWx1ZSIsInNldEF0dHJpYnV0ZVZhbHVlIiwiaWRBdHRyaWJ1dGVXaXRoU3VmZml4Iiwic2V0Q2hpbGQiLCJwcmVwZW5kQ2hpbGQiLCJIVE1MIiwiZWxlbWVudE5hbWUiLCJjbGFzc1ZhbHVlIiwic3R5bGVWYWx1ZSIsImhyZWYiLCJjdXN0b20iLCJhcHBseVN0eWxlcyIsIklucHV0TWFwcGluZyIsIm1vZGVsIiwidmFsaWRhdG9yIiwiX21vZGVsIiwiX3ZhbGlkYXRvciIsIl9wdWxsZXJzIiwiX3B1c2hlcnMiLCJmaWVsZCIsInRvIiwiZmllbGREZXN0aW5hdGlvbiIsInB1bGxlciIsImZpZWxkVmFsdWUiLCJpc0NoZWNrZWQiLCJQcm9wZXJ0eUFjY2Vzc29yIiwidmFsaWRhdGUiLCJwdXNoZXIiLCJzZXRDaGVja2VkIiwiSW5wdXRNYXBwZXIiLCJfaW5wdXRNYXBwaW5nTGlzdCIsInNjaGVtYSIsImlucHV0TWFwcGluZyIsIm1hcHBpbmciLCJwdWxsIiwicHVzaCIsImlucHV0cyIsIlVSTCIsIl9wcm90b2NvbCIsIl9ob3N0IiwiX3BvcnQiLCJfcGF0aExpc3QiLCJfcGFyYW1ldGVyTWFwIiwicmVtYWluaW5nIiwiZGV0ZXJtaW5lUHJvdG9jb2wiLCJkZXRlcm1pbmVIb3N0IiwiZGV0ZXJtaW5lUG9ydCIsImRldGVybWluZVBhdGgiLCJkZXRlcm1pbmVQYXJhbWV0ZXJzIiwiaW5jbHVkZXMiLCJwYXJ0cyIsInNwbGl0IiwicmVwbGFjZSIsImhvc3RQYXJ0IiwicG9ydFBhcnQiLCJzdWJzdHJpbmciLCJwYXRoUGFydHMiLCJkZWNvZGVVUkkiLCJwYXJ0TGlzdCIsInBhcmFtZXRlck1hcCIsImtleVZhbHVlIiwiZmlyc3RQYXRoUGFydCIsInBhdGhQYXJ0IiwiZmlyc3RQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJLZXkiLCJwYXJhbWV0ZXJWYWx1ZSIsImVuY29kZVVSSSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFhQSxTQUFiO0VBRUksdUJBQVlDLFNBQVosRUFBdUI7RUFB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
