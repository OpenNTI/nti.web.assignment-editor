import React from 'react';
import PropTypes from 'prop-types';

import QuestionSet from './QuestionSet';
import Placeholder from './PlaceholderQuestionSet';

export default class AssignmentPart extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
		assignment: PropTypes.object.isRequired,
		course: PropTypes.object,
	};

	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const { part, assignment, course } = this.props;
		const questionSet = part.question_set;

		if (!assignment.isModifiable) {
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
}
