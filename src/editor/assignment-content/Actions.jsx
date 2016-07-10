import {dispatch} from 'nti-lib-dispatcher';
import {saveFieldOn} from '../Actions';
import {ASSIGNMENT_UPDATED, ASSIGNMENT_ERROR} from '../Constants';

function saveField (assignment, field, value) {
	const save = saveFieldOn(assignment, field, value);

	if (save && save.then) {
		save.then(() => {
			dispatch(ASSIGNMENT_UPDATED, assignment);
		})
		.catch((reason) => {
			dispatch(ASSIGNMENT_ERROR, {
				NTIID: assignment.NTIID,
				field: field,
				reason: reason
			});
		});
	}
}

export function saveTitle (assignment, value, maxLength) {
	if (value.length > maxLength) {
		dispatch(ASSIGNMENT_ERROR, {
			NTIID: assignment.NTIID,
			field: 'title',
			reason: {
				message: 'Title is too long',
				doNotShow: true
			}
		});
	} else {
		saveField(assignment, 'title', value);
	}
}


export function saveContent (assignment, value) {
	saveField(assignment, 'content', value);
}
