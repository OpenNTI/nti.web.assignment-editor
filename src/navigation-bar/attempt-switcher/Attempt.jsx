import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {DateTime} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

const t = scoped('nti-assignment.navigation-bar.attempt-switcher.Attempt', {
	started: 'Started on %(date)s',
	submitted: 'Submitted on %(date)s'
});

function formatDate (date) {
	return DateTime.format(date, 'MMM D, YYYY [at] h:mm A');
}

export default class AttemptSwitcherAttemptItem extends React.Component {
	static propTypes = {
		attempt: PropTypes.shape({
			getStartTime: PropTypes.func.isRequired,
			getSubmittedTime: PropTypes.func.isRequired
		}).isRequired,
		active: PropTypes.bool,
		label: PropTypes.bool
	}


	render () {
		const {attempt, active, label} = this.props;

		if (label) { return this.renderAttempt(attempt, active); }

		return (
			<LinkTo.Object object={attempt} className="assignment-navigation-bar-attempt-switcher-attempt-link">
				{this.renderAttempt(attempt, active)}
			</LinkTo.Object>
		);
	}


	renderAttempt (attempt, active) {
		const started = attempt.getStartTime();
		const submitted = attempt.getSubmitTime();

		return (
			<span className={cx('assignment-navigation-bar-attempt-switcher-attempt', {active})}>
				{submitted && t('submitted', {date: formatDate(submitted)})}
				{!submitted && started && t('started', {date: formatDate(started)})}
			</span>
		);
	}
}
