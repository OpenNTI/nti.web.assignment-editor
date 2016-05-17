import React from 'react';
import Field from './Field';

export default class Delete extends Field {
	get fieldName () { return 'Delete'; }

	getSelectableValue () {
		return 'Delete';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
