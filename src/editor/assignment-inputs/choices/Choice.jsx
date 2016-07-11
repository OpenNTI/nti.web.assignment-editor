import React from 'react';
import cx from 'classnames';

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
		plainText: React.PropTypes.bool
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


	componentDidMount () {
		this.syncHeight();

		if (this.isNew && this.editorRef) {
			this.editorRef.focus();
			delete this.isNew;
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
			/>
		);
	}
}
