import {dispatch} from 'nti-lib-dispatcher';
import {DRAG_OVER, DRAG_LEAVE} from './Constants';

export function dragOverOrdering (container) {
	dispatch(DRAG_OVER, container);
}

export function dragLeaveOrdering (container) {
	dispatch(DRAG_LEAVE, container);
}
