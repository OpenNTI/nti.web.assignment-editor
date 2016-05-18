import React from 'react';
import Field from './Field';

export default class Description extends Field {
	get fieldName () { return 'content'; }

	getSelectableValue () {
		return 'Description';
	}


	onChange (e) {
		super.onChange(e.target.value);
	}


	renderInput () {
		return (
			<textarea onChange={this.onChange}>{this.state.value}</textarea>
		);
	}
}
