import React from 'react';

import {NumberInput} from 'nti-web-commons';

export default class TimeLimitEditor extends React.Component {
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

	componentWillMount () {
		const {value = 0} = this.props;
		this.setState({value});
	}

	componentDidMount () {
		// this.hours.focus();
	}

	getValue () {
		const hours = this.hours.value;
		const minutes = this.minutes.value;
		return (hours * 3600) + (minutes * 60);
	}

	inputChanged () {

		const value = this.getValue();

		this.setState({value});

		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	render () {

		const h = (v) => Math.floor(v / 3600);
		const m = (v) => Math.floor((v - (h(v) * 3600)) / 60);

		const {value} = this.state;
		const hours = h(value);
		const minutes = m(value);

		return (
			<div className="duration-picker">
				<NumberInput ref={x => this.hours = x}
					type="number"
					onChange={this.inputChanged}
					defaultValue={hours}
					min="0"
				/>
				<span> : </span>
				<NumberInput ref={x => this.minutes = x}
					type="number"
					onChange={this.inputChanged}
					defaultValue={minutes}
					min="0"
					max="59"
				/>
			</div>
		);
	}
}
