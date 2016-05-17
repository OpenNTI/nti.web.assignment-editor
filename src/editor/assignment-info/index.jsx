import React from 'react';

import Title from './Title';
import Description from './Description';
import PointValue from './PointValue';
import Publish from './Publish';
import Delete from './Delete';
import AvailableBeginning from './AvailableBeginning';
import AvailableEnding from './AvailableEnding';
import TimeLimit from './TimeLimit';

export default class AssignmentInfo extends React.Component {
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
				<div className="assignment-info loading"></div>
			);
		}

		return (
			<div className="assignment-info">
				<div className="top">
					<Title assignment={assignment} schema={schema} />
					<PointValue assignment={assignment} schema={schema} />
					<Publish assignment={assignment} schema={schema} />
					<Delete assignment={assignment} schema={schema} />
				</div>
				<div className="bottom">
					<Description assignment={assignment} schema={schema} />
					<AvailableBeginning assignment={assignment} schema={schema} />
					<AvailableEnding assignment={assignment} schema={schema} />
					<TimeLimit assignment={assignment} schema={schema} />
				</div>
			</div>
		);
	}
}
