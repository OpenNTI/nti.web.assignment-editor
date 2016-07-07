import React from 'react';
import cx from 'classnames';

export default class DragHandle extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool
	}

	static contextTypes = {
		addDragHandle: React.PropTypes.func,
		enableDrag: React.PropTypes.func,
		disableDrag: React.PropTypes.func
	}


	componentDidMount () {
		const {addDragHandle} = this.context;

		if (addDragHandle) {
			addDragHandle();
		}
	}


	onMouseDown = (e) => {
		const {enableDrag} = this.context;

		if (enableDrag) {
			e.stopPropagation();
			enableDrag();
		}
	}


	onMouseUp = (e) => {
		const {disableDrag} = this.context;

		if (disableDrag) {
			e.stopPropagation();
			disableDrag();
		}
	}


	render () {
		const {className, disabled} = this.props;
		const {enableDrag, disableDrag} = this.context;
		const cls = cx('drag-handle', className, {disabled});

		if (!enableDrag || !disableDrag) {
			return null;
		}


		return (
			<div className={cls}>
				<i className="icon-gripper" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
			</div>
		);
	}
}
