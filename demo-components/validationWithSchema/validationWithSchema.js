class ValidationWithSchema {
	
	constructor(){
		this._component = new justright.Component("ValidationWithSchema");
		justright.events.listen("check",this,this.check);
		justright.events.listen("reverseMap",this,this.reverseMap);
		this._model = {};
		this._validator = new ValidationWithSchema_Validator(this._model,this._component);
		this._mapper = justright.inputs.link(this._model, this._validator)
			.to(this._component.get("input1"));
	}
	
	getComponent(){
		return this._component;
	}

}

class ValidationWithSchema_Validator{
	
	constructor(model, component){
		this._model = model;
		this._component = component;
		this._validation = jsen({ 
			type: "object" , properties : {
				_field1 : { type: "string", format: "email" }
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

justright.templates.load("ValidationWithSchema","./demo-components/validationWithSchema/validationWithSchema.html");