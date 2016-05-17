import React from 'react';
import Field from './Field';

export default class Title extends Field {
	get fieldName () { return 'title'; }

	constructor (props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}


	getSelectableValue () {
		return 'Title';
	}


	onChange (e) {
		super.onChange(e.target.value);
	}


	renderInput () {
		return (
			<input type="text" value={this.state.value} onChange={this.onChange} />
		);
	}
}
