import React, {PropTypes} from 'react';

import {Flyout, PublishTrigger, Publish} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	label: 'Students have started your assignment.',
	text: 'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.'
};

const t = scoped('PUBLISH_LOCKED', DEFAULT_TEXT);

export default class PublishLocked extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}

	onResetClick () {

	}

	onDeleteClick () {

	}

	render () {
		const {assignment} = this.props;

		// const trigger = <PublishTrigger value={Publish.evaluatePublishStateFor(assignment)} />;
		const trigger = <div>Test</div>;

		return (
		<Flyout ref={this.setFlyoutRef} className="publish-locked" alignment="top-right" trigger={trigger}>
			<span className="reset-label">{t('label')}</span>
			<p className="reset-text">{t('text')}</p>

			<div onClick={this.onDeleteClick} className="publish-delete">Delete</div>
			<div className="publish-reset" onClick={this.onResetClick}>Reset Assignment</div>
		</Flyout>
		);
	}
}
