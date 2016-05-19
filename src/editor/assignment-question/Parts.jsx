import React from 'react';

import {getEditorWidget} from '../assignment-inputs';

function questionParts (props) {
	let {parts} = props.question;

	if (parts.length === 0) {
		return (
			<div className="question-parts">No Parts</div>
		);
	}

	return (
		<div className="question-parts">
			{parts.map(getEditorWidget)}
		</div>
	);
}

questionParts.propTypes = {
	question: React.PropTypes.object.isRequired
};


export default questionParts;
