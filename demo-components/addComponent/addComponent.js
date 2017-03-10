class AddComponent{
	
	constructor(){
		this._component = new justright.Component(justright.templates.get("AddComponent"));
		console.log(this._component);
		justright.events.listen("helloClicked",this,this.sayHello);
		justright.events.listen("addComponentClicked",this,this.addComponent);
	}
	
	getComponent(){
		return this._component;
	}
	
	sayHello(){
		this._component.addChild("message","Hello world!");
	}
	
	addComponent(){
		var newComponent = new AddComponent();
		this._component.addChild("subComponent",newComponent.getComponent());
	}
	
}
justright.templates.load("AddComponent","./demo-components/addComponent/addComponent.html");