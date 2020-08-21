import './Choice.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Events} from '@nti/lib-commons';

import BufferedTextEditor from '../../inputs/BufferedTextEditor';
import {DragHandle} from '../../../dnd';
import SyncHeight from '../../../sync-height';
import {Component as Selectable} from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';

const {getKeyCode} = Events;

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
export default class Choice extends React.Component {
	static propTypes = {
		choice: PropTypes.object,
		heightSyncGroup: PropTypes.object,
		error: PropTypes.object,
		className: PropTypes.string,
		onChange: PropTypes.func,
		onDelete: PropTypes.func,
		plainText: PropTypes.bool,
		insertNewChoiceAfter: PropTypes.func,
		focusNext: PropTypes.func,
		focusPrev: PropTypes.func,
		maybeDeleteRow: PropTypes.func
	}


	setSyncRef = x => this.syncRef = x

	constructor (props) {
		super(props);

		const {choice} = this.props;

		this.isNew = choice.isNew;

		this.state = {
			selectableId: choice.NTIID || choice.ID,
			selectableValue: new ControlsConfig()
		};

		this.setEditorRef = x => this.editorRef = x;
	}


	componentWillReceiveProps (nextProps) {
		const {choice:newChoice} = nextProps;
		const {choice:oldChoice} = this.props;

		if (newChoice !== oldChoice && newChoice.isNew) {
			this.isNew = true;
		}
	}


	componentDidUpdate () {
		if (this.isNew) {
			this.doFocus();
			delete this.isNew;
		}

		this.addListener();
	}


	componentDidMount () {
		this.addListener();
		this.syncHeight();

		if (this.isNew && this.editorRef) {
			setTimeout(() => {
				this.doFocus();
			}, 1);
			delete this.isNew;
		}
	}


	componentWillUnmount () {
		this.removeListener();
	}


	addListener (choice) {
		this.removeListener();

		const {choice:propChoice} = this.props;
		const listenTo = choice || propChoice;

		if (listenTo) {
			listenTo.addListener('focus', this.doFocus);
		}
	}


	removeListener () {
		const {choice} = this.props;

		if (choice) {
			choice.removeListener('focus', this.doFocus);
		}
	}


	doFocus = (where) => {
		if (this.editorRef) {
			if (where && this.editorRef[where]) {
				this.editorRef[where]();
			} else {
				this.editorRef.focus();
			}
		}
	}


	focusToEnd = () => {
		if(this.editorRef) {
			this.editorRef.focusToEnd();
		}
	}


	syncHeight = () => {
		if (this.syncRef && this.syncRef.updateHeight) {
			this.syncRef.updateHeight();
		}
	}


	onChange = (label) => {
		const {onChange, choice:oldChoice} = this.props;

		if (onChange) {
			let newChoice = oldChoice.clone();
			newChoice.label = label;

			onChange(newChoice);
		}
	}


	onEditorFocus = (editor) => {
		this.setState({
			selectableValue: new ControlsConfig(editor)
		});
	}


	onDelete = () => {
		const {onDelete} = this.props;

		if (onDelete) {
			onDelete();
		}
	}


	onTabKey = () => {
		const {focusNext, choice} = this.props;

		return focusNext && focusNext(choice);
	}


	onShiftTabKey = () => {
		const {focusPrev, choice} = this.props;

		return focusPrev && focusPrev(choice);
	}


	onEnterKey = () => {
		const {insertNewChoiceAfter, choice} = this.props;

		return insertNewChoiceAfter && insertNewChoiceAfter(choice);
	}


	onBackspaceKey = () => {
		const {maybeDeleteRow, choice} = this.props;
		const value = this.editorRef.getValue();

		if (!value && maybeDeleteRow) {
			maybeDeleteRow(choice);
		}

		return false;
	}


	render () {
		const {className, choice, heightSyncGroup, onDelete, error} = this.props;
		const {selectableId, selectableValue} = this.state;
		const cls = cx(className, 'input-type-choice', {error, correct: choice.correct});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue}>
				<DragHandle className="choice-drag-handle hide-when-saving" />
				<SyncHeight ref={this.setSyncRef} group={heightSyncGroup}>
					{this.renderEditor()}
				</SyncHeight>
				{onDelete && (<div className="delete hide-when-saving" onClick={this.onDelete}><i className="icon-remove" title="Delete Row"/></div>)}
			</Selectable>
		);
	}


	renderEditor () {
		const {choice, error} = this.props;

		return (
			<BufferedTextEditor
				ref={this.setEditorRef}
				initialValue={choice.label}
				placeholder={PLACEHOLDER}
				onFocus={this.onEditorFocus}
				onChange={this.onChange}
				onEditorChange={this.syncHeight}
				error={error}
				inlineOnly
				customKeyBindings={{
					[getKeyCode.TAB]: this.onTabKey,
					[getKeyCode.SHIFT_TAB]: this.onShiftTabKey,
					[getKeyCode.ENTER]: this.onEnterKey,
					[getKeyCode.BACKSPACE]: this.onBackspaceKey
				}}
			/>
		);
	}
}

Placeholder.propTypes = {
	correct: PropTypes.bool
};
export function Placeholder ({correct}) {
	return (
		<div className={cx('input-type-choice', 'placeholder', {correct})}>
			<DragHandle className="choice-drag-handle" force />
			<div className="placeholder-text" />
			<div className="delete hide-when-saving"><i className="icon-remove" title="Delete Row" /></div>
		</div>
	);
}
