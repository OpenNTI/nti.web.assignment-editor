import React from 'react';
import {ConflictResolution, Prompt} from 'nti-web-commons';
import {wait} from 'nti-commons';

import Store from '../Store';

const {DefaultConfirmPrompt} = ConflictResolution;

export default function handleUngradableInAutoGradeAssignment (challenge) {

	if (challenge.code !== 'UngradableInAutoGradeAssignment') {
		return void 0;
	}

	const {assignment} = Store;

	const refresh = () => assignment && assignment.refresh().then(() => assignment.onChange('refreshed'));

	return new Promise((confirm, reject) => {

		const onCancel = () => assignment && wait.on(refresh())
			.then(() => (challenge.reject(), reject()));

		Prompt.modal(
			<DefaultConfirmPrompt challenge={challenge} onConfirm={confirm} onCancel={onCancel}/>,
			'request-conflict-resolver'
		);
	})
		.then(() => challenge.confirm())
		.then(refresh);
}
