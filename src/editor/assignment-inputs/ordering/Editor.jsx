import React from 'react';
import Rows from './Rows';

export default class OrderingEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};

		this.onPairsChanged = this.onPairsChanged.bind(this);
	}


	onPairsChanged (/*labels, value, solution*/) {

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
				onChange={this.onPairsChanged}
			/>
		);
	}
}
