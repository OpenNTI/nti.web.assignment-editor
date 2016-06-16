export function isErrorForChoice (error, choice) {
	const {reason} = error || {};
	let {field, index} = reason || {};

	index = index || [];

	return field === choice.errorField && index.indexOf(choice.index) >= 0 ? error : null;
}


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
			errorField: this.errorField,
			index,
			label,
			correct,
			isNew
		};

		return choice;
	}
}
