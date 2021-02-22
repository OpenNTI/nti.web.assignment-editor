import './DragHandle.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class DragHandle extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		force: PropTypes.bool,
	};

	static contextTypes = {
		addDragHandle: PropTypes.func,
		enableDrag: PropTypes.func,
		disableDrag: PropTypes.func,
	};

	componentDidUpdate(prevProps) {
		const { disabled } = this.props;
		const { disableDrag } = this.context;

		// if (!prevProps.disabled && disabled && disableDrag) ?
		if (disabled && disableDrag) {
			disableDrag();
		}
	}

	componentDidMount() {
		const { addDragHandle } = this.context;

		if (addDragHandle) {
			addDragHandle();
		}
	}

	onMouseDown = e => {
		const { disabled } = this.props;
		const { enableDrag } = this.context;

		if (enableDrag && !disabled) {
			e.stopPropagation();
			enableDrag();
		}
	};

	onMouseUp = e => {
		const { disableDrag } = this.context;

		if (disableDrag) {
			e.stopPropagation();
			disableDrag();
		}
	};

	onFocus = e => {
		e.stopPropagation();
	};

	render() {
		const { className, disabled, force } = this.props;
		const { enableDrag, disableDrag } = this.context;
		const cls = cx('drag-handle', className, { disabled });

		if ((!enableDrag || !disableDrag) && !force) {
			return null;
		}

		return (
			<div className={cls}>
				<i
					className="icon-gripper"
					onMouseDown={this.onMouseDown}
					onMouseUp={this.onMouseUp}
					onFocus={this.onFocus}
					tabIndex="-1"
				/>
			</div>
		);
	}
}
