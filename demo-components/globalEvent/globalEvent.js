class GlobalEvent {

	constructor(owner){
		this._component = new justright.Component("GlobalEvent");
		if(owner === undefined){
			for(var i=0;i<10;i++) {
				this._component.addChild("boxes",new GlobalEvent(this).getComponent());
			}
		}
		justright.events.listen("selectClicked",this,this.selectBox);
		justright.events.listen("enableClicked",this,this.selectBox);
		justright.events.listenBefore("selectClicked",this,this.unselectBox);
	}

	getComponent(){
		return this._component;
	}

	selectBox(){
		justright.StyleUtil.set(this._component.get("box"),"background-color","red");
	}

	unselectBox(){
		justright.StyleUtil.set(this._component.get("box"),"background-color","white");
	}

}
justright.templates.load("GlobalEvent","./demo-components/globalEvent/globalEvent.html");
