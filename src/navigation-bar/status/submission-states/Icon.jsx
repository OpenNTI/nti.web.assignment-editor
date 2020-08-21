import './Icon.scss';
import React from 'react';
import PropTypes from 'prop-types';

import getStateRenderer from './get-state-renderer';

const STATES = [
	{

		render: function FailedIcon () {
			return (
				<div className="failed" />
			);
		},
		cases: [
			//If the assignment has been submitted, without a successful completed item, and
			//it has a grade.
			(assignment, historyItem) => {
				const {CompletedItem} = assignment;
				const isSubmitted = historyItem && historyItem.isSubmitted();
				const hasGrade = historyItem && historyItem.grade && !!historyItem.grade.value;

				return isSubmitted && CompletedItem && !CompletedItem.Success && hasGrade;
			}
		]
	},
	{
		render: function PassingIcon () {
			return (
				<div className="passing" />
			);
		},
		cases: [
			//Has a successful completed item
			(assignment, historyItem) => {
				const {CompletedItem} = assignment;
				const submitted = historyItem && historyItem.isSubmitted();

				return submitted && CompletedItem && CompletedItem.Success;
			},
			//Was submitted and no due date
			(assignment, historyItem) => {
				const due = assignment.getDueDate();
				const submitted = historyItem && historyItem.isSubmitted();

				return !due && submitted;
			},
			//Was submitted before the due date
			(assignment, historyItem) => {
				const due = assignment.getDueDate();
				const submittedDate = historyItem && historyItem.completed;

				return due && submittedDate && submittedDate <= due;
			},
			//Is no submit and was submitted
			(assignment, historyItem) => {
				const isSubmitted = historyItem && historyItem.isSubmitted();

				return assignment.isNonSubmit() && isSubmitted;
			}
		]
	},
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
				const noSubmission = !historyItem || !historyItem.isSubmitted();

				return !assignment.isNonSubmit() && due && due < now && noSubmission;
			},
			//No passing percentage and the assignment was submitted late
			(assignment, historyItem) => {
				const due = assignment.getDueDate();
				const submittedDate = historyItem && historyItem.completed;

				return !assignment.isNonSubmit() && due && submittedDate && submittedDate > due;
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

		if (!render) { return null; }

		return (
			<div className="assignment-navigation-bar-status-submission-icon">
				{render(assignment, historyItem)}
			</div>
		);
	}
}
