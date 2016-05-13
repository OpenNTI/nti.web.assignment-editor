import React from 'react';

import AssignmentTitle from './AssignmentTitle';
import AssignmentDescription from './AssignmentDescription';

export default class AssignmentInfo extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			value: ''
		};
	}


	render () {

		return (
			<div className="assignment-info">
				<AssignmentTitle />
				<AssignmentDescription />
			</div>
		);
	}
}
