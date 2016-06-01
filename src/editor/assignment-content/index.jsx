import React from 'react';

import Title from './Title';
import Description from './Description';

export default class AssignmentContent extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {assignment, schema} = this.props;

		if (!assignment) {
			return (
				<div className="assignment-content loading"></div>
			);
		}

		return (
			<div className="assignment-content">
				<Title assignment={assignment} schema={schema} />
				<Description assignment={assignment} schema={schema} />
			</div>
		);
	}
}
