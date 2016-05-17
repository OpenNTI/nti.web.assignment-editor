import React from 'react';
import Field from './Field';

export default class TimeLimit extends Field {
	fieldName = 'TimeLimit'

	getSelectableValue () {
		return 'Time Limit';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
