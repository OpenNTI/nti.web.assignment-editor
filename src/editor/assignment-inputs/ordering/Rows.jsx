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

		this.labelType = partId + '-label';
		this.valueType = partId + '-value';

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


	onCellChange (newValue, cell) {
		// debugger;
	}


	onLabelsChange (labels) {
		// debugger;
	}


	onValuesChange (values) {
		// debugger;
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
					{labels.forEach(this.renderDelete)}
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
