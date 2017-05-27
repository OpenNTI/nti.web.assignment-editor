import React from 'react';
import PropTypes from 'prop-types';

import ChoiceFactory from '../choices/Factory';
import Choices from '../choices';

import {generatePartFor} from './utils';

const choiceType = 'FreeResponseSolution';
const errorField = 'solutions';

const disclaimer = 'Short answer questions are auto graded, but the responses must be a 100% match. List as many possible answers as you\'re willing to accept including common misspellings.';
const addLabel = 'Add a Possible Answer';


export default class FreeResponseEditor extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
		question: PropTypes.object,
		index: PropTypes.number,
		onChange: PropTypes.func
	}


	constructor (props) {
		super(props);

		const {part} = this.props;

		this.choiceFactory = new ChoiceFactory (choiceType, part.NTIID, errorField);

		this.state = {
			choices: this.mapChoices(part.solutions)
		};
	}


	mapChoices (solutions) {
		if (!Array.isArray(solutions)) {
			solutions = [solutions];
		}

		return solutions.map((solution, index) => {
			return solution && solution.value ? this.choiceFactory.make(solution.value, true, index) : null;
		}).filter(x => x);
	}


	onChange = (choices) => {
		const {part, onChange, index} = this.props;
		let solutions = choices.map(choice => choice.label.trim());


		if (onChange) {
			onChange(index, generatePartFor(part.MimeType, '', solutions));
		}
	}


	buildBlankChoice = (column) => {
		return this.choiceFactory.make('', true, column.length, true);
	}


	render () {
		const {choices} = this.state;

		return (
			<div className="free-response-editor">
				<div className="disclaimer">{disclaimer}</div>
				<Choices
					choices={choices}
					onChange={this.onChange}
					buildBlankChoice={this.buildBlankChoice}
					canRemove
					addLabel={addLabel}
					plainText
				/>
			</div>
		);
	}
}
