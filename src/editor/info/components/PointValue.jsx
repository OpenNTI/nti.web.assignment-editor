import React from 'react';
import PropTypes from 'prop-types';
import {Input, LabeledValue} from '@nti/web-commons';

export default class PointValue extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired
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

	componentDidUpdate (_, prevState) {
		const {value} = this.state;
		if (value !== prevState.value) {
			clearTimeout(this.saveChangeDelay);
			this.saveChangeDelay = setTimeout(this.save, 500);
		}
	}

	setUp (props = this.props) {
		const {assignment} = props;

		this.setState({
			value: assignment.totalPoints
		});
	}

	attachRef = x => this.input = x

	onBlur = () => {
		clearTimeout(this.saveChangeDelay);
		this.save();
	}

	onChange = (value) => {
		//we set the min to 0, but just safe-guard it just in case.
		if (value < 0 || isNaN(value)) {
			return;
		}

		this.setState({
			value: typeof value === 'number' ? value : null
		});
	}

	save = () => {
		const {assignment} = this.props;
		const {value} = this.state;

		const doneSaving = () => {
			delete this.savingValue;
			this.setUp();
		};


		if (assignment.totalPoints !== value && this.savingValue !== value) {
			this.savingValue = value;

			assignment.setTotalPoints(value)
				.then(doneSaving, doneSaving);
		}
	}

	render () {
		const {assignment} = this.props;
		const {value} = this.state;

		return (
			<div className="field point-value">
				<LabeledValue label="Value" disabled={!assignment.canSetTotalPoints()}>
					<Input.Number
						value={typeof value === 'number' ? value : null}
						min={0}
						ref={this.attachRef}
						onBlur={this.onBlur}
						onChange={this.onChange}
					/>
				</LabeledValue>
			</div>
		);
	}
}
