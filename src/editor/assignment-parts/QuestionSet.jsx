import React from 'react';
import Question from '../assignment-question';

export default class QuestionSetComponent extends React.Component {

	static propTypes = {
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.state = {};

		this.onQuestionSetChange = this.onQuestionSetChange.bind(this);
	}


	componentDidMount () {
		const {questionSet} = this.props;

		questionSet.addListener('change', this.onQuestionSetChange);
	}


	componentWillUnmount () {
		const {questionSet} = this.props;

		questionSet.removeListener('change', this.onQuestionSetChange);
	}


	onQuestionSetChange () {
		this.forceUpdate();
	}


	render () {
		const {questionSet} = this.props;
		const {questions} = questionSet;

		return (
			<div className="questions">
				{questions.map((question) => {
					return (<Question key={question.NTIID} question={question} questionSet={questionSet}/>);
				})}
			</div>
		);
	}
}
