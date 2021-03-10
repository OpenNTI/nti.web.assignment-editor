import './Attempts.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Button } from '@nti/web-commons';

const t = scoped('nti-assignment.navigation-bar.submission-states.Attempts', {
	tryAgain: 'Try Again',
	remainingAttempts: {
		one: '%(count)s Attempt Remaining',
		other: '%(count)s Attempts Remaining',
	},
	unlimitedAttempts: 'Unlimited Attempts Remaining',
});

export default class AssignmentSubmissionStateAttempts extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		historyItem: PropTypes.object,
		onTryAgain: PropTypes.func,
	};

	onTryAgain = () => {
		const { onTryAgain } = this.props;

		if (onTryAgain) {
			onTryAgain();
		}
	};

	render() {
		const { assignment, historyItem } = this.props;
		const hasBeenSubmitted = historyItem && historyItem.isSubmitted();

		if (!assignment.hasLink('Commence') || !hasBeenSubmitted) {
			return null;
		}

		const { maxSubmissions, submissionCount } = assignment;

		return (
			<div className="assignment-navigation-bar-status-submission-attempt">
				<Button rounded onClick={this.onTryAgain}>
					{t('tryAgain')}
				</Button>
				<span className="remaining">
					{maxSubmissions < 0
						? t('unlimitedAttempts')
						: t('remainingAttempts', {
								count: maxSubmissions - submissionCount,
						  })}
				</span>
			</div>
		);
	}
}
