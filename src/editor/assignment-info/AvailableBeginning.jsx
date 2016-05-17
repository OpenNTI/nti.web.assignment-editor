import React from 'react';
import Field from './Field';

export default class AvailableBeginning extends Field {
	fieldName = 'available_for_submission_beginning'

	getSelectableValue () {
		return 'Available Submission Beginning';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
