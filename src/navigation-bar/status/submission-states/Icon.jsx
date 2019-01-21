import React from 'react';
import PropTypes from 'prop-types';

import getStateRenderer from './get-state-renderer';

const STATES = [
	{
		render: function LateItcon () {
			return (
				<div className="late" />
			);
		},

		cases: [
			//Not submitted and the assignment is over due
			(assignment, historyItem) => {
				const now = new Date();
				const due = assignment.getDueDate();
				const noSubmission = !historyItem || !historyItem.Submission.isSubmitted();

				return due && due < now && noSubmission;
			},
			//No passing percentage and the assignment was submitted late
			(assignment, historyItem) => {
				const {passingScore} = assignment;
				const due = assignment.getDueDate();
				const submittedDate = historyItem && historyItem.Submission.getCreatedTime();

				return due && submittedDate && !passingScore && submittedDate > due;
			}
		]
	}
];

export default class AssignmentSubmissionIcon extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}


	render () {
		const {assignment, historyItem} = this.props;
		const render = getStateRenderer(STATES, assignment, historyItem);

		return (
			<div className="assignment-navigation-bar-status-submission-icon">
				{render && render(assignment, historyItem)}
			</div>
		);
	}
}
