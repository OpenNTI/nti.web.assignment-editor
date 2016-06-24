import React from 'react';

import {NumberInput} from 'nti-web-commons';

export const secondsPerHour = 3600;
export const secondsPerDay = secondsPerHour * 24;

export default class DurationPicker extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};
		this.inputChanged = this.inputChanged.bind(this);
		this.getValue = this.getValue.bind(this);
	}

	static propTypes = {
		onChange: React.PropTypes.func,
		value: React.PropTypes.number
	}

	/**
	 * Get the minutes (0-59) for the given seconds value.
	 * @param  {number} seconds number of seconds
	 * @return {integer} the minutes (0-59) for the given seconds value
	 */
	static minutes (seconds) {
		return Math.floor((seconds % secondsPerHour) / 60);
	}

	/**
	 * Get the hours (0-23) for the given seconds value
	 * @param  {number} seconds The number of seconds
	 * @return {integer} the number of hours (0-23) for the given seconds value
	 */
	static hours (seconds) {
		return Math.floor((seconds % secondsPerDay) / secondsPerHour);
	}

	/**
	 * Get the number of days for the given seconds value
	 * @param  {number} seconds The number of seconds
	 * @return {integer} the number of days for the given seconds value
	 */
	static days (seconds) {
		return Math.floor(seconds / secondsPerDay);
	}

	componentWillMount () {
		const {value = 0} = this.props;
		this.setState({value});
	}

	componentDidMount () {
		// this.hours.focus();
	}

	getValue () {
		const days = this.days.value;
		const hours = this.hours.value;
		const minutes = this.minutes.value;
		return (days * secondsPerDay) + (hours * secondsPerHour) + (minutes * 60);
	}

	inputChanged () {

		const value = this.getValue();

		this.setState({value});

		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	render () {

		const {value} = this.state;
		const days = this.constructor.days(value);
		const hours = this.constructor.hours(value);
		const minutes = this.constructor.minutes(value);

		return (
			<div className="duration-picker">
				<label>
					<span className="label">Days</span>
					<NumberInput ref={x => this.days = x}
						type="number"
						onChange={this.inputChanged}
						defaultValue={days}
						min="0"
					/>
				</label>
				<label>
					<span className="label">Hours</span>
					<NumberInput ref={x => this.hours = x}
						type="number"
						onChange={this.inputChanged}
						defaultValue={hours}
						min={0} max={23}
					/>
				</label>
				<label>
					<span className="label">Minutes</span>
					<NumberInput ref={x => this.minutes = x}
						type="number"
						onChange={this.inputChanged}
						defaultValue={minutes}
						min="0"
						max="59"
					/>
				</label>
			</div>
		);
	}
}
