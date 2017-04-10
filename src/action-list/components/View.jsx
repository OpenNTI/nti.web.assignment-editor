import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import cx from 'classnames';

import Item from './Item';

export default class ActionStack extends React.Component {
	static propTypes = {
		stack: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		const {stack} = props;

		this.state = {
			items: stack.items
		};
	}


	componentDidUpdate () {
		this.addStackListeners();
	}


	componentDidMount () {
		this.addStackListeners();
	}


	componentWillUnmount () {
		this.removeStackListeners();
	}


	addStackListeners () {
		this.removeStackListeners();

		const {stack} = this.props;

		stack.addListener('changed', this.onStackChanged);
	}


	removeStackListeners () {
		const {stack} = this.props;

		stack.removeListener('changed', this.onStackChanged);
	}


	onStackChanged = () => {
		const {stack} = this.props;

		this.setState({
			items: stack.items
		});
	}


	render () {
		const {items} = this.state;
		const cls = cx('action-stack', {'is-empty': !items.length});

		return (
			<div className={cls}>
				<ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
					{items.map(this.renderItem)}
				</ReactCSSTransitionGroup>
			</div>
		);
	}


	renderItem (item) {
		return (
			<Item key={item.ID} item={item} />
		);
	}
}
