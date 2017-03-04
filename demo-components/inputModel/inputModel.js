class InputModel extends justright.Component{
	
	constructor(){
		super(justright.templates.get("InputModel"));
		justright.events.listen("check",this,this.check);
		justright.events.listen("reverseMap",this,this.reverseMap);
		this._model = new InputModel_Model();
		justright.inputs.map(this.get("field1"),this._model);
		justright.inputs.map(this.get("field2"),this._model);
		justright.inputs.map(this.get("field3"),this._model);
	}
	
	reverseMap(){
		this._model._field1 = "Reverse ABC";
		this._model._field2 = "Reverse 123";
		this._model._field3 = "Reverse #?_";
		// Outputs model to view
		justright.inputs.push();
	}
	
	check(event){
		// Debugs the model with the view data
		alert("Field1 : " + this._model._field1 + 
				" Field2 : " + this._model._field2 +
				" Field3 : " + this._model._field3);
	}
	
}

class InputModel_Model{
	
	constructor(){
		this._field1 = null;
		this._field2 = null;
		this._field3 = null;
	}
	
}

justright.templates.load("InputModel","./demo-components/inputModel/inputModel.html");