import React from 'react';

import Ordering from '../../../dnd/ordering/Ordering';
import Cell from './Cell';

export default class OrderingRows extends React.Component {

	static propTypes = {
		rows: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func,
		partId: React.PropTypes.string
	}

	constructor (props) {
		super(props);

		const {rows, partId} = props;

		this.labelType = (partId + '-label').toLowerCase();
		this.valueType = (partId + '-value').toLowerCase();

		this.labelAccepts = [this.labelType];
		this.valueAccepts = [this.valueType];

		const parts = this.mapRows(rows, partId);
		const {labels, values} = parts;

		if (labels.length !== values.length) {
			throw new Error('Labels, Values mismatch length');
		}

		this.state = {
			labels,
			values
		};

		this.onCellChange = this.onCellChange.bind(this);
		this.onLabelsChange = this.onLabelsChange.bind(this);
		this.onValuesChange = this.onValuesChange.bind(this);
		this.deleteRow = this.deleteRow.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
		this.renderCell = this.renderCell.bind(this);
	}


	mapRows (rows, partId) {
		let labels = [];
		let values = [];

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];

			labels.push({
				label: row.label,
				ID: partId + '-label-' + i,
				MimeType: this.labelType,
				isLabel: true
			});

			values.push({
				label: row.value,
				ID: partId + '-value-' + i,
				MimeType: this.valueType,
				isValue: true
			});
		}

		return {
			labels,
			values
		};
	}

	onChange () {
		const {onChange} = this.props;
		const {labels, values} = this.state;
		let rows = [];

		for (let i = 0; i < labels.length; i++) {
			rows.push({
				label: labels[i].label,
				value: values[i].label
			});
		}

		if (onChange) {
			onChange(rows);
		}
	}


	onCellChange (newValue, cell) {
		let {labels, values} = this.state;

		function updateValue (rows, id, value) {
			return rows.map((row) => {
				if (row.ID === id) {
					row.label = value;
				}

				return row;
			});
		}

		if (cell.isLabel) {
			labels = updateValue(labels, cell.ID, newValue);
		} else {
			values = updateValue(values, cell.ID, newValue);
		}

		this.setState({
			labels,
			values
		}, () => {
			this.onChange();
		});
	}


	onLabelsChange (labels) {
		this.setState({
			labels
		}, () => {
			this.onChange();
		});
	}


	onValuesChange (values) {
		this.setState({
			values
		}, () => {
			this.onChange();
		});
	}


	deleteRow (index) {
		// debugger;
	}


	render () {
		const {partId} = this.props;
		const {labels, values} = this.state;

		return (
			<div className="ordering-editor-rows">
				<div className="rows">
					<Ordering
						className="ordering-editor-column labels"
						containerId={partId}
						accepts={this.labelAccepts}
						items={labels}
						renderItem={this.renderCell}
						onChange={this.onLabelsChange}
					/>
					<Ordering
						className="ordering-editor-column values"
						containerId={partId}
						accepts={this.valueAccepts}
						items={values}
						renderItem={this.renderCell}
						onChange={this.onValuesChange}
					/>
				</div>
				<div className="delete">
					{labels.map(this.renderDelete)}
				</div>
			</div>
		);
	}


	renderDelete (label, index) {
		return (
			<span key={index} data-index={index} onClick={this.deleteRow}>X</span>
		);
	}


	renderCell (cell) {
		return (
			<Cell key={cell.ID} cell={cell} onChange={this.onCellChange} />
		);
	}

}
