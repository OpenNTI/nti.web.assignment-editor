import React from 'react';

import ChoiceFactory from '../choices/Factory';
import {canAddPart, canMovePart, canRemovePart} from '../utils';

import Choices from './Choices';
import {generatePartFor} from './utils';

const errorField = 'choices';


export default class MultipleChoiceEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		multipleAnswers: React.PropTypes.bool,
		error: React.PropTypes.object,
		generatePart: React.PropTypes.func,
		index: React.PropTypes.number,
		onChange: React.PropTypes.func,
		keepStateHash: React.PropTypes.number
	}


	constructor (props) {
		super(props);

		const {part, error} = this.props;
		const {choices, solutions, NTIID:partId} = part;

		this.partType = (partId + '-answer').toLowerCase();
		this.partTypes = [this.partType];

		this.choiceFactory = new ChoiceFactory (this.partType, partId, errorField);

		this.state = {
			choices: this.mapChoices(choices, solutions),
			error
		};
	}

	//TODO: listen for changes on the question to update the choices


	componentWillReceiveProps (nextProps) {
		const {part:newPart, error:newError, keepStateHash:newStateHash} = nextProps;
		const {part:oldPart, error:oldError, keepStateHash:oldStateHash} = this.props;
		const {choices, solutions} = newPart;
		let state = null;

		if (newPart !== oldPart || newStateHash !== oldStateHash) {
			state = state || {};
			state.choices = this.mapChoices(choices, solutions);
		}

		if (newError !== oldError) {
			state = state || {};
			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	mapChoices (choices, solutions) {
		let solution = (solutions || [])[0];//For now just handle the first solution

		solution = solution && solution.value;

		if (!Array.isArray(solution)) {
			solution = [solution];
		}

		solution = solution.reduce((acc, s) => {
			acc[s] = true;

			return acc;
		}, {});

		return choices.map((choice, index) => {
			return this.choiceFactory.make(choice, solution[index], index);
		});
	}


	generatePart (content, choices, solutions) {
		const {part, generatePart} = this.props;
		const mimeType = part && part.MimeType;

		if (!mimeType) {
			//TOOD: see if we ever need to handle this case
		}

		return generatePart ? generatePart(content, choices, solutions) : generatePartFor(mimeType, content, choices, solutions);
	}


	choicesChanged = (choices) => {
		const {multipleAnswers, onChange, index:partIndex} = this.props;

		let values = choices.reduce((acc, choice, index) => {
			let label = choice.label;

			acc.choices.push(label);

			if (choice.correct) {
				acc.solutions.push(index);
			}

			return acc;
		}, {choices: [], solutions: []});

		if (!multipleAnswers) {
			values.solutions = values.solutions[0];
		}

		if (onChange) {
			onChange(partIndex, this.generatePart('', values.choices, values.solutions));
		}

	}


	buildBlankChoice = (column) => {
		return this.choiceFactory.make('', false, column.length, true);
	}


	removeChoice (id) {
		let {choices} = this.state;

		choices = choices.filter((choice) => {
			let choiceId = choice.NTIID || choice.ID;

			return choiceId !== id;
		});

		this.choicesChanged(choices);
	}


	render () {
		const {part, multipleAnswers, question} = this.props;
		const {choices, error} = this.state;

		return (
			<Choices
				containerId={part.NTIID}
				accepts={this.partTypes}
				choices={choices}
				error={error}
				onChange={this.choicesChanged}
				buildBlankChoice={canAddPart(question) ? this.buildBlankChoice : void 0}
				canRemove={canRemovePart(question)}
				multipleAnswers={multipleAnswers}
				reorderable={canMovePart(question)}
			/>
		);
	}
}