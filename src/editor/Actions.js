import {dispatch} from 'nti-lib-dispatcher';
import {getService} from  'nti-web-client';
import Logger from 'nti-util-logger';
import {LOADED, LOADED_SCHEMA, SAVING, SAVE_ENDED} from './Constants';

const logger = Logger.get('assignment-editor:assignment-actions');
const defaultSchema = {};

export function loadAssignment (ntiid) {
	getService()
		.then((service) => {
			return service.getObject(ntiid);
		})
		.then((assignment) => {
			dispatch(LOADED, assignment);
			loadSchema(assignment);
		})
		.catch((reason) => {
			//TODO: HANDLE THE ERROR CASE
			dispatch(LOADED, new Error(reason));
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

	const save = obj.save(values);
	const afterSave = () => dispatch(SAVE_ENDED, obj);

	save.then(afterSave, afterSave);

	return save;
}
