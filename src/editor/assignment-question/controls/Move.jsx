import React from 'react';
import cx from 'classnames';

import {moveQuestion} from '../../assignment-parts/Actions';
import MoveRoot from '../../utils/MoveRoot';
import MoveInfo from '../../../dnd/ordering/MoveInfo';

const TYPES = {
	UP: 'up',
	DOWN: 'down'
};

export default class Move extends React.Component {
	static propTypes = {
		type: React.PropTypes.oneOf([TYPES.UP, TYPES.DOWN]),
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

		const newIndex = type === TYPES.UP ? moveInfo.originIndex - 1 : moveInfo.originIndex + 1;

		moveQuestion(question, questionSet, newIndex, moveInfo, this.moveRoot);
	}


	render () {
		const {type, questionSet} = this.props;
		const questions = questionSet.questions;
		const classNames = cx(`icon-move${type}`, {disable: shouldDisable(type, this.OriginIndex, questions && questions.length)});

		return (
			<i className={classNames} title={type} onClick={this.onClick}/>
		);
	}
}

function shouldDisable (type, index, length) {
	if (type === TYPES.UP && index === 0) {
		return true;
	} else if (type === TYPES.DOWN && index === length - 1) {
		return true;
	}
}
