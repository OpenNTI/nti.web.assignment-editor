import React, {PropTypes} from 'react';
import cx from 'classnames';

import {Flyout, PublishTrigger, Constants} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
const {PUBLISH_STATES} = Constants;

const DEFAULT_TEXT = {
	label: 'Students have started your assignment.',
	text: 'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.',
	error: 'Could not reset the assignment at this time. Please try again later.'
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

	state = {}

	setFlyoutRef = x => this.flyoutRef = x


	onResetClick = () => {
		const {assignment} = this.props;
		if (assignment.hasLink('reset')) {
			assignment.resetAllSubmissions()
				.then(this.closeMenu, () => this.setState({error: true}));
		}
	}

	closeMenu = () => {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}


	clearError = () => this.setState({error: false})


	render () {
		const {props: {assignment, value, children}, state: {error}} = this;

		const can = assignment && assignment.hasLink('reset');
		const trigger = <PublishTrigger value={value} />;

		return (
			<Flyout ref={this.setFlyoutRef} className="publish-locked"
				trigger={trigger}
				verticalAlign={Flyout.ALIGNMENTS.TOP}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				onDismiss={this.clearError}
				arrow>
				<span className="reset-label">{t('label')}</span>
				<p className="reset-text">{t('text')}</p>

				{children}
				{error && ( <div className="reset-error">{t('error')}</div> )}
				{can && ( <div className={cx('flyout-fullwidth-btn publish-reset', {error})} onClick={this.onResetClick}>Reset Assignment</div> )}
			</Flyout>
		);
	}
}
