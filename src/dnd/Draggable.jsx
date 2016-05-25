import React from 'react';
import DataTransfer from './DataTransfer';
import DnDInfo from './Info';

export default class Draggable extends React.Component {
	static propTypes = {
		data: React.PropTypes.any.isRequired,
		onDragStart: React.PropTypes.fn,
		onDragEnd: React.PropTypes.fn,
		handleClassName: React.PropTypes.bool,
		children: React.PropTypes.any
	}

	constructor (props) {
		super(props);

		const {data, handleClassName} = props;

		this.setDataForTransfer(data);

		this.state = {
			draggable: !handleClassName
		};

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}


	setDataForTransfer (data) {
		if (!Array.isArray(data)) {
			data = [data];
		}

		this.dataTransfer = this.dataTransfer || new DataTransfer();

		for (let d of data) {
			this.dataTransfer.setData(d);
		}
	}


	onDragStart (e) {
		const {onDragStart} = this.props;
		const {dataTransfer} = e;

		dataTransfer.effectAllowed = 'all';
		dataTransfer.dropEffect = 'move';
		dataTransfer.setData(DnDInfo.MimeType, DnDInfo.dataForTransfer);

		if (this.dataTransfer) {
			this.dataTransfer.forEach((key, value) => {
				dataTransfer.setData(key, value);
			});
		}

		this.setState({
			isDragging: true
		});

		if (onDragStart) {
			onDragStart(e);
		}
	}


	onDragEnd (e) {
		const {onDragEnd} = this.props;

		this.setState({
			isDragging: false
		});

		if (onDragEnd) {
			onDragEnd(e);
		}
	}


	onMouseDown (e) {
		const {handleClassName} = this.props;

		if (e.target.classList.contains(handleClassName)) {
			this.setState({
				draggable: true
			});
		}
	}


	onMouseUp () {
		this.setState({
			draggable: false
		});
	}


	render () {
		const {children, handleClassName} = this.props;
		const {draggable, isDragging} = this.state;
		const child = React.Children.only(children);

		const props = {
			onDragStart: this.onDragStart,
			onDragEnd: this.onDragEnd
		};

		if (handleClassName) {
			props.onMouseDown = this.onMouseDown;
			props.onMouseUp = this.onMouseUp;
		}

		if (draggable) {
			props.draggable = true;
		}

		if (isDragging) {
			props.className = 'dragging';
		}

		return (
			React.cloneElement(child, props)
		);
	}
}
