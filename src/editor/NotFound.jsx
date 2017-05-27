import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {ResourceNotFound} from 'nti-web-commons';

const DEFAULT_TEXT = {
	gotoAssignments: 'Back to Assignments'
};

const t = scoped('ASSIGNMENT_NOT_FOUND', DEFAULT_TEXT);

AssignmentNotFound.propTypes = {
	gotoRoot: PropTypes.func
};
export default function AssignmentNotFound ({gotoRoot}) {
	const actions = [];

	if (gotoRoot) {
		actions.push({
			label: t('gotoAssignments'),
			handler: gotoRoot
		});
	}

	return (<ResourceNotFound actions={actions} />);
}
