import React from 'react';
import {Associations} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const {createGroupedInterfaceForItem, openEditorModal, Display} = Associations;

const DEFAULT_TEXT = {
	empty: 'Add to Lesson',
	loading: {
		one: 'Shared with %(count)s Lesson...',
		other: 'Shared with %(count)s Lessons...'
	},
	modalLabel: 'Add to Lesson',
	availableLabel: 'Available Lessons',
	noShared: {
		subHeader: 'Add to a Lesson.'
	},
	remaining: {
		one: '%(count)s Other Lesson',
		other: '%(count)s Other Lessons'
	},
	label: {
		//This makes use of the pluralization of the count of list items to get the appropriate commas or not
		remaining: {
			one: 'Shared with {list} and {remaining}',
			other: 'Shared with {list}, and {remaining}'
		},
		single: 'Shared with {list}'
	},
};

const t = scoped('AssignmentSharing', DEFAULT_TEXT);

export default class AssignmentSharing extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onClick = () => {
		const {assignment, course} = this.props;
		const associations = createGroupedInterfaceForItem(assignment, course);

		openEditorModal(t('modalLabel'), associations, null, t);
	}


	render () {
		const {assignment, course} = this.props;

		return (
			<div className="assignment-sharing" onClick={this.onClick}>
				<i className="icon-folder" />
				<Display.Inline item={assignment} scope={course} getString={t} />
			</div>
		);
	}
}
