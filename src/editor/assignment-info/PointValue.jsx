import React from 'react';
import {NumberInput} from 'nti-web-commons';

export default class PointValue extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};
		this.onBlur = this.onBlur.bind(this);
	}

	static propTypes = {
		assignment: React.PropTypes.object.required
	}

	onBlur () {
		const {assignment} = this.props;
		const {value} = this.input;
		console.log(value);
		assignment.save({
			PointValue: value
		});
	}


	render () {

		const {value} = this.state;

		return (
			<div className="field point-value">
				<div className="field-label">Point Value</div>
				<div className="field-value">
					<NumberInput ref={x => this.input = x} onBlur={this.onBlur} defaultValue={value} />
				</div>
			</div>
		);
	}
}
