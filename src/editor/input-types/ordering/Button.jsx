import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import Button from '../base/Button';

import {generatePartFor} from './utils';

const ICON_CLS = 'ordering';

const defaultLabels = ['Label 1', 'Label 2'];
const defaultValues = ['Value 1', 'Value 2'];
const defaultSolution = {'0': 0, '1': 1};

const DEFAULT_TEXT = {
	orderingButtonLabel: 'Ordering'
};

const t = scoped('ASSIGNMENT_AUTHORING', DEFAULT_TEXT);

export default class OrderingButton extends React.Component {
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
				label={t('orderingButtonLabel')}
				handles={handles}
				iconCls={ICON_CLS} />
		);
	}

	getBlankPart () {
		const {handles} = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, null, defaultLabels, defaultValues, defaultSolution);
		}
		return {};
	}
}
