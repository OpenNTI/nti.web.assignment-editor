import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	notShared: 'Add to Lesson'
};

const t = scoped('AssignmentSharing', DEFAULT_TEXT);

AssignmentSharing.propTypes = {
	assignment: React.PropTypes.object,
	course: React.PropTypes.object
};
export default function AssignmentSharing ({assignment, course}) {

	return (
		<div className="assignment-sharing">
			<i className="icon-folder" />
			<span>{t('notShared')}</span>
		</div>
	);
}
