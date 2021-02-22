import './PublishLocked.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';
import { Flyout, PublishTrigger, Constants, Loading } from '@nti/web-commons';

import { resetAssignmentSubmissions } from '../../Actions';

const { PUBLISH_STATES } = Constants;

const DEFAULT_TEXT = {
	label: 'Students have started your assignment.',
	editorLabel: 'Students have started this assignment',
	text:
		'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.',
	editorText:
		'The instructor must reset this assignment before a publish change can occur.',
	error:
		'Could not reset the assignment at this time. Please try again later.',
	resetAssignment: 'Reset Assignment',
};

const t = scoped('assignment.editing.controls.publish.locked', DEFAULT_TEXT);

export default class PublishLocked extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES)),
		]),
		assignment: PropTypes.object,
	};

	state = {};

	setFlyoutRef = x => (this.flyoutRef = x);

	componentWillUnmount() {
		this.unmounted = true;
	}

	onResetClick = async () => {
		const { assignment } = this.props;
		if (assignment.hasLink('reset')) {
			this.setState({ busy: true });
			try {
				await resetAssignmentSubmissions(assignment);
				this.closeMenu();
			} catch {
				this.setState({ error: true });
			} finally {
				if (!this.unmounted) {
					this.setState({ busy: false });
				}
			}
		}
	};

	closeMenu = () => {
		this.flyoutRef?.dismiss();
	};

	clearError = () => this.setState({ error: false });

	isNonInstructor() {
		const { assignment } = this.props;
		if (!assignment) {
			return;
		}

		return (
			!assignment.hasLink('reset') &&
			!assignment.hasLink('publish') &&
			!assignment.hasLink('unpublish')
		);
	}

	render() {
		const {
			props: { assignment, value, children },
			state: { error, busy },
		} = this;

		const can = assignment && assignment.hasLink('reset');
		const trigger = <PublishTrigger value={value} />;
		const label = this.isNonInstructor() ? 'editorLabel' : 'label';
		const text = this.isNonInstructor() ? 'editorText' : 'text';

		return (
			<Flyout.Triggered
				ref={this.setFlyoutRef}
				className="publish-locked"
				trigger={trigger}
				verticalAlign={Flyout.ALIGNMENTS.TOP}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				onDismiss={this.clearError}
				arrow
			>
				<span className="reset-label">{t(label)}</span>
				<p className="reset-text">{t(text)}</p>

				{!busy && children}
				{error && <div className="reset-error">{t('error')}</div>}
				{busy ? (
					<Loading.Ellipsis />
				) : (
					can && (
						<div
							className={cx(
								'flyout-fullwidth-btn publish-reset',
								{ error }
							)}
							onClick={this.onResetClick}
						>
							{t('resetAssignment')}
						</div>
					)
				)}
			</Flyout.Triggered>
		);
	}
}
