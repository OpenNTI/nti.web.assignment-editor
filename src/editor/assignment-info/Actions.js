import {dispatch} from 'nti-lib-dispatcher';
import {SAVING, ASSIGNMENT_UPDATED, ASSIGNMENT_ERROR} from '../Constants';

export function saveFieldOnAssignment (assignment, field, newValue) {
	const oldValue = assignment[field];

	if (oldValue === newValue) { return; }

	const values = {};

	values[field] = newValue;

	dispatch(SAVING, assignment);
	assignment.save(values)
		.then(() => {
			dispatch(ASSIGNMENT_UPDATED, assignment);
		})
		.catch((reason) => {
			dispatch(ASSIGNMENT_ERROR, reason);
		});
}
