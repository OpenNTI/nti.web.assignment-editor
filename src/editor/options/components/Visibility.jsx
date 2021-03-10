import './Visibility.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { HOC } from '@nti/web-commons';

import OptionGroup from './OptionGroup';

const DEFAULT_TEXT = {
	header: 'Assign To',
	content: 'Change who can see the assignment.',
	label: 'Show For',
	ForCredit: 'For Credit Only',
	Everyone: 'Everyone',
};

const t = scoped('assignment.editing.options.visibility', DEFAULT_TEXT);

const getOption = k => ({ label: t(k), value: k });

class Visibility extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
	};

	static getItem(props) {
		return props.assignment;
	}

	onChange = ({ target }) => {
		const { assignment } = this.props;
		if (assignment) {
			assignment.setVisibility(target.value);
		}
	};

	render() {
		const { assignment } = this.props;
		const visibility = assignment && assignment.getVisibility();
		const isDisabled = assignment && !assignment.hasLink('IsNonPublic');

		const options =
			assignment.isNonPublic && isDisabled
				? [getOption('ForCredit')]
				: [getOption('Everyone'), getOption('ForCredit')];

		return (
			<OptionGroup
				disabled={isDisabled}
				name="visibility"
				header={t('header')}
				content={t('content')}
			>
				<label>
					<select value={visibility} onChange={this.onChange}>
						{options.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
					<div className="arrow" />
				</label>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Visibility);
