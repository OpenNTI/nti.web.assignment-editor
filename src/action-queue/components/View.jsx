import React from 'react';
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


	componentDidMount () {
		this.addQueueListeners();
	}


	componentWillUnmount () {
		this.removeQueueListeners();
	}


	addQueueListeners () {
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
				{items.map(this.renderItem)}
			</div>
		);
	}


	renderItem (item) {
		return (
			<Item key={item.ID} item={item} />
		);
	}
}
