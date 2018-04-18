import {dispatch} from '@nti/lib-dispatcher';

import {
	SAVING,
	SAVE_ENDED,
	ASSIGNMENT_UPDATED,
	ASSIGNMENT_ERROR,
	ASSIGNMENT_WARNING,
} from '../Constants';

export function warnIfDiscussionEmpty (assignment) {
	const {discussion_ntiid:discussionID} = assignment;

	if (!assignment.isSaving && !discussionID) {
		dispatch(ASSIGNMENT_WARNING, {
			NTIID: assignment.NTIID,
			field: 'discussion_ntiid',
			reason: {
				message: 'Discussion cannot be blank.'
			}
		});
	}
}


export function setDiscussionOnAssignment (discussionID, assignment) {
	const {'discussion_ntiid':current} = assignment;

	if (current === discussionID) {
		return Promise.resolve();
	}

	dispatch(SAVING, assignment);

	return assignment.setDiscussionID(discussionID)
		.then(() => {
			dispatch(ASSIGNMENT_UPDATED, assignment);
			warnIfDiscussionEmpty(assignment);
			dispatch(SAVE_ENDED);
		}).catch((reason) => {
			dispatch(ASSIGNMENT_ERROR, {
				NTIID: assignment.NTIID,
				field: 'discussion_ntiid',
				reason
			});

			dispatch(SAVE_ENDED, assignment);

			return Promise.reject(reason);
		});
}
