import React, {PropTypes} from 'react';
import cx from 'classnames';

import {resetAssignmentSubmissions} from '../../Actions';

import {Flyout, PublishTrigger, Constants, TinyLoader as Loading} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
const {PUBLISH_STATES} = Constants;

const DEFAULT_TEXT = {
	label: 'Students have started your assignment.',
	editorLabel: 'Students have started this assignment',
	text: 'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.',
	editorText: 'The instructor must reset this assignment before a publish change can occur.',
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
			this.setState({busy: true});
			resetAssignmentSubmissions(assignment)
				.then(this.closeMenu, () => this.setState({error: true}))
				.then(()=> this.setState({busy: false}));
		}
	}

	closeMenu = () => {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}


	clearError = () => this.setState({error: false})

	isNonInstructor () {
		const {assignment} = this.props;
		if(!assignment) { return; }

		return !assignment.hasLink('reset') && !assignment.hasLink('publish') && !assignment.hasLink('unpublish');
	}

	render () {
		const {props: {assignment, value, children}, state: {error, busy}} = this;

		const can = assignment && assignment.hasLink('reset');
		const trigger = <PublishTrigger value={value} />;
		const label =  this.isNonInstructor() ? 'editorLabel' : 'label';
		const text = this.isNonInstructor() ? 'editorText' : 'text';

		return (
			<Flyout ref={this.setFlyoutRef} className="publish-locked"
				trigger={trigger}
				verticalAlign={Flyout.ALIGNMENTS.TOP}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				onDismiss={this.clearError}
				arrow>
				<span className="reset-label">{t(label)}</span>
				<p className="reset-text">{t(text)}</p>

				{!busy && children}
				{error && ( <div className="reset-error">{t('error')}</div> )}
				{busy ? (
					<Loading/>
				) : can && (
					<div className={cx('flyout-fullwidth-btn publish-reset', {error})} onClick={this.onResetClick}>
						Reset Assignment
					</div>
				)}
			</Flyout>
		);
	}
}
