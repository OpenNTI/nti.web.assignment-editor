import React from 'react';
import cx from 'classnames';

import PointValue from './PointValue';
import DueDate from './DueDate';
import TimeLimit from './TimeLimit';

export default class AssignmentInfoView extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object,
		onDueDateUpdate: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {assignment, schema, onDueDateUpdate} = this.props;

		return (
			<div className={cx('assignment-info', {loading: !assignment})}>
				{assignment && ( <DueDate assignment={assignment} schema={schema} onDueDateUpdate={onDueDateUpdate} /> )}
				{assignment && ( <TimeLimit assignment={assignment} schema={schema} /> )}
				{assignment && ( <PointValue assignment={assignment} schema={schema} /> )}
			</div>
		);
	}
}
