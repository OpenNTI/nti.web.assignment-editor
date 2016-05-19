import {dispatch} from 'nti-lib-dispatcher';
import {getService} from  'nti-web-client';
import Logger from 'nti-util-logger';
import {LOADED, LOADED_SCHEMA} from './Constants';

const logger = Logger.get('assignment-editor:assignment-actions');
const defaultSchema = {};

export function loadAssignment (ntiid) {
	//TODO: ABSOLUTELY GET RID OF THIS BEFORE IT GOES OUT ANYWHERE
	window.$AppConfig = window.$AppConfig || {server: 'http://janux.dev:8082/dataserver2/'};

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
				debugger;
			})
			.catch((reason) => {
				debugger;
				logger.error('Failed to load schema: ', reason);
				dispatch(LOADED_SCHEMA, defaultSchema);
			});
	}
}
