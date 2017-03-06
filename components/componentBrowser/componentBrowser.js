class ComponentBrowser extends justright.Component{
	
	constructor(){
		super(justright.templates.get("ComponentBrowser"));
		
		justright.events.listen("test",this,this.test);
		
		justright.events.listen("helloWorld",this,this.helloWorld);
		justright.events.listen("createElement",this,this.createElement);
		justright.events.listen("simpleEvent",this,this.simpleEvent);
		justright.events.listen("addComponent",this,this.addComponent);
		justright.events.listen("globalEvent",this,this.globalEvent);
		justright.events.listen("inputModel",this,this.inputModel);
		justright.events.listen("dragAndDrop",this,this.dragAndDrop);
		
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

	createElement(){
		this.clearChildren("result");
		this.load('CreateElement','CreateElement','./demo-components/createElement/createElement.html','./demo-components/createElement/createElement.js');
	}
	
	simpleEvent(){
		this.clearChildren("result");
		this.load('SimpleEvent','SimpleEvent','./demo-components/simpleEvent/simpleEvent.html','./demo-components/simpleEvent/simpleEvent.js');
	}
	
	addComponent(){
		this.clearChildren("result");
		this.load('AddComponent','AddComponent','./demo-components/addComponent/addComponent.html','./demo-components/addComponent/addComponent.js');
	}
	
	globalEvent(){
		this.clearChildren("result");
		this.load('GlobalEvent','GlobalEvent','./demo-components/globalEvent/globalEvent.html','./demo-components/globalEvent/globalEvent.js');
	}

	inputModel(){
		this.clearChildren("result");
		this.load('InputModel','InputModel','./demo-components/inputModel/inputModel.html','./demo-components/inputModel/inputModel.js');
	}
	
	dragAndDrop(){
		this.clearChildren("result");
		this.load('DragAndDrop','DragAndDrop','./demo-components/dragAndDrop/dragAndDrop.html','./demo-components/dragAndDrop/dragAndDrop.js');
	}
	
	load(className,templateName,designUrl,codeUrl){
		this._className = className;
		this._templateName = templateName;
		this._designUrl = designUrl;
		this._codeUrl = codeUrl;
		this.loadFiles(this._designUrl,this._codeUrl);
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
		qwest.get(designUrl).then(function(xhr,designResult){
		    var code = ace.edit(obj.get("design").getMappedElement());
		    code.setTheme("ace/theme/monokai");
		    code.getSession().setMode("ace/mode/html");
		    code.getSession().getDocument().setValue(designResult);
		    
		    qwest.get(codeUrl).then(function(xhr,codeResult){
			    var design = ace.edit(obj.get("code").getMappedElement());
			    design.setTheme("ace/theme/monokai");
			    design.getSession().setMode("ace/mode/javascript");
			    design.getSession().getDocument().setValue(codeResult);
			});
		});
	}
}

justright.templates.load("ComponentBrowser","./components/componentBrowser/componentBrowser.html");