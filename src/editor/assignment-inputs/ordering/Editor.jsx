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
		const {labels, values, solutions} = part;
		const rows = this.mapRows(labels, values, solutions);

		this.state = {
			rows
		};

		this.onRowsChanged = this.onRowsChanged.bind(this);
		this.addNewRow = this.addNewRow.bind(this);
	}


	mapRows (labels, values, solutions) {
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
				value
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
	}


	addNewRow () {
		let {rows} = this.state;

		rows = rows.slice(0);

		rows.push({
			label: '',
			value: '',
			isNew: true
		});

		this.setState({
			rows
		});
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
			/>
		);
	}
}
