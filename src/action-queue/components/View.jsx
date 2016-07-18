import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import Item from './Item';

export default class ActionStack extends React.Component {
	static propTypes = {
		queue: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		const {queue} = props;

		this.state = {
			items: queue.items
		};
	}


	componentDidUpdate () {
		this.addQueueListeners();
	}


	componentDidMount () {
		this.addQueueListeners();
	}


	componentWillUnmount () {
		this.removeQueueListeners();
	}


	addQueueListeners () {
		this.removeQueueListeners();

		const {queue} = this.props;

		queue.addListener('changed', this.onQueueChanged);
	}


	removeQueueListeners () {
		const {queue} = this.props;

		queue.removeListener('changed', this.onQueueChanged);
	}


	onQueueChanged = () => {
		const {queue} = this.props;

		this.setState({
			items: queue.items
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
