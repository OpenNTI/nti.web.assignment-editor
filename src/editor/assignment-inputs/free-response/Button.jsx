import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const LABEL = 'Free Response';
const DEFAULT_CONTENT = 'Free Response Question';
const DEFAULT_SOLUTION = ['Answer 1'];
const ICON_CLS = 'freeresponse';


export default class FreeResponseButton extends React.Component {
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
				defaultQuestionContent={DEFAULT_CONTENT}
				handles={handles}
				iconCls={ICON_CLS} />
		);
	}


	getBlankPart () {
		const {handles} = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, DEFAULT_CONTENT, DEFAULT_SOLUTION);
		}
		return {};
	}
}
