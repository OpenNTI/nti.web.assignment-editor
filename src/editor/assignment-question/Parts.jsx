import React from 'react';

import {getEditorWidget} from '../assignment-inputs';

function questionParts (props) {
	const {question, error} = props;
	const {parts} = question;

	if (parts.length === 0) {
		return (
			<div className="question-parts">No Parts</div>
		);
	}

	return (
		<div className="question-editor-parts">
			{parts.map((part, index) => {
				return getEditorWidget(part, index, question, error);
			})}
		</div>
	);
}

questionParts.propTypes = {
	question: React.PropTypes.object.isRequired,
	error: React.PropTypes.any
};


export default questionParts;
