import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import jump from 'jump.js';
import {getViewportHeight} from '@nti/lib-dom';
import {DialogButtons, LockScroll} from '@nti/web-commons';

import {HeightChange} from '../../sync-height';
import {getDialogPositionForRect, getScrollOffsetForRect} from '../utils';

const BODY_OPEN_CLS = 'inline-dialog-open';

function getBody () {
	return typeof document === 'undefined' ? null : document.body;
}

function addOpenClsToBody () {
	const body = getBody();

	if (body) {
		body.classList.add(BODY_OPEN_CLS);
	}
}

function removeOpenClsFromBody () {
	const body = getBody();

	if (body) {
		body.classList.remove(BODY_OPEN_CLS);
	}
}

export default class InlineDialog extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.node,
		dialogButtons: PropTypes.array,
		active: PropTypes.bool,
		topPadding: PropTypes.number,
		bottomPadding: PropTypes.number
	}

	setDialogRef = x => this.dialog = x
	setInnerRef = x => this.innerRef = x
	setPlaceholderRef = x => this.placeholderRef = x


	state = {}

	componentDidMount () {
		const {active} = this.props;

		if (active) {
			this.activateModal();
		}
	}


	componentDidUpdate () {
		const {active} = this.props;
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
		const {topPadding, bottomPadding} = this.props;
		const {active} = this.state;

		if (this.isUpdating || (!active && !force)) { return; }

		this.isUpdating = true;

		const onceScrolled = new Promise((fulfill) => {
			const scrollOffset = getScrollOffsetForRect(this.getDialogRect(), getViewportHeight(), topPadding, bottomPadding);

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

		addOpenClsToBody();
	}


	deactivateModal () {
		this.setState({
			active: false,
			dialogPosition: null
		});

		removeOpenClsFromBody();
	}


	render () {
		const {children, className, dialogButtons, bottomPadding} = this.props;
		const {dialogPosition, active} = this.state;
		const child = React.Children.only(children);
		const cls = cx('inline-dialog', className, {active});
		let wrapperStyles = {};
		let innerStyles = {};
		let placeholderStyles = {};

		if (dialogPosition) {
			innerStyles.paddingTop = `${dialogPosition.top}px`;
			placeholderStyles.height = `${dialogPosition.height}px`;
		}

		if (bottomPadding) {
			innerStyles.paddingBottom = `${bottomPadding}px`;
		}


		return (
			<div ref={this.setDialogRef} className={cls}>
				{
					active ?
						(
							<div className="wrapper" style={wrapperStyles}>
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
