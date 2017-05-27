import React from 'react';
import PropTypes from 'prop-types';
import {TextEditor, valuesEqual} from 'nti-modeled-content';
import {buffer} from 'nti-commons';

const DEFAULT_BUFFER = 5000;

export default class BufferedTextEditor extends React.Component {
	static propTypes = {
		initialValue: PropTypes.string,
		onChange: PropTypes.func,
		onEditorChange: PropTypes.func,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		buffer: PropTypes.number,
		error: PropTypes.object,
		warning: PropTypes.object
	}


	static defaultProps = {
		buffer: DEFAULT_BUFFER
	}


	setEditorRef = x => this.editorRef = x


	constructor (props) {
		super(props);

		const {initialValue, buffer:bufferTime} = props;

		this.bufferedChange = buffer(bufferTime, () => this.onChange());

		this.state = {
			initialValue
		};
	}


	componentWillReceiveProps (nextProps) {
		const {initialValue:newValue, buffer:newBuffer} = nextProps;
		const {initialValue:oldValue, buffer:oldBuffer, onEditorChange} = this.props;
		let state;


		if (newBuffer !== oldBuffer) {
			this.bufferedChange = buffer(newBuffer, () => this.onChange());
		}

		this.updatedValue = this.updatedValue || (!this.isFocused && newValue);

		if (newValue !== oldValue && !this.isFocused) {
			state = state || {};

			state.initialValue = newValue;
		}


		if (state) {
			this.setState(state, () => {
				if (onEditorChange) {
					onEditorChange();
				}
			});
		}
	}


	get editor () {
		return this.editorRef;
	}


	focus () {
		if (this.editorRef && this.editorRef.focus) {
			this.editorRef.focus();
		}
	}


	focusToEnd () {
		if (this.editorRef && this.editorRef.focusToEnd) {
			this.editorRef.focusToEnd();
		}
	}


	getValue () {
		return this.editorRef && this.editorRef.getValue();
	}


	getValueFromState () {
		const {initialValue} = this.state;

		return this.updatedValue || initialValue;
	}


	hasValueChanged () {
		const oldValue = this.getValueFromState();
		const newValue = this.getValue();

		return !valuesEqual(oldValue, newValue);
	}


	onChange () {
		const {onChange} = this.props;
		const newValue = this.getValue();

		if (onChange && this.hasValueChanged()) {
			this.updatedValue = newValue;
			onChange(newValue);
		}
	}


	onEditorChange = () => {
		const {onEditorChange, error, warning} = this.props;

		if (this.hasValueChanged()) {
			if (onEditorChange) {
				onEditorChange();
			}

			this.bufferedChange();

			if (error && error.clear) {
				error.clear();

				this.bufferedChange.flush();
			} else if (warning && warning.clear) {
				warning.clear();

				this.bufferedChange.flush();
			}
		}
	}


	onEditorFocus = () => {
		const {onFocus} = this.props;

		this.isFocused = true;

		if (onFocus) {
			onFocus(this.editorRef);
		}
	}


	onEditorBlur = () => {
		const {onBlur} = this.props;

		this.isFocused = null;

		this.bufferedChange();
		this.bufferedChange.flush();

		if (onBlur) {
			onBlur(this.editorRef);
		}
	}


	render () {
		const {error, warning, ...otherProps} = this.props;
		const {initialValue} = this.state;

		delete otherProps.onEditorChange;
		delete otherProps.onChange;
		delete otherProps.onBlur;
		delete otherProps.onFocus;

		return (
			<TextEditor
				{...otherProps}
				ref={this.setEditorRef}
				initialValue={initialValue}
				error={error}
				warning={warning}
				onChange={this.onEditorChange}
				onBlur={this.onEditorBlur}
				onFocus={this.onEditorFocus}
			/>
		);
	}
}
