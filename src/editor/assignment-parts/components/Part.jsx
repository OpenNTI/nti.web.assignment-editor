import React from 'react';
import QuestionSet from './QuestionSet';

export default class AssignmentPart extends React.Component {

	static propTypes = {
		part: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {part, assignment} = this.props;
		const questionSet = part.question_set;

		return (
			<QuestionSet questionSet={questionSet} assignment={assignment} />
		);
	}
}
