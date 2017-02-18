class DragAndDrop extends justright.Component{
	
	constructor(){
		super(justright.templates.get("DragAndDrop"));
		justright.events.listen("drag",this,this.drag);
		justright.events.listen("target",this,this.target);
		justright.events.listen("flash",this,this.flash);
		justright.events.listen("dragOver",this,this.dragOver);
		this._target = null;
	}
	
	dragOver(event){
		event.preventDefault();
	}
	
	flash(event){
	    this.get("box").getStyleAttribute().set("background-color","red");
	}
	
	target(event){
	    this._target = event.getTarget();
	    return false;
	}
	
	drag(event){
	    var container = this.get("container");
	    var box = this.get("box");
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
	   
}
justright.templates.load("DragAndDrop","./demo-components/dragAndDrop/dragAndDrop.html");