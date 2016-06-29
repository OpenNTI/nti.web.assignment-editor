import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const LABEL = 'Multiple Choice';
const ICON_CLS = 'multiple-choice';

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


	render () {
		const {assignment, activeQuestion} = this.props;
		const {handles} = this.constructor;

		return (
			<Button
				part={this.getBlankPart()}
				assignment={assignment}
				activeQuestion={activeQuestion}
				label={LABEL}
				handles={handles}
				iconCls={ICON_CLS} />
		);
	}


	getBlankPart () {
		const {handles} = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, null, defaultChoices, defaultSolution, defaultHint);
		}
	}
}
