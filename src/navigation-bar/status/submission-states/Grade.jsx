import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import getStateRenderer from './get-state-renderer';

const t = scoped('nti-assignment.navigation-bar.submission-states.Grade', {
	label: 'Assignment Grade',
	pending: 'Pending...',
	excused: 'Excused'
});

const STATES = [
	{
		render: function PendingGrade () {
			return (
				<span className="pending">{t('pending')}</span>
			);
		},
		case: (assignment, historyItem) => {
			const isSubmitted = historyItem && historyItem.isSubmitted();
			const isGraded = historyItem && !!historyItem.getGradeValue();

			return isSubmitted && !isGraded;
		}
	},
	{
		render: function Graded (assignment, historyItem) {
			return (
				<div className="grade-value-container">
					<span className="graded">{historyItem.grade.getValue()}</span>
					{historyItem.grade.IsExcused && <span className="excused">{t('excused')}</span>}
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const isSubmitted = historyItem && historyItem.isSubmitted();
			const isGraded = historyItem && !!historyItem.getGradeValue();

			return isSubmitted && isGraded;
		}
	}
];
export default class AssignmentSubmissionStatusGrade extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}


	render () {
		const {assignment, historyItem} = this.props;
		const renderer = getStateRenderer(STATES, assignment, historyItem);

		if (!renderer) { return null; }

		return (
			<div className="assignment-navigation-bar-status-submission-grade">
				<div className="label">{t('label')}</div>
				<div className="value">{renderer(assignment, historyItem)}</div>
			</div>
		);
	}
}
