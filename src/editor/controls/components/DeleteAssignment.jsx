import './DeleteAssignment.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import { deleteAssignment } from '../../Actions';

const DEFAULT_TEXT = {
	deleteWarning:
		'Deleting this assignment will remove it, all student progress, and all submissions.',
};

const t = scoped('assignment.editing.controls', DEFAULT_TEXT);

export default class DeleteAssignment extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
	};

	onDeleteClick = () => {
		const { assignment } = this.props;
		if (assignment) {
			deleteAssignment(assignment, t('deleteWarning'));
		}
	};

	render() {
		const { assignment } = this.props;
		const canDelete = assignment && assignment.hasLink('Delete');
		return !canDelete ? null : (
			<div onClick={this.onDeleteClick} className="delete-assignment">
				<i className="icon-delete small" />
				Delete
			</div>
		);
	}
}
