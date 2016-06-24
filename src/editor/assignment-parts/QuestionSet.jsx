import React from 'react';
import {HOC} from 'nti-web-commons';
import autobind from 'nti-commons/lib/autobind';

import Ordering from '../../dnd/ordering/Ordering';
import Question from '../assignment-question';
import {moveQuestion} from './Actions';
import MoveRoot from '../utils/MoveRoot';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';
const {ItemChanges} = HOC;

export {
	QUESTION_TYPE
};

export default class QuestionSetComponent extends React.Component {

	static propTypes = {
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		const {questionSet} = props;
		const {questions} = questionSet;
		const moveLink = questionSet && questionSet.getLink && questionSet.getLink('AssessmentMove');

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

	componentWillReceiveProps (nextProps) {
		const {questionSet:newQuestionSet} = nextProps;
		const {questionSet:oldQuestionSet} = this.props;

		if (newQuestionSet !== oldQuestionSet) {
			this.setState({
				questions: newQuestionSet.questions
			});
		}
	}


	onQuestionSetChange () {
		const {questionSet} = this.props;
		const {questions} = questionSet;

		this.setState({
			questions
		});
	}


	onQuestionOrderChange (newOrder, item, newIndex, moveInfo) {
		const {questionSet} = this.props;

		moveQuestion(item, questionSet, newIndex, moveInfo, this.moveRoot);
	}


	render () {
		const {questionSet} = this.props;
		const {questions} = this.state;
		const item = questionSet.isSaving ? null : questionSet;

		return (
			<ItemChanges item={item} onItemChanged={this.onQuestionSetChange}>
				<Ordering
					containerId={questionSet.NTIID}
					className="question-set-editor"
					items={questions}
					renderItem={this.renderQuestion}
					accepts={[QUESTION_TYPE]}
					onChange={this.onQuestionOrderChange}
				/>
			</ItemChanges>
		);
	}


	renderQuestion (question, index) {
		const {questionSet, assignment} = this.props;

		return (
			<Question index={index} question={question} questionSet={questionSet} assignment={assignment} />
		);
	}
}
