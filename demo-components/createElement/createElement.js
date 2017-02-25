class CreateElement extends justright.Component{
	
	constructor(){
		super(justright.templates.get("CreateElement"));
		var url = new justright.URL("http://www.google.com");
		url.getParameterMap().set("q","abc");
		var a = justright.HTML.a("Go to google",url.toString());
		this.set("element",a);
	}
	
}
justright.templates.load("CreateElement","./demo-components/createElement/createElement.html");