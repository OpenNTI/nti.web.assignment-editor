import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import {Dropzone} from '../../../dnd';

import {createPartWithQuestion} from '../Actions';
import {QUESTION_TYPE} from './QuestionSet';

const PLACEHOLDER = 'No questions yet. Select question from the right to add one.';

export default class NoParts extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		autobind(this, 'onQuestionAdded');

		this.accepts = [QUESTION_TYPE];
		this.dropHandlers = {
			[QUESTION_TYPE]: this.onQuestionAdded
		};
	}


	onQuestionAdded (data) {
		const {assignment} = this.props;

		createPartWithQuestion(assignment, data);
	}


	render () {
		return (
			<Dropzone className="assignment-editor-no-parts" accepts={this.accepts} dropHandlers={this.dropHandlers}>
				<div>
					{PLACEHOLDER}
				</div>
			</Dropzone>
		);
	}
}
