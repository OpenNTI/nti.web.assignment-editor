import React from 'react';
import Field from './Field';

export default class AvailableEnding extends Field {
	get fieldName () { return 'available_for_submission_ending'; }

	getSelectableValue () {
		return 'Available Submission Ending';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
