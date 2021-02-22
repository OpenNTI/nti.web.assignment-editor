import './Background.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import getStateRenderer from './get-state-renderer';

const STATES = [
	{
		render: () => 'green',
		case: assignment => {
			const { CompletedItem, passingScore } = assignment;

			return CompletedItem && passingScore && CompletedItem.Success;
		},
	},
	{
		render: () => 'red',
		cases: [
			assignment => {
				const { CompletedItem, passingScore } = assignment;

				return CompletedItem && passingScore && !CompletedItem.Success;
			},
			(assignment, historyItem) => {
				const now = new Date();
				const due = assignment.getDueDate();
				const hasSubmission = historyItem && historyItem.isSubmitted();

				return !hasSubmission && due && now > due;
			},
		],
	},
];

export default class AssignmentSubmissionGradient extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		assignment: PropTypes.object,
		historyItem: PropTypes.object,
		children: PropTypes.any,
	};

	render() {
		const { className, assignment, historyItem, children } = this.props;
		const render = getStateRenderer(STATES, assignment, historyItem);
		const extraClass = render ? render() : '';

		return (
			<div
				className={cx(
					className,
					'assignment-navigation-bar-submission-gradient',
					extraClass
				)}
			>
				{children}
			</div>
		);
	}
}
