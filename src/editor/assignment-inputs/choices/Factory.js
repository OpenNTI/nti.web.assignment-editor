import {EventEmitter} from 'events';

class Choice extends EventEmitter {
	constructor (data) {
		super();

		this.data = data;
	}

	clone () {
		return new Choice({...this.data});
	}

	get MimeType () {
		return this.data.MimeType;
	}

	get ID () {
		return this.data.ID;
	}


	get errorField () {
		return this.data.errorField;
	}


	get index () {
		return this.data.index;
	}


	get isNew () {
		return this.data.isNew;
	}


	get correct () {
		return this.data.correct;
	}

	set correct (value) {
		if (this.data.correct !== value) {
			this.data.correct = value;
		}
	}


	get label () {
		return this.data.label;
	}


	set label (value) {
		if (this.data.label !== value) {
			this.data.label = value;
			this.emit('changed');
		}
	}


	get syncHeightWith () {
		return this.rows;
	}


	set syncHeightWith (rows) {
		this.rows = rows;
	}


	get dataForTransfer () {
		return JSON.stringify(this.data);
	}
}


export default class ChoiceFactory {

	constructor (type, containerId, errorField) {
		this.choiceType = type;
		this.containerId = containerId;
		this.errorField = errorField;
	}


	make (label, correct, index, isNew) {
		const choice = new Choice({
			MimeType: this.choiceType,
			ID: this.containerId + '-' + index,
			errorField: this.errorField,
			index,
			label: label,
			correct,
			isNew
		});

		return choice;
	}
}


export function cloneChoice (choice) {
	if (!choice instanceof Choice) {
		return choice;
	}

	return new Choice(choice.data);
}


export function isErrorForChoice (error, choice) {
	const {reason} = error || {};
	let {field, index} = reason || {};

	index = index || [];

	return field === choice.errorField && index.indexOf(choice.index) >= 0 ? error : null;
}
