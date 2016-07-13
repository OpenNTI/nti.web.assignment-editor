import React from 'react';
import cx from 'classnames';

import PointValue from './PointValue';
import DueDate from './DueDate';
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

		return (
			<div className={cx('assignment-info', {loading: !assignment})}>
				{assignment && ( <DueDate assignment={assignment} schema={schema} /> )}
				{assignment && ( <TimeLimit assignment={assignment} schema={schema} /> )}
				{assignment && ( <PointValue assignment={assignment} schema={schema} /> )}
			</div>
		);
	}
}
