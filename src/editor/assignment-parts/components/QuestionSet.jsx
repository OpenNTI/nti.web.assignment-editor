import './QuestionSet.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { HOC } from '@nti/web-commons';
import { Authoring } from '@nti/lib-interfaces';

import { Ordering } from '../../../dnd';
import Question from '../../question';
import { moveQuestion } from '../Actions';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';
const { ItemChanges } = HOC;

export { QUESTION_TYPE };

const isDifferent = (a, b) =>
	(a && !b) ||
	(!a && b) ||
	a.length !== b.length ||
	a.some((x, i) => x !== b[i]);

export default class QuestionSetComponent extends React.Component {
	static propTypes = {
		questionSet: PropTypes.object.isRequired,
		assignment: PropTypes.object.isRequired,
		course: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.setup(props);
	}

	setup = (props = this.props) => {
		const setState = x =>
			//eslint-disable-next-line react/no-direct-mutation-state
			this.state ? this.setState(x) : (this.state = x);

		const { questionSet } = props;

		setState({ questions: [...questionSet.questions] });

		if (questionSet && questionSet.hasLink('AssessmentMove')) {
			this.moveRoot = new Authoring.MoveRoot(
				questionSet,
				'AssessmentMove'
			);
		} else {
			//TODO: disable moving
			delete this.moveRoot;
		}
	};

	componentDidUpdate(prevProps) {
		const { questionSet: oldQuestionSet } = prevProps;
		const { questionSet } = this.props;
		const { questions } = this.state;

		if (
			questionSet !== oldQuestionSet ||
			isDifferent(questions, questionSet.questions)
		) {
			this.setup();
		}
	}

	onQuestionSetChange = () => {
		this.setup();
	};

	onQuestionOrderChange = (newOrder, item, newIndex, moveInfo) => {
		const { questionSet, assignment } = this.props;

		moveQuestion(
			item,
			questionSet,
			newIndex,
			moveInfo,
			this.moveRoot,
			assignment.isAvailable()
		);
	};

	render() {
		const { questionSet } = this.props;
		const { questions } = this.state;
		const item = questionSet.isSaving ? null : questionSet;

		return (
			<ItemChanges item={item} onItemChanged={this.onQuestionSetChange}>
				<Ordering
					containerId={questionSet.NTIID}
					className={cx('question-set-editor', {
						'no-reorder': !this.moveRoot,
					})}
					items={questions || []}
					renderItem={this.renderQuestion}
					accepts={[QUESTION_TYPE]}
					onChange={this.onQuestionOrderChange}
				/>
			</ItemChanges>
		);
	}

	renderQuestion = (question, index) => {
		const { questionSet, assignment, course } = this.props;

		return (
			<Question
				index={index}
				question={question}
				questionSet={questionSet}
				assignment={assignment}
				course={course}
			/>
		);
	};
}
