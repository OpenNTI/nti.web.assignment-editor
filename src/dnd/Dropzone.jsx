import React from 'react';
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

	return true;
}


export function doHandleDataTransfer (handlers, dataTransfer) {
	const types = Object.keys(handlers);

	//TODO: look at what to do when there is more than one handler for a drop...
	for (let t of types) {
		let data = dataTransfer.findDataFor(t);

		if (data) {
			handlers[t](data);
			return true;
		}
	}

	return false;
}

export default class Dropzone extends React.Component {
	static propTypes = {
		dropHandlers: React.PropTypes.object,
		onDrop: React.PropTypes.fn,
		onInvalidDrop: React.PropTypes.fn,
		onDragEnter: React.PropTypes.fn,
		onDragLeave: React.PropTypes.fn,
		onDragOver: React.PropTypes.fn,
		children: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		let {dropHandlers} = props;

		dropHandlers = dropHandlers || {};

		this.acceptedTypes = Object.keys(dropHandlers);
		this.acceptsOrder = dropHandlers.priority || this.acceptedTypes;

		this.onDrop = this.onDrop.bind(this);
		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
	}


	onDrop (e) {
		const {onDrop, onInvalidDrop, dropHandlers} = this.props;
		const {dataTransfer} = e;
		const data = new DataTransfer(dataTransfer);

		if (!isValidTransfer(data)) {
			if (onInvalidDrop) {
				onInvalidDrop();
			}
		} else {
			doHandleDataTransfer(dropHandlers, data);

			if (onDrop) {
				onDrop(e, data);
			}
		}
	}


	onDragEnter (e) {
		const {onDragEnter} = this.props;
		const {dataTransfer} = e;
		const data = new DataTransfer(dataTransfer);

		this.dragEnterCounter = this.dragEnterCounter || 0;

		this.dragEnterCounter += 1;

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
		const {onDragLeave} = this.props;

		this.dragEnterCounter = this.dragEnterCounter || 1;

		this.dragEnterCounter -= 1;

		if (this.dragEnterCounter === 0) {
			this.setState({
				dragOver: false,
				isValid: null
			});

			if (onDragLeave) {
				onDragLeave(e);
			}
		}
	}


	onDragOver (e) {
		//These are necessary to get drop events
		e.preventDefault();
		e.stopPropagation();

		const {onDragOver} = this.props;
		const {dataTransfer} = e;

		if (onDragOver) {
			onDragOver(e, new DataTransfer(dataTransfer));
		}
	}


	render () {
		const {children} = this.props;
		const child = React.Children.only(children);

		const props = {
			onDrop: this.onDrop,
			onDragEnter: this.onDragEnter,
			onDragLeave: this.onDragLeave,
			onDragOver: this.onDragOver
		};


		return (
			React.cloneElement(child, props)
		);
	}
}
