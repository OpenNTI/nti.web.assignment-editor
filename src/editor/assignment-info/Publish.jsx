import React from 'react';
import Field from './Field';

export default class Publish extends Field {
	fieldName = 'Publish'

	getSelectableValue () {
		return 'Publish';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
