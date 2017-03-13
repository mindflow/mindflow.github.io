class InputModel {

	constructor(){
		this._component = new justright.Component("InputModel");
		justright.events.listen("check",this,this.check);
		justright.events.listen("reverseMap",this,this.reverseMap);
		this._model = {};
		this._mapper = justright.inputs.link(this._model)
			.to(this._component.get("input1"))
			.and(this._component.get("input2"))
			.and(this._component.get("input3"))
			.and(this._component.get("input4"))
			.and(this._component.get("input5"));
	}

	getComponent(){
		return this._component;
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
		this._component.get("modelDebug").setChild(JSON.stringify(this._model,undefined, 2));
	}

}

justright.templates.load("InputModel","./demo-components/inputModel/inputModel.html");
