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

	state = {}


	showSettings = () => {
		const {part} = this.props;
		Prompt.modal(<Settings onSave={this.onSaveSettings} part={part}/>);
	}


	onSaveSettings = (value) => {
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

	getExtensionText (extensions) {
		//TODO: Localize this mess.
		let txt;
		extensions = extensions || [];
		if (extensions.length > 1) {
			extensions = extensions.slice();

			const last = extensions.pop();
			txt = extensions.join(', ') + ' or ' + last;
			txt = 'Upload your ' + txt + ' here.';
		}
		else if (extensions.length === 1 && extensions[0] !== '*') {
			txt = 'Upload your ' + extensions[0] + ' here.';
		}
		else {
			txt = 'Upload your file here.';
		}

		return txt;
	}

	render () {
		const {part} = this.props;
		const title = this.getExtensionText(part && part.allowed_extensions);

		return (
			<div className="file-upload assignment-editing">
				<div className="title hide-when-saving">{title}</div>
				{part.max_file_size && <div className="max-size hide-when-saving">Maximum file size is <span className="filesize">{filesize(part.max_file_size)}</span>.</div>}
				<div className="upload-button">Upload a file</div>
				<SettingsButton onClick={this.showSettings} />
			</div>
		);
	}
}
