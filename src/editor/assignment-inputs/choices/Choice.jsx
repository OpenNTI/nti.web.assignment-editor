import React from 'react';
import cx from 'classnames';

import getKeyCode from 'nti-commons/lib/get-key-code';
import BufferedTextEditor from '../../inputs/BufferedTextEditor';

import {DragHandle} from '../../../dnd';
import SyncHeight from '../../../sync-height';
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
export default class Choice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		heightSyncGroup: React.PropTypes.object,
		error: React.PropTypes.object,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onDelete: React.PropTypes.func,
		plainText: React.PropTypes.bool,
		insertNewChoiceAfter: React.PropTypes.func,
		focusNext: React.PropTypes.func,
		focusPrev: React.PropTypes.func
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
			this.doFocus();
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


	doFocus = () => {
		if (this.editorRef) {
			this.editorRef.focus();
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


	onDeleteKey = () => {
		//TODO: fill this out
	}


	render () {
		const {className, choice, heightSyncGroup, onDelete, error} = this.props;
		const {selectableId, selectableValue} = this.state;
		const cls = cx(className, 'assignment-input-choice', {error, correct: choice.correct});

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
				customBindings={{
					[getKeyCode.TAB]: this.onTabKey,
					[getKeyCode.SHIFT_TAB]: this.onShiftTabKey,
					[getKeyCode.ENTER]: this.onEnterKey,
					[getKeyCode.DELETE]: this.onDeleteKey
				}}
			/>
		);
	}
}
