import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {DateTime} from '@nti/web-commons';

import getStateRenderer from './get-state-renderer';

const t = scoped('nti-assignment.navigation-bar.submission-states.Title', {
	notSubmitted: {
		late: {
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
				title: 'Congratulations',
				subTitle: 'You met the requirements to pass this assignment.'
			},
			failed: {
				title: 'You did not meet the requirements to pass this assignment.'
			}
		}
	}
});

const STATES = [
	{
		render: function NotSubmittedLate (assignment) {
			const now = new Date();
			const due = assignment.getDueDate();
			const {submissionBuffer} = assignment;
			const latest = new Date(due.getTime() + ((submissionBuffer || 0) * 1000));
			const baseKey = latest > now ? 'notSubmitted.late.insideGracePeriod' : 'notSubmitted.late.outsideGracePeriod';
			const formatted = DateTime.format(latest, 'dddd, MMMM D [at] h:mm A z');

			return (
				<div className="not-submitted-late">
					{!t.isMissing(`${baseKey}.title`) && (
						<span className="title">{t(`${baseKey}.title`, {date: formatted})}</span>
					)}
					{!t.isMissing(`${baseKey}.subTitle`) && (
						<span className="sub-title">{t(`${baseKey}.subTitle`)}</span>
					)}
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const now = new Date();
			const due = assignment.getDueDate();
			const hasBeenSubmitted = historyItem && historyItem.Submission.isSubmitted();

			return due && due < now && !hasBeenSubmitted;
		}
	}
];

export default class AssignmentSubmissionTitle extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}


	render () {
		const {assignment, historyItem} = this.props;
		const render = getStateRenderer(STATES, assignment, historyItem);

		return (
			<div className="assignment-navigation-bar-status-submission-title">
				{render && render(assignment, historyItem)}
			</div>
		);
	}
}
