import React from 'react';
import HistoryStack from './utils/HistoryStack';

// import AssigmentInfo from './editor-parts';

export default class AssignmentEditor extends React.Component {

	constructor (props) {
		super(props);
	}

	render () {
		let undoColor = this.stack.canUndo ? 'black' : 'grey';
		let redoColor = this.stack.canRedo ? 'black' : 'grey';

		return (
			<div>
				// <AssignmentInfo assignment={this.props.assignment} />
			</div>
		);
	}
}
