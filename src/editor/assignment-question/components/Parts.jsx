import React from 'react';

import {getEditorWidget} from '../../assignment-inputs';

questionParts.propTypes = {
	question: React.PropTypes.object.isRequired,
	error: React.PropTypes.any,
	onChange: React.PropTypes.func,
	keepStateHash: React.PropTypes.number
};


export default function questionParts (props) {
	const {question, error, onChange, keepStateHash} = props;
	const {parts} = question;

	if (!parts || parts.length === 0) {
		return (
			<div className="question-parts">No Parts</div>
		);
	}

	return (
		<div className="question-editor-parts">
			{parts.map((part, index) => {
				return getEditorWidget(part, index, question, error, onChange, keepStateHash);
			})}
		</div>
	);
}
