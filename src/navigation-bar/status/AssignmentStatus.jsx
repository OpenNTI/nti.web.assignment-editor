import './AssignmentStatus.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {rawContent} from '@nti/lib-commons';
import {DateTime} from '@nti/web-commons';

const t = scoped('nti-assignment.navigation-bar.status.AssignmentStatus', {
	totalPoints: {
		one: '%(count)s Point',
		other: '%(count)s Points'
	},
	passingScore: '<span class="percentage">%(passingScore)s%%</span> <span>to Pass</span>',
	attempts: {
		started: {
			limitedAttempts: {
				zero: '<b>No</b> Attempts Remaining',
				one: '<b>%(count)s</b> Attempt Remaining',
				other: '<b>%(count)s</b> Attempts Remaining'
			},
			unlimitedAttempts: '<b>Unlimited</b> Attempts Remaining'
		},
		notStarted: {
			limitedAttempts: {
				zero: '<b>No</b> Attempts',
				one: '<b>%(count)s</b> Attempt',
				other: '<b>%(count)s</b> Attempts'
			},
			unlimitedAttempts: '<b>Unlimited</b> Attempts'
		}
	}
});

function AssignmentTimeLimit (assignment) {
	if (!assignment.isTimed) { return null; }

	return (
		<div className="time-limit">
			<i className="icon-clock" />
			<span>{DateTime.getShortNaturalDuration(assignment.getMaximumTimeAllowed())}</span>
		</div>
	);
}

function AssignmentTotalPoints (assignment) {
	if (!assignment.totalPoints) { return null; }

	return (
		<div className="total-points">
			<i className="icon-star-outline" />
			<span>{t('totalPoints', {count: assignment.totalPoints})}</span>
		</div>
	);
}

function AssignmentPassingScore (assignment, historyItem) {
	if (!assignment.passingScore) { return null; }

	const passingScore = Math.ceil(assignment.passingScore * 100);
	const failed = historyItem && historyItem.isSubmitted() && assignment.CompletedItem && !assignment.CompletedItem.Success;

	return (
		<div className={cx('passing-score', {failed})}>
			<i className="icon-arrow-up-outline" />
			<span {...rawContent(t('passingScore', {passingScore}))} />
		</div>
	);
}

function AssignmentAttempts (assignment, historyItem) {
	if (assignment.isNonSubmit()) { return; }
	if (historyItem && assignment.CompletedItem && assignment.CompletedItem.Success && !assignment.hasLink('Commence')) { return; }

	const {maxSubmissions, submissionCount} = assignment;
	const started = submissionCount > 0;
	const key = started ? 'attempts.started' : 'attempts.notStarted';

	let label = '';

	if (maxSubmissions == null) {
		label = t(`${key}.limitedAttempts`, {count: 1});
	} else if (maxSubmissions < 0) {
		label = t(`${key}.unlimitedAttempts`);
	} else {
		label = t(`${key}.limitedAttempts`, {count: maxSubmissions - submissionCount});
	}

	return (
		<div className={cx('attempt-info')}>
			<span {...rawContent(label)} />
		</div>
	);
}


const PARTS = [
	AssignmentTimeLimit,
	AssignmentTotalPoints,
	AssignmentPassingScore,
	AssignmentAttempts
];

export default class AssignmentStatus extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object
	}


	render () {
		const {assignment, historyItem} = this.props;
		const parts = PARTS
			.map(fn => fn(assignment, historyItem))
			.filter(part => !!part);

		if (!parts.length) { return null; }

		return (
			<ul className={cx('assignment-navigation-bar-status-assignment', {'has-submission': !!historyItem})}>
				{parts.map((part, key) => {
					return (
						<li key={key}>
							{part}
						</li>
					);
				})}
			</ul>
		);
	}
}
