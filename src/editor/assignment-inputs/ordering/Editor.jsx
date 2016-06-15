import React from 'react';

import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import ChoiceFactory from '../choices/Factory';
import Choices from '../choices';

const labelsError = 'labels';
const valuesError = 'values';

const addLabel = 'Add a Row';


export default class OrderingEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		error: React.PropTypes.any
	}

	constructor (props) {
		super(props);

		const {part, error} = this.props;
		const {labels, values, solutions, NTIID:partId} = part;

		this.labelType = (partId + '-label').toLowerCase();
		this.valueType = (partId + '-value').toLowerCase();

		this.partTypes = [this.labelType, this.valueType];

		this.labelFactory = new ChoiceFactory (this.labelType, partId + '-label', labelsError);
		this.valueFactory = new ChoiceFactory (this.valueType, partId + '-value', valuesError);

		const choices = this.mapChoices(labels, values, solutions);

		this.state = {
			choices,
			error
		};

		this.choicesChanged = this.choicesChanged.bind(this);
		this.addNewChoice = this.addNewChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
	}


	mapChoices (labels, values, solutions) {
		let solution = solutions[0];//For now just use the first solution
		let choices = [];

		solution = solution && solution.value;

		for (let i = 0; i < labels.length; i++) {
			let label = labels[i];
			let value = values[solution[i]];

			choices.push([
				this.labelFactory.make(label, false, i),
				this.valueFactory.make(value, true, i)
			]);
		}

		return choices;
	}


	generatePart (content, labels, values, solutions) {
		const {part} = this.props;
		const mimeType = part && part.MimeType;

		if (!mimeType) {
			//TODO: see if we ever hit this case
		}

		return generatePartFor(mimeType, content, labels, values, solutions);
	}


	choicesChanged (choices) {
		const {question} = this.props;
		let labels = [];
		let values = [];
		let solutions = {};

		for (let i = 0; i < choices.length; i++) {
			let label = choices[i][0];
			let value = choices[i][1];

			labels.push(label.label);
			values.push(value.label);
			solutions[i] = i;
		}

		savePartToQuestion(question, this.generatePart('', labels, values, solutions));

		this.setState({
			choices
		});
	}


	addNewChoice () {
		let {choices} = this.state;

		choices = choices.slice(0);

		choices.push([
			this.labelFactory.make('', false, choices.length, true),
			this.valueFactory.make('', true, choices.length)
		]);

		this.choicesChanged(choices);
	}


	removeChoice (labelId, valueId) {
		let {choices} = this.state;

		choices = choices.slice(0);

		choices = choices.filter((choice) => {
			let label = choice[0];
			let value = choice[1];

			return label.ID !== labelId || value.ID !== valueId;
		});

		this.choicesChanged(choices);
	}


	render () {
		const {part} = this.props;
		const {choices, error} =  this.state;

		return (
			<Choices
				className="ordering-editor-choices"
				containerId={part.NTIID}
				accepts={this.partTypes}
				choices={choices}
				error={error}
				onChange={this.choicesChanged}
				add={this.addNewChoice}
				remove={this.removeChoice}
				addLabel={addLabel}
				reorderable
			/>
		);
	}
}
