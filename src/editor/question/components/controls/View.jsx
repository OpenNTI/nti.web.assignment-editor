import React from 'react';
import cx from 'classnames';

import {hasOrderedContents} from '../../../../ordered-contents';

import Delete from './Delete';
import Duplicate from './Duplicate';
import Move, {UP, DOWN} from './Move';

QuestionControls.propTypes = {
	question: React.PropTypes.object.isRequired,
	questionSet: React.PropTypes.object.isRequired,
	assignment: React.PropTypes.object.isRequired,
	flushChanges: React.PropTypes.func
};


export default function QuestionControls (props) {
	const {question, questionSet, assignment, flushChanges} = props;

	const ordered = hasOrderedContents(questionSet);
	const canMove = ordered;
	const canDelete = ordered;
	const canDuplicate = ordered;
	const isEmpty = !canMove && !canDelete && !canDuplicate;
	const cls = cx('assignment-editing-controls', {empty: isEmpty});

	return (
		<div className={cls}>
			<Move type={UP}
				question={question}
				questionSet={questionSet}
				assignment={assignment}
				disabled={!canMove}
				/>

			<Move type={DOWN}
				question={question}
				questionSet={questionSet}
				assignment={assignment}
				disabled={!canMove}
				/>

			<Duplicate
				question={question}
				questionSet={questionSet}
				assignment={assignment}
				flushChanges={flushChanges}
				disabled={!canDuplicate}
				/>

			<Delete
				question={question}
				questionSet={questionSet}
				assignment={assignment}
				disabled={!canDelete}
				/>
		</div>
	);
}

export function Placeholder () {
	return (
		<div className="assignment-editing-controls placeholder">
			<i className="icon-moveup" />
			<i className="icon-movedown" />
			<i className="icon-duplicate" />
			<i className="icon-delete" />
		</div>
	);
}
