import React from 'react';
import {ConflictResolution, Prompt} from 'nti-web-commons';

import Store from '../Store';

const {DefaultConfirmPrompt} = ConflictResolution;

export default function handleUngradableInAutoGradeAssignment (challenge) {

	if (challenge.code !== 'UngradableInAutoGradeAssignment') {
		return void 0;
	}

	const {assignment} = Store;

	return new Promise((confirm, reject) => {
		const onCancel = () => (challenge.reject(), reject());
		Prompt.modal(
			<DefaultConfirmPrompt challenge={challenge} onConfirm={confirm} onCancel={onCancel}/>,
			'request-conflict-resolver'
		);
	})
		.then(() => challenge.confirm())
		.then(() => assignment && assignment.refresh())
		.then(() => assignment && assignment.onChange('refreshed'));
}
