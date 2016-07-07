import React from 'react';
import cx from 'classnames';

import {MoveRoot} from '../../../ordered-contents';
import MoveInfo from '../../../dnd/ordering/MoveInfo';

import {moveQuestion} from '../../assignment-parts/Actions';


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
		questionSet: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super();

		const {questionSet, question} = props;
		const moveLink = questionSet && questionSet.getLink('AssessmentMove');

		if (moveLink) {
			this.moveRoot = new MoveRoot(moveLink);
			this.OriginIndex = questionSet.questions.findIndex(q => q.getID() === question.getID());
		}
	}


	onClick = () => {
		const {question, questionSet, type} = this.props;
		const moveInfo = new MoveInfo({
			OriginContainer: questionSet.getID(),
			OriginIndex: this.OriginIndex
		});

		const newIndex = type === UP ? moveInfo.originIndex - 1 : moveInfo.originIndex + 1;

		moveQuestion(question, questionSet, newIndex, moveInfo, this.moveRoot);
	}


	render () {
		const {type, question, questionSet} = this.props;
		const classNames = cx(`icon-move${type}`, {disabled: shouldDisable(type, question, questionSet)});

		return (
			<i className={classNames} title={type} onClick={this.onClick}/>
		);
	}
}
