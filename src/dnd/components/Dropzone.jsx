import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DnDInfo from '../utils/Info';
import DataTransfer from '../utils/DataTransfer';
import { setDropHandled } from '../Actions';
import Store from '../Store';
import { DRAG_END } from '../Constants';

export function isValidTransfer(dataTransfer) {
	return dataTransfer.containsType(DnDInfo.MimeType);
}

export function hasAcceptedType(types, dataTransfer) {
	for (let t of types) {
		if (dataTransfer.containsType(t)) {
			return true;
		}
	}

	return false;
}

export function doHandleDataTransfer(handlers, dataTransfer, e) {
	const types = Object.keys(handlers);

	//TODO: look at what to do when there is more than one handler for a drop...
	for (let t of types) {
		let data = dataTransfer.findDataFor(t);

		if (data) {
			handlers[t](data, dataTransfer, e);
			return true;
		}
	}

	return false;
}

export default class Dropzone extends React.Component {
	static propTypes = {
		dropHandlers: PropTypes.object,
		onDrop: PropTypes.func,
		onInvalidDrop: PropTypes.func,
		onDragEnter: PropTypes.func,
		onDragLeave: PropTypes.func,
		onDragOver: PropTypes.func,
		children: PropTypes.any,
		className: PropTypes.string,
	};

	state = {};

	dragEnterLock = 0;

	constructor(props) {
		super(props);

		const handlers = props.dropHandlers || {};
		this.acceptedTypes = Object.keys(handlers);
		this.acceptsOrder = handlers.priority || this.acceptedTypes;
	}

	componentDidMount() {
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.onStoreChange);
	}

	getDOMNode() {
		//We need the underlying dom node. Using refs will likely give us a Component instance...
		//we don't want to assume the component exposes a ref my any particular name, so,
		//until this API is removed, we will use it.
		// eslint-disable-next-line react/no-find-dom-node
		return ReactDOM.findDOMNode(this);
	}

	onStoreChange = e => {
		const { type } = e;

		if (type === DRAG_END) {
			this.maybeForceDragLeave();
		}
	};

	onDrop = e => {
		const { onDrop, onInvalidDrop, dropHandlers } = this.props;
		const { dataTransfer } = e;
		const data = new DataTransfer(dataTransfer);

		this.dragEnterLock = 0;

		if (!isValidTransfer(data)) {
			if (onInvalidDrop) {
				onInvalidDrop();
			}
		} else {
			const handled = doHandleDataTransfer(dropHandlers, data, e);

			if (handled) {
				e.stopPropagation();
				setDropHandled(data);
			} else if (onDrop) {
				e.stopPropagation();
				onDrop(e, data, () => setDropHandled(data));
			} else {
				e.dataTransfer.dropEffect = 'none';
			}
		}

		this.setState({
			dragOver: false,
			isValid: null,
		});
	};

	onDragEnter = e => {
		e.stopPropagation();

		const { onDragEnter } = this.props;
		const { dataTransfer } = e;
		const data = new DataTransfer(dataTransfer);

		this.dragEnterLock++;

		if (
			isValidTransfer(data) &&
			hasAcceptedType(this.acceptedTypes, data)
		) {
			this.setState({
				dragOver: true,
				isValid: true,
			});
		} else {
			this.setState({
				dragOver: true,
				isValid: false,
			});
		}

		if (onDragEnter) {
			onDragEnter(e, data);
		}
	};

	onDragLeave = e => {
		e.stopPropagation();

		const { onDragLeave } = this.props;

		this.dragEnterLock--;
		if (this.dragEnterLock <= 0) {
			this.dragEnterLock = 0; //force 0, unlock
		}

		if (this.dragEnterLock > 0 || e.target !== this.getDOMNode()) {
			return;
		}

		this.setState({
			dragOver: false,
			isValid: null,
		});

		if (onDragLeave) {
			onDragLeave(e);
		}
	};

	maybeForceDragLeave() {
		const { onDragLeave } = this.props;

		if (onDragLeave) {
			onDragLeave();
		}
	}

	onDragOver = e => {
		//These are necessary to get drop events
		e.preventDefault();
		e.stopPropagation();

		const { onDragOver } = this.props;
		const { dataTransfer } = e;
		const data = new DataTransfer(dataTransfer);

		//TODO: pass wHether or not there is data it could handle
		if (onDragOver) {
			onDragOver(e, hasAcceptedType(this.acceptedTypes, data), data);
		}
	};

	render() {
		const { children, className } = this.props;
		const { dragOver, isValid } = this.state;
		const child = React.Children.only(children);
		const cls = cx(className || '', child.props.className, {
			'drag-over': dragOver,
			'valid-drag': dragOver && isValid,
			'invalid-drag': dragOver && !isValid,
		});

		const props = {
			onDrop: this.onDrop,
			onDragEnter: this.onDragEnter,
			onDragLeave: this.onDragLeave,
			onDragOver: this.onDragOver,
			className: cls,
		};

		return React.cloneElement(child, props);
	}
}
