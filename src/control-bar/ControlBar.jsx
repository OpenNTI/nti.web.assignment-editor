import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

ControlBar.propTypes = {
	visible: PropTypes.bool,
	children: PropTypes.any
};

export default function ControlBar ({visible, children}) {
	return (
		<ReactCSSTransitionGroup transitionName="slideUp" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
			{visible && (
				<div key="control-bar" className="nti-control-bar">
					{children}
				</div>
			)}
		</ReactCSSTransitionGroup>
	);
}
