import React from 'react';
import Field from './Field';

export default class AvailableBeginning extends Field {
	get fieldName () { return 'available_for_submission_beginning'; }

	getSelectableValue () {
		return 'Available Submission Beginning';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
