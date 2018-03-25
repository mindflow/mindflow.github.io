class HelloWorld extends justright.Component {
	
	constructor() {
		super(justright.templates.get("HelloWorld"));
		this.setChild("textValue","Hello");
		justright.eventRegistry.listen("myEvent1", this, this.myEvent1);
		justright.eventRegistry.listen("myEvent2", this, this.myEvent2);
	}
	
	myEvent1(event){
		var helloWorld = new HelloWorld("Added by click");
		this.addChild("buttonElement", helloWorld);
		this.addChild("textValue","-");
	}
	
	myEvent2(event){
		alert("Hello!");
	}
	
}

justright.templates.load("HelloWorld","./demo-components/helloWorld-bak/helloWorld.html");