
import { ConflictResolution, Prompt } from '@nti/web-commons';
import { wait } from '@nti/lib-commons';

import Store from '../Store';

const { DefaultConfirmPrompt } = ConflictResolution;

export default function handleUngradableInAutoGradeAssignment(challenge) {
	if (challenge.code !== 'UngradableInAutoGradeAssignment') {
		return void 0;
	}

	const { assignment } = Store;

	const refresh = () =>
		assignment &&
		assignment.refresh().then(() => assignment.onChange('refreshed'));

	return new Promise((confirm, reject) => {
		Prompt.modal(
			<DefaultConfirmPrompt
				challenge={challenge}
				onConfirm={confirm}
				onCancel={reject}
			/>,
			'request-conflict-resolver'
		);
	})
		.then(() => challenge.confirm())
		.then(refresh)
		.catch(async reason => {
			if (assignment) {
				await wait.on(refresh());
				challenge.reject();
				throw reason;
			}
		});
}
