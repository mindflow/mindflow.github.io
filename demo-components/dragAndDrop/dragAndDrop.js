class DragAndDrop extends justright.Component{
	
	constructor(){
		super(justright.templates.get("DragAndDrop"));
		justright.events.listen("drag",this,this.drag);
		justright.events.listen("drop",this,this.drop);
	}
	
	drag(event){
	    //console.log(event.offsetX + " " + event.offsetY);
	    //console.log(event);
	}
	
	drop(event){
	    event.preventDefault();
	    var container = this.get("container").getMappedElement();
	    var mappedElement = this.get("message").getMappedElement();
	    console.log(event);
	    //console.log(event.screenY + " " + event.screenX);
	    mappedElement.style.top = event.clientY - container.getBoundingClientRect().top;
	    mappedElement.style.left = event.clientX - container.getBoundingClientRect().left;
	    
	    
	}
	   
}
justright.templates.load("DragAndDrop","./demo-components/dragAndDrop/dragAndDrop.html");