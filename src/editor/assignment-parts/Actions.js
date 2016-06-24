import {dispatch} from 'nti-lib-dispatcher';
import {getService} from  'nti-web-client';
import Logger from 'nti-util-logger';

import {saveFieldOn} from '../Actions';
import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';
import OrderedContents from '../utils/OrderedContents';

const logger = Logger.get('assignment-questionset:Actions');

const QUESTIONS_KEY = 'questions';
const QUESTION_SET_KEY = 'question_set';
const PARTS_KEY = 'parts';

const blankAssignmentPart = {
	'Class': 'AssignmentPart',
	'MimeType': 'application/vnd.nextthought.assessment.assignmentpart'
};

const blankQuestionSet = {
	'Class': 'QuestionSet',
	'MimeType': 'application/vnd.nextthought.naquestionset'
};


function buildPartWithQuestion (questionData) {
	return getService()
		.then((service) => {
			const part = service.getObjectPlaceholder({...blankAssignmentPart});
			const questionSet = service.getObjectPlaceholder({...blankQuestionSet});
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


export function createPartWithQuestion (assignment, question) {
	buildPartWithQuestion(question)
		.then((part) => {
			assignment.parts = assignment.parts || [];
			assignment.parts.push(part);

			assignment.onChange();

			const save = saveFieldOn(assignment, PARTS_KEY, [part]);

			if (save && save.then) {
				save.catch((reason) => {
					assignment.parts = assignment.parts.map(p => setErrorOnPlaceholderPart(p, reason));

					assignment.onChange();
				});
			}
		});
}


export function removePartWithQuestionSet (assignment, questionSet) {
	let {[PARTS_KEY]:parts} = assignment;

	parts = parts.filter(part => part[QUESTION_SET_KEY].NTIID !== questionSet.NTIID);

	saveFieldOn(assignment, PARTS_KEY, parts);
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
			.then(() => {
				dispatch(SAVE_ENDED);
				dispatch(QUESTION_SET_UPDATED, questionSet);
			})
			.catch((reason) => {
				logger.error('Unable to move question: ', reason);
				dispatch(QUESTION_SET_ERROR, reason);
			});
	}
}
