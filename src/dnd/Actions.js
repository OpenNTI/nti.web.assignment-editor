import {dispatch} from 'nti-lib-dispatcher';
import {ORDERING_DRAG_OVER, ORDERING_DRAG_LEAVE, DROP_HANDLED} from './Constants';

export function dragOverOrdering (container) {
	dispatch(ORDERING_DRAG_OVER, container);
}

export function dragLeaveOrdering (container) {
	dispatch(ORDERING_DRAG_LEAVE, container);
}

export function setDropHandled (data) {
	dispatch(DROP_HANDLED, data);
}
