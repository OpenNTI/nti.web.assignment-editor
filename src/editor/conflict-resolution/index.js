import { ConflictResolution } from '@nti/web-commons';

import handleUngradableInAutoGradeAssignment from './handleUngradableInAutoGradeAssignment';

export function register() {
	ConflictResolution.registerHandler(
		'UngradableInAutoGradeAssignment',
		handleUngradableInAutoGradeAssignment
	);
}

export function unregister() {
	ConflictResolution.registerHandler(
		'UngradableInAutoGradeAssignment',
		handleUngradableInAutoGradeAssignment
	);
}
