import React from 'react';

import {savePartToQuestion} from './Actions';
import Choices from './Choices';

export default class OrderingEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		const {part} = props;
		const parts = this.getParts(part);

		this.state = {
			labels: parts.labels,
			values: parts.values,
			labelType: parts.labelType,
			valueType: parts.valueType
		};

		this.onChoicesChanged = this.onChoicesChanged.bind(this);
		this.addNewChoice = this.addNewChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
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
				ID: NTIID + '-label-' + i,
				isLabel: true
			});

			values.push({
				label: value,
				MimeType: valueType,
				ID: NTIID + '-value-' + i,
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


	onChoicesChanged (newLabels, newValues) {
		const {question, part} = this.props;
		let labels = [];
		let values = [];
		let solutions = {};

		for (let i = 0; i < newLabels.length; i++) {
			labels.push(newLabels[i].label);
			values.push(newValues[i].label);
			solutions[i] = i;
		}

		savePartToQuestion(question, part, '', labels, values, solutions, []);

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
		const {labels, values, labelType, valueType} = this.state;

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
			/>
		);
	}
}
