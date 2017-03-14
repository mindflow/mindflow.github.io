class ValidationSimple {

	constructor(){
		this._component = new justright.Component("ValidationSimple");
		this._model = {};
		this._validator = new ValidationSimple_Validator(this._model,this._component);
		this._mapper = justright.inputs.link(this._model, this._validator)
			.to(this._component.get("input1"));
	}

	getComponent(){
		return this._component;
	}

}

class ValidationSimple_Validator{

	constructor(model, component){
		this._model = model;
		this._component = component;
	}

	validate(inputField){
		justright.StyleUtil.set(inputField,"background-color","white");
		if(inputField.getValue() === ""){
	    	justright.StyleUtil.set(inputField,"background-color","red");
		}
	}
}

justright.templates.load("ValidationSimple","./demo-components/validationSimple/validationSimple.html");
