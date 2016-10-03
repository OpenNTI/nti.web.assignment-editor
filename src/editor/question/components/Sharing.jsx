import React from 'react';

QuestionSharing.propTypes = {
	question: React.PropTypes.object,
	course: React.PropTypes.object,
	focused: React.PropTypes.bool
};
export default function QuestionSharing ({question, course, focused}) {
	//If the question isn't in at least 2 assessments there's no need
	//to show the sharing widget.
	if (question.associationCount < 2) {
		return null;
	}

	return (
		<span>Sharing</span>
	);
}
