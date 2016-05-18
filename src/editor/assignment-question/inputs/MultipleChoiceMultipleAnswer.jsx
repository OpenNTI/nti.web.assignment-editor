import React from 'react';

export default class MultipleChoiceMultipleAnswerPart extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired
	}

	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.multiplechoicemultipleanswerpart',
		'application/vnd.nextthought.assessment.randomizedmultiplechoicemultipleanswerpart'
	]


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div>TODO: Fill Out Multiple Choice Multiple Answer Type</div>
		);
	}
}
