import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const defaultChoices = ['Choice 1'];
const defaultSolution = [0];
const defaultHint = [];

export default class MultipleChoiceMultipleAnswerButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		activeQuestion: React.PropTypes.object
	}

	label = 'Multiple Choice Multiple Answer'
	defaultQuestionContent = 'Multiple Choice Multiple Answer Question'
	iconCls = 'multiple-choice multiple-answer'

	render () {
		const {assignment, activeQuestion} = this.props;
		return (
			<Button
				part={this.getBlankPart()}
				assignment={assignment}
				activeQuestion={activeQuestion}
				label={this.label}
				defaultQuestionContent={this.defaultQuestionContent}
				handles={this.handles}
				iconCls={this.iconCls} />
		);
	}

	getBlankPart () {
		const {handles} = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, this.defaultQuestionContent, defaultChoices, defaultSolution, defaultHint);
		}
	}
}
