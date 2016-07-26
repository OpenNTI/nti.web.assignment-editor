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
		previewAssignment: React.PropTypes.func
	}

	static contextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unselect: React.PropTypes.fn
		})
	}


	constructor (props) {
		super(props);

		this.state = {};

		autobind(this, 'selectionChanged');
	}


	componentDidMount () {
		const {SelectionManager} = this.context;

		if (SelectionManager) {
			SelectionManager.addListener('selection-changed', this.selectionChanged);
			this.selectionChanged(SelectionManager.getSelection());
		}
	}


	componentWillUnmount () {
		const {SelectionManager} = this.context;

		if (SelectionManager) {
			SelectionManager.removeListener('selection-changed', this.selectionChanged);
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
				{(assignment && assignment.hasLink('edit')) ?
					<PreviewControls previewAssignment={previewAssignment} /> :
					null
				}
				<EditorStatus />
				<PublishControls assignment={assignment} />
			</div>
		);
	}
}
