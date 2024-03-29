import React from 'react';
import PropTypes from 'prop-types';

export default class TextArea extends React.Component {
	static propTypes = {
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		className: PropTypes.string,
		value: PropTypes.string,
		placeholder: PropTypes.string,
		error: PropTypes.string,
	};

	static defaultProps = {
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

	getValue() {
		const { value } = this.state;

		return value;
	}

	onChange(e) {
		const { onChange } = this.props;
		const value = e.target.value;

		this.setState({
			value: value,
		});

		if (onChange) {
			onChange(value);
		}
	}

	render() {
		//TODO: render any errors passed in
		const { className } = this.props;

		return (
			<textarea
				type="text"
				value={this.state.value}
				className={className}
				placeholder={this.props.placeholder}
				onFocus={this.props.onFocus}
				onBlur={this.props.onBlur}
				onChange={this.onChange}
				style={{ width: '100%', resize: 'none', border: 'none' }}
			/>
		);
	}
}
