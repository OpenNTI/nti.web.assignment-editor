import React from 'react';

export default class DiscussionAssignment extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		course: React.PropTypes.object
	}

	render () {
		return (
			<h3>Discussion Assignment</h3>
		);
	}
}
