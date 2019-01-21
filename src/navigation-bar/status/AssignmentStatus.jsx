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
	passingScore: '<span class="percentage">%(passingScore)s%%</span> or Higher to Pass'
});

function AssignmentTimeLimit (assignment) {
	if (!assignment.isTimed) { return null; }

	return (
		<div className="time-limit">
			<i className="icon-clock" />
			<span>{DateTime.getShortNaturalDuration(assignment.getMaximumTimeAllowed(), 2)}</span>
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

function AssignmentPassingScore (assignment) {
	//TODO: hard coding passing score for now.

	return (
		<div className={cx('passing-score', {failed: false})}>
			<i className="icon-chevron-up" />
			<span {...rawContent(t('passingScore', {passingScore: 62}))} />
		</div>
	);
}


const PARTS = [
	AssignmentTimeLimit,
	AssignmentTotalPoints,
	AssignmentPassingScore
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
