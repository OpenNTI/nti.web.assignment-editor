import EventEmitter from 'events';

class Choice extends EventEmitter {
	constructor(data, groupName) {
		super();

		this.data = data;
		this.groupName = groupName;
	}

	clone() {
		const clone = new Choice({ ...this.data });

		clone.syncHeightGroup = this.syncHeightGroup;

		return clone;
	}

	focus() {
		this.emit('focus');
	}

	focusToEnd() {
		this.emit('focus', 'focusToEnd');
	}

	onFocus() {
		this.isNew = false;
	}

	get MimeType() {
		return this.data.MimeType;
	}

	get ID() {
		return this.data.containerId + '-' + this.data.index;
	}

	get containerId() {
		return this.data.containerId;
	}

	get errorField() {
		return this.data.errorField;
	}

	get index() {
		return this.data.index;
	}

	get isNew() {
		return this.data.isNew;
	}

	set isNew(value) {
		this.data.isNew = value;
	}

	get correct() {
		return this.data.correct;
	}

	set correct(value) {
		this.data.correct = value;
	}

	get label() {
		return this.data.label;
	}

	set label(value) {
		this.data.label = value;
	}

	get syncHeightGroup() {
		return this.group;
	}

	set syncHeightGroup(group) {
		this.group = group;
	}

	set index(index) {
		this.data.index = index;
	}

	get dataForTransfer() {
		const data = {
			MimeType: this.MimeType,
			ID: this.ID,
			correct: this.correct,
			containerId: this.containerId,
			label: this.label,
		};

		return JSON.stringify(data);
	}
}

export default class ChoiceFactory {
	constructor(type, containerId, errorField, name) {
		this.choiceType = type;
		this.containerId = containerId;
		this.errorField = errorField;
		this.name = name;
	}

	make(label, correct, index, isNew) {
		const choice = new Choice(
			{
				MimeType: this.choiceType,
				containerId: this.containerId,
				errorField: this.errorField,
				index,
				label: label,
				correct,
				isNew,
			},
			this.name
		);

		return choice;
	}
}

export function cloneChoice(choice) {
	if (!(choice instanceof Choice)) {
		return choice;
	}

	return new Choice(choice.data);
}

export function isErrorForChoice(error, choice) {
	const { raw } = error || {};
	let { field, index } = raw || {};

	index = index || [];

	return field === choice.errorField && index.indexOf(choice.index) >= 0
		? error
		: null;
}
