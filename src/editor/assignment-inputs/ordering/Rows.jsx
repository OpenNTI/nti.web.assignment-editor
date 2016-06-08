import React from 'react';

import Ordering from '../../../dnd/ordering/Ordering';
import Cell from './Cell';
import AddButton from './AddButton';

export default class OrderingRows extends React.Component {

	static propTypes = {
		rows: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func,
		addRow: React.PropTypes.func,
		deleteRow: React.PropTypes.func,
		partId: React.PropTypes.string
	}

	constructor (props) {
		super(props);

		const {rows, partId} = props;

		this.labelType = (partId + '-label').toLowerCase();
		this.valueType = (partId + '-value').toLowerCase();

		this.labelAccepts = [this.labelType];
		this.valueAccepts = [this.valueType];

		const parts = this.mapRows(rows);
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
		this.addRow = this.addRow.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
		this.renderCell = this.renderCell.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {rows:newRows} = nextProps;
		const {rows:oldRows} = this.props;

		if (newRows === oldRows) { return; }

		const parts = this.mapRows(newRows);
		const {labels, values} = parts;

		this.setState({
			labels,
			values
		});
	}


	mapRows (rows) {
		let labels = [];
		let values = [];

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];

			labels.push({
				label: row.label,
				ID: row.ID + '-label',
				rowId: row.ID,
				MimeType: this.labelType,
				isLabel: true,
				isNew: row.isNew
			});

			values.push({
				label: row.value,
				ID: row.ID + '-value',
				rowId: row.ID,
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
			let label = labels[i];
			let value = values[i];

			rows.push({
				label: label.label,
				value: value.label,
				ID: label.rowId
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
				return row.ID === id ? {...row, label: value} : row;
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


	deleteRow (e) {
		const {deleteRow} = this.props;
		const id = e.target && e.target.getAttribute('data-row');

		if (deleteRow && id) {
			deleteRow(id);
		}
	}


	addRow () {
		const {addRow} = this.props;

		if (addRow) {
			addRow();
		}
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
					<AddButton onAdd={this.addRow} />
				</div>
				<div className="delete">
					{labels.map(this.renderDelete)}
				</div>
			</div>
		);
	}


	renderDelete (label, index) {
		return (
			<div key={index} data-row={label.rowId} onClick={this.deleteRow}>X</div>
		);
	}


	renderCell (cell) {
		return (
			<Cell key={cell.ID} cell={cell} onChange={this.onCellChange} />
		);
	}

}
