import React from 'react';

import Title from './Title';
import Description from './Description';

export default class AssignmentContent extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div className="assignment-content">
				<Title />
				<Description />
			</div>
		);
	}
}
