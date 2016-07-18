import React from 'react';
import cx from 'classnames';
import jump from 'jump.js';
import {getViewportHeight} from 'nti-lib-dom';

import {getDialogPositionForRect, getScrollOffsetForRect} from '../utils';


export default class InlineDialog extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.node,
		dialogButtons: React.PropTypes.array,
		active: React.PropTypes.bool
	}

	setDialogRef = x => this.dialog = x


	state = {}


	componentWillUpdate (nextProps) {
		const {active} = nextProps;
		const {active:isActive} = this.props;

		if (active && !isActive) {
			this.activateModal();
		} else if (!active && isActive) {
			this.deactivateModal();
		}
	}


	activateModal () {
		const getRect = () => this.dialog && this.dialog.getBoundingClientRect();
		const setState = () => {
			this.setState({
				active: true,
				dialogPosition: getDialogPositionForRect(getRect())
			});
		};

		const scrollOffset = getScrollOffsetForRect(getRect(), getViewportHeight());


		if (scrollOffset) {
			jump(scrollOffset, {
				duration: 500,
				callback: setState
			});
		} else {
			setState();
		}
	}


	deactivateModel () {}


	render () {
		const {children, className} = this.props;
		const {dialogPosition, active} = this.state;
		const child = React.Children.only(children);
		const cls = cx('inline-dialog', className, {active});
		let innerStyles = {};
		let placeholderStyles = {};

		//TODO: render dialog buttons

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
								<div className="inner-wrapper" style={innerStyles}>
									{child}
								</div>
							</div>
						) :
						child
				}
				{ active && (<div className="inline-dialog-placeholder" style={placeholderStyles} />)}
			</div>
		);
	}
}
