import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { buffer, Events } from '@nti/lib-commons';

import { DragHandle } from '../../../dnd';
import { Component as Selectable } from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';

const { getKeyCode } = Events;

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
		choice: PropTypes.object,
		error: PropTypes.object,
		className: PropTypes.string,
		onChange: PropTypes.func,
		onDelete: PropTypes.func,
		insertNewChoiceAfter: PropTypes.func,
		focusNext: PropTypes.func,
		focusPrev: PropTypes.func,
		maybeDeleteRow: PropTypes.func,
	};

	constructor(props) {
		super(props);

		const { choice, error } = this.props;

		this.isNew = choice.isNew;

		this.state = {
			label: choice.label,
			selectableId: choice.NTIID || choice.ID,
			selectableValue: new ControlsConfig(),
			error,
		};

		this.setEditorRef = x => (this.editorRef = x);
	}

	componentDidUpdate(prevProps) {
		const { choice: newChoice, error: newError } = this.props;
		const { choice: oldChoice, error: oldError } = prevProps;
		let state = null;

		this.updatedLabel = newChoice.label;
		this.isNew = newChoice.isNew;

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

		if (this.isNew) {
			this.doFocus();
			delete this.isNew;
		}

		this.addListener();
	}

	componentDidMount() {
		this.addListener();

		if (this.isNew && this.editorRef) {
			this.doFocus();
			delete this.isNew;
		}
	}

	componentWillUnmount() {
		this.removeListener();
	}

	addListener(choice) {
		this.removeListener();

		const { choice: propChoice } = this.props;
		const listenTo = choice || propChoice;

		if (listenTo) {
			listenTo.addListener('focus', this.doFocus);
		}
	}

	removeListener() {
		const { choice } = this.props;

		if (choice) {
			choice.removeListener('focus', this.doFocus);
		}
	}

	doFocus = where => {
		if (this.editorRef) {
			if (where && this[where]) {
				this[where]();
			} else {
				this.editorRef.focus();
			}
		}
	};

	focusToEnd = () => {
		const dom = this.editorRef;
		if (dom) {
			const { value } = dom;
			const { length } = value;

			dom.focus();
			dom.setSelectionRange(length, length);
		}
	};

	areLabelsEqual(oldLabel, label) {
		return oldLabel === label;
	}

	onChange = buffer(5000, () => {
		const { onChange, choice: oldChoice } = this.props;
		const oldLabel = oldChoice.label;
		const { label } = this.state;

		if (onChange && !this.areLabelsEqual(oldLabel, label)) {
			let newChoice = oldChoice.clone();
			newChoice.label = label;

			onChange(newChoice);
		}
	});

	onInputChange = e => {
		const { error, label } = this.state;

		this.setState({
			label: e.target.value,
		});

		if (!this.areLabelsEqual(label, e.target.value)) {
			this.onChange();

			if (error && error.clear) {
				error.clear();

				this.onChange.flush();
			}
		}
	};

	onInputFocus = () => {
		this.isFocused = true;
	};

	onInputBlur = () => {
		this.isFocused = null;
		this.onChange();
		this.onChange.flush();
	};

	onInputKeyDown = e => {
		const {
			focusNext,
			focusPrev,
			insertNewChoiceAfter,
			maybeDeleteRow,
			choice,
		} = this.props;
		const { label } = this.state;
		const code = getKeyCode(e);

		if (code === getKeyCode.ENTER && insertNewChoiceAfter) {
			insertNewChoiceAfter(choice);
		} else if (code === getKeyCode.SHIFT_TAB && focusPrev) {
			focusPrev(choice);
		} else if (code === getKeyCode.TAB && focusNext) {
			focusNext(choice);
		} else if (
			code === getKeyCode.BACKSPACE &&
			maybeDeleteRow &&
			(label === '' || label === ' ')
		) {
			e.preventDefault();
			e.stopPropagation();
			maybeDeleteRow(choice);
		}
	};

	onDelete = () => {
		const { onDelete } = this.props;

		if (onDelete) {
			onDelete();
		}
	};

	onSelect = () => {
		if (this.inputRef) {
			this.inputRef.focus();
		}
	};

	render() {
		const { className, choice, onDelete } = this.props;
		const { error, selectableId, selectableValue } = this.state;
		//Use the same class name as the other choice so css will style both
		const cls = cx(className, 'input-type-choice', {
			error,
			correct: choice.correct,
		});

		return (
			<Selectable
				className={cls}
				id={selectableId}
				value={selectableValue}
				onSelect={this.onSelect}
				onUnselect={this.onUnselect}
			>
				<DragHandle className="choice-drag-handle hide-when-saving" />
				{this.renderEditor()}
				{onDelete && (
					<div
						className="delete hide-when-saving"
						onClick={this.onDelete}
					>
						<i className="icon-remove" title="Delete Row" />
					</div>
				)}
			</Selectable>
		);
	}

	renderEditor() {
		const { label } = this.state;

		return (
			<input
				type="text"
				className="hide-when-saving"
				ref={this.setEditorRef}
				value={label}
				onKeyDown={this.onInputKeyDown}
				onChange={this.onInputChange}
				onFocus={this.onInputFocus}
				onBlur={this.onInputBlur}
				placeholder={PLACEHOLDER}
			/>
		);
	}
}
