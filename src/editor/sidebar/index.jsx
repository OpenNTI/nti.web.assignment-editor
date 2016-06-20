import React from 'react';
import QuestionTypes from './QuestionTypes';
import TabBar from './header';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';

export default class Editor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object,
		selection: React.PropTypes.any
	}


	shouldComponentUpdate (nextProps) {
		const {assignment:oldAssignment, schema:oldSchema, selection:oldSelection} = this.props;
		const {assignment:newAssignment, schema:newSchema, selection:newSelection} = nextProps;

		return oldAssignment !== newAssignment || oldSchema !== newSchema || oldSelection !== newSelection;
	}



	render () {
		const {assignment, schema, selection} = this.props;

		if (!assignment) {
			return (
				<div className="assignment-editing-sidebar loading"></div>
			);
		}

		const activeSelection = selection && selection[0];
		const activeItem = activeSelection && activeSelection.value && activeSelection.value.item;
		const activeQuestion = activeItem && activeItem.MimeType === QUESTION_TYPE ? activeItem : null;

		return (
			<div className="assignment-editing-sidebar">
				<TabBar />
				<QuestionTypes assignment={assignment} schema={schema} selection={selection} activeQuestion={activeQuestion} />
			</div>
		);
	}
}
