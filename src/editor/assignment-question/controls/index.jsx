import React from 'react';

import {hasOrderedContents} from '../../utils/OrderedContents';

import Delete from './Delete';
import Duplicate from './Duplicate';


QuestionControls.propTypes = {
	question: React.PropTypes.object.isRequired,
	questionSet: React.PropTypes.object.isRequired,
	assignment: React.PropTypes.object.isRequired
};


export default function QuestionControls (props) {
	const {question, questionSet, assignment} = props;

	const ordered = hasOrderedContents(questionSet);
	const canDelete = ordered;
	const canDuplicate = ordered;

	return (
		<div className="assignment-editing-controls">
			{canDuplicate && ( <Duplicate question={question} questionSet={questionSet} assignment={assignment} /> )}
			{canDelete && ( <Delete question={question} questionSet={questionSet} assignment={assignment} /> )}
		</div>
	);
}
