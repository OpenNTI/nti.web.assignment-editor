import React from 'react';
import Field from './Field';

export default class Delete extends Field {
	fieldName = 'Delete'

	getSelectableValue () {
		return 'Delete';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
