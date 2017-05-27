import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import Button from '../base/Button';

import {generatePartFor} from './utils';

const ICON_CLS = 'multiple-choice';

const defaultChoices = ['Choice 1'];
const defaultSolution = 0;
const defaultHint = [];

const DEFAULT_TEXT = {
	multipleChoiceButtonLabel: 'Multiple Choice'
};

const t = scoped('ASSIGNMENT_AUTHORING', DEFAULT_TEXT);

export default class MultipleChoiceButton extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		activeInsert: PropTypes.object
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
				label={t('multipleChoiceButtonLabel')}
				handles={handles}
				iconCls={ICON_CLS} />
		);
	}


	getBlankPart () {
		const {handles} = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, null, defaultChoices, defaultSolution, defaultHint);
		}
	}
}
