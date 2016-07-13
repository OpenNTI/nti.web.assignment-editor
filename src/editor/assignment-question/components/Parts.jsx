import React from 'react';

import {getEditorWidget} from '../../assignment-inputs';

questionParts.propTypes = {
	question: React.PropTypes.object.isRequired,
	error: React.PropTypes.any,
	onChange: React.PropTypes.func
};


export default function questionParts (props) {
	const {question, error, onChange} = props;
	const {parts} = question;

	if (!parts || parts.length === 0) {
		return (
			<div className="question-parts">No Parts</div>
		);
	}

	return (
		<div className="question-editor-parts">
			{parts.map((part, index) => {
				return getEditorWidget(part, index, question, error, onChange);
			})}
		</div>
	);
}
