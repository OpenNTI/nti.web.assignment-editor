import React from 'react';
import AssignmentInfo from './editor-parts/assignment-info';
import Controls from './editor-parts/controls';
import SelectionManager from './utils/SelectionManager';

let selectionManager = new SelectionManager();

export default class AssignmentEditor extends React.Component {

	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unseleft: React.PropTypes.fn
		})
	}


	constructor (props) {
		super(props);
	}


	getChildContext () {
		return {
			SelectionManager: selectionManager
		};
	}


	render () {
		return (
			<div>
				<Controls />
				<AssignmentInfo assignment={this.props.assignment} />
			</div>
		);
	}
}
