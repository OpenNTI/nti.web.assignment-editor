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

		this.state = {};

		this.onRowsChanged = this.onRowsChanged.bind(this);
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


	render () {
		const {part} = this.props;
		let {labels, values, solutions, NTIID} = part;
		let solution = solutions[0];//For now just take the first solution
		let rows = [];

		solution = solution && solution.value;
		labels = labels.slice(0);
		values = values.slice(0);

		rows = labels.reduce((acc, label, index) => {
			acc.push({
				label,
				value: values[solution[index]]
			});

			return acc;
		}, []);

		return (
			<Rows
				rows={rows}
				partId={NTIID}
				onChange={this.onRowsChanged}
			/>
		);
	}
}
