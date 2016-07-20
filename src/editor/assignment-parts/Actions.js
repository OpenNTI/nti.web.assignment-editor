import {dispatch} from 'nti-lib-dispatcher';
import {getService} from  'nti-web-client';
import Logger from 'nti-util-logger';
import {isNTIID} from 'nti-lib-ntiids';

import OrderedContents from '../../ordered-contents';
import {cloneQuestion} from '../assignment-question/utils';

import {saveFieldOn, maybeResetAssignmentOnError} from '../Actions';
import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';

import {cloneQuestionSet} from './utils';

const logger = Logger.get('lib:asssignment-editor:assignment-parts:Actions');

const QUESTIONS_KEY = 'questions';
const QUESTION_SET_KEY = 'question_set';
const PARTS_KEY = 'parts';

const blankAssignmentPart = {
	'Class': 'AssignmentPart',
	'MimeType': 'application/vnd.nextthought.assessment.assignmentpart',
	getQuestions () {
		return this[QUESTION_SET_KEY];
	}
};

const blankQuestionSet = {
	'Class': 'QuestionSet',
	'MimeType': 'application/vnd.nextthought.naquestionset',
	getQuestions () {
		return this[QUESTIONS_KEY] || [];
	}
};


function buildPartWithQuestion (questionData, oldQuestionSet) {
	return getService()
		.then((service) => {
			const part = service.getObjectPlaceholder({...blankAssignmentPart});
			const questionSet = service.getObjectPlaceholder(oldQuestionSet ? cloneQuestionSet(oldQuestionSet) : {...blankQuestionSet});
			const question = service.getObjectPlaceholder({...questionData});

			part.isSaving = true;
			questionSet.isSaving = true;
			question.isSaving = true;

			questionSet[QUESTIONS_KEY] = questionSet[QUESTIONS_KEY] || [];

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
	const questions = questionSet[QUESTIONS_KEY];
	const questionsData = questions.map((x) => {
		if (isNTIID(x.NTIID)) {
			return x.NTIID;
		}

		return cloneQuestion(x);
	});

	questionSet[QUESTIONS_KEY] = questionsData;
	part[QUESTION_SET_KEY] = questionSet;

	return part;
}


export function createPartWithQuestion (assignment, question, questionSet) {
	buildPartWithQuestion(question, questionSet)
		.then((part) => {
			assignment.parts = assignment.parts || [];
			assignment.parts.push(part);

			assignment.onChange();

			const save = saveFieldOn(assignment, PARTS_KEY, [getSaveDataForFakePart(part)]);

			if (save && save.then) {
				save
					.catch((reason) => {
						assignment.parts = assignment.parts.map(p => setErrorOnPlaceholderPart(p, reason));

						assignment.onChange();
					});
			}
		});
}


export function removePartWithQuestionSet (assignment, questionSet) {
	function deleteQuestionSet () {
		questionSet.delete();
	}


	let {[PARTS_KEY]:parts} = assignment;

	parts = parts.filter(part => part[QUESTION_SET_KEY].NTIID !== questionSet.NTIID);

	const save = saveFieldOn(assignment, PARTS_KEY, parts);
	const {questions} = questionSet;

	if (save && save.then) {
		save.then(deleteQuestionSet);
	} else {
		deleteQuestionSet();
	}

	//If there was only one question left, return an undo method
	if (questions.length === 1) {
		return Promise.resolve(() => {
			createPartWithQuestion(assignment, questions[0], questionSet);
		});
	}

	return Promise.resolve();
}


export function moveQuestion (question, questionSet, index, moveInfo, moveRoot) {
	let orderedContents = questionSet && new OrderedContents(questionSet);
	let {index:oldIndex, container:oldContainer} = moveInfo;

	if (!orderedContents || !moveRoot) {
		logger.error('Invalid ordered contents');

		dispatch(QUESTION_SET_ERROR, 'Invalid ordered contents');
	} else {
		dispatch(SAVING, questionSet);

		orderedContents.move(question, index, oldIndex, oldContainer, moveRoot)
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
