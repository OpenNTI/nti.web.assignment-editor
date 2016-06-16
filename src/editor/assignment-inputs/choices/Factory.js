import {getFragmentFromString} from 'nti-lib-dom';
import uuid from 'node-uuid';

function parseLabel (label) {
	let frag = getFragmentFromString(label);
	let idAnchor = frag && frag.querySelector('a[data-id]');
	let id = idAnchor ? idAnchor.getAttribute('data-id') : uuid.v4();

	if (idAnchor) {
		frag.removeChild(idAnchor);
	}

	let tempDiv = document.createElement('div');

	tempDiv.appendChild(frag.cloneNode(true));

	return {
		ID: id,
		label: tempDiv.innerHTML
	};
}


export default class ChoiceFactory {

	constructor (type, containerId, errorField) {
		this.choiceType = type;
		this.containerId = containerId;
		this.errorField = errorField;
	}


	make (label, correct, index, isNew) {
		const parts = parseLabel(label);

		const choice = {
			MimeType: this.choiceType,
			ID: parts.ID,
			errorField: this.errorField,
			index,
			label: parts.label,
			correct,
			isNew
		};

		return choice;
	}


	getLabelWithIdFor (choice) {
		const {ID, label} = choice;

		return `<a data-id="${ID}"></a>${label}`;
	}
}


export function isErrorForChoice (error, choice) {
	const {reason} = error || {};
	let {field, index} = reason || {};

	index = index || [];

	return field === choice.errorField && index.indexOf(choice.index) >= 0 ? error : null;
}
