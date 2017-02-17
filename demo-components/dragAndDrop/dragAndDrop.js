class DragAndDrop extends justright.Component{
	
	constructor(){
		super(justright.templates.get("DragAndDrop"));
		justright.events.listen("drag",this,this.drag);
		justright.events.listen("drop",this,this.drop);
		justright.events.listen("mousePos",this,this.mousePos);
		this._clickedX = 0;
		this._clickedY = 0;
	}
	
	mousePos(event){
	    this._mousePosX = event.offsetX;
	    this._mousePosY = event.offsetY;
	}
	
	drop(event){
	    var container = this.get("container").getMappedElement();
	    var mappedElement = this.get("message").getMappedElement();
	    mappedElement.style.top = event.clientY - container.getBoundingClientRect().top - this._mousePosY;
	    mappedElement.style.left = event.clientX - container.getBoundingClientRect().left - this._mousePosX;
	}
	   
}
justright.templates.load("DragAndDrop","./demo-components/dragAndDrop/dragAndDrop.html");