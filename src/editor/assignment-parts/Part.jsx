import React from 'react';
import QuestionSet from './QuestionSet';

export default class AssignmentPart extends React.Component {

	static propTypes = {
		Part: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {Part} = this.props;
		const questionSet = Part.question_set;

		return (
			<QuestionSet QuestionSet={questionSet} />
		);
	}
}
