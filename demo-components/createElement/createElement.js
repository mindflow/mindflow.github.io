class CreateElement{
	
	constructor(){
		this._component = new justright.Component("CreateElement");
		var url = new justright.URL("http://www.google.com");
		url.getParameterMap().set("q","abc");
		var a = justright.HTML.a("Go to google",url.toString());
		this._component.set("element",a);
	}
	
	getComponent(){
		return this._component;
	}
	
}
justright.templates.load("CreateElement","./demo-components/createElement/createElement.html");