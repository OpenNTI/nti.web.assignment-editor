import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import Ordering from '../../dnd/ordering/Ordering';
import Question from '../assignment-question';
import {moveQuestion} from './Actions';
import MoveRoot from '../utils/MoveRoot';

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
		const moveLink = questionSet.getLink('AssessmentMove');

		this.state = {
			questions: questions
		};

		if (moveLink) {
			this.moveRoot = new MoveRoot(moveLink);
		} else {
			//TODO: disable moving
		}

		autobind(this,
			'onQuestionSetChange',
			'onQuestionOrderChange',
			'renderQuestion'
		);
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

		moveQuestion(item, questionSet, newIndex, moveInfo, this.moveRoot);
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
