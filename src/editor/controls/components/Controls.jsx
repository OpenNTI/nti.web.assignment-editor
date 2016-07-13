import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import ActionQueue from '../../../action-queue';

import PublishControls from './PublishControls';
import FormatControls from './FormatControls';
import EditorStatus from './Status';

export default class Controls extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		undoQueue: React.PropTypes.object
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


	componenWillUnmount () {
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
		const {assignment, undoQueue} = this.props;

		return (
			<div className="assignment-editor-controls">
				<ActionQueue queue={undoQueue} />
				<FormatControls selection={selection} />
				<EditorStatus />
				<PublishControls assignment={assignment} />
			</div>
		);
	}
}
