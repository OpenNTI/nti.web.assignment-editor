import React from 'react';
import isEmpty from 'isempty';
import cx from 'classnames';

import Token from './Token';

export default class TokenEditor extends React.Component {

	constructor (props) {
		super(props);
		this.state = {inputValue: ''};
	}

	static propTypes = {
		tokens: React.PropTypes.array,
		onFocus: React.PropTypes.func,
		className: React.PropTypes.string
	}

	get value () {
		return [...this.state.values];
	}

	componentWillMount () {
		this.setUp();
	}

	setUp (props = this.props) {
		this.setState({
			values: new Set(props.tokens)
		});
	}

	add = (value) => {
		let v = value;
		if (isEmpty(v)) {
			return;
		}
		if (!v.startsWith('.')) {
			v = '.' + v;
		}
		const {values} = this.state;
		values.add(v);
		this.setState({values});
	}

	remove = (value) => {
		const {values} = this.state;
		values.delete(value);
		this.setState({
			values
		});
	}

	clearInput = () => {
		this.setState({
			inputValue: ''
		});
	}

	focusInput = () => {
		if (this.input) {
			this.input.focus();
		}
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}

	onBlur = (e) => {
		this.add(e.target.value);
		this.clearInput();
	}

	onInputChange = (e) => {
		this.setState({
			inputValue: e.target.value
		});
	}

	onKeyDown = (e) => {
		const finishingKeys = ['Enter', 'Tab', ' ', ','];
		if (finishingKeys.indexOf(e.key) > -1) {
			e.stopPropagation();
			e.preventDefault();
			this.add(e.target.value);
			this.clearInput();
		}
		else if(isEmpty(e.target.value) && e.key === 'Backspace') {
			e.preventDefault();
			this.deleteLastValue();
		}
	}

	deleteLastValue = () => {
		const {values} = this.state;
		if (values.size > 0) {
			const lastValue = [...values][values.size - 1];
			values.delete(lastValue);
			this.setState({
				inputValue: lastValue
			});
		}
	}

	render () {

		const {values, inputValue} = this.state;

		const classes = cx('token-editor', this.props.className);

		return (
			<div className={classes} onClick={this.focusInput}>
				{values.size === 0 && inputValue.length === 0 && <span className="placeholder">Enter all the file types you want to accept</span>}
				{[...values].map(x => <Token key={x} value={x} onRemove={this.remove} />)}
				<input
					ref={x => this.input = x}
					onKeyDown={this.onKeyDown}
					onChange={this.onInputChange}
					onBlur={this.onBlur}
					value={inputValue}
				/>
			</div>
		);
	}

}
