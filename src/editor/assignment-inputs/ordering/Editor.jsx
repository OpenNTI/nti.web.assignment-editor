import React from 'react';

import {savePartToQuestion} from './Actions';
import Rows from './Rows';

export default class OrderingEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		const {part} = props;
		const {labels, values, solutions, NTIID:partId} = part;
		const rows = this.mapRows(labels, values, solutions, partId);

		this.state = {
			rows
		};

		this.onRowsChanged = this.onRowsChanged.bind(this);
		this.addNewRow = this.addNewRow.bind(this);
		this.deleteRow = this.deleteRow.bind(this);
	}


	mapRows (labels, values, solutions, partId) {
		let rows = [];
		let solution = solutions[0];//For now just take the first solution

		solution = solution && solution.value;
		labels = labels.slice(0);
		values = values.slice(0);

		for (let i = 0; i < labels.length; i++) {
			let label = labels[i];
			let value = values[solution[i]];

			rows.push({
				label,
				value,
				ID: partId + '-row-' + i
			});
		}

		return rows;
	}


	onRowsChanged (rows) {
		const {question, part} = this.props;
		let labels = [];
		let values = [];
		let solution = {};

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];

			labels.push(row.label);
			values.push(row.value);
			solution[i] = i;
		}

		savePartToQuestion(question, part, '', labels, values, solution, []);

		this.setState({
			rows: rows
		});
	}


	addNewRow () {
		let {rows} = this.state;

		rows = rows.slice(0);

		rows.push({
			label: '',
			value: '',
			isNew: true
		});

		this.onRowsChanged(rows);
	}


	deleteRow (id) {
		let {rows} = this.state;

		rows = rows.filter(row => row.ID !== id);

		this.onRowsChanged(rows);
	}


	render () {
		const {part} = this.props;
		const {NTIID} = part;
		const {rows} = this.state;

		return (
			<Rows
				rows={rows}
				partId={NTIID}
				onChange={this.onRowsChanged}
				addRow={this.addNewRow}
				deleteRow={this.deleteRow}
			/>
		);
	}
}
