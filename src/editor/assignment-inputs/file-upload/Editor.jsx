import React from 'react';

import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import Settings from './Settings';

export default class FileUploadEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.onSaveSettings = this.onSaveSettings.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
		this.state = {};
	}

	toggleSettings () {
		this.setState({
			showSettings: !this.state.showSettings
		});
	}

	onSaveSettings (value) {
		console.log(value);
		const {question, part} = this.props;
		// generatePartFor (MimeType, content, maxSize, mimeTypes = ['*/*'], extensions = [], hints = []) {
		const newPart = generatePartFor(
			part.MimeType,
			part.content,
			part.max_file_size,
			part.allowed_mime_types,
			value.fileExtensions
		);
		savePartToQuestion(question, newPart);
		this.toggleSettings();
	}

	render () {

		const {showSettings} = this.state;
		const {part} = this.props;

		if (showSettings) {
			return <Settings onCancel={this.toggleSettings} onSave={this.onSaveSettings} part={part}/>;
		}

		return (
			<div className="file-upload">
				<div>Upload your file here.</div>
				<div>Maximum file size is 10MB.</div>
				<div className="upload-button">Upload a file</div>
				<div className="settings-button" onClick={this.toggleSettings}>Settings</div>
			</div>
		);
	}
}
