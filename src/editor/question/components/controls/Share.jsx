import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Associations} from 'nti-web-commons';

const {createInterfaceForItem, openEditorModal} = Associations;

const AssignmentType = 'application/vnd.nextthought.assessment.assignment';

const DEFAULT_TEXT = {
	shareWith: 'Share with Other Assignments',
	modalLabel: 'Add to Assignment',
	noActiveLessons: 'Add to Assignment',
	availableLabel: 'Available Assignments',
	noShared: {
		subHeader: 'Add to a Assignment.'
	}
};

const t = scoped('QUESTION_SHARING_CONTROL', DEFAULT_TEXT);

export default class ShareControl extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	}


	onClick = () => {
		const {question, course} = this.props;
		const associations = createInterfaceForItem(question, course, [AssignmentType]);

		openEditorModal(t('modalLabel'), associations, null, t);
	}


	render () {
		return (
			<span className="share-control-list-item" onClick={this.onClick}>{t('shareWith')}</span>
		);
	}
}
