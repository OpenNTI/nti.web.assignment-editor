import React from 'react';
import {ControlBar, Button, DisplayName} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	preview: 'You\'re currently previewing this assignment.',
	submission: 'You\'re currently viewing %(name)s\'s submission',
	button: 'Start Editing'
};

const t = scoped('ASSIGNMENT_CONTROL_BAR', DEFAULT_TEXT);

function getSubmissionText (data) {
	return t('submission', data);
}

export default class AssignmentControlBar extends React.Component {
	static propTypes = {
		doEdit: React.PropTypes.func,
		student: React.PropTypes.object
	}


	onClick = (e) => {
		const {doEdit} = this.props;

		e.preventDefault();
		e.stopPropagation();

		if (doEdit) {
			doEdit();
		}
	}


	render () {
		const {student} = this.props;

		return (
			<ControlBar visible>
				<div className="assignment-control-bar">
					<div className="message">
						<i className="icon-view" />
						{
							student ?
								(<DisplayName tag="span" entity={student} localeKey={getSubmissionText} />) :
								(<span>{t('message')}</span>)
						}
					</div>
					<Button rounded onClick={this.onClick} href="./edit">{t('button')}</Button>
				</div>
			</ControlBar>
		);
	}
}
