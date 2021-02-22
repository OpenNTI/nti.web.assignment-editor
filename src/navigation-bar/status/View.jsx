import React from 'react';
import PropTypes from 'prop-types';

import AssignmentStatus from './AssignmentStatus';
import SubmissionStatus from './SubmissionStatus';

export default class AssignmentNavigationBarStatus extends React.PureComponent {
	static propTypes = {
		assignment: PropTypes.object,
		historyItem: PropTypes.object,
	};

	render() {
		const { assignment, historyItem } = this.props;

		if (!assignment && !historyItem) {
			return null;
		}

		return (
			<div className="assignment-navigation-bar-status">
				{assignment && <AssignmentStatus {...this.props} />}
				{assignment && <SubmissionStatus {...this.props} />}
			</div>
		);
	}
}
