import React from 'react';

export default class QuestionComponent extends React.Component {
	static propTypes = {
		Question: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {Question} = this.props;

		return (
			<span>{Question.content}</span>
		);
	}
}
