import React from 'react';

import AssignmentInfo from '../assignment-info';
import AssignmentParts from '../assignment-parts';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.any
	}


	render () {
		return (
			<div>
				<AssignmentInfo assignment={this.props.assignment} />
				<AssignmentParts assignment={this.props.assignment} />
			</div>
		);
	}
}
