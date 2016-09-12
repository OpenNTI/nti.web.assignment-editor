import React from 'react';
import {scoped} from 'nti-lib-locale';
import Button from '../base/Button';
import {generatePartFor} from './utils';

const ICON_CLS = 'essay';

const DEFAULT_TEXT = {
	essayButtonLabel: 'Essay'
};

const t = scoped('ASSIGNMENT_AUTHORING', DEFAULT_TEXT);

export default class EssayButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		activeInsert: React.PropTypes.object
	}

	static set handles (handles) {
		this.handledMimetypes = handles;
	}

	static get handles () {
		return this.handledMimetypes;
	}


	render () {
		const {assignment, activeInsert} = this.props;
		const {handles} = this.constructor;
		return (
			<Button
				part={this.getBlankPart()}
				assignment={assignment}
				activeInsert={activeInsert}
				label={t('essayButtonLabel')}
				handles={handles}
				iconCls={ICON_CLS} />
		);
	}


	getBlankPart () {
		const {handles} = this.constructor;
		const mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType);
		}
		return {};
	}
}
