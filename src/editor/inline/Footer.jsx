import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const DEFAULT_TEXT = {
	save: 'Save',
	cancel: 'Cancel'
};
const t = scoped('course.overview.lesson.items.questionset.editor.Footer', DEFAULT_TEXT);

export default class AssignmentEditorFooter extends React.Component {
	static propTypes = {
		onSave: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired
	}

	state = {}


	render () {
		return (
			<div className="footer">
				<div className="save" onClick={this.props.onSave}>{t('save')}</div>
				<div className="cancel" onClick={this.props.onCancel}>{t('cancel')}</div>
			</div>
		);
	}
}
