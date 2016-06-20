import React, {PropTypes} from 'react';
import {HOC} from 'nti-web-commons';
import Grading from './options/Grading';
import Randomize from './options/Randomize';
import Limits from './options/Limits';

class AssignmentOptions extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}

	static getItem (props) {
		return props.assignment;
	}

	render () {
		const {assignment} = this.props;

		return (
			<div className="assignment-options">
				<header>
					<h1 className="main-header">Options</h1>
					<p className="options-assignment-title">{assignment.title}</p>
				</header>
				<div>
					<Grading assignment={assignment} />
					<Randomize assignment={assignment} />
					<Limits assignment={assignment} />
				</div>
			</div>
		);
	}
}

export default HOC.ItemChanges.compose(AssignmentOptions);
