class InputModel {
	
	constructor(){
		this._component = new justright.Component("InputModel");
		justright.events.listen("check",this,this.check);
		justright.events.listen("reverseMap",this,this.reverseMap);
		this._model = {};
		this._validator = new InputModel_Validator(this._model,this._component);
		this._mapper = justright.inputs.link(this._model, this._validator)
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

class InputModel_Validator{
	
	constructor(model, component){
		this._model = model;
		this._component = component;
		this._validation = jsen({ 
			type: "object" , properties : {
				_field1 : { type: "string", format: "email" },
				_field2 : { type: "string", format: "email" },
				_field3 : { type: "string", format: "email" },
				_field4 : { type: "string", format: "email" },
				_field5 : { type: "string", format: "numeric" }
			}
		},{ greedy: true });
	}
	
	validate(inputField){
		this._validation(this._model);
		inputField.getStyleAttribute().set("background-color","white");
		for(var i = 0; i<this._validation.errors.length; i++){
		    var property = this._validation.errors[i];
		    if(inputField.getAttributes().get("name") === property.path){
		    	inputField.getStyleAttribute().set("background-color","red");
		    }
		}
	}
}

justright.templates.load("InputModel","./demo-components/inputModel/inputModel.html");