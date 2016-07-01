import React from 'react';
import filesize from 'filesize';
import {Prompt} from 'nti-web-commons';

import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import Settings from './Settings';
import {SettingsButton} from 'nti-web-commons';

export default class FileUploadEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.onSaveSettings = this.onSaveSettings.bind(this);
		this.showSettings = this.showSettings.bind(this);
		this.state = {};
	}

	showSettings () {
		const {part} = this.props;
		Prompt.modal(<Settings onSave={this.onSaveSettings} part={part}/>);
	}

	onSaveSettings (value) {
		const {question, part} = this.props;
		const newPart = generatePartFor(
			part.MimeType,
			part.content,
			part.max_file_size,
			part.allowed_mime_types,
			value.fileExtensions
		);
		savePartToQuestion(question, newPart);
		return true;
	}

	render () {

		const {part} = this.props;

		return (
			<div className="file-upload">
				<div>Upload your file here.</div>
				{part.max_file_size && <div>Maximum file size is <span className="filesize">{filesize(part.max_file_size)}</span>.</div>}
				<div className="upload-button">Upload a file</div>
				<SettingsButton onClick={this.showSettings} />
			</div>
		);
	}
}
