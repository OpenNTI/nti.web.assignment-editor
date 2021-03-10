import './SubmissionStatus.scss';
import React from 'react';
import cx from 'classnames';

import { Layouts } from '@nti/web-commons';

import {
	Icon,
	Title,
	Background,
	Meta,
	Grade,
	Attempts,
} from './submission-states';

const { Responsive } = Layouts;

const WIDE_CUTOFF = 600;
const isWide = ({ containerWidth }) =>
	containerWidth && containerWidth >= WIDE_CUTOFF;
const isNarrow = x => !isWide(x);

export default class SubmissionStatus extends React.Component {
	render() {
		return (
			<Responsive.Container className="assignment-navigation-bar-status-submission-container">
				<Responsive.Item query={isWide} render={this.renderWider} />
				<Responsive.Item query={isNarrow} render={this.renderNarrow} />
			</Responsive.Container>
		);
	}

	renderWider = () => {
		return this.renderItems('wide');
	};

	renderNarrow = () => {
		return this.renderItems('narrow');
	};

	renderItems(cls) {
		return (
			<Background
				{...this.props}
				className={cx(
					'assignment-navigation-bar-status-submission',
					cls
				)}
			>
				<Icon {...this.props} />
				<Title {...this.props} />
				<Meta {...this.props} />
				<Grade {...this.props} />
				<Attempts {...this.props} />
			</Background>
		);
	}
}
