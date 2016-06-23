import React from 'react';
import cx from 'classnames';
import {TextEditor, valuesEqual} from 'nti-modeled-content';
import autobind from 'nti-commons/lib/autobind';

import Selectable from '../../utils/Selectable';
import ControlsConfig from '../../controls/ControlsConfig';

const PLACEHOLDER = '';

/**
 * Render a choice for a assignment question.
 *
 * the choice object should look like:
 * {
 * 		MimeType: String,
 * 		label: String,
 * 		NTIID | ID: String,
 * 		error: Object//the active error for the choice
 * }
 */
export default class Choice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		error: React.PropTypes.object,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		plainText: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {choice, error} = this.props;

		this.isNew = choice.isNew;

		this.state = {
			label: choice.label,
			selectableId: choice.NTIID || choice.ID,
			selectableValue: new ControlsConfig(),
			error
		};

		this.setEditorRef = x => this.editorRef = x;

		autobind(this,
			'onUnselect',
			'onSelect',
			'onEditorFocus',
			'onEditorChange',
			'onEditorBlur'
		);
	}


	componentWillReceiveProps (nextProps) {
		const {choice: newChoice, error:newError} = nextProps;
		const {choice: oldChoice, error:oldError} = this.props;
		let state = null;

		this.updatedLabel = newChoice.label;

		if (newChoice !== oldChoice && !this.isFocused) {
			state = state || {};

			delete this.updatedLabel;
			state.label = newChoice.label;
			state.selectableId = newChoice.NTIID || newChoice.ID;
		}

		if (newError !== oldError) {
			state = state || {};

			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	componentDidMount () {
		if (this.isNew && this.editorRef) {
			this.editorRef.focus();
			delete this.isNew;
		}
	}


	getLabelFromState () {
		const {label} = this.state;

		return this.updatedLabel || label;
	}


	onChange () {
		const {onChange, choice} = this.props;
		const oldLabel = this.getLabelFromState();
		const label = this.editorRef && this.editorRef.getValue();

		if (onChange && !valuesEqual(oldLabel, label)) {
			onChange({...choice, label: label});
		}
	}


	onEditorChange () {
		const {error} = this.state;
		const oldLabel = this.getLabelFromState();
		const newLabel = this.editorRef && this.editorRef.getValue();

		if (error && error.clear && !valuesEqual(oldLabel, newLabel)) {
			this.onChange();
			error.clear();
		}
	}


	onEditorFocus () {
		this.isFocused = true;

		this.setState({
			selectableValue: new ControlsConfig(this.editorRef)
		});
	}


	onEditorBlur () {
		this.isFocused = null;
	}


	onSelect () {
		if (this.inputRef) {
			this.inputRef.focus();
		}
	}


	onUnselect () {
		this.onChange();
	}


	render () {
		const {className, choice} = this.props;
		const {label, error, selectableId, selectableValue} = this.state;
		const cls = cx(className, 'assignment-input-choice', {error, correct: choice.correct});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onSelect={this.onSelect} onUnselect={this.onUnselect}>
				<TextEditor
					ref={this.setEditorRef}
					initialValue={label}
					placeholder={PLACEHOLDER}
					onFocus={this.onEditorFocus}
					onBlur = {this.onEditorBlur}
					onChange={this.onEditorChange}
				/>
			</Selectable>
		);
	}
}
