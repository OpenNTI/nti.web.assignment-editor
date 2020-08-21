import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PointValue from './PointValue';
import DueDate from './DueDate';
import TimeLimit from './TimeLimit';
import PassingScore from './PassingScore';

export default class AssignmentInfoView extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		schema: PropTypes.object
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
				{assignment && ( <PassingScore assignment={assignment} schema={schema} /> )}
				{assignment && ( <PointValue assignment={assignment} schema={schema} /> )}
			</div>
		);
	}
}
