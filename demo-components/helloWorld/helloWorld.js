class HelloWorld extends justright.Component{
	
	constructor(){
		super(justright.templates.get("HelloWorld"));
		this.set("message","Hello world!");
	}
	
}
justright.templates.load("HelloWorld","./demo-components/helloWorld/helloWorld.html");