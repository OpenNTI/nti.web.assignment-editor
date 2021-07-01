import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';

import QuestionSet from './QuestionSet';
import Placeholder from './PlaceholderQuestionSet';

AssignmentPart.propTypes = {
	part: PropTypes.object.isRequired,
	assignment: PropTypes.object.isRequired,
	course: PropTypes.object,
};

const Spinner = styled(Loading.Spinner)`
	margin: 6rem auto;
`;

export default function AssignmentPart({
	part: { question_set: questionSet },
	assignment,
	course,
}) {
	if (!assignment.isModifiable) {
		return <Placeholder />;
	}

	// If questionSet is a string (ntiid) we wait, on the assumption that
	// it's an ntiid and will be resolved in a subsequent render. See NTI-10788
	// for an edge case where this occurs.
	return typeof questionSet === 'string' ? (
		<Spinner />
	) : (
		<QuestionSet
			questionSet={questionSet}
			assignment={assignment}
			course={course}
		/>
	);
}
