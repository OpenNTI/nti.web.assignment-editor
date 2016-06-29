import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const LABEL = 'Essay';
const ICON_CLS = 'essay';

export default class EssayButton extends React.Component {
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
		const mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType);
		}
		return {};
	}
}
