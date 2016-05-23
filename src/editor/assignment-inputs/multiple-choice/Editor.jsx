import React from 'react';
import Choices from './Choices';
import {savePartToQuestion} from './Actions';

export default class MultipleChoiceEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		this.state = {};

		this.choicesChanged = this.choicesChanged.bind(this);
	}


	choicesChanged (choices, solution) {
		const {part, question, multipleAnswers} = this.props;

		if (!multipleAnswers) {
			solution = solution[0];
		}

		savePartToQuestion(question, part, '', choices, solution);
	}


	render () {
		const {part, multipleAnswers} = this.props;
		let {choices, solutions} = part;
		let solution = solutions[0];//For now just handle the first solution

		solution = solution && solution.value;
		choices = choices.slice(0);

		if (!Array.isArray(solution)) {
			solution = [solution];
		}

		solution = solution.slice(0);

		return (
			<Choices
				partId={part.NTIID}
				choices={choices}
				solution={solution}
				onChange={this.choicesChanged}
				multipleAnswers={multipleAnswers}
			/>
		);
	}
}
