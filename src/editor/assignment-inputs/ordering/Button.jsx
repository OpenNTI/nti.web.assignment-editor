import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const LABEL = 'Ordering';
const ICON_CLS = 'ordering';

const defaultLabels = ['Label 1', 'Label 2'];
const defaultValues = ['Value 1', 'Label 2'];
const defaultSolution = {'0': 0, '1': 1};

export default class OrderingButton extends React.Component {
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
			return generatePartFor(mimeType, null, defaultLabels, defaultValues, defaultSolution);
		}
		return {};
	}
}
