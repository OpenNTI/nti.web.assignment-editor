import React from 'react';
import cx from 'classnames';
import jump from 'jump.js';
import {getViewportHeight} from 'nti-lib-dom';
import {DialogButtons, LockScroll} from 'nti-web-commons';

import {HeightChange} from '../../sync-height';

import {getDialogPositionForRect, getScrollOffsetForRect} from '../utils';

export default class InlineDialog extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.node,
		dialogButtons: React.PropTypes.array,
		active: React.PropTypes.bool
	}

	setDialogRef = x => this.dialog = x
	setInnerRef = x => this.innerRef = x
	setPlaceholderRef = x => this.placeholderRef = x


	state = {}

	constructor (props) {
		super(props);
	}


	componentWillUpdate (nextProps) {
		const {active} = nextProps;
		const {active:isActive} = this.state;

		if (active && !isActive) {
			this.activateModal();
		} else if (!active && isActive) {
			this.deactivateModal();
		}
	}


	getDialogRect () {
		let rect = null;

		if (this.innerRef && this.placeholderRef) {
			let placeholderRect = this.placeholderRef.getBoundingClientRect();

			rect = {
				top: placeholderRect.top,
				height: this.innerRef.firstChild.clientHeight
			};
		} else {
			rect = this.dialog && this.dialog.getBoundingClientRect();
		}

		return rect;
	}


	updateModal = (force) => {
		const {active} = this.state;

		if (this.isUpdating || (!active && !force)) { return; }

		this.isUpdating = true;

		const onceScrolled = new Promise((fulfill) => {
			const scrollOffset = getScrollOffsetForRect(this.getDialogRect(), getViewportHeight());

			if (scrollOffset) {
				jump(scrollOffset, {
					duration: 250,
					callback: fulfill
				});
			} else {
				fulfill();
			}
		});


		onceScrolled
			.then(() => {
				const {dialogPosition:currentPosition} = this.state;
				const newPosition = getDialogPositionForRect(this.getDialogRect());

				if (!currentPosition || currentPosition.top !== newPosition.top || currentPosition.height !== newPosition.height) {
					this.setState({
						active: true,
						dialogPosition: newPosition
					}, () => {
						delete this.isUpdating;
					});
				}
			});
	}


	activateModal () {
		this.updateModal(true);
	}


	deactivateModal () {
		this.setState({
			active: false,
			dialogPosition: null
		});
	}


	render () {
		const {children, className, dialogButtons} = this.props;
		const {dialogPosition, active} = this.state;
		const child = React.Children.only(children);
		const cls = cx('inline-dialog', className, {active});
		let innerStyles = {};
		let placeholderStyles = {};

		if (dialogPosition) {
			innerStyles.paddingTop = `${dialogPosition.top}px`;
			placeholderStyles.height = `${dialogPosition.height}px`;
		}

		return (
			<div ref={this.setDialogRef} className={cls}>
				{
					active ?
						(
							<div className="wrapper">
								<LockScroll />
								<div ref={this.setInnerRef} className="inner-wrapper" style={innerStyles}>
									<HeightChange onChange={this.updateModal}>
										{child}
									</HeightChange>
									<DialogButtons buttons={dialogButtons} />
								</div>
							</div>
						) :
						child
				}
				{ active && (<div ref={this.setPlaceholderRef} className="inline-dialog-placeholder" style={placeholderStyles} />)}
			</div>
		);
	}
}
