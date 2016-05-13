import React from 'react';
import SimpleText from '../inputs/SimpleText';
import Selectable from '../../utils/Selectable';


export default class AssignmentDescription extends React.Component {
	constructor (props) {
		super(props);

		const bindList = [
			'onChange'
		];

		for (let fn of bindList) {
			this[fn] = this[fn].bind(this);
		}
	}


	onChange () {}


	activateSelection () {
		if (this.selectable) {
			this.selectable.select();
		}
	}


	deactivateSelection () {
		if (this.selectable) {
			this.selectable.unselect();
		}
	}


	render () {
		return (
			<Selectable className="assignment-description" id="assignment-description" value="Assignment Description" >
				<span>Description</span>
				<SimpleText value="description" onChange={this.onChange}/>
			</Selectable>
		);
	}
}
