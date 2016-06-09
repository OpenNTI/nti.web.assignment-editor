import React from 'react';

import Ordering from '../../../dnd/ordering/Ordering';
import Choice from './Choice';
import AddButton from './AddButton';

const labelsField = 'labels';
const valuesField = 'values';


function getErrorForChoice (error, choice, choiceIndex) {
	const {reason} = error || {};
	let {field, index} = reason || {};

	index = index || [];

	if (field === labelsField && choice.isLabel) {
		return index.indexOf(choiceIndex) >= 0 ? error : null;
	} else if (field === valuesField && choice.isValue) {
		return index.indexOf(choiceIndex) >= 0 ? error : null;
	}
}


export default class OrderingChoices extends React.Component {
	static propTypes = {
		labels: React.PropTypes.array.isRequired,
		values: React.PropTypes.array.isRequired,
		partId: React.PropTypes.string,
		labelType: React.PropTypes.string,
		valueType: React.PropTypes.string,
		onChange: React.PropTypes.func,
		addNew: React.PropTypes.func,
		remove: React.PropTypes.func,
		error: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		let {labels, values, labelType, valueType} = props;

		this.labelAccepts = [labelType];
		this.valueAccepts = [valueType];

		labels = labels.slice(0);
		values = values.slice(0);

		this.state = {
			labels,
			values
		};

		this.onLabelOrderChange = this.onLabelOrderChange.bind(this);
		this.onValueOrderChange = this.onValueOrderChange.bind(this);
		this.onChoiceChange = this.onChoiceChange.bind(this);
		this.addChoice = this.addChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
		this.renderChoice = this.renderChoice.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {labels:newLabels, values:newValues, error:newError} = nextProps;
		const {labels:oldLabels, values:oldValues, error:oldError} = this.props;
		let state = null;

		if (oldLabels !== newLabels) {
			state = state || {};
			state.labels = newLabels;
		}

		if (oldValues !== newValues) {
			state = state || {};
			state.values = newValues;
		}

		if (oldError !== newError) {
			state = state || {};
			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	onChange () {
		const {onChange} = this.props;
		let {labels, values} = this.state;

		labels = labels.slice(0);
		values = values.slice(0);

		if (onChange) {
			onChange(labels, values);
		}
	}


	onLabelOrderChange (labels) {
		this.setState({
			labels
		}, () => {
			this.onChange();
		});
	}


	onValueOrderChange (values) {
		this.setState({
			values
		}, () => {
			this.onChange();
		});
	}


	onChoiceChange (choiceId, label, isLabel) {
		let {labels, values} = this.state;

		function updateValue (choices, id, value) {
			return choices.map((choice) => {
				return choice.ID === id ? {...choice, label: value} : choice;
			});
		}

		if (isLabel) {
			labels = updateValue(labels, choiceId, label);
		} else {
			values = updateValue(values, choiceId, label);
		}

		this.setState({
			labels,
			values
		}, () => {
			this.onChange();
		});
	}


	addChoice () {
		const {addNew} = this.props;

		if (addNew) {
			addNew();
		}
	}


	removeChoice (e) {
		const {remove} = this.props;
		const target = e.target;
		const label = target && target.getAttribute('data-label');
		const value = target && target.getAttribute('data-value');

		if (remove) {
			remove(label, value);
		}
	}


	render () {
		const {partId} = this.props;
		const {labels, values} = this.state;
		let deletes = [];

		for (let i = 0; i < labels.length; i++) {
			let label = labels[i];
			let value = values[i];

			deletes.push({
				label: label.NTIID || label.ID,
				value: value.NTIID || value.ID
			});
		}

		return (
			<div className="ordering-editor-choices">
				<div className="choices">
					<Ordering
						className="ordering-editor-column labels"
						containerId={partId}
						accepts={this.labelAccepts}
						items={labels}
						renderItem={this.renderChoice}
						onChange={this.onLabelOrderChange}
					/>
					<Ordering
						className="ordering-editor-column values"
						containerId={partId}
						accepts={this.valueAccepts}
						items={values}
						renderItem={this.renderChoice}
						onChange={this.onValueOrderChange}
					/>
					<AddButton onAdd={this.addChoice} />
				</div>
				<div className="delete">
					{deletes.map(this.renderDelete)}
				</div>
			</div>
		);
	}


	renderChoice (choice, index) {
		const {error} = this.state;

		return (
			<Choice key={choice.ID} choice={choice} onChange={this.onChoiceChange} error={getErrorForChoice(error, choice, index)} />
		);
	}


	renderDelete (ids) {
		const key = ids.label + '-' + ids.value;

		return (
			<div key={key} data-label={ids.label} data-value={ids.value} onClick={this.removeChoice}>X</div>
		);
	}
}
