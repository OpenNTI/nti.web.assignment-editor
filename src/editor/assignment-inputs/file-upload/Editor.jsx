import React from 'react';

export default class FileUploadEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div>TODO: Fill Out File Upload Type</div>
		);
	}
}
