import React from 'react';
import Field from './Field';

export default class TimeLimit extends Field {
	get fieldName () { return 'TimeLimit'; }

	getSelectableValue () {
		return 'Time Limit';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
