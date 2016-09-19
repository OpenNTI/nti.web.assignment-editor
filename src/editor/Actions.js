import {dispatch} from 'nti-lib-dispatcher';
import {getService} from  'nti-web-client';
import Logger from 'nti-util-logger';

import {SAVE, EVENT_FINISH} from 'nti-lib-interfaces';

import {
	ASSIGNMENT_ERROR,
	ASSIGNMENT_DELETING,
	ASSIGNMENT_DELETED,
	FREE,
	LOADING,
	LOADED,
	LOADED_COURSE,
	LOADED_SCHEMA,
	REVERT_ERRORS,
	SAVING,
	SAVE_ENDED
} from './Constants';

import {Prompt} from 'nti-web-commons';
import {wait} from 'nti-commons';

const SHORT = 3000;


const logger = Logger.get('lib:asssignment-editor:Actions');
const defaultSchema = {};


export function freeAssignment (assignment) {
	dispatch(FREE);
	assignment.removeListener(EVENT_FINISH, onAssignmentSaved);
}


export function loadAssignmentWithCourse (assignmentId, courseId) {
	dispatch(LOADING);

	return getService()
		.then(service =>
			courseId
				? service.getObject(courseId)
					.then(course => (
						dispatch(LOADED_COURSE, course),
						course.getAssignment(assignmentId)
						)
					)
				: service.getObject(assignmentId)
		)
		.then(assignment => {
			assignment.addListener(EVENT_FINISH, onAssignmentSaved);
			dispatch(LOADED, assignment);
			loadSchema(assignment);
		})
		.catch(reason => {
			//TODO: HANDLE THE ERROR CASE
			dispatch(LOADED, reason instanceof Error ? reason : new Error(reason));
		});
}


export function loadAssignment (ntiid, course) {
	dispatch(LOADING);

	const fetch = course
		? course.getAssignment(ntiid)
		: getService().then(service => service.getObject(ntiid));

	fetch
		.then(assignment => {
			assignment.addListener(EVENT_FINISH, onAssignmentSaved);
			dispatch(LOADED, assignment);
			loadSchema(assignment);
		})
		.catch(reason => {
			//TODO: HANDLE THE ERROR CASE
			dispatch(LOADED, reason instanceof Error ? reason : new Error(reason));
		});
}


export function loadSchema (assignment) {
	//TODO: ACTUALLY LOAD THE SCHEMA
	const link = assignment.getLink('schema');

	if (!link) {
		dispatch(LOADED_SCHEMA, defaultSchema);
	} else {
		getService()
			.then((service) => {
				return service.get(link);
			})
			.then((schema) => {
				dispatch(LOADED_SCHEMA, schema);
			})
			.catch((reason) => {
				logger.error('Failed to load schema: ', reason);
				dispatch(LOADED_SCHEMA, defaultSchema);
			});
	}
}


function onAssignmentSaved (action, data, e) {
	const assignment = this; //emitters set the scope of the handler to themselves.
	if (action === SAVE && e) {
		const fn = maybeResetAssignmentOnError(assignment);
		fn(e);
	}
}


export function maybeResetAssignmentOnError (assignmentOrQuestionSet) {

	function getMainSubmittable (model) {
		let p;
		do {
			p = model && model.parent('getSubmission');
			if (p) { model = p; }
		} while (p);
		return model;
	}

	const assignment = getMainSubmittable(assignmentOrQuestionSet);
	if (!/assignment/i.test(assignment.MimeType)) {
		logger.warn('Could not get assignment!! %o', assignment);
	}

	return (error) => {

		if (error.code === 'ObjectHasSubmissions' || error.code === 'ObjectHasSavepoints') {
			return assignment.refresh()
				.then(() => {
					assignment.onChange('all');
					dispatch(ASSIGNMENT_ERROR, {
						NTIID: assignment.NTIID,
						field: null,
						reason: error
					});
				});
		}

		return Promise.reject(error);
	};
}


export function saveFieldOn (obj, field, newValue) {
	if (!obj.save) {
		throw new Error('Invalid object to save field on');
	}

	const oldValue = obj[field];

	//If the value didn't change, don't do anything
	if (oldValue === newValue) {
		return;
	}

	const values = {[field]: newValue};

	dispatch(SAVING, obj);

	const save = obj.save(values).catch(maybeResetAssignmentOnError(obj));
	const afterSave = () => dispatch(SAVE_ENDED, obj);

	save.then(afterSave, afterSave);

	return save;
}


export function deleteAssignment (assignment, promptText) {
	Prompt.areYouSure(promptText)
			.then(() => {
				dispatch(ASSIGNMENT_DELETING, true);
				assignment.delete()
					.then(wait.min(SHORT))
					.then(() => {
						dispatch(ASSIGNMENT_DELETED);
					})
					.catch((reason) => {
						dispatch(ASSIGNMENT_ERROR, reason);
						dispatch(ASSIGNMENT_DELETING, false);
					});
			});
}


export function resetAssignmentSubmissions (assignment) {
	return assignment.resetAllSubmissions()
		.then(() => dispatch(REVERT_ERRORS));
}
