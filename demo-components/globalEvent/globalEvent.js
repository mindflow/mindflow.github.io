class GlobalEvent {

	constructor(owner){
		this._component = new justright.Component("GlobalEvent");
		if(owner === undefined){
			for(var i=0;i<10;i++) {
				this._component.addChild("boxes",new GlobalEvent(this).getComponent());
			}
		}
		justright.eventRegistry.listen("//event:selectClicked",this,this.selectBox);
		justright.eventRegistry.listen("//event:enableClicked",this,this.selectBox);
		justright.eventRegistry.listenBefore("//event:selectClicked",this,this.unselectBox);
	}

	getComponent(){
		return this._component;
	}

	selectBox(){
		this._component.get("box").setStyle("background-color","red");
	}

	unselectBox(){
		this._component.get("box").setStyle("background-color","white");
	}

}
justright.templates.load("GlobalEvent","./demo-components/globalEvent/globalEvent.html");
