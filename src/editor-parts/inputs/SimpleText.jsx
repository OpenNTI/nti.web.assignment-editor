import React from 'react';

export default class SimpleText extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		value: React.PropTypes.string,
		error: React.PropTypes.string
	}

	static draultProps = {
		onBlur: () => {},
		onFocus: () => {},
		onChange: () => {}
	}

	constructor (props) {
		super(props);

		this.state = {
			value: props.value
		};

		const bindList = [
			'onChange'
		];

		for (let fn of bindList) {
			this[fn] = this[fn].bind(this);
		}
	}


	onChange (e) {
		debugger;
	}


	render () {
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
