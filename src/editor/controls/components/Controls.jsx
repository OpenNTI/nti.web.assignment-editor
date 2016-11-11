import React from 'react';

import ActionStack from '../../../action-list';
import {
	SAVING,
	SAVE_ENDED
} from '../../Constants';
import Store from '../../Store';

import PublishControls from './PublishControls';
import FormatControls from './FormatControls';
import EditorStatus from './Status';
import PreviewControls from './PreviewControls';

export default class Controls extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		undoStack: React.PropTypes.object,
		selectionManager: React.PropTypes.object,
		previewAssignment: React.PropTypes.func
	}

	static contextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.func,
			unselect: React.PropTypes.func
		})
	}


	constructor (props) {
		super(props);

		this.state = {
			hasUpdated: false,
			isSaving: Store.isSaving
		};
	}


	componentDidMount () {
		const {selectionManager} = this.props;

		if (selectionManager) {
			selectionManager.addListener('selection-changed', this.selectionChanged);
			this.selectionChanged(selectionManager.getSelection());
		}

		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		const {selectionManager} = this.props;

		if (selectionManager) {
			selectionManager.removeListener('selection-changed', this.selectionChanged);
		}

		Store.removeChangeListener(this.onStoreChange);
	}


	onStoreChange = (data) => {
		const {type} = data;

		if (type === SAVING || type === SAVE_ENDED) {
			this.onSaveChanged();
		}
	}


	onSaveChanged () {
		const {isSaving} = this.state;

		if (isSaving !== Store.isSaving) {
			this.setState({
				hasUpdated: true,
				isSaving: Store.isSaving
			});
		}
	}


	selectionChanged = (selection) => {
		this.setState({
			selection
		});
	}

	render () {
		const {selection, hasUpdated, isSaving} = this.state;
		const {assignment, undoStack, previewAssignment} = this.props;

		return (
			<div className="assignment-editor-controls">
				<ActionStack stack={undoStack} />
				<FormatControls selection={selection} />
				{previewAssignment && (<PreviewControls previewAssignment={previewAssignment} />)}
				<EditorStatus hasUpdated={hasUpdated} isSaving={isSaving} />
				<PublishControls assignment={assignment} isSaving={isSaving} />
			</div>
		);
	}
}
