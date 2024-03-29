import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { dragStart, dragEnd } from '../Actions';
import DataTransfer from '../utils/DataTransfer';
import DnDInfo from '../utils/Info';

export default class Draggable extends React.Component {
	static propTypes = {
		data: PropTypes.any,
		onDragStart: PropTypes.func,
		onDragEnd: PropTypes.func,
		onMouseDown: PropTypes.func,
		onMouseUp: PropTypes.func,
		children: PropTypes.any,
		className: PropTypes.string,
	};

	static childContextTypes = {
		addDragHandle: PropTypes.func,
		// removeDragHandle: React.PropTypes.func,
		enableDrag: PropTypes.func,
		disableDrag: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.setDataForTransfer(props.data);
	}

	getChildContext() {
		return {
			addDragHandle: () => (this.hasDragHandle = true),
			enableDrag: () => this.setDraggable(true),
			disableDrag: () => this.setDraggable(false),
		};
	}

	componentDidUpdate(prevProps) {
		const { data: newData } = this.props;
		const { data: oldData } = prevProps;

		if (newData !== oldData) {
			this.setDataForTransfer(newData);
		}
	}

	// getSnapshotBeforeUpdate () {
	// 	// if (!this.isDragging && this.isDraggable) {
	// 	// 	this.setDraggable(false);
	// 	// }
	//  	return null;
	// }

	setDataForTransfer(data) {
		if (!Array.isArray(data)) {
			data = [data];
		}

		this.dataTransfer = new DataTransfer();

		for (let d of data) {
			if (d != null) {
				this.dataTransfer.setData(d);
			}
		}
	}

	getDOMNode() {
		//We need the underlying dom node. Using refs will likely give us a Component instance...
		//we don't want to assume the component exposes a ref my any particular name, so,
		//until this API is removed, we will use it.
		// eslint-disable-next-line react/no-find-dom-node
		return ReactDOM.findDOMNode(this);
	}

	onDragStart = e => {
		e.stopPropagation();

		const { onDragStart } = this.props;
		const { dataTransfer } = e;
		const domNode = this.getDOMNode();

		dataTransfer.effectAllowed = 'all';
		dataTransfer.dropEffect = 'move';
		dataTransfer.setData(DnDInfo.MimeType, DnDInfo.dataForTransfer);

		if (this.dataTransfer) {
			this.dataTransfer.forEach((key, value) => {
				dataTransfer.setData(key, value);
			});
		}

		this.isDragging = true;
		domNode.classList.add('dragging');
		domNode.style.position = 'relative';
		domNode.style.zIndex = 0;

		if (onDragStart) {
			onDragStart();
		}

		dragStart();
	};

	onDragEnd = e => {
		const { onDragEnd } = this.props;
		const domNode = this.getDOMNode();

		this.isDragging = false;
		domNode.classList.remove('dragging');
		domNode.style.position = '';
		domNode.style.zIndex = '';

		if (onDragEnd) {
			onDragEnd(e);
		}

		dragEnd();
	};

	setDraggable(add) {
		const domNode = this.getDOMNode();
		const listener = add ? 'addEventListener' : 'removeEventListener';

		this.isDraggable = true;

		if (add) {
			domNode.setAttribute('draggable', true);
		} else {
			domNode.removeAttribute('draggable');
		}

		domNode[listener]('dragstart', this.onDragStart);
		domNode[listener]('dragend', this.onDragEnd);
	}

	onMouseDown = e => {
		if (this.hasDragHandle) {
			return;
		}

		e.stopPropagation();

		const { onMouseDown } = this.props;

		if (onMouseDown) {
			onMouseDown(e);
		}

		this.setDraggable(true);
	};

	onMouseUp = e => {
		if (this.hasDragHandle) {
			return;
		}

		const { onMouseUp } = this.props;

		if (onMouseUp) {
			onMouseUp(e);
		}

		this.setDraggable(false);
	};

	render() {
		const { children, className, ...props } = this.props;
		const child = React.Children.only(children);

		props.className = cx(className, 'draggable');
		props.onMouseDown = this.onMouseDown;
		props.onMouseUp = this.onMouseUp;
		delete props.data;
		delete props.onDragStart;
		delete props.onDragEnd;

		return React.cloneElement(child, props);
	}
}
