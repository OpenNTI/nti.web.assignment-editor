import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class ControlBar extends React.Component {
	static propTypes = {
		visible: React.PropTypes.bool,
		children: React.PropTypes.any
	}

	constructor (props) {
		super(props);

		this.state = {
			visible: props.visible
		};
	}


	componentWillReceiveProps (nextProps) {
		this.setState({
			visible: nextProps.visible
		});
	}


	render () {
		const {visible} = this.state;

		return (
			<ReactCSSTransitionGroup transitionName="slideUp" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
				{visible ?
					this.renderBar() :
					null
				}
			</ReactCSSTransitionGroup>
		);
	}

	renderBar () {
		const {children} = this.props;

		return (
			<div key="control-bar" className="control-bar">
				{children}
			</div>
		);
	}
}
