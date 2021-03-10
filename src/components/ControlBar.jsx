import './ControlBar.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { ControlBar, Button, DisplayName } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	preview: "You're currently previewing this assignment.",
	submission: "You're currently viewing %(name)s's submission",
	button: 'Start Editing',
};

const t = scoped('assignment.editing.controls.bar', DEFAULT_TEXT);

const getSubmissionText = data => t('submission', data);

export default class AssignmentControlBar extends React.Component {
	static propTypes = {
		doEdit: PropTypes.func,
		student: PropTypes.object,
	};

	onClick = e => {
		const { doEdit } = this.props;

		e.preventDefault();
		e.stopPropagation();

		if (doEdit) {
			doEdit();
		}
	};

	render() {
		const { student } = this.props;

		return (
			<ControlBar visible className="assignment-control-bar-container">
				<div className="assignment-control-bar">
					<div className="message">
						<i className="icon-view" />
						{student ? (
							<DisplayName
								tag="span"
								entity={student}
								localeKey={getSubmissionText}
							/>
						) : (
							<span>{t('preview')}</span>
						)}
					</div>
					<Button rounded onClick={this.onClick} href="./edit">
						{t('button')}
					</Button>
				</div>
			</ControlBar>
		);
	}
}
