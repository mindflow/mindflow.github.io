class ComponentBrowser extends justright.Component{
	
	constructor(){
		super(justright.templates.get("ComponentBrowser"));
		
		justright.events.listen("test",this,this.test);
		
		justright.events.listen("helloWorld",this,this.helloWorld);
		justright.events.listen("simpleEvent",this,this.simpleEvent);
		justright.events.listen("addComponent",this,this.addComponent);
		
		this._className = null;
		this._templateName = null;
		this._designUrl = null;
		this._codeUrl = null;
		
	    var code = ace.edit(this.get("design").getMappedElement());
	    code.setTheme("ace/theme/monokai");
	    code.getSession().setMode("ace/mode/html");
		
	    var design = ace.edit(this.get("code").getMappedElement());
	    design.setTheme("ace/theme/monokai");
	    design.getSession().setMode("ace/mode/javascript");
	}
	
	helloWorld(){
		this.clearChildren("result");
		this.load('HelloWorld','HelloWorld','./demo-components/helloWorld/helloWorld.html','./demo-components/helloWorld/helloWorld.js');
	}
	
	simpleEvent(){
		this.clearChildren("result");
		this.load('SimpleEvent','SimpleEvent','./demo-components/simpleEvent/simpleEvent.html','../demo-components/simpleEvent/simpleEvent.js');
	}
	
	addComponent(){
		this.clearChildren("result");
		this.load('AddComponent','AddComponent','../demo-components/addComponent/addComponent.html','./demo-components/addComponent/addComponent.js');
	}
	
	load(className,templateName,designUrl,codeUrl){
		this._className = className;
		this._templateName = templateName;
		this._designUrl = designUrl;
		this._codeUrl = codeUrl;
		this.loadFiles(this._designUrl,this._codeUrl);
		var loaded = false;
		
		var obj = this;	
		$(document).ajaxStop(function() {
			if(!loaded){
				//obj.test();
			}
			loaded = true;
		});
	}
	
	test(){
		var type = this.evalComponent(this._className);
		this.loadComponent(type,this._templateName);
	}

	evalComponent(className) {
		var type;
		eval(ace.edit(this.get("code").getMappedElement()).getSession().getDocument().getValue() + "\ntype = " + className);
		return type;
	}

	loadComponent(type, templateName){
		justright.templates.set(templateName,ace.edit(this.get("design").getMappedElement()).getSession().getDocument().getValue());
		this.setChild("result",(new type()));
	}

	loadFiles(designUrl,codeUrl){
		var obj = this;
		jQuery.get(designUrl, function(designResult) {
		    var code = ace.edit(obj.get("design").getMappedElement());
		    code.setTheme("ace/theme/monokai");
		    code.getSession().setMode("ace/mode/html");
		    code.getSession().getDocument().setValue(designResult);
		    
			jQuery.get( codeUrl, function(codeResult) {
			    var design = ace.edit(obj.get("code").getMappedElement());
			    design.setTheme("ace/theme/monokai");
			    design.getSession().setMode("ace/mode/javascript");
			    design.getSession().getDocument().setValue(codeResult);
			},"text");
		},"text");
	}
}

justright.templates.load("ComponentBrowser","./components/componentBrowser/componentBrowser.html");