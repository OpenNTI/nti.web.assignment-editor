import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	resetLabel: 'Students have started your assignment.',
	resetDesc: 'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.',
	resetAssignment: 'Reset Assignment'
};
const t = scoped('course.overview.lesson.items.questionset.editor.Reset', DEFAULT_TEXT);

export default class AssignmentEditorReset extends React.Component {
	static propTypes = {
		onReset: PropTypes.func.isRequired
	}

	state = {}


	render () {
		return (
			<div className="inline-reset-menu">
				<div className="reset">
					<div className="nti-checkbox">
						<span className="publish-reset-label">{t('resetLabel')}</span>
						<span className="publish-reset-text">{t('resetDesc')}</span>
						<div className="publish-reset" onClick={this.props.onReset}>{t('resetAssignment')}</div>
					</div>
				</div>
			</div>
		);
	}
}
