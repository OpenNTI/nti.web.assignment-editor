import React from 'react';
import {Prompt} from 'nti-web-commons';

import Store from '../../Store';

import {revertAllErrors} from './Actions';
import Issues from './components/Issues';

const {modal} = Prompt;

export function hasStateMovedForward (assignment, newState) {
	const published = assignment.isPublished();
	const available = assignment.getAvailableForSubmissionBeginning();
	const now = new Date();

	let movedForward = false;

	if (!published && newState) {
		movedForward = true;
	} else if (published && available > now && newState === true) {
		movedForward = true;
	}

	return movedForward;
}

export function allowPublish (assignment, newState) {
	const {errors, warnings} = Store;
	const emptyFunction = () => {};
	let {onDismiss} = Store;
	if (!onDismiss) {
		onDismiss = emptyFunction;
	}

	let allow;
	//If the publication state hasn't "moved forward"
	//we don't need to alert about any errors
	if (!hasStateMovedForward(assignment, newState)) {
		allow = Promise.resolve();
	} else if (!errors.length && !warnings.length) {
		allow = Promise.resolve();
	} else {
		allow = new Promise((fulfill, reject) => {
			modal(
				<Issues errors={errors} warnings={warnings} confirm={fulfill} reject={reject} onDismiss={onDismiss}/>,
				'assignment-publish-confirmation-prompt'
			);
		}).then(() => {
			revertAllErrors();
		});
	}

	return allow;
}
