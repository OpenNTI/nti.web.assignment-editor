import {dispatch} from 'nti-lib-dispatcher';
import {scoped} from 'nti-lib-locale';
import {Prompt} from 'nti-web-commons';
import minWait from 'nti-commons/lib/wait-min';

const SHORT = 3000;

const DEFAULT_TEXT = {
	deleteWarning: 'Deleting this assignment will remove it, all student progress, and all submissions.'
};

const t = scoped('AssignmentEditingControls', DEFAULT_TEXT);


import {ASSIGNMENT_ERROR, ASSIGNMENT_DELETING, ASSIGNMENT_DELETED} from '../Constants';


export function deleteAssignment (assignment) {
	Prompt.areYouSure(t('deleteWarning'))
			.then(() => {
				dispatch(ASSIGNMENT_DELETING, true);
				assignment.delete()
					.then(minWait(SHORT))
					.then(() => {
						dispatch(ASSIGNMENT_DELETED);
					})
					.catch((reason) => {
						dispatch(ASSIGNMENT_ERROR, reason);
						dispatch(ASSIGNMENT_DELETING, false);
					});
			});
}
