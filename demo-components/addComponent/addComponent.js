class AddComponent extends justright.Component{
	
	constructor(){
		super(justright.templates.get("AddComponent"));
		justright.events.listen("helloClicked",this,this.sayHello);
		justright.events.listen("addComponentClicked",this,this.addComponent);
	}
	
	sayHello(){
		this.addChild("message","Hello world!");
	}
	
	addComponent(){
		this.addChild("subComponent",new AddComponent());
	}
	
}
justright.templates.load("AddComponent","./demo-components/addComponent/addComponent.html");