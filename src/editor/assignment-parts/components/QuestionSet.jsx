import React from 'react';
import cx from 'classnames';
import {HOC} from 'nti-web-commons';

import {MoveRoot} from '../../../ordered-contents';
import {Ordering} from '../../../dnd';

import Question from '../../question';
import {moveQuestion} from '../Actions';

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
		this.setup(props);
	}


	setup = (props = this.props) => {
		const setState = (x) => this.state ? this.setState(x) : (this.state = x);

		const {questionSet} = props;
		const {questions} = questionSet;
		const moveLink = questionSet && questionSet.getLink && questionSet.getLink('AssessmentMove');

		setState({ questions });

		if (moveLink) {
			this.moveRoot = new MoveRoot(moveLink);
		} else {
			//TODO: disable moving
			delete this.moveRoot;
		}
	}


	componentWillReceiveProps (nextProps) {
		const {questionSet:newQuestionSet} = nextProps;
		const {questionSet:oldQuestionSet} = this.props;

		if (newQuestionSet !== oldQuestionSet) {
			this.setup(nextProps);
		}
	}


	onQuestionSetChange = () => {
		this.setup();
	}


	onQuestionOrderChange = (newOrder, item, newIndex, moveInfo) => {
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
					className={cx('question-set-editor', {'no-reorder': !this.moveRoot})}
					items={questions || []}
					renderItem={this.renderQuestion}
					accepts={[QUESTION_TYPE]}
					onChange={this.onQuestionOrderChange}
				/>
			</ItemChanges>
		);
	}


	renderQuestion = (question, index) => {
		const {questionSet, assignment} = this.props;

		return (
			<Question index={index} question={question} questionSet={questionSet} assignment={assignment} />
		);
	}
}
