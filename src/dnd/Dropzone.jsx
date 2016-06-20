import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';

import DnDInfo from './Info';
import DataTransfer from './DataTransfer';

export function isValidTransfer (dataTransfer) {
	return dataTransfer.containsType(DnDInfo.MimeType);
}

export function hasAcceptedType (types, dataTransfer) {
	for (let t of types) {
		if (dataTransfer.containsType(t)) {
			return true;
		}
	}

	return false;
}


export function doHandleDataTransfer (handlers, dataTransfer, e) {
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
		dropHandlers: React.PropTypes.object,
		onDrop: React.PropTypes.func,
		onInvalidDrop: React.PropTypes.func,
		onDragEnter: React.PropTypes.func,
		onDragLeave: React.PropTypes.func,
		onDragOver: React.PropTypes.func,
		children: React.PropTypes.any,
		className: React.PropTypes.string
	}


	constructor (props) {
		super(props);

		this.state = {};

		let {dropHandlers} = props;

		dropHandlers = dropHandlers || {};

		this.acceptedTypes = Object.keys(dropHandlers);
		this.acceptsOrder = dropHandlers.priority || this.acceptedTypes;

		autobind(this,
			'onDrop',
			'onDragEnter',
			'onDragLeave',
			'onDragOver'
		);
	}


	getDOMNode () {
		return ReactDOM.findDOMNode(this);
	}


	onDrop (e) {
		e.preventDefault();
		e.stopPropagation();

		const {onDrop, onInvalidDrop, dropHandlers} = this.props;
		const {dataTransfer} = e;
		const data = new DataTransfer(dataTransfer);

		this.dragEnterCounter = 0;

		if (!isValidTransfer(data)) {
			if (onInvalidDrop) {
				onInvalidDrop();
			}
		} else {
			doHandleDataTransfer(dropHandlers, data, e);

			if (onDrop) {
				onDrop(e, data);
			}
		}

		this.setState({
			dragOver: false,
			isValid: null
		});
	}


	onDragEnter (e) {
		e.preventDefault();
		e.stopPropagation();

		const {onDragEnter} = this.props;
		const {dataTransfer} = e;
		const data = new DataTransfer(dataTransfer);


		if (isValidTransfer(data) && hasAcceptedType(this.acceptedTypes, data)) {
			this.setState({
				dragOver: true,
				isValid: true
			});
		} else {
			this.setState({
				dragOver: true,
				isValid: false
			});
		}

		if (onDragEnter) {
			onDragEnter(e, data);
		}
	}


	onDragLeave (e) {
		e.preventDefault();
		e.stopPropagation();

		const {onDragLeave} = this.props;

		if (e.target !== this.getDOMNode()) {
			return;
		}

		this.setState({
			dragOver: false,
			isValid: null
		});

		if (onDragLeave) {
			onDragLeave(e);
		}
	}


	onDragOver (e) {
		//These are necessary to get drop events
		e.preventDefault();
		e.stopPropagation();

		const {onDragOver} = this.props;
		const {dataTransfer} = e;
		const data = new DataTransfer(dataTransfer);

		//TODO: pass wHether or not there is data it could handle
		if (onDragOver) {
			onDragOver(e, hasAcceptedType(this.acceptedTypes, data), data);
		}
	}


	render () {
		const {children, className} = this.props;
		const {dragOver, isValid} = this.state;
		const child = React.Children.only(children);
		const cls = cx(className || '', {'drag-over': dragOver, 'valid-drag': dragOver && isValid, 'invalid-drag': dragOver && !isValid});

		const props = {
			onDrop: this.onDrop,
			onDragEnter: this.onDragEnter,
			onDragLeave: this.onDragLeave,
			onDragOver: this.onDragOver,
			className: cls
		};


		return (
			React.cloneElement(child, props)
		);
	}
}
