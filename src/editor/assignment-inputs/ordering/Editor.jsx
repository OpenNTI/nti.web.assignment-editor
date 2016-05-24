import React from 'react';
import Pairs from './Pairs';

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
		let {labels, values, solutions} = part;
		let solution = solutions[0];//For now just take the first solution

		solution = solution && solution.value;
		labels = labels.slice(0);
		values = values.slice(0);

		return (
			<Pairs
				labels={labels}
				values={values}
				solution={solution}
				onChange={this.onPairsChanged}
			/>
		);
	}
}
