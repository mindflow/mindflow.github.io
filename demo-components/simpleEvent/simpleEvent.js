class SimpleEvent extends justright.Component{
	
	constructor(){
		super(justright.templates.get("SimpleEvent"));
		justright.events.listen("helloClicked",this,this.sayHello);
	}
	
	sayHello(){
		this.addChild("message","Hello world!");
	}
	
}
justright.templates.load("SimpleEvent","./demo-components/simpleEvent/simpleEvent.html");