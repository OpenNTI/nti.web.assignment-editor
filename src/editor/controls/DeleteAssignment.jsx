import React from 'react';

import {deleteAssignment} from './Actions';

export default class DeleteAssignment extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.string
	}

	onDeleteClick = () => {
		const {assignment} = this.props;
		if (assignment) {
			deleteAssignment(assignment);
		}
	}

	render () {
		const {assignment} = this.props;
		const canDelete = assignment && assignment.hasLink('edit');
		return !canDelete ? null : (
			<div onClick={this.onDeleteClick} className="delete-assignment"><i className="icon-delete small"/>Delete</div>
		);
	}
}
