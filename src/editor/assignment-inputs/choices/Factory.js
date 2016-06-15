export default class ChoiceFactory {

	constructor (type, containerId, errorField) {
		this.choiceType = type;
		this.containerId = containerId;
		this.counter = 0;
		this.errorField = errorField;
	}


	make (label, correct, index, isNew) {
		this.counter += 1;

		const choice = {
			MimeType: this.choiceType,
			ID: this.containerId + '-' + this.counter,
			label,
			correct,
			isNew,
			isErrorFor: error => this.isErrorFor(error, index)
		};


		return choice;
	}


	isErrorFor (error, choiceIndex) {
		const {reason} = error || {};
		let {field, index} = reason || {};

		index = index || [];

		return field === this.errorField && index.indexOf(choiceIndex) >= 0 ? error : null;
	}
}
