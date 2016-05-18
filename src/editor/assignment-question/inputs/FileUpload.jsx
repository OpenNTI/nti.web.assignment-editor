import React from 'react';

export default class FileUploadPart extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired
	}

	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.filepart'
	]


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
