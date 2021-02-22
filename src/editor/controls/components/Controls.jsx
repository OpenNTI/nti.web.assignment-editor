import './Controls.scss';
import React from 'react';
import PropTypes from 'prop-types';

import ActionStack from '../../../action-list';
import { SAVING, SAVE_ENDED } from '../../Constants';
import Store from '../../Store';

import PublishControls from './PublishControls';
import FormatControls from './FormatControls';
import EditorStatus from './Status';
import PreviewControls from './PreviewControls';

export default class Controls extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		undoStack: PropTypes.object,
		selectionManager: PropTypes.object,
		previewAssignment: PropTypes.func,
	};

	static contextTypes = {
		SelectionManager: PropTypes.shape({
			select: PropTypes.func,
			unselect: PropTypes.func,
		}),
	};

	constructor(props) {
		super(props);

		this.state = {
			hasUpdated: false,
			isSaving: Store.isSaving,
		};
	}

	componentDidMount() {
		const { selectionManager } = this.props;

		if (selectionManager) {
			selectionManager.addListener(
				'selection-changed',
				this.selectionChanged
			);
			this.selectionChanged(selectionManager.getSelection());
		}

		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount() {
		const { selectionManager } = this.props;

		if (selectionManager) {
			selectionManager.removeListener(
				'selection-changed',
				this.selectionChanged
			);
		}

		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = data => {
		const { type } = data;

		if (type === SAVING || type === SAVE_ENDED) {
			this.onSaveChanged();
		}
	};

	onSaveChanged() {
		const { isSaving } = this.state;

		if (isSaving !== Store.isSaving) {
			this.setState({
				hasUpdated: true,
				isSaving: Store.isSaving,
			});
		}
	}

	selectionChanged = selection => {
		this.setState({
			selection,
		});
	};

	render() {
		const { selection, hasUpdated, isSaving } = this.state;
		const { assignment, undoStack, previewAssignment } = this.props;

		return (
			<div className="assignment-editor-controls">
				<ActionStack stack={undoStack} />
				<FormatControls selection={selection} />
				{previewAssignment && (
					<PreviewControls previewAssignment={previewAssignment} />
				)}
				<EditorStatus hasUpdated={hasUpdated} isSaving={isSaving} />
				<PublishControls assignment={assignment} isSaving={isSaving} />
			</div>
		);
	}
}
