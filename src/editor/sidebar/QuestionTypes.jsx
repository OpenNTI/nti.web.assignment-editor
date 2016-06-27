import React from 'react';
import {HOC} from 'nti-web-commons';
import autobind from 'nti-commons/lib/autobind';

import {getButtons} from '../assignment-inputs';

const {ItemChanges} = HOC;

function getQuestionSetFrom (assignment) {
	const {parts} = assignment;
	const part = parts && parts[0];
	const {'question_set':questionSet} = part || {};

	return questionSet;
}

export default class QuestionTypes extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		schema: React.PropTypes.object,
		activeQuestion: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		autobind(this, 'onChange');
	}


	onChange () {
		this.forceUpdate();
	}


	render () {
		const {assignment, activeQuestion} = this.props;
		const questionSet = getQuestionSetFrom(assignment);
		const item = questionSet && !questionSet.isPlaceholder ? questionSet : assignment;

		return (
			<ItemChanges item={item} onItemChanged={this.onChange}>
				<div className="question-types">
					{getButtons(null, assignment, activeQuestion)}
				</div>
			</ItemChanges>
		);
	}
}
