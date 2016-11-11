import React from 'react';
import {HOC} from 'nti-web-commons';
import cx from 'classnames';
import {MoveRoot} from 'nti-lib-interfaces';

import {MoveInfo} from '../../../../dnd';

import {moveQuestion} from '../../../assignment-parts/Actions';

const {ItemChanges} = HOC;


const UP = 'up';
const DOWN = 'down';

export {
	UP,
	DOWN
};

function isFirstQuestion (question, questionSet) {
	const {questions} = questionSet;
	const first = questions[0];

	return first && first.NTIID === question.NTIID;
}

function isLastQuestion (question, questionSet) {
	const {questions} = questionSet;
	const last = questions[questions.length - 1];

	return last && last.NTIID === question.NTIID;
}


function getIndexOf (question, questionSet) {
	return questionSet.questions.findIndex(q => q.NTIID === question.NTIID);
}


function shouldDisable (type, question, questionSet) {
	if (type === UP) {
		return isFirstQuestion(question, questionSet);
	} else if (type === DOWN) {
		return isLastQuestion(question, questionSet);
	}
}

export default class Move extends React.Component {
	static propTypes = {
		type: React.PropTypes.oneOf([UP, DOWN]),
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		disabled: React.PropTypes.bool
	}


	constructor (props) {
		super();

		this.setup(props);
	}


	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}


	setup (props) {
		const setState = x => this.state ? this.setState(x) : (this.state = x);
		const {questionSet, question, type, disabled} = props;

		if (questionSet && questionSet.hasLink('AssessmentMove')) {
			this.moveRoot = new MoveRoot(questionSet, 'AssessmentMove');
		} else if (this.moveRoot) {
			delete this.moveRoot;
		}

		setState({
			index: getIndexOf(question, questionSet),
			disabled: disabled || shouldDisable(type, question, questionSet)
		});
	}


	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {question, questionSet, type} = this.props;
		const {index, disabled} = this.state;
		const moveInfo = new MoveInfo({
			OriginContainer: questionSet.getID(),
			OriginIndex: index
		});

		const newIndex = type === UP ? moveInfo.originIndex - 1 : moveInfo.originIndex + 1;

		if (!disabled) {
			moveQuestion(question, questionSet, newIndex, moveInfo, this.moveRoot);
		}
	}


	onQuestionSetUpdated = () => {
		const {question, questionSet, type} = this.props;

		this.setState({
			index: getIndexOf(question, questionSet),
			disabled: shouldDisable(type, question, questionSet)
		});
	}


	render () {
		const {type, questionSet} = this.props;
		const {disabled} = this.state;
		const classNames = cx(`icon-move${type}`, {disabled});

		return (
			<ItemChanges item={questionSet} onItemChanged={this.onQuestionSetUpdated}>
				<i className={classNames} title={type} onClick={this.onClick}/>
			</ItemChanges>
		);
	}
}