import React from 'react';
import SimpleText from '../inputs/SimpleText';
import Selectable from '../utils/Selectable';


export default class AssignmentTitle extends React.Component {
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


	render () {
		return (
			<Selectable className="assignment-title" id="assignment-title" value="Assignment Title" >
				<span>Title</span>
				<SimpleText value="Title" onChange={this.onChange}/>
			</Selectable>
		);
	}
}
