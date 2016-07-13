import {dispatch} from 'nti-lib-dispatcher';
import {scoped} from 'nti-lib-locale';

import {saveFieldOn} from '../Actions';
import {ASSIGNMENT_UPDATED, ASSIGNMENT_ERROR} from '../Constants';

const defaultText = {
	titleLabel: 'Title',
	contentLabel: 'Description',
	tooLong: 'Is limited to %(max)s characters.'
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
		saveField(assignment, 'title', value, t('titleLabel'));
	}
}


export function saveContent (assignment, value) {
	saveField(assignment, 'content', value, t('contentLabel'));
}
