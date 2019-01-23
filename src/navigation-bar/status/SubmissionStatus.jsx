import React from 'react';
import PropTypes from 'prop-types';

import {Icon, Title} from './submission-states';

export default class SubmissionStatus extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}


	render () {
		const {assignment, historyItem} = this.props;

		return (
			<div className="assignment-navigation-bar-status-submission">
				{this.renderSubmissionStatus(assignment, historyItem)}
				{this.renderGrade(assignment, historyItem)}
			</div>
		);
	}


	renderSubmissionStatus (assignment, historyItem) {
		return (
			<div className="submission-state">
				<Icon assignment={assignment} historyItem={historyItem} />
				<Title assignment={assignment} historyItem={historyItem} />
			</div>
		);
	}


	renderGrade () {
		return null;
	}
}
