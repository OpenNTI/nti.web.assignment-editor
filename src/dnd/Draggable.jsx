import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';

import DataTransfer from './DataTransfer';
import DnDInfo from './Info';
import {getDomNodeProps, DROPZONE} from './DomNodeProps';

export default class Draggable extends React.Component {
	static propTypes = {
		data: React.PropTypes.any.isRequired,
		onDragStart: React.PropTypes.func,
		onDragEnd: React.PropTypes.func,
		onMouseDown: React.PropTypes.func,
		onMouseUp: React.PropTypes.func,
		handleClassName: React.PropTypes.bool,
		children: React.PropTypes.any,
		className: React.PropTypes.string
	}

	constructor (props) {
		super(props);

		const {data} = props;

		this.setDataForTransfer(data);

		this.state = {
			draggable: false
		};

		autobind(this,
			'onDragStart',
			'onDragEnd',
			'onMouseDown',
			'onMouseUp'
		);
	}


	componentWillReceiveProps (nextProps) {
		const {data:newData} = nextProps;
		const {data:oldData} = this.props;

		if (newData !== oldData) {
			this.setDataForTransfer(newData);
		}
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
		e.stopPropagation();

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
		e.stopPropagation();

		const {handleClassName, onMouseDown} = this.props;

		if (onMouseDown) {
			onMouseDown(e);
		}

		if (!handleClassName || e.target.classList.contains(handleClassName)) {
			this.setState({
				draggable: true
			});
		}
	}


	onMouseUp (e) {
		const {onMouseUp} = this.props;

		if (onMouseUp) {
			onMouseUp(e);
		}

		this.setState({
			draggable: false
		});
	}


	render () {
		const {children, className} = this.props;
		const {draggable, isDragging} = this.state;
		const child = React.Children.only(children);
		const cls = cx(className || '', 'draggable', {dragging: isDragging});

		const props = getDomNodeProps(this.props, [DROPZONE]);

		props.className = cls;
		props.onMouseDown = this.onMouseDown;
		props.onMouseUp = this.onMouseUp;

		if (draggable) {
			props.draggable = true;
			props.onDragStart = this.onDragStart;
			props.onDragEnd = this.onDragEnd;
		}


		return (
			React.cloneElement(child, props)
		);
	}
}
