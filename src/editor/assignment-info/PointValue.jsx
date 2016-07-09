import React from 'react';
import {NumberInput, LabeledValue} from 'nti-web-commons';

export default class PointValue extends React.Component {

	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	state = {}

	componentWillMount () {
		this.setUp();
	}

	componentWillReceiveProps (nextProps) {
		const {assignment} = this.props;
		if (nextProps.assignment !== assignment) {
			this.setUp(nextProps);
		}
	}

	setUp (props = this.props) {
		const {assignment} = props;
		const value = assignment.totalPoints;
		this.setState({
			value
		});
	}

	attachRef = x => this.input = x

	onBlur = () => {
		this.save();
	}

	onChange = () => {
		const {value} = this.input;
		//we set the min to 0, but just safe-guard it just in case.
		if (value < 0) {
			return;
		}

		this.setState({
			value: value || null
		});
	}

	save () {
		const {assignment} = this.props;
		const {value} = this.state;
		if(assignment.totalPoints !== value) {
			assignment.save({
				'total_points': value
			});
		}
	}

	render () {

		const {value} = this.state;

		return (
			<div className="field point-value">
				<LabeledValue label="Value">
					<NumberInput defaultValue={value || ''}
						min="0"
						ref={this.attachRef}
						onBlur={this.onBlur}
						onChange={this.onChange}
						/>
				</LabeledValue>
			</div>
		);
	}
}
