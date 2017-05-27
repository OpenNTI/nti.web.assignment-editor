import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';

import {canAddPart, canMovePart, canRemovePart} from '../utils';
import ChoiceFactory from '../choices/Factory';
import Choices from '../choices';

import {generatePartFor} from './utils';

const labelsError = 'labels';
const valuesError = 'values';

const addLabel = 'Add a Row';

const LABELS = 'labels';
const VALUES = 'values';

const logger = Logger.get('lib:assignment-editor:input-types:ordering:Editor');

export default class OrderingEditor extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
		question: PropTypes.object.isRequired,
		error: PropTypes.any,
		index: PropTypes.number,
		onChange: PropTypes.func,
		keepStateHash: PropTypes.number
	}

	constructor (props) {
		super(props);

		const {part, error} = this.props;
		const {labels, values, solutions, NTIID:partId} = part;

		this.labelType = (partId + '-label').toLowerCase();
		this.valueType = (partId + '-value').toLowerCase();

		this.partTypes = [this.labelType, this.valueType];

		this.labelFactory = new ChoiceFactory (this.labelType, partId + '-label', labelsError, LABELS);
		this.valueFactory = new ChoiceFactory (this.valueType, partId + '-value', valuesError, VALUES);

		const choices = this.mapChoices(labels, values, solutions);

		this.state = {
			choices,
			error
		};
	}


	componentWillReceiveProps (nextProps) {
		const {part:newPart, error:newError, keepStateHash:newStateHash} = nextProps;
		const {part:oldPart, error:oldError, keepStateHash:oldStateHash} = this.props;
		const {labels, values, solutions} = newPart;
		let state = null;

		if (newPart !== oldPart || newStateHash !== oldStateHash) {
			state = state || {};
			state.choices = this.mapChoices(labels, values, solutions);
		}

		if (newError !== oldError) {
			state = state || {};
			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	mapChoices (labels, values, solutions) {
		let solution = solutions && solutions[0];//For now just use the first solution
		let choices = [];


		solution = solution && solution.value;

		if(!solution) {
			logger.error('No solution? Defaulting to label order.');
			solution = Object.keys(labels);
		}

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


	choicesChanged = (choices) => {
		const {onChange, index} = this.props;
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


		if (onChange) {
			onChange(index, this.generatePart('', labels, values, solutions));
		}
	}


	buildBlankChoice = (column) => {
		const first = column[0];
		let blank;

		if (first.groupName === LABELS) {
			blank = this.labelFactory.make('', false, column.length, true);
		} else {
			blank = this.valueFactory.make('', true, column.length);
		}

		return blank;
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


	render () {
		const {part, question} = this.props;
		const {choices, error} =  this.state;

		return (
			<Choices
				className="ordering-editor-choices"
				containerId={part.NTIID}
				accepts={this.partTypes}
				choices={choices}
				error={error}
				onChange={this.choicesChanged}
				buildBlankChoice={canAddPart(question) ? this.buildBlankChoice : void 0}
				canRemove={canRemovePart(question)}
				addLabel={addLabel}
				reorderable={canMovePart(question)}
				minAllowed={2}
			/>
		);
	}
}
