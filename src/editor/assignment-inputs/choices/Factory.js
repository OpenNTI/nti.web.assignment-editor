export default class ChoiceFactory {

	constructor (type, containerId, errorField) {
		this.choiceType = type;
		this.containerId = containerId;
		this.errorField = errorField;
	}


	make (label, correct, index, isNew) {
		const choice = {
			MimeType: this.choiceType,
			ID: this.containerId + '-' + index,
			errorField: this.errorField,
			index,
			label: label,
			correct,
			isNew
		};

		return choice;
	}
}


export function isErrorForChoice (error, choice) {
	const {reason} = error || {};
	let {field, index} = reason || {};

	index = index || [];

	return field === choice.errorField && index.indexOf(choice.index) >= 0 ? error : null;
}
