import React from 'react';
import Choices from './Choices';
import {savePartToQuestion} from './Actions';

export default class MultipleChoiceEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};

		this.choicesChanged = this.choicesChanged.bind(this);
	}


	choicesChanged (choices, solution) {
		const {part, question} = this.props;

		savePartToQuestion(question, part, '', choices, solution);
	}


	render () {
		const {part} = this.props;
		let {choices, solutions} = part;
		let solution = solutions[0];//For now just handle the first solution

		solution = solution && solution.value;
		choices = choices.slice(0);

		return (
			<Choices partId={part.NTIID} choices={choices} solution={solution} onChange={this.choicesChanged}/>
		);
	}
}
