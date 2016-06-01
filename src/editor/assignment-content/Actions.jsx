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
			dispatch(ASSIGNMENT_ERROR, reason);
		});
	}
}

export function saveTitle (assignment, value) {
	saveField(assignment, 'title', value);
}


export function saveDescription (assignment, value) {
	saveField(assignment, 'content', value);
}
