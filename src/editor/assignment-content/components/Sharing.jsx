import React from 'react';
import {Associations} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';


const {createGroupedInterfaceForItem, openEditorModal} = Associations;

const DEFAULT_TEXT = {
	noActiveLessons: 'Add to Lesson',
	modalLabel: 'Add to Lesson',
	availableLabel: 'Available Lessons',
	noShared: {
		subHeader: 'Add to a Lesson.'
	}
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
		return (
			<div className="assignment-sharing" onClick={this.onClick}>
				<i className="icon-folder" />
				<span>{t('noActiveLessons')}</span>
			</div>
		);
	}
}
