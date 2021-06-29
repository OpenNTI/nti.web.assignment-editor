import React from 'react';
import PropTypes from 'prop-types';

import QuestionSet from './QuestionSet';
import Placeholder from './PlaceholderQuestionSet';

AssignmentPart.propTypes = {
	part: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	course: PropTypes.object,
};

export default function AssignmentPart({
	part: { question_set: questionSet },
	assignment,
	course,
}) {
	if (!assignment.isModifiable || typeof questionSet === 'string') {
		return <Placeholder />;
	}

	return (
		<QuestionSet
			questionSet={questionSet}
			assignment={assignment}
			course={course}
		/>
	);
}
