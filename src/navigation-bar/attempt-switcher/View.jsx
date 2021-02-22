import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Flyout } from '@nti/web-commons';

import Attempt from './Attempt';

const t = scoped('nti-assignment.navigation-bar.attempt-switcher.View', {
	label: 'Attempts',
});

function isSameAttempt(a, b) {
	a = a && a.getID ? a.getID() : a;
	b = b && b.getID ? b.getID() : b;

	return a === b;
}

export default class AssignmentNavigationAttemptSwitcher extends React.Component {
	static propTypes = {
		attempts: PropTypes.arrayOf(
			PropTypes.shape({
				getID: PropTypes.func,
			})
		),
		active: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				getID: PropTypes.func,
			}),
		]),
	};

	attachFlyout = x => (this.flyout = x);

	onNavigation = () => {
		if (this.flyout) {
			this.flyout.doClose();
		}
	};

	render() {
		const { active, attempts } = this.props;

		if (!attempts.length) {
			return null;
		}

		return (
			<Flyout.Triggered
				ref={this.attachFlyout}
				trigger={this.renderTrigger(active)}
				verticalAlign={Flyout.ALIGNMENTS.ALIGN_BOTTOM}
				horizontalAlgin={Flyout.ALIGNMENTS.ALIGN_LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
			>
				<ul className="assignment-navigation-bar-attempt-switcher">
					{attempts.map((attempt, index) => {
						return (
							<li key={index}>
								<Attempt
									active={isSameAttempt(active, attempt)}
									attempt={attempt}
									onNavigation={this.onNavigation}
								/>
							</li>
						);
					})}
				</ul>
			</Flyout.Triggered>
		);
	}

	renderTrigger(active) {
		return (
			<div className="assignment-navigation-bar-attempt-switcher-trigger">
				{active && <Attempt label attempt={active} />}
				{!active && <span>{t('label')}</span>}
				<i className="icon-chevron-down" />
			</div>
		);
	}
}
