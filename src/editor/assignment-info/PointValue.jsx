import React from 'react';
import Field from './Field';

export default class PointValue extends Field {
	get fieldName () { return 'PointValue'; }

	getSelectableValue () {
		return 'Point Value';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
