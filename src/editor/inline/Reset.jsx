import './Reset.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	resetLabel: 'Students have started your assignment.',
	resetDesc:
		'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.',
	resetAssignment: 'Reset Assignment',
	nonInstructorLabel: 'Students have started this assignment.',
	nonInstructorDesc:
		'The instructor must reset this assignment before a publish change can occur.',
};
const t = scoped(
	'course.overview.lesson.items.questionset.editor.Reset',
	DEFAULT_TEXT
);

export default class AssignmentEditorReset extends React.Component {
	static propTypes = {
		onReset: PropTypes.func.isRequired,
		nonInstructorAdmin: PropTypes.bool,
	};

	render() {
		const { nonInstructorAdmin } = this.props;

		// if nonInstructorAdmin, they should see a message indicating assignment has been started, but don't show reset button
		return (
			<div className="inline-reset-menu">
				<div className="reset">
					<div className="nti-checkbox">
						<span className="publish-reset-label">
							{nonInstructorAdmin
								? t('nonInstructorLabel')
								: t('resetLabel')}
						</span>
						<span className="publish-reset-text">
							{nonInstructorAdmin
								? t('nonInstructorDesc')
								: t('resetDesc')}
						</span>
						{!nonInstructorAdmin && (
							<div
								className="publish-reset"
								onClick={this.props.onReset}
							>
								{t('resetAssignment')}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
