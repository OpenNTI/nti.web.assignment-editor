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
			<div className="file-upload">
				<div>Upload your file here.</div>
				<div>Maximum file size is 10MB.</div>
				<div className="upload-button">Upload a file</div>
			</div>
		);
	}
}
