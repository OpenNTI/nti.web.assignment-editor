import React from 'react';
import Base from '../multiple-choice/Editor';

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


	render () {
		const {part, question} = this.props;
		const {error} = this.state;

		return (
			<Base part={part} question={question} multipleAnswers error={error} />
		);
	}
}
