import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Button from '../base/Button';

import { generatePartFor } from './utils';

const ICON_CLS = 'file-upload';

const DEFAULT_TEXT = {
	fileUploadButtonLabel: 'File Upload',
};

const t = scoped('assignment.editing.inputs', DEFAULT_TEXT);

export default class FileUploadButton extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		activeInsert: PropTypes.object,
	};

	static set handles(handles) {
		this.handledMimetypes = handles;
	}

	static get handles() {
		return this.handledMimetypes;
	}

	render() {
		const { assignment, activeInsert } = this.props;
		const { handles } = this.constructor;
		return (
			<Button
				part={this.getBlankPart()}
				assignment={assignment}
				activeInsert={activeInsert}
				label={t('fileUploadButtonLabel')}
				handles={handles}
				iconCls={ICON_CLS}
			/>
		);
	}

	getBlankPart() {
		const { handles } = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType);
		}
		return {};
	}
}
