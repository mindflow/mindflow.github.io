class HelloWorld {
	
	constructor(){
		this._component = new justright.Component("HelloWorld");
		this._component.set("message","Hello world!");
	}
	
	getComponent(){
		return this._component;
	}
	
}
justright.templates.load("HelloWorld","./demo-components/helloWorld/helloWorld.html");