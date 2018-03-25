class ComponentBrowser {

	constructor(){
		this._component = new justright.Component("ComponentBrowser");
		
		justright.eventRegistry.listen("//event:test",this,this.test);

		justright.eventRegistry.listen("//event:helloWorld",this,this.helloWorld);
		justright.eventRegistry.listen("//event:createElement",this,this.createElement);
		justright.eventRegistry.listen("//event:simpleEvent",this,this.simpleEvent);
		justright.eventRegistry.listen("//event:addComponent",this,this.addComponent);
		justright.eventRegistry.listen("//event:globalEvent",this,this.globalEvent);
		justright.eventRegistry.listen("//event:inputModel",this,this.inputModel);
		justright.eventRegistry.listen("//event:dragAndDrop",this,this.dragAndDrop);
		justright.eventRegistry.listen("//event:validationSimple",this,this.validationSimple);
		justright.eventRegistry.listen("//event:validationWithSchema",this,this.validationWithSchema);

		this._className = null;
		this._templateName = null;
		this._designUrl = null;
		this._codeUrl = null;

	    var code = ace.edit(this._component.get("design").getMappedElement());
        code.$blockScrolling = Infinity;
	    code.setTheme("ace/theme/monokai");
	    code.getSession().setMode("ace/mode/html");

	    var design = ace.edit(this._component.get("code").getMappedElement());
        design.$blockScrolling = Infinity;
	    design.setTheme("ace/theme/monokai");
	    design.getSession().setMode("ace/mode/javascript");
	}

	getComponent(){
		return this._component;
	}

	helloWorld(){
		this._component.clearChildren("result");
		this.load('HelloWorld','HelloWorld','./demo-components/helloWorld/helloWorld.html','./demo-components/helloWorld/helloWorld.js');
	}

	createElement(){
		this._component.clearChildren("result");
		this.load('CreateElement','CreateElement','./demo-components/createElement/createElement.html','./demo-components/createElement/createElement.js');
	}

	simpleEvent(){
		this._component.clearChildren("result");
		this.load('SimpleEvent','SimpleEvent','./demo-components/simpleEvent/simpleEvent.html','./demo-components/simpleEvent/simpleEvent.js');
	}

	addComponent(){
		this._component.clearChildren("result");
		this.load('AddComponent','AddComponent','./demo-components/addComponent/addComponent.html','./demo-components/addComponent/addComponent.js');
	}

	globalEvent(){
		this._component.clearChildren("result");
		this.load('GlobalEvent','GlobalEvent','./demo-components/globalEvent/globalEvent.html','./demo-components/globalEvent/globalEvent.js');
	}

	inputModel(){
		this._component.clearChildren("result");
		this.load('InputModel','InputModel','./demo-components/inputModel/inputModel.html','./demo-components/inputModel/inputModel.js');
	}

	validationSimple(){
		this._component.clearChildren("result");
		this.load('ValidationSimple','ValidationSimple','./demo-components/validationSimple/validationSimple.html','./demo-components/validationSimple/validationSimple.js');
	}

	validationWithSchema(){
		this._component.clearChildren("result");
		this.load('ValidationWithSchema','ValidationWithSchema','./demo-components/validationWithSchema/validationWithSchema.html','./demo-components/validationWithSchema/validationWithSchema.js');
	}

	dragAndDrop(){
		this._component.clearChildren("result");
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
		eval(ace.edit(this._component.get("code").getMappedElement()).getSession().getDocument().getValue() + "\ntype = " + className);
		return type;
	}

	loadComponent(type, templateName){
		var templateValue = ace.edit(this._component.get("design").getMappedElement()).getSession().getDocument().getValue();
		justright.templates.set(templateName,new justright.Template(templateValue));
		var obj = new type();
		if(obj instanceof justright.Component){
			this._component.setChild("result",(obj));
			return;
		}
		if(obj.getComponent != undefined){
			this._component.setChild("result",(obj.getComponent()));
			return;
		}
		console.error("Could not find component for " + type);
	}

	loadFiles(designUrl,codeUrl){
		var obj = this;

		var code = ace.edit(obj.getComponent().get("design").getMappedElement());
	    code.setTheme("ace/theme/monokai");
	    code.getSession().setMode("ace/mode/html");
		code.getSession().getDocument().setValue("");


	    var design = ace.edit(obj.getComponent().get("code").getMappedElement());
	    design.setTheme("ace/theme/monokai");
	    design.getSession().setMode("ace/mode/javascript");
	    design.getSession().getDocument().setValue("");

		qwest.get(designUrl).then(function(xhr,designResult){
		    code.getSession().getDocument().setValue(designResult);
		});
	    qwest.get(codeUrl).then(function(xhr,codeResult){
		    design.getSession().getDocument().setValue(codeResult);
		});
	}
}

justright.templates.load("ComponentBrowser","./components/componentBrowser/componentBrowser.html");
