import {dispatch} from 'nti-lib-dispatcher';

import {REVERT_ERRORS} from '../../Constants';


export function revertAllErrors () {
	dispatch(REVERT_ERRORS);
}
