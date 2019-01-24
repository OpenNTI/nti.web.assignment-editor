import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {List, DateTime} from '@nti/web-commons';

import getStateRenderer from './get-state-renderer';

const t = scoped('nti-assignment.navigation-bar.submission-states.Meta', {
	notSubmitted: {
		late: {
			insideGracePeriod: {
				label: 'Overdue ',
				due: 'on %(date)s'
			},
			outsideGracePeriod: {
				label: 'Not Submitted ',
				due: 'overdue on %(date)s'
			}
		}
	},
	submitted: {
		onTime: {
			label: 'Completed ',
			date: '%(date)s'
		},
		late: {
			label: 'Overdue ',
			date: 'Completed %(date)s'
		}
	}
});

const COMPLETED_STATES = [
	{
		render: function NotSubmittedLate (assignment) {
			const now = new Date();
			const due = assignment.getDueDate();
			const {submissionBuffer} = assignment;
			const latest = new Date(due.getTime() + ((submissionBuffer || 0) * 1000));
			const baseKey = latest > now ? 'notSubmitted.late.insideGracePeriod' : 'notSubmitted.late.outsideGracePeriod';
			const formatted = DateTime.format(due, 'dddd, MMMM D [at] h:mm A z');

			return (
				<div className="not-submitted">
					<span className="bold">{t(`${baseKey}.label`)}</span>
					<span className="date">{t(`${baseKey}.due`, {date: formatted})}</span>
				</div>
			);

		},
		//Not submitted and its pass due (also not a no submit)
		case: (assignment, historyItem) => {
			const now = new Date();
			const due = assignment.getDueDate();
			const isSubmitted = historyItem && historyItem.isSubmitted();

			return !assignment.isNonSubmit() && due && due < now && !isSubmitted;
		}
	},
	{
		render: function SubmittedOnTime (assignment, historyItem) {
			const submittedDate = historyItem && historyItem.completed;
			const formatted = DateTime.format(submittedDate, 'dddd, MMMM D');
			const baseKey = 'submitted.onTime';

			return (
				<div className="on-time">
					<span className="bold">{t(`${baseKey}.label`)}</span>
					<span className="date">{t(`${baseKey}.date`, {date: formatted})}</span>
				</div>
			);
		},
		cases: [
			//Submitted on time
			(assignment, historyItem) => {
				const due = assignment.getDueDate();
				const submittedDate = historyItem && historyItem.completed;

				return (!due && submittedDate) || (submittedDate && submittedDate < due);
			},
			//Submitted and is no submit
			(assignment, historyItem) => {
				const isSubmitted = historyItem && historyItem.isSubmitted();

				return assignment.isNonSubmit() && isSubmitted;
			}
		]
	},
	{
		render: function SubmittedLate (assignment, historyItem) {
			const submittedDate = historyItem && historyItem.completed;
			const formatted = DateTime.format(submittedDate, 'dddd, MMMM D');
			const baseKey = 'submitted.late';

			return (
				<div className="submitted-late">
					<span className="bold">{t(`${baseKey}.label`)}</span>
					<span className="date">{t(`${baseKey}.date`, {date: formatted})}</span>
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const due = assignment.getDueDate();
			const submittedDate = historyItem && historyItem.completed;

			return due && submittedDate && submittedDate > due;
		}
	}
];

const DURATION_STATES = [

];


export default class AssignmentSubmissionStatesMeta extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}

	render () {
		const {assignment, historyItem} = this.props;
		const completedState = 	getStateRenderer(COMPLETED_STATES, assignment, historyItem);
		const durationState = getStateRenderer(DURATION_STATES, assignment, historyItem);

		if (!completedState && !durationState) { return null; }

		return (
			<div className="assignment-navigation-bar-status-submission-meta">
				<List.SeparatedInline>
					{completedState && completedState(assignment, historyItem)}
					{durationState && durationState(assignment, historyItem)}
				</List.SeparatedInline>
			</div>
		);
	}
}
