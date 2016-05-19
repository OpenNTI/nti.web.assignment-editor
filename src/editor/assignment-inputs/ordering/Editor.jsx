import React from 'react';

export default class OrderingEditor extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div>TODO: Fill Out Ordering Type</div>
		);
	}
}
