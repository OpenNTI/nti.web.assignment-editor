import React from 'react';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const defaultLabels = ['Label 1', 'Label 2', 'Label 3'];
const defaultValues = ['Value 1', 'Value 2', 'Value 3'];
const defaultSolution = {'0': 2, '1': 1, '2': 0};

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

	label = 'Ordering'
	iconCls = 'ordering'


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
			return generatePartFor(mimeType, this.defaultQuestionContent, defaultLabels, defaultValues, defaultSolution);
		}
		return {};
	}
}
