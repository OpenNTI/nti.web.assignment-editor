import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import MultipleChoiceEditor from '../multiple-choice/Editor';
import {generatePartFor} from './utils';

export default class MultipleChoiceMultipleAnswerEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		error: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		const {error} = props;

		this.state = {
			error
		};

		autobind(this, 'generatePart');
	}


	componentWillReceiveProps (nextProps) {
		const {error:newError} = nextProps;
		const {error:oldError} = this.props;

		if (newError !== oldError) {
			this.setState({
				error: newError
			});
		}
	}


	generatePart (content, choices, solutions) {
		const {part} = this.props;
		const mimeType = part && part.MimeType;

		if (!mimeType) {
			//TOOD: see if we ever need to handle this case
		}

		return generatePartFor(mimeType, content, choices, solutions);
	}


	render () {
		const {part, question} = this.props;
		const {error} = this.state;

		return (
			<MultipleChoiceEditor part={part} question={question} multipleAnswers error={error} generatePart={this.generatePart} />
		);
	}
}
