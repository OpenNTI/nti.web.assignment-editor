import React from 'react';
import Field from './Field';

export default class PointValue extends Field {
	fieldName = 'PointValue'

	getSelectableValue () {
		return 'Point Value';
	}

	renderInput () {
		return (
			<input type="text" value={this.fieldName} />
		);
	}
}
