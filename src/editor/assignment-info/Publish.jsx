import React from 'react';
import Field from './Field';

export default class Publish extends Field {
	get fieldName () { return  'Publish'; }

	getSelectableValue () {
		return 'Publish';
	}

	renderInput () {
		return (
			<span>{this.fieldName}</span>
		);
	}
}
