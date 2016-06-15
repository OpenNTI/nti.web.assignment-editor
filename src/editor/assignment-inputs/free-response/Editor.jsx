import React from 'react';

import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import ChoiceFactory from '../choices/Factory';
import Choices from '../choices';

const choiceType = 'FreeResponseSolution';
const errorField = 'solutions';

const disclaimer = 'Short answer questions are auto graded, but the responses must be a 100% match. List as many possible answers as you\'re willing to accept including common misspellings.';
const addLabel = 'Add a Possible Answer';


export default class FreeResponseEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		const {part} = this.props;

		this.choiceFactory = new ChoiceFactory (choiceType, part.NTIID, errorField);

		this.state = {
			choices: this.mapChoices(part.solutions)
		};

		this.onChange = this.onChange.bind(this);
		this.addChoice = this.addChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
	}


	mapChoices (solutions) {
		if (!Array.isArray(solutions)) {
			solutions = [solutions];
		}

		return solutions.map((solution, index) => {
			return this.choiceFactory.make(solution.value, true, index);
		});
	}


	onChange (choices) {
		const {question, part} = this.props;
		let solutions = choices.map(choice => choice.label);

		this.setState({
			choices
		}, () => {
			savePartToQuestion(question, generatePartFor(part.MimeType, '', solutions));
		});
	}


	addChoice () {
		let {choices} = this.state;

		choices = choices.slice(0);

		choices.push(this.choiceFactory.make('', true, choices.length, true));

		this.setState({
			choices
		});
	}


	removeChoice (choiceId) {
		let {choices} = this.state;

		choices = choices.slice(0);

		choices = choices.filter((choice) => {
			return choice.ID !== choiceId;
		});

		this.onChange(choices);
	}


	render () {
		const {choices} = this.state;

		return (
			<div className="free-response-editor">
				<div className="disclaimer">{disclaimer}</div>
				<Choices
					choices={choices}
					onChange={this.onChange}
					add={this.addChoice}
					remove={this.removeChoice}
					addLabel={addLabel}
				/>
			</div>
		);
	}
}
