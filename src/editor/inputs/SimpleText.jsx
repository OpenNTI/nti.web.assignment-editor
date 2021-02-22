import React from 'react';
import PropTypes from 'prop-types';

export default class SimpleText extends React.Component {
	static propTypes = {
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		value: PropTypes.string,
		error: PropTypes.string,
	};

	static draultProps = {
		onBlur: () => {},
		onFocus: () => {},
		onChange: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
		};

		const bindList = ['onChange'];

		for (let fn of bindList) {
			this[fn] = this[fn].bind(this);
		}
	}

	onChange() {}

	render() {
		//TODO: render any errors passed in
		return (
			<input
				type="text"
				value={this.state.value}
				onFocus={this.props.onFocus}
				onBlur={this.props.onBlur}
				onChange={this.onChange}
			/>
		);
	}
}
