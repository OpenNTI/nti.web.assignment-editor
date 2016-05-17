import React from 'react';
import Field from './Field';

export default class Title extends Field {
	fieldName = 'title'

	getSelectableValue () {
		return 'Title';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
