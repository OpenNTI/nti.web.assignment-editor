import React from 'react';
import Field from './Field';

export default class Description extends Field {
	fieldName = 'content'

	getSelectableValue () {
		return 'Description';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
