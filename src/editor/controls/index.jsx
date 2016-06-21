import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import FormatControls from './FormatControls';

export default class Controls extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object
	}

	static contextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unseleft: React.PropTypes.fn
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

		return (
			<div className="assignment-editor-controls">
				<FormatControls selection={selection} />
			</div>
		);
	}
}
