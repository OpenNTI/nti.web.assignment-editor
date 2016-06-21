import React from 'react';

import {hasOrderedContents} from '../../utils/OrderedContents';

import Delete from './Delete';


function questionControls (props) {
	const {question, questionSet} = props;

	return (
		<div className="assignment-editing-controls">
			{hasOrderedContents(questionSet) ?
				(
					<Delete question={question} questionSet={questionSet} />
				) :
				null
			}
		</div>
	);
}

questionControls.propTypes = {
	question: React.PropTypes.object.isRequired,
	questionSet: React.PropTypes.object.isRequired
};

export default questionControls;
