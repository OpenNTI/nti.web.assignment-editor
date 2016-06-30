import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const LABEL = 'Multiple Answer';
const ICON_CLS = 'multiple-choice multiple-answer';

const defaultChoices = ['Choice 1'];
const defaultSolution = [0];
const defaultHint = [];

export default class MultipleChoiceMultipleAnswerButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		activeInsert: React.PropTypes.object
	}

	static set handles (handles) {
		this.handledMimetypes = handles;
	}

	static get handles () {
		return this.handledMimetypes;
	}

	render () {
		const {assignment, activeInsert} = this.props;
		const {handles} = this.constructor;

		return (
			<Button
				part={this.getBlankPart()}
				assignment={assignment}
				activeInsert={activeInsert}
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
