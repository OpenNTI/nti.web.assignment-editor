import React from 'react';
import {getButtons} from '../assignment-inputs';

export default class QuestionTypes extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		schema: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {assignment} = this.props;

		return (
			<div className="question-types">
				{getButtons(null, assignment)}
			</div>
		);
	}
}
