import React from 'react';

import Ordering from '../../dnd/ordering/Ordering';
import Question from '../assignment-question';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';

export default class QuestionSetComponent extends React.Component {

	static propTypes = {
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		const {questionSet} = props;
		const {questions} = questionSet;

		this.state = {
			questions: questions
		};

		this.onQuestionSetChange = this.onQuestionSetChange.bind(this);
		this.onQuestionOrderChange = this.onQuestionOrderChange.bind(this);
		this.renderQuestion = this.renderQuestion.bind(this);
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


	onQuestionOrderChange (newOrder) {
		debugger;
	}


	render () {
		const {questions} = this.state;

		return (
			<Ordering
				containerId={this.props.questionSet.NTIID}
				className="question-set-editor"
				items={questions}
				renderItem={this.renderQuestion}
				accepts={[QUESTION_TYPE]}
				onChange={this.onQuestionOrderChange}
			/>
		);
	}


	renderQuestion (question, index) {
		const {questionSet} = this.props;

		return (
			<Question index={index} question={question} questionSet={questionSet} />
		);
	}
}
