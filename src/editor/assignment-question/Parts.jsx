import React from 'react';

import {getInputWidget} from './inputs';

function questionParts (props) {
	let {parts} = props.Question;

	if (parts.length === 0) {
		return (
			<div className="question-parts">No Parts</div>
		);
	}

	return (
		<div className="question-parts">
			{parts.map(getInputWidget)}
		</div>
	);
}

questionParts.propTypes = {
	Question: React.PropTypes.object.isRequired
};


export default questionParts;
