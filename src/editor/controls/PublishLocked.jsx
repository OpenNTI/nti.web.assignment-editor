import React, {PropTypes} from 'react';

import {Flyout, PublishTrigger, Constants} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
const {PUBLISH_STATES} = Constants;

const DEFAULT_TEXT = {
	label: 'Students have started your assignment.',
	text: 'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.'
};

const t = scoped('PUBLISH_LOCKED', DEFAULT_TEXT);

export default class PublishLocked extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES))
		]),
		assignment: PropTypes.object
	}

	constructor () {
		super();

		this.setFlyoutRef = x => this.flyoutRef = x;
	}

	onResetClick = () => {
		const {assignment} = this.props;
		if (assignment.reset) {
			const r = assignment.resetAllSubmissions();
			r.then(() => this.closeMenu());
		}
	}

	closeMenu () {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}

	render () {
		const {value, children} = this.props;

		const trigger = <PublishTrigger value={value} />;

		return (
			<Flyout ref={this.setFlyoutRef} className="publish-locked"
				trigger={trigger}
				verticalAlign={Flyout.ALIGNMENTS.TOP}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				arrow>
				<span className="reset-label">{t('label')}</span>
				<p className="reset-text">{t('text')}</p>

				{children}

				<div className="flyout-fullwidth-btn publish-reset" onClick={this.onResetClick}>Reset Assignment</div>
			</Flyout>
		);
	}
}
