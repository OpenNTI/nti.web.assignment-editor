import React from 'react';

import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import Choices from './Choices';

export default class OrderingEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		error: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		const {part, error} = props;
		const parts = this.getParts(part);

		this.state = {
			labels: parts.labels,
			values: parts.values,
			labelType: parts.labelType,
			valueType: parts.valueType,
			error
		};

		this.onChoicesChanged = this.onChoicesChanged.bind(this);
		this.addNewChoice = this.addNewChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		const {part:newPart, error:newError} = nextProps;
		const {part:oldPart, error:oldError} = this.props;
		const parts = this.getParts(newPart);
		let state = null;

		if (newPart !== oldPart) {
			state = state || {};
			state.labels = parts.labels;
			state.values = parts.values;
			state.labelType = parts.labelType;
			state.valueType = parts.valueType;
		}

		if (newError !== oldError) {
			state = state || {};
			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	getParts (part) {
		const {labels:partLabels, values:partValues, solutions, NTIID} = part;
		const labelType = (NTIID + '-label').toLowerCase();
		const valueType = (NTIID + '-value').toLowerCase();
		let solution = solutions[0];//For now just take the first solution
		let labels = [];
		let values = [];

		solution = solution && solution.value;

		for (let i = 0; i < partLabels.length; i++) {
			let label = partLabels[i];
			let value = partValues[solution[i]];

			labels.push({
				label: label,
				MimeType: labelType,
				ID: NTIID + '-label-' + label.replace(/\s+/g, '-'),
				isLabel: true
			});

			values.push({
				label: value,
				MimeType: valueType,
				ID: NTIID + '-value-' + value.replace(/\s+/g, '-'),
				isValue: true
			});
		}

		return {
			labels,
			values,
			labelType,
			valueType
		};
	}


	generatePart (content, labels, values, solutions) {
		const {part} = this.props;
		const mimeType = part && part.MimeType;

		if (!mimeType) {
			//TODO: see if we ever hit this case
		}

		return generatePartFor(mimeType, content, labels, values, solutions);
	}


	onChoicesChanged (newLabels, newValues) {
		const {question} = this.props;
		let labels = [];
		let values = [];
		let solutions = {};

		for (let i = 0; i < newLabels.length; i++) {
			labels.push(newLabels[i].label);
			values.push(newValues[i].label);
			solutions[i] = i;
		}

		savePartToQuestion(question, this.generatePart('', labels, values, solutions));

		this.setState({
			labels: newLabels,
			values: newValues
		});
	}


	addNewChoice () {
		const {part} = this.props;
		const {NTIID:partId} = part;
		let {labels, values, labelType, valueType} = this.state;

		labels = labels.slice(0);
		values = values.slice(0);

		labels.push({
			label: '',
			MimeType: labelType,
			ID: partId + '-label-' + labels.length,
			isLabel: true,
			isNew: true
		});

		values.push({
			label: '',
			MimeType: valueType,
			ID: partId + '-value-' + values.length,
			isValue: true
		});

		this.onChoicesChanged(labels, values);
	}


	removeChoice (labelId, valueId) {
		let {labels, values} = this.state;

		labels = labels.filter(x => x.ID !== labelId);
		values = values.filter(x => x.ID !== valueId);

		this.onChoicesChanged(labels, values);
	}


	render () {
		const {part} = this.props;
		const {NTIID:partId} = part;
		const {labels, values, error, labelType, valueType} = this.state;


		return (
			<Choices
				labels={labels}
				values={values}
				partId={partId}
				labelType={labelType}
				valueType={valueType}
				onChange={this.onChoicesChanged}
				addNew={this.addNewChoice}
				remove={this.removeChoice}
				error={error}
			/>
		);
	}
}
