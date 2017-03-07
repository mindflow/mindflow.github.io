class InputModel extends justright.Component{
	
	constructor(){
		super(justright.templates.get("InputModel"));
		justright.events.listen("check",this,this.check);
		justright.events.listen("reverseMap",this,this.reverseMap);
		this._model = new InputModel_Model();
		this._mapper = justright.inputs.new(this._model)
			.map(this.get("input1"))
			.map(this.get("input2"))
			.map(this.get("input3"))
			.map(this.get("input4"))
			.map(this.get("input5"));
	}
	
	reverseMap(){
		this._model._field1 = "Reverse ABC";
		this._model._field2 = "B";
		this._model._field3 = "C";
		this._model._field4 = "!¤#¤&#¤#&%&¤#/&¤#";
		// Outputs model to view
		this._mapper.push();
	}
	
	check(event){
		// Debugs the model with the view data
		this.get("modelDebug").setChild(JSON.stringify(this._model,undefined, 2));
	}
	
}

class InputModel_Model{
	
}

justright.templates.load("InputModel","./demo-components/inputModel/inputModel.html");