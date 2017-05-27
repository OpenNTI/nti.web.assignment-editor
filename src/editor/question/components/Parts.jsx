import React from 'react';
import PropTypes from 'prop-types';

import {getEditorWidget, Placeholder as InputPlaceholder} from '../../input-types';

questionParts.propTypes = {
	question: PropTypes.object.isRequired,
	error: PropTypes.any,
	onChange: PropTypes.func,
	keepStateHash: PropTypes.number
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
			{parts.map((part, index) =>
				getEditorWidget(part, index, question, error, onChange, keepStateHash)
			)}
		</div>
	);
}

export function Placeholder () {
	return (
		<div className="question-editor-parts placeholder">
			<InputPlaceholder />
		</div>
	);
}
