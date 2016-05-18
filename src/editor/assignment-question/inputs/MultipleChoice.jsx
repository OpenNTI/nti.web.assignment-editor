import React from 'react';

export default class MultipleChoicePart extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired
	}

	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.multiplechoicepart',
		'application/vnd.nextthought.assessment.randomizedmultiplechoicepart'
	]


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div>TODO: Fill Out Multiple Choice Type</div>
		);
	}
}
