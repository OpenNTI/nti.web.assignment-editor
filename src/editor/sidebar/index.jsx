import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import QuestionTypes from './QuestionTypes';
import TabBar from './header';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';


function getActiveQuestionInsertFromSelection (selection) {
	const activeSelection = selection && selection[0];//For now just look at the first one
	const activeInsert = activeSelection && activeSelection.value && activeSelection.value.insertAt;
	const item = activeInsert && activeInsert.item;

	return item && item.MimeType === QUESTION_TYPE ? activeInsert : null;
}


export default class Editor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object,
		selection: React.PropTypes.any
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
		const {assignment, schema} = this.props;
		const {selection} = this.state;

		const activeInsert = getActiveQuestionInsertFromSelection(selection);

		if (!assignment) {
			return (
				<div className="assignment-editing-sidebar loading"></div>
			);
		}


		return (
			<div className="assignment-editing-sidebar">
				<TabBar />
				<QuestionTypes assignment={assignment} schema={schema} selection={selection} activeInsert={activeInsert} />
			</div>
		);
	}
}
