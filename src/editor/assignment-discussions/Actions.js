import {dispatch} from 'nti-lib-dispatcher';
import {
	SAVING,
	SAVE_ENDED,
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
