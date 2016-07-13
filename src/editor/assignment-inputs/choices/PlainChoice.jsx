import React from 'react';
import cx from 'classnames';
import getKeyCode from 'nti-commons/lib/get-key-code';
import buffer from 'nti-commons/lib/function-buffer';

import {DragHandle} from '../../../dnd';
import Selectable from '../../utils/Selectable';
import ControlsConfig from '../../controls/ControlsConfig';

const PLACEHOLDER = '';

/*
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
export default class PlainChoice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		error: React.PropTypes.object,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onDelete: React.PropTypes.func,
		insertNewChoiceAfter: React.PropTypes.func,
		focusNext: React.PropTypes.func,
		focusPrev: React.PropTypes.func
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


	areLabelsEqual (oldLabel, label) {
		return oldLabel === label;
	}


	onChange = buffer(5000, () => {
		const {onChange, choice:oldChoice} = this.props;
		const oldLabel = oldChoice.label;
		const {label} = this.state;

		if (onChange && !this.areLabelsEqual(oldLabel, label)) {
			let newChoice = oldChoice.clone();
			newChoice.label = label;

			onChange(newChoice);
		}
	})


	onInputChange = (e) => {
		const {error, label} = this.state;

		this.setState({
			label: e.target.value
		});

		if (!this.areLabelsEqual(label, e.target.value)) {
			this.onChange();

			if (error && error.clear) {
				error.clear();

				this.onChange.flush();
			}
		}
	}


	onInputFocus = () => {
		this.isFocused = true;
	}


	onInputBlur = () => {
		this.isFocused = null;
		this.onChange();
		this.onChange.flush();
	}


	onInputKeyPress = (e) => {
		const {focusNext, focusPrev, insertNewChoiceAfter, choice} = this.props;
		const code = getKeyCode(e);

		if (code === getKeyCode.ENTER && insertNewChoiceAfter) {
			insertNewChoiceAfter(choice);
		}  else if (code === getKeyCode.SHIFT_TAB && focusPrev) {
			focusPrev();
		} else if (code === getKeyCode.TAB && focusNext) {
			focusNext();
		}
	}


	onDelete = () => {
		const {onDelete} = this.props;

		if (onDelete) {
			onDelete();
		}
	}


	onSelect = () => {
		if (this.inputRef) {
			this.inputRef.focus();
		}
	}


	render () {
		const {className, choice, onDelete} = this.props;
		const {error, selectableId, selectableValue} = this.state;
		//Use the same class name as the other choice so css will style both
		const cls = cx(className, 'assignment-input-choice', {error, correct: choice.correct});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onSelect={this.onSelect} onUnselect={this.onUnselect}>
				<DragHandle className="choice-drag-handle hide-when-saving" />
				{this.renderEditor()}
				{onDelete && (<div className="delete hide-when-saving" onClick={this.onDelete}><i className="icon-remove" title="Delete Row"/></div>)}
			</Selectable>
		);
	}


	renderEditor () {
		const {label} = this.state;

		return (
			<input
				type="text"
				className="hide-when-saving"
				ref={this.setEditorRef}
				value={label}
				onKeyPress={this.onInputKeyPress}
				onChange={this.onInputChange}
				onFocus={this.onInputFocus}
				onBlur={this.onInputBlur}
				placeholder={PLACEHOLDER}
			/>
		);
	}
}
