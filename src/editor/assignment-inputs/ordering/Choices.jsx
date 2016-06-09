import React from 'react';

import Ordering from '../../../dnd/ordering/Ordering';
import Choice from './Choice';
import AddButton from './AddButton';

export default class OrderingChoices extends React.Component {
	static propTypes = {
		labels: React.PropTypes.array.isRequired,
		values: React.PropTypes.array.isRequired,
		partId: React.PropTypes.string,
		labelType: React.PropTypes.string,
		valueType: React.PropTypes.string,
		onChange: React.PropTypes.func,
		addNew: React.PropTypes.func,
		remove: React.PropTypes.func
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
		const {labels:newLabels, values:newValues} = nextProps;
		const {labels:oldLabels, values:oldValues} = this.props;

		if (oldLabels !== newLabels || oldValues !== newValues) {
			this.setState({
				labels: newLabels,
				values: newValues
			});
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


	renderChoice (choice) {
		return (
			<Choice key={choice.ID} choice={choice} onChange={this.onChoiceChange} />
		);
	}


	renderDelete (ids) {
		const key = ids.label + '-' + ids.value;

		return (
			<div key={key} data-label={ids.label} data-value={ids.value} onClick={this.removeChoice}>X</div>
		);
	}
}

// export default class OrderingRows extends React.Component {

// 	componentWillReceiveProps (nextProps) {
// 		const {rows:newRows} = nextProps;
// 		const {rows:oldRows} = this.props;

// 		if (newRows === oldRows) { return; }

// 		const parts = this.mapRows(newRows);
// 		const {labels, values} = parts;

// 		this.setState({
// 			labels,
// 			values
// 		});
// 	}


// 	mapRows (rows) {
// 		let labels = [];
// 		let values = [];

// 		for (let i = 0; i < rows.length; i++) {
// 			let row = rows[i];

// 			labels.push({
// 				label: row.label,
// 				ID: row.ID + '-label',
// 				rowId: row.ID,
// 				MimeType: this.labelType,
// 				isLabel: true,
// 				isNew: row.isNew
// 			});

// 			values.push({
// 				label: row.value,
// 				ID: row.ID + '-value',
// 				rowId: row.ID,
// 				MimeType: this.valueType,
// 				isValue: true
// 			});
// 		}

// 		return {
// 			labels,
// 			values
// 		};
// 	}


// 	onChange () {
// 		const {onChange} = this.props;
// 		const {labels, values} = this.state;
// 		let rows = [];

// 		for (let i = 0; i < labels.length; i++) {
// 			let label = labels[i];
// 			let value = values[i];

// 			rows.push({
// 				label: label.label,
// 				value: value.label,
// 				ID: label.rowId
// 			});
// 		}

// 		if (onChange) {
// 			onChange(rows);
// 		}
// 	}


// 	onCellChange (newValue, cell) {
// 		let {labels, values} = this.state;

// 		function updateValue (rows, id, value) {
// 			return rows.map((row) => {
// 				return row.ID === id ? {...row, label: value} : row;
// 			});
// 		}

// 		if (cell.isLabel) {
// 			labels = updateValue(labels, cell.ID, newValue);
// 		} else {
// 			values = updateValue(values, cell.ID, newValue);
// 		}

// 		this.setState({
// 			labels,
// 			values
// 		}, () => {
// 			this.onChange();
// 		});
// 	}


// 	onLabelsChange (labels) {
// 		this.setState({
// 			labels
// 		}, () => {
// 			this.onChange();
// 		});
// 	}


// 	onValuesChange (values) {
// 		this.setState({
// 			values
// 		}, () => {
// 			this.onChange();
// 		});
// 	}


// 	deleteRow (e) {
// 		const {deleteRow} = this.props;
// 		const id = e.target && e.target.getAttribute('data-row');

// 		if (deleteRow && id) {
// 			deleteRow(id);
// 		}
// 	}


// 	addRow () {
// 		const {addRow} = this.props;

// 		if (addRow) {
// 			addRow();
// 		}
// 	}


// 	render () {
// 		const {partId} = this.props;
// 		const {labels, values} = this.state;

// 		console.log(labels.reduce((acc, label, index) => {
// 			acc.push(label.label + ':' + values[index].label);

// 			return acc;
// 		}, []).join('\n'));

// 		console.log(values);

// 		return (
// 			<div className="ordering-editor-rows">
// 				<div className="rows">
// 					<Ordering
// 						className="ordering-editor-column labels"
// 						containerId={partId}
// 						accepts={this.labelAccepts}
// 						items={labels}
// 						renderItem={this.renderCell}
// 						onChange={this.onLabelsChange}
// 					/>
// 					<Ordering
// 						className="ordering-editor-column values"
// 						containerId={partId}
// 						accepts={this.valueAccepts}
// 						items={values}
// 						renderItem={this.renderCell}
// 						onChange={this.onValuesChange}
// 					/>
// 					<AddButton onAdd={this.addRow} />
// 				</div>
// 				<div className="delete">
// 					{labels.map(this.renderDelete)}
// 				</div>
// 			</div>
// 		);
// 	}


// 	renderDelete (label, index) {
// 		return (
// 			<div key={index} data-row={label.rowId} onClick={this.deleteRow}>X</div>
// 		);
// 	}


// 	renderCell (cell) {
// 		console.log(cell.label);
// 		return (
// 			<Cell key={cell.ID} cell={cell} onChange={this.onCellChange} />
// 		);
// 	}

// }
