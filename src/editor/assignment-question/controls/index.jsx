import React from 'react';
import cx from 'classnames';

import {hasOrderedContents} from '../../utils/OrderedContents';

import Delete from './Delete';
import Duplicate from './Duplicate';
import Move from './Move';

QuestionControls.propTypes = {
	question: React.PropTypes.object.isRequired,
	questionSet: React.PropTypes.object.isRequired,
	assignment: React.PropTypes.object.isRequired
};


export default function QuestionControls (props) {
	const {question, questionSet, assignment} = props;

	const ordered = hasOrderedContents(questionSet);
	const canMove = ordered;
	const canDelete = ordered;
	const canDuplicate = ordered;
	const isEmpty = !canMove && !canDelete && !canDuplicate;
	const cls = cx('assignment-editing-controls', {empty: isEmpty});

	return (
		<div className={cls}>
			{canMove && (<Move type="up" question={question} questionSet={questionSet} assignment={assignment} />)}
			{canMove && (<Move type="down" question={question} questionSet={questionSet} assignment={assignment} />)}
			{canDuplicate && (<Duplicate question={question} questionSet={questionSet} assignment={assignment} />)}
			{canDelete && (<Delete question={question} questionSet={questionSet} assignment={assignment} />)}
		</div>
	);
}
