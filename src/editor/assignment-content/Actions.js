import {dispatch} from 'nti-lib-dispatcher';
import {scoped} from 'nti-lib-locale';

import {saveFieldOn} from '../Actions';
import {ASSIGNMENT_UPDATED, ASSIGNMENT_ERROR, ASSIGNMENT_WARNING} from '../Constants';

const defaultText = {
	titleLabel: 'Title',
	contentLabel: 'Description',
	tooLong: 'The assignment title is limited to %(max)s characters.',
	tooShort: 'The assignment title is empty.'
};
const t = scoped('ASSIGNMENT_CONTENT', defaultText);

function saveField (assignment, field, value, label) {
	const save = saveFieldOn(assignment, field, value);

	if (save && save.then) {
		save.then(() => {
			dispatch(ASSIGNMENT_UPDATED, assignment);
		})
		.catch((reason) => {
			dispatch(ASSIGNMENT_ERROR, {
				NTIID: assignment.NTIID,
				field: field,
				label: label,
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
			label: t('titleLabel'),
			reason: {
				message: t('tooLong', {max: maxLength}),
				doNotShow: true
			}
		});
	} else {
		if (value.length === 0) {
			dispatch(ASSIGNMENT_WARNING, {
				NTIID: assignment.NTIID,
				field: 'title',
				label: t('titleLabel'),
				reason: {
					message: t('tooShort'),
					doNotShow: true
				}
			});
		}
		saveField(assignment, 'title', value, t('titleLabel'));
	}
}


export function saveContent (assignment, value) {
	saveField(assignment, 'content', value, t('contentLabel'));
}
