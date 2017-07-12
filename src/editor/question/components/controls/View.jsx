import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {OrderedContents} from 'nti-lib-interfaces';

import Delete from './Delete';
import Duplicate from './Duplicate';
import Move, {UP, DOWN} from './Move';
import More from './More';
import Share from './Share';

QuestionControls.propTypes = {
	question: PropTypes.object.isRequired,
	questionSet: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	course: PropTypes.object,
	flushChanges: PropTypes.func
};


export default function QuestionControls (props) {
	const {question, questionSet, assignment, flushChanges, course} = props;

	const ordered = OrderedContents.hasOrderedContents(questionSet);
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

			<More>
				<Share question={question} course={course} />
			</More>
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
