import './Meta.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { List, DateTime } from '@nti/web-commons';

import getStateRenderer from './get-state-renderer';

const t = scoped('nti-assignment.navigation-bar.submission-states.Meta', {
	notSubmitted: {
		late: {
			insideGracePeriod: {
				label: 'Overdue ',
				due: 'on %(date)s',
			},
			outsideGracePeriod: {
				label: 'Not Submitted ',
				due: 'overdue on %(date)s',
			},
		},
	},
	submitted: {
		onTime: {
			date: 'Completed %(date)s',
		},
		late: {
			date: 'Completed %(date)s',
		},
	},
	badges: {
		overtime: {
			tip: '%(time)s overtime',
			badge: 'overtime',
		},
		overdue: {
			tip: '%(time)s overdue',
			badge: 'overdue',
		},
		separator: ', ',
	},
});

const BADGE_STATES = [
	{
		render: function SubmissionMetaBadge(assignment, historyItem) {
			const isNoSubmit =
				assignment.isNonSubmit() ||
				(historyItem && historyItem.isSyntheticSubmission());
			const maxTime =
				assignment.isTimed && assignment.getMaximumTimeAllowed();
			const dueDate = assignment.getDueDate();

			const completed = historyItem && historyItem.completed;
			const duration =
				assignment.isTimed &&
				historyItem.getDuration &&
				historyItem.getDuration();

			const overtime =
				!isNoSubmit && maxTime && duration && duration > maxTime
					? t('badges.overtime.tip', {
							time: DateTime.getNaturalDuration(
								duration - maxTime,
								1
							),
					  })
					: null;

			const overdue =
				!isNoSubmit && dueDate && completed >= dueDate
					? t('badges.overdue.tip', {
							time: DateTime.getNaturalDuration(
								completed.getTime() - dueDate.getTime()
							),
					  })
					: null;

			return (
				<div className="badges">
					{overdue && (
						<span className="overdue" data-qtip={overdue}>
							{t('badges.overdue.badge')}
						</span>
					)}
					{overdue && overtime && (
						<span className="separator">
							{t('badges.separator')}
						</span>
					)}
					{overtime && (
						<span className="overtime" data-qtip={overtime}>
							{t('badges.overtime.badge')}
						</span>
					)}
				</div>
			);
		},
		case: (assignment, historyItem) => {
			return historyItem && historyItem.isSubmitted();
		},
	},
];

const COMPLETED_STATES = [
	{
		render: function NotSubmittedLate(assignment) {
			const now = new Date();
			const due = assignment.getDueDate();
			const { submissionBuffer } = assignment;
			const noBuffer = !submissionBuffer && submissionBuffer !== 0;
			const latest = new Date(
				due.getTime() + (submissionBuffer || 0) * 1000
			);
			const baseKey =
				latest > now || noBuffer
					? 'notSubmitted.late.insideGracePeriod'
					: 'notSubmitted.late.outsideGracePeriod';
			const formatted = DateTime.format(
				due,
				DateTime.WEEKDAY_MONTH_NAME_DAY_AT_TIME_WITH_ZONE
			);

			return (
				<div className="not-submitted">
					<span className="bold">{t(`${baseKey}.label`)}</span>
					<span className="date">
						{t(`${baseKey}.due`, { date: formatted })}
					</span>
				</div>
			);
		},
		//Not submitted and its pass due (also not a no submit)
		case: (assignment, historyItem) => {
			const now = new Date();
			const due = assignment.getDueDate();
			const isSubmitted = historyItem && historyItem.isSubmitted();

			return (
				!assignment.isNonSubmit() && due && due < now && !isSubmitted
			);
		},
	},
	{
		render: function SubmittedOnTime(assignment, historyItem) {
			const submittedDate = historyItem && historyItem.completed;
			const formatted = DateTime.format(
				submittedDate,
				DateTime.WEEKDAY_MONTH_NAME_DAY
			);
			const baseKey = 'submitted.onTime';

			return (
				<div className="on-time">
					<span className="date">
						{t(`${baseKey}.date`, { date: formatted })}
					</span>
				</div>
			);
		},
		cases: [
			//Submitted on time
			(assignment, historyItem) => {
				const due = assignment.getDueDate();
				const submittedDate = historyItem && historyItem.completed;

				return (
					(!due && submittedDate) ||
					(submittedDate && submittedDate < due)
				);
			},
			//Submitted and is no submit
			(assignment, historyItem) => {
				const isSubmitted = historyItem && historyItem.isSubmitted();

				return assignment.isNonSubmit() && isSubmitted;
			},
		],
	},
	{
		render: function SubmittedLate(assignment, historyItem) {
			const submittedDate = historyItem && historyItem.completed;
			const formatted = DateTime.format(
				submittedDate,
				DateTime.WEEKDAY_MONTH_NAME_DAY
			);
			const baseKey = 'submitted.late';

			return (
				<div className="submitted-late">
					<span className="date">
						{t(`${baseKey}.date`, { date: formatted })}
					</span>
				</div>
			);
		},
		case: (assignment, historyItem) => {
			const due = assignment.getDueDate();
			const submittedDate = historyItem && historyItem.completed;

			return due && submittedDate && submittedDate > due;
		},
	},
];

const DURATION_STATES = [
	{
		render: function TimedDuration(assignment, historyItem) {
			const duration = historyItem.getDuration();
			const formatted = DateTime.getNaturalDuration(duration || 0);

			return <div className="duration">{formatted}</div>;
		},
		case: (assignment, historyItem) => {
			const isSubmitted = historyItem && historyItem.isSubmitted();

			return assignment.isTimed && isSubmitted;
		},
	},
];

export default class AssignmentSubmissionStatesMeta extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object,
	};

	render() {
		const { assignment, historyItem } = this.props;
		const badgeState = getStateRenderer(
			BADGE_STATES,
			assignment,
			historyItem
		);
		const completedState = getStateRenderer(
			COMPLETED_STATES,
			assignment,
			historyItem
		);
		const durationState = getStateRenderer(
			DURATION_STATES,
			assignment,
			historyItem
		);

		if (!completedState && !durationState) {
			return null;
		}

		return (
			<div className="assignment-navigation-bar-status-submission-meta">
				<List.SeparatedInline>
					<div>
						{badgeState && badgeState(assignment, historyItem)}
						{completedState &&
							completedState(assignment, historyItem)}
					</div>
					{durationState && durationState(assignment, historyItem)}
				</List.SeparatedInline>
			</div>
		);
	}
}
