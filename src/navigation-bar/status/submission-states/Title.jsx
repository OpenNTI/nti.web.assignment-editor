import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {DateTime} from '@nti/web-commons';

import getStateRenderer from './get-state-renderer';

const t = scoped('nti-assignment.navigation-bar.submission-states.Title', {
	notSubmitted: {
		late: {
			noGracePeriod: {
				title: 'Late submissions will be accepted.',
				subTitle: 'A late penalty may be applied to your score.'
			},
			insideGracePeriod: {
				title: 'Late submissions will be accepted until %(date)s.',
				subTitle: 'A late penalty may be applied to your score.'
			},
			outsideGracePeriod: {
				title: 'You can no longer submit this assignment.'
			}
		}
	},
	submitted: {
		pending: {
			title: 'Thank you for submitting. We will notify you when your score is available.'
		},
		notPassFail: {
			notAutoGrade: {
				title: 'Thank you for submitting. Your score is now available.'
			},
			autoGrade: {
				title: 'Your assignment was submitted successfully!'
			}
		},
		passFail: {
			passed: {
				title: 'Congratulations!',
				subTitle: 'You met the requirements to pass this assignment.'
			},
			failed: {
				title: 'You did not meet the requirements to pass this assignment.'
			}
		}
	}
});

function renderTitle (baseKey, data) {
	const key = `${baseKey}.title`;

	return t.isMissing(key) ?
		null :
		(
			<span className="title">{t(key, data || {})}</span>
		);
}


function renderSubTitle (baseKey, data) {
	const key = `${baseKey}.subTitle`;

	return t.isMissing(key) ?
		null :
		(
			<span className="sub-title">{t(key, data || {})}</span>
		);
}

const STATES = [
	{
		render: function NotSubmittedLate (assignment) {
			const now = new Date();
			const due = assignment.getDueDate();
			const {submissionBuffer} = assignment;

			//If there is no submissionBuffer we will always accept late submissions
			if (!submissionBuffer && submissionBuffer !== 0) {
				return (
					<div className="not-submitted-late">
						{renderTitle('notSubmitted.late.noGracePeriod')}
						{renderSubTitle('notSubmitted.late.noGracePeriod')}
					</div>
				);
			}

			const latest = new Date(due.getTime() + ((submissionBuffer || 0) * 1000));
			const baseKey = latest > now ? 'notSubmitted.late.insideGracePeriod' : 'notSubmitted.late.outsideGracePeriod';
			const formatted = DateTime.format(latest, 'dddd, MMMM D [at] h:mm A z');

			return (
				<div className="not-submitted-late">
					{renderTitle(baseKey, {date: formatted})}
					{renderSubTitle(baseKey)}
				</div>
			);
		},
		//the assignment is late, and has NOT been submitted
		case: (assignment, historyItem) => {
			const now = new Date();
			const due = assignment.getDueDate();
			const hasBeenSubmitted = historyItem && historyItem.isSubmitted();

			return !assignment.isNonSubmit() && due && due < now && !hasBeenSubmitted;
		}
	},
	{
		render: function Pending () {
			const base = 'submitted.pending';

			return (
				<div className="pending">
					{renderTitle(base)}
					{renderSubTitle(base)}
				</div>
			);
		},
		//The assignment has been submitted, and does NOT have a grade
		case: (assignment, historyItem) => {
			const hasBeenSubmitted = historyItem && historyItem.isSubmitted();
			const grade = historyItem && historyItem.getGradeValue();

			return hasBeenSubmitted && !grade;
		}
	},
	{
		render: function Success () {
			const base = 'submitted.passFail.passed';

			return (
				<div className="passing">
					{renderTitle(base)}
					{renderSubTitle(base)}
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const {CompletedItem} = assignment;

			return CompletedItem && CompletedItem.Success;
		}
	},
	{
		render: function Failed () {
			const base = 'submitted.passFail.failed';

			return (
				<div className="failed">
					{renderTitle(base)}
					{renderSubTitle(base)}
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const {CompletedItem} = assignment;

			return CompletedItem && !CompletedItem.Success;
		}
	},
	{
		render: function NotPassFailAutoGrade () {
			const base = 'submitted.notPassFail.autoGrade';

			return (
				<div className="auto-grade">
					{renderTitle(base)}
					{renderSubTitle(base)}
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const hasBeenSubmitted = historyItem && historyItem.isSubmitted();
			const autoGrade = historyItem && historyItem.grade && historyItem.grade.hasAutoGrade();

			return hasBeenSubmitted && autoGrade;
		}
	},
	{
		render: function NotPassFailNotAutoGrade () {
			const base = 'submitted.notPassFail.notAutoGrade';

			return (
				<div className="manual-grade">
					{renderTitle(base)}
					{renderSubTitle(base)}
				</div>
			);
		},
		//The assignment has been submitted, has manual grade
		case: (assignment, historyItem) => {
			const hasBeenSubmitted = historyItem && historyItem.isSubmitted();
			const autoGrade = historyItem && historyItem.grade && historyItem.grade.hasAutoGrade();

			return hasBeenSubmitted && !autoGrade;
		}
	},
];

export default class AssignmentSubmissionTitle extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}


	render () {
		const {assignment, historyItem} = this.props;
		const render = getStateRenderer(STATES, assignment, historyItem);

		if (!render) { return null; }

		return (
			<div className="assignment-navigation-bar-status-submission-title">
				{render(assignment, historyItem)}
			</div>
		);
	}
}
