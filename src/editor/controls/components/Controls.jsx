import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import ActionStack from '../../../action-list';

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

		this.state = {};

		autobind(this, 'selectionChanged');
	}


	componentDidMount () {
		const {selectionManager} = this.props;

		if (selectionManager) {
			selectionManager.addListener('selection-changed', this.selectionChanged);
			this.selectionChanged(selectionManager.getSelection());
		}
	}


	componentWillUnmount () {
		const {selectionManager} = this.props;

		if (selectionManager) {
			selectionManager.removeListener('selection-changed', this.selectionChanged);
		}
	}


	selectionChanged (selection) {
		this.setState({
			selection
		});
	}

	render () {
		const {selection} = this.state;
		const {assignment, undoStack, previewAssignment} = this.props;

		return (
			<div className="assignment-editor-controls">
				<ActionStack stack={undoStack} />
				<FormatControls selection={selection} />
				{previewAssignment && (<PreviewControls previewAssignment={previewAssignment} />)}
				<EditorStatus />
				<PublishControls assignment={assignment} />
			</div>
		);
	}
}
