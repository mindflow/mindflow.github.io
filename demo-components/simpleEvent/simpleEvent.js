class SimpleEvent {
	
	constructor(){
		this._component = new justright.Component("SimpleEvent");
		justright.events.listen("helloClicked",this,this.sayHello);
	}
	
	getComponent(){
		return this._component;
	}
	
	sayHello(){
		this._component.addChild("message","Hello world!");
	}
	
}
justright.templates.load("SimpleEvent","./demo-components/simpleEvent/simpleEvent.html");