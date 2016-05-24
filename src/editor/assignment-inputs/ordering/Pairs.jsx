import React from 'react';

export function orderValues (labels, values, solution) {
	let order = [];

	for (let i = 0; i < labels.length; i++) {
		order.push(values[solution[i]]);
	}

	return order;
}


export default class OrderingPairs extends React.Component {

	static propTypes = {
		labels: React.PropTypes.array.isRequired,
		values: React.PropTypes.array.isRequired,
		solution: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		let {labels, values, solution} = this.props;

		values = orderValues(labels, values, solution);

		this.state = {
			labels: labels,
			values: values
		};
	}


	onLabelChange () {

	}


	onValueChange () {

	}


	render () {
		return (
			<span>Ordering Pairs</span>
		);
	}

}
