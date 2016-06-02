import React from 'react';

export default class QuestionControl extends React.Component {
	static propTypes = {
		question: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div className="controls">Controls</div>
		);
	}
}
