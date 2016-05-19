import React from 'react';
import QuestionTypes from './QuestionTypes';

export default class Editor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		const {assignment, schema} = this.props;

		if (!assignment) {
			return (
				<div className="sidebar loading"></div>
			);
		}

		return (
			<QuestionTypes assignment={assignment} schema={schema} />
		);
	}
}
