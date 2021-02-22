import React from 'react';
import PropTypes from 'prop-types';

import MultipleChoiceEditor from '../multiple-choice/Editor';

import { generatePartFor } from './utils';

export default class MultipleChoiceMultipleAnswerEditor extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
		question: PropTypes.object.isRequired,
		error: PropTypes.any,
		index: PropTypes.number,
		onChange: PropTypes.func,
		keepStateHash: PropTypes.number,
	};

	constructor(props) {
		super(props);

		const { error } = props;

		this.state = {
			error,
		};
	}

	componentDidUpdate(prevProps) {
		const { error: newError } = this.props;
		const { error: oldError } = prevProps;

		if (newError !== oldError) {
			this.setState({
				error: newError,
			});
		}
	}

	generatePart = (content, choices, solutions) => {
		const { part } = this.props;
		const mimeType = part && part.MimeType;

		if (!mimeType) {
			//TODO: see if we ever need to handle this case
		}

		return generatePartFor(mimeType, content, choices, solutions);
	};

	render() {
		const { part, question, index, onChange, keepStateHash } = this.props;
		const { error } = this.state;

		return (
			<MultipleChoiceEditor
				part={part}
				question={question}
				multipleAnswers
				error={error}
				generatePart={this.generatePart}
				index={index}
				onChange={onChange}
				keepStateHash={keepStateHash}
			/>
		);
	}
}
