import {dispatch} from '@nti/lib-dispatcher';
import {getService} from  '@nti/web-client';
import Logger from '@nti/util-logger';
import {isNTIID} from '@nti/lib-ntiids';
import {Authoring} from '@nti/lib-interfaces';

import {cloneQuestion} from '../question/utils';
import {saveFieldOn, maybeResetAssignmentOnError} from '../Actions';
import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';


const logger = Logger.get('lib:asssignment-editor:assignment-parts:Actions');

const QUESTIONS_KEY = 'questions';
const QUESTION_SET_KEY = 'question_set';
const PARTS_KEY = 'parts';

const blankAssignmentPart = {
	'Class': 'AssignmentPart',
	'MimeType': 'application/vnd.nextthought.assessment.assignmentpart',
	[QUESTION_SET_KEY]: [],
	getQuestions () {
		return this[QUESTION_SET_KEY];
	}
};

const blankQuestionSet = {
	'Class': 'QuestionSet',
	'MimeType': 'application/vnd.nextthought.naquestionset',
	[QUESTIONS_KEY]: [],
	getQuestions () {
		return this[QUESTIONS_KEY] || [];
	}
};


function getQuestionSetData (questionSet) {
	if (!questionSet) { return {...blankQuestionSet}; }

	const {NTIID} = questionSet;

	return {
		actualNTIID: NTIID
	};

}


function buildPartWithQuestion (questionData, existingQuestionSet) {
	return getService()
		.then((service) => {
			const part = service.getObjectPlaceholder({...blankAssignmentPart});
			const questionSet = service.getObjectPlaceholder(getQuestionSetData(existingQuestionSet));
			const question = service.getObjectPlaceholder({...questionData});

			part.isSaving = true;
			questionSet.isSaving = true;
			question.isSaving = true;

			questionSet[QUESTIONS_KEY] = [];

			questionSet[QUESTIONS_KEY].push(question);

			part[QUESTION_SET_KEY] = questionSet;

			return part;
		});
}


function setErrorOnPlaceholderPart (part, reason) {
	if (!part || !part.isPlaceholder) { return part; }

	part.error = reason;

	const questionSet = part[QUESTION_SET_KEY];

	if (questionSet.isPlaceholder) {
		questionSet.error = reason;
	}

	const questions = questionSet[QUESTIONS_KEY];

	questionSet[QUESTIONS_KEY] = questions.map((question) => {
		if (question.isPlaceholder) {
			question.error = reason;
		}
	});

	return part;
}


function getSaveDataForFakePart (part) {

	const questionSet = part[QUESTION_SET_KEY];
	const questions = questionSet[QUESTIONS_KEY] || [];
	const questionsData = questions.map((x) => {
		if (isNTIID(x.NTIID)) {
			return x.NTIID;
		}

		return cloneQuestion(x);
	});

	if (questionSet.actualNTIID) {
		part[QUESTION_SET_KEY] = questionSet.actualNTIID;
	} else {
		questionSet[QUESTIONS_KEY] = questionsData;
		part[QUESTION_SET_KEY] = questionSet;
	}

	return part;
}


function markPartForDelaySaving (part, save, remove) {
	const questionSet = part[QUESTION_SET_KEY];
	const questions = questionSet[QUESTIONS_KEY] || [];

	questionSet[QUESTIONS_KEY] = questions.map((question) => {
		if (question.isPlaceholder) {
			Object.defineProperty(question, 'delaySaving', {
				configurable: true,
				enumerable: false,
				value: true
			});

			question.save = (data) => {
				Object.assign(question, data);

				return save(part);
			};

			question.remove = remove;

			return question;
		}
	});
}


function addPartToAssignment (part, assignment, delaySave) {
	function doSave (placeholder) {
		const save = saveFieldOn(assignment, PARTS_KEY, [getSaveDataForFakePart(placeholder)]);

		if (save && save.then) {
			save
				.catch((reason) => {
					assignment.parts = assignment.parts.map(p => setErrorOnPlaceholderPart(p, reason));

					assignment.onChange();
				});

			return save;
		}

		return Promise.resolve();
	}

	function remove () {
		assignment.parts = assignment.parts.filter(p => p !== part);

		assignment.onChange();
	}

	if (delaySave) {
		markPartForDelaySaving(part, doSave, remove);
	}

	assignment.parts = assignment.parts || [];
	assignment.parts.push(part);

	assignment.onChange();

	if (!delaySave) {
		doSave(part);
	}

	return;
}



export function createPartWithQuestion (assignment, question, questionSet, delaySave) {
	buildPartWithQuestion(question, questionSet)
		.then((part) => addPartToAssignment(part, assignment, delaySave));
}


export function removePartWithQuestionSet (assignment, questionSet) {
	function deleteQuestionSet () {
		questionSet.delete();
	}


	let {[PARTS_KEY]:parts} = assignment;

	parts = parts.filter(part => part[QUESTION_SET_KEY].NTIID !== questionSet.NTIID);

	const save = saveFieldOn(assignment, PARTS_KEY, parts);
	const {questions} = questionSet;

	//If there was only one question left, return an undo method
	if (questions.length === 1) {
		return Promise.resolve({
			undo: () => {
				createPartWithQuestion(assignment, questions[0], questionSet);
			},
			cleanup: () => {
				deleteQuestionSet();
			}
		});
	} else if (save.then) {
		save.then(() => deleteQuestionSet());
	} else {
		deleteQuestionSet();
	}

	return Promise.resolve();
}


export function moveQuestion (question, questionSet, index, moveInfo, moveRoot, delaySave) {
	let orderedContents = questionSet && new Authoring.OrderedContents(questionSet);
	let {index:oldIndex, container:oldContainer} = moveInfo;

	if (!orderedContents || !moveRoot) {
		logger.error('Invalid ordered contents');

		dispatch(QUESTION_SET_ERROR, 'Invalid ordered contents');
	} else {
		dispatch(SAVING, questionSet);

		orderedContents.move(question, index, oldIndex, oldContainer, moveRoot, delaySave)
			.catch(maybeResetAssignmentOnError(questionSet))
			.then(() => {
				dispatch(QUESTION_SET_UPDATED, questionSet);
				dispatch(SAVE_ENDED);
			})
			.catch((reason) => {
				logger.error('Unable to move question: ', reason);
				dispatch(QUESTION_SET_ERROR, reason);
				dispatch(SAVE_ENDED);
			});
	}
}
