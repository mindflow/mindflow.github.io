class GlobalEvent extends justright.Component{
	
	constructor(owner){
		super(justright.templates.get("GlobalEvent"));
		if(owner == null){
			this.addChild("otherBox",new GlobalEvent(this));
			this.addChild("otherBox",new GlobalEvent(this));
		}
		justright.events.listen("selectClicked",this,this.selectBox);
		justright.events.listen("enableClicked",this,this.selectBox);
		justright.events.listenBefore("selectClicked",this,this.unselectBox);
	}
	
	selectBox(){
		this.get("box").getAttributes().set("style","background-color:red;display:inline-block;padding:20px;border:1px;border-style:solid;border-color:#888888");
	}
	
	unselectBox(){
		this.get("box").getAttributes().set("style","display:inline-block;padding:20px;border:1px;border-style:solid;border-color:#888888");
	}
	
}
justright.templates.load("GlobalEvent","./demo-components/globalEvent/globalEvent.html");