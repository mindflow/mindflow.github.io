class DragAndDrop extends justright.Component{
	
	constructor(){
		super(justright.templates.get("DragAndDrop"));
		justright.events.listen("select",this,this.select);
		justright.events.listenAfter("globalMouseup",this,this.unselect);
		justright.events.listenAfter("globalMousemove",this,this.move);
		
		justright.events.listen("move",this,this.move);
		this._target = null;
	}
	
	move(event){
		if(this._target === null){
			return;
		}
	    var container = this.get("container");
	    var box = this._target.getElement();
	    var topPos = event.getY() - container.getTop() - this._target.getY();
	    var leftPos = event.getX() - container.getLeft() - this._target.getX();
	    var topMax = container.getHeight() - box.getHeight();
	    var leftMax = container.getWidth() - box.getWidth();
	    var topMin = 0;
	    var leftMin = 0;
	    if(event.getY() === 0 || event.getX() === 0){
	        return;
	    }
	    if(topPos < topMin){
	    	topPos = topMin;
	    }
	    if(leftPos < leftMin){
	    	leftPos = leftMin;
	    }
	    if(topPos > topMax){
	    	topPos = topMax;
	    }
	    if(leftPos > leftMax){
	    	leftPos = leftMax;
	    }
	    box.getStyleAttribute().set("top",topPos);
	    box.getStyleAttribute().set("left",leftPos);
	}
	
	unselect(event){
		if(this._target === null){
			return;
		}
		var box = this._target.getElement();
	    box.getStyleAttribute().set("background-color","red");
	    this._target = null;
	}
	
	select(event){
	    if(this._target !== null){
	        return;
	    }
	    var box = event.getTarget().getElement();
		box.getStyleAttribute().set("background-color","yellow");
	    this._target = event.getTarget();
	}
	
	   
}
justright.templates.load("DragAndDrop","./demo-components/dragAndDrop/dragAndDrop.html");