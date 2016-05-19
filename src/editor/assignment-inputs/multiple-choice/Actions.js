import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';
import {SAVING, SAVE_ENDED, PART_UPDATED, PART_ERROR} from '../../Constants';

const logger = Logger.get('assignment-question:multichoicepart');

function choicesEqual (choicesA, choicesB) {
	if (choicesA.length !== choicesB.length) {
		return false;
	}

	for (let i = 0; i < choicesA.length; i++) {
		if (choicesA[i] !== choicesB[i]) {
			return false;
		}
	}

	return true;
}


function generateSolutionFor (value) {
	return {
		MimeType: 'application/vnd.nextthought.assessment.multiplechoicesolution',
		value: value
	};
}

export function savePart (part, choices, solution) {
	const oldChoices = part.choices;
	const oldSolutions = part.solutions;
	const oldSolution = oldSolutions[0];
	let values = {};

	if (!choicesEqual(choices, oldChoices)) {
		values.choices = choices;
	}

	if (oldSolution.value !== solution) {
		values.solutions = [generateSolutionFor(solution)];
	}

	if (!values.choices && !values.solutions) { return; }

	dispatch(SAVING, part);

	part.save(values)
		.then(() => {
			dispatch(SAVE_ENDED);
			dispatch(PART_UPDATED, part);
		})
		.catch((reason) => {
			logger.error('Failed to update part: ', reason);
			dispatch(SAVE_ENDED);
			dispatch(PART_ERROR, reason);
		});
}
