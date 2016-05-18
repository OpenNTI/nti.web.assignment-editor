import React from 'react';

export default class OrderingPart extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired
	}

	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.orderingpart'
	]


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
