class GlobalEvent extends justright.Component{
	
	constructor(owner){
		super(justright.templates.get("GlobalEvent"));
		if(owner === undefined){
			for(var i=0;i<10;i++) {
				this.addChild("boxes",new GlobalEvent(this));
			}
		}
		justright.events.listen("selectClicked",this,this.selectBox);
		justright.events.listen("enableClicked",this,this.selectBox);
		justright.events.listenBefore("selectClicked",this,this.unselectBox);
	}
	
	selectBox(){
		this.get("box").getStyleAttribute().set("background-color","red");
	}
	
	unselectBox(){
		this.get("box").getStyleAttribute().set("background-color","white");
	}
	
}
justright.templates.load("GlobalEvent","./demo-components/globalEvent/globalEvent.html");