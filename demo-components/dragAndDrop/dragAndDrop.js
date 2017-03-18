class DragAndDrop {

	constructor(){
		this._component = new justright.Component("DragAndDrop");
		justright.events.listen("select",this,this.select);
		justright.events.listenAfter("globalMouseup",this,this.unselect);
		justright.events.listenAfter("globalMousemove",this,this.move);

		justright.events.listen("move",this,this.move);
		this._selection = null;
	}

	getComponent(){
		return this._component;
	}

	move(event) {
		if(this._selection === null){
			return;
		}
	    var container = this._component.get("container");
	    var box = this._selection.getTarget();
	    var topPos = event.getClientY() - container.getTop() - this._selection.getOffsetY();
	    var leftPos = event.getClientX() - container.getLeft() - this._selection.getOffsetX();
	    var topMax = container.getHeight() - box.getHeight();
	    var leftMax = container.getWidth() - box.getWidth();
	    var topMin = 0;
	    var leftMin = 0;
	    if(event.getClientY() === 0 || event.getClientX() === 0){
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
	    box.setStyle("top",topPos);
	    box.setStyle("left",leftPos);
	}

	unselect(event){
		if(this._selection === null){
			return;
		}
		var box = this._selection.getTarget();
	    box.setStyle("background-color","red");
	    this._selection = null;
	}

	select(event){
	    if(this._selection !== null){
	        return;
	    }
	    var box = event.getTarget();
		box.setStyle("background-color","yellow");
	    this._selection = event;
	}


}
justright.templates.load("DragAndDrop","./demo-components/dragAndDrop/dragAndDrop.html");
