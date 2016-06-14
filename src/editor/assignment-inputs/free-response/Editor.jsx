import React from 'react';

import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import Choices from './Choices';

const disclaimer = 'Short answer questions are auto graded, but the responses must be a 100% match. List as many possible answers as you\'re willing to accept including common misspellings.';

export default class FreeResponseEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		const {part} = this.props;

		this.state = {
			choices: this.mapChoices(part.solutions, part.NTIID)
		};

		this.onChange = this.onChange.bind(this);
		this.addChoice = this.addChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
	}


	mapChoices (solutions, partId) {
		if (!Array.isArray(solutions)) {
			solutions = [solutions];
		}

		return solutions.map((solution, index) => {
			return {
				ID: partId + '-' + index,
				label: solution.value,
				correct: true
			};
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
		const {part} = this.props;
		const {NTIID:partId} = part;
		let {choices} = this.state;

		choices = choices.slice(0);

		choices.push({
			ID: partId + '-' + choices.length,
			label: '',
			correct: true,
			isNew: true
		});

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
				<Choices choices={choices} onChange={this.onChange} onAdd={this.addChoice} onRemove={this.removeChoice} />
			</div>
		);
	}
}
