import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';
import {SelectBox} from 'nti-web-commons';
import {HOC} from 'nti-web-commons';

import OptionGroup from '../OptionGroup';

const DEFAULT_TEXT = {
	content: 'Change who can see the assignment.',
	label: 'Show For',
	ForCredit: 'For Credit Only',
	Everyone: 'Everyone'
};

const t = scoped('OPTIONS_VISIBILITY', DEFAULT_TEXT);

const getOption = k => ({label: t(k), value: k});

class Visibility extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}

	static getItem (props) {
		return props.assignment;
	}

	onChange = (value) => {
		const {assignment} = this.props;
		assignment.setVisibility(value);
	}

	render () {
		const {assignment} = this.props;
		const value = assignment.getVisibility();

		const options = [
			getOption('ForCredit'),
			getOption('Everyone')
		];

		return (
			<OptionGroup name="visibility" header="Visibility" content={t('content')}>
				<SelectBox value={value} options={options} onChange={this.onChange} />
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Visibility);
