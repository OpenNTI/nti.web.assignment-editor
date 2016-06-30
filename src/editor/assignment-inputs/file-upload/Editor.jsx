import React from 'react';

import {Prompt} from 'nti-web-commons';
import {savePartToQuestion} from '../Actions';
import {generatePartFor} from './utils';
import Settings from './Settings';
import SettingsButton from './SettingsButton';

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
		return (
			<div className="file-upload">
				<div>Upload your file here.</div>
				<div>Maximum file size is 10MB.</div>
				<div className="upload-button">Upload a file</div>
				<SettingsButton onClick={this.showSettings} />
			</div>
		);
	}
}
