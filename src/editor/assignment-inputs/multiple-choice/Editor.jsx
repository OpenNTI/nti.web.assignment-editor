import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import Choices from './choices';
import ChoiceFactory from '../choices/Factory';
import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import {canAddPart, canMovePart, canRemovePart} from '../utils';

const errorField = 'choices';


export default class MultipleChoiceEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		multipleAnswers: React.PropTypes.bool,
		error: React.PropTypes.object,
		generatePart: React.PropTypes.func
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

		autobind(this,
			'choicesChanged',
			'addNewChoice',
			'removeChoice'
		);
	}

	//TODO: listen for changes on the question to update the choices


	componentWillReceiveProps (nextProps) {
		const {part:newPart, error:newError} = nextProps;
		const {part:oldPart, error:oldError} = this.props;
		const {choices, solutions} = newPart;
		let state = null;

		if (newPart !== oldPart) {
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
		let solution = solutions[0];//For now just handle the first solution

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


	choicesChanged (choices) {
		const {question, multipleAnswers} = this.props;

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

		savePartToQuestion(question, this.generatePart('', values.choices, values.solutions));

		this.setState({
			choices: choices
		});
	}


	addNewChoice () {
		let {choices} = this.state;

		choices = choices.slice(0);

		choices.push(this.choiceFactory.make('', false, choices.length, true));

		this.choicesChanged(choices);
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
				add={canAddPart(question) && this.addNewChoice}
				remove={canRemovePart(question) && this.removeChoice}
				multipleAnswers={multipleAnswers}
				reorderable={canMovePart(question)}
			/>
		);
	}
}
