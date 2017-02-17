class DragAndDrop extends justright.Component{
	
	constructor(){
		super(justright.templates.get("DragAndDrop"));
		justright.events.listen("drag",this,this.drag);
		justright.events.listen("mousePos",this,this.mousePos);
		justright.events.listen("dragOver",this,this.dragOver);
		this._mousePosX = 0;
		this._mousePosY = 0;
	}
	
	dragOver(event){
		event.preventDefault();
	}
	
	mousePos(event){
	    this._mousePosX = event.offsetX;
	    this._mousePosY = event.offsetY;
	    return false;
	}
	
	drag(event){
	    var container = this.get("container").getMappedElement();
	    var mappedElement = this.get("message").getMappedElement();
	    var topPos = event.clientY - container.getBoundingClientRect().top - this._mousePosY;
	    var leftPos = event.clientX - container.getBoundingClientRect().left - this._mousePosX;
	    var topMax = container.getBoundingClientRect().height - mappedElement.getBoundingClientRect().height;
	    var leftMax = container.getBoundingClientRect().width - mappedElement.getBoundingClientRect().width;
	    var topMin = 0;
	    var leftMin = 0;
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
	    mappedElement.style.top = topPos;
	    mappedElement.style.left = leftPos;
	}
	   
}
justright.templates.load("DragAndDrop","./demo-components/dragAndDrop/dragAndDrop.html");