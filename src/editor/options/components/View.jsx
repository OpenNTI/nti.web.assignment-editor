import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/web-commons';

import Grading from './Grading';
import Randomize from './Randomize';
import Limits from './Limits';
import Visibility from './Visibility';
// import Buffer from './Buffer';

function getQuestionSet (assignment) {
	const {parts} = assignment || {};
	const part = (parts || [])[0];
	const {question_set:questionSet} = part || {};

	return !questionSet || questionSet.isPlaceholder ? void 0 : questionSet;
}

class AssignmentOptions extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}

	static getItem (props) {
		return props.assignment;
	}

	render () {
		const {assignment} = this.props;
		const questionSet = getQuestionSet(assignment);
		const {title} = assignment || {};


		return (
			<div className="assignment-options">
				<header>
					<h1 className="main-header">Options</h1>
					<p className="options-assignment-title">{title}</p>
				</header>
				<div>
					<Visibility assignment={assignment} questionSet={questionSet}/>
					<Grading assignment={assignment} questionSet={questionSet} />
					<Randomize assignment={assignment} questionSet={questionSet} />
					<Limits assignment={assignment} questionSet={questionSet} />
					{/* <Buffer assignment={assignment} questionSet={questionSet} /> */}
				</div>
			</div>
		);
	}
}

export default HOC.ItemChanges.compose(AssignmentOptions);
