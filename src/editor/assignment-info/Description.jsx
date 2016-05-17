import React from 'react';
import Field from './Field';

export default class Description extends Field {
	get fieldName () { return 'content'; }

	getSelectableValue () {
		return 'Description';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
