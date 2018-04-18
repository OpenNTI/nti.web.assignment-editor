import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import {Prompt} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {generatePartFor} from './utils';
import Settings from './Settings';

const DEFAULT_TEXT = {
	upload: 'Upload a file',
	settings: 'Limit File Types'
};

const t = scoped('assignment.editing.inputs.upload', DEFAULT_TEXT);


export default class FileUploadEditor extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
		question: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		index: PropTypes.number
	}

	state = {}

	componentWillReceiveProps (nextProps) {
		if (this.props.part !== nextProps.part) {
			this.setState({part: null});
		}
	}


	showSettings = () => {
		const {part} = this.props;
		Prompt.modal(<Settings onSave={this.onSaveSettings} part={part}/>);
	}


	onSaveSettings = (value) => {
		const {part, onChange, index} = this.props;
		const newPart = generatePartFor(
			part.MimeType,
			part.content,
			part.max_file_size,
			part.allowed_mime_types,
			value.fileExtensions
		);

		if (onChange) {
			onChange(index, newPart);
		}

		this.setState({part: newPart});

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
		const part = this.state.part || this.props.part;
		const title = this.getExtensionText(part && part.allowed_extensions);

		return part && (
			<div className="file-upload assignment-editing">
				<div className="title hide-when-saving">{title}</div>
				{part.max_file_size && <div className="max-size hide-when-saving">Maximum file size is <span className="filesize">{filesize(part.max_file_size)}</span>.</div>}
				<div className="settings" onClick={this.showSettings}>{t('settings')}</div>
				<div className="upload-button">{t('upload')}</div>
			</div>
		);
	}
}
