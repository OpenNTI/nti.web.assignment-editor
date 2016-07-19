import React from 'react';

const DEFAULT_NAME = 'DO';

export default class ActionQueueItem extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired
	};


	onComplete = () => {
		const {item} = this.props;

		if (item && item.complete) {
			item.complete();
		}
	}


	render () {
		const {item} = this.props;
		const name = item.name || DEFAULT_NAME;

		return (
			<div className="action-stack-item">
				<span className="label">{item.label}</span>
				<span onClick={this.onComplete} className="action">{name}</span>
			</div>
		);
	}
}
