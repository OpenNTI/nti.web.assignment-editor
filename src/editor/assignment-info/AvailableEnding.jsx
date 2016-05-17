import React from 'react';
import Field from './Field';

export default class AvailableEnding extends Field {
	fieldName = 'available_for_submission_ending'

	getSelectableValue () {
		return 'Available Submission Ending';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
