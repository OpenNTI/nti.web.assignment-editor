import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './Actions';

const defaultChoices = ['Choice 1'];
const defaultSolution = 0;
const defaultHint = [];

export default class MultipleChoiceButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		activeQuestion: React.PropTypes.object
	}

	static set handles (handles) {
		this.handledMimetypes = handles;
	}

	static get handles () {
		return this.handledMimetypes;
	}

	label = 'Multiple Choice'
	defaultQuestionContent = 'Multiple Choice Question'
	iconCls = 'multiple-choice'


	render () {
		const {assignment, activeQuestion} = this.props;
		const {handles} = this.constructor;
		return (
			<Button
				part={this.getBlankPart()}
				assignment={assignment}
				activeQuestion={activeQuestion}
				label={this.label}
				defaultQuestionContent={this.defaultQuestionContent}
				handles={handles}
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
