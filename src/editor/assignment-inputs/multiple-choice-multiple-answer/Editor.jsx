import React from 'react';
import Base from '../multiple-choice/Editor';

export default class MultipleChoiceMultipleAnswerEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {part, question} = this.props;

		return (
			<Base part={part} question={question} multipleAnswers />
		);
	}
}
