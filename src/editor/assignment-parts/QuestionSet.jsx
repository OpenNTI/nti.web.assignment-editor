import React from 'react';

import Ordering from '../../dnd/ordering/Ordering';
import Question from '../assignment-question';
import {moveQuestion} from './Actions';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';

export default class QuestionSetComponent extends React.Component {

	static propTypes = {
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired
	}


	static contextTypes = {
		MoveRoot: React.PropTypes.shape({
			moveRecordFrom: React.PropTypes.func
		})
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


	onQuestionSetChange (questionSet) {
		const {questions} = questionSet;

		this.setState({
			questions: questions
		});
	}


	onQuestionOrderChange (newOrder, item, newIndex, moveInfo) {
		const {questionSet} = this.props;
		const {MoveRoot} = this.context;

		moveQuestion(item, questionSet, newIndex, moveInfo, MoveRoot);
	}


	render () {
		const {questionSet} = this.props;
		const {questions} = this.state;

		return (
			<Ordering
				containerId={questionSet.NTIID}
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
