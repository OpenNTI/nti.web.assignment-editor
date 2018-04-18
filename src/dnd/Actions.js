import {dispatch} from '@nti/lib-dispatcher';

import {ORDERING_DRAG_OVER, ORDERING_DRAG_LEAVE, DROP_HANDLED, DRAG_START, DRAG_END} from './Constants';

export function dragOverOrdering (container) {
	dispatch(ORDERING_DRAG_OVER, container);
}

export function dragLeaveOrdering (container) {
	dispatch(ORDERING_DRAG_LEAVE, container);
}

export function setDropHandled (data) {
	dispatch(DROP_HANDLED, data);
}

export function dragStart () {
	dispatch(DRAG_START);
}

export function dragEnd () {
	dispatch(DRAG_END);
}
