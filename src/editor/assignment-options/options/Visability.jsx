import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';
import {SelectBox} from 'nti-web-commons';
import {HOC} from 'nti-web-commons';

import OptionGroup from '../OptionGroup';

const DEFAULT_TEXT = {
	content: 'Change the who can see the assignment.',
	label: 'Show For',
	ForCredit: 'For Credit Only',
	Everyone: 'Everyone'
};

const t = scoped('OPTIONS_VISABILITY', DEFAULT_TEXT);

const getOption = k => ({label: t(k), value: k});

class Visability extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	static getItem (props) {
		return props.assignment;
	}

	onChange = (value) => {
		if (this.busy) { return; }
		this.busy = true;

		const {assignment} = this.props;
		const work = assignment.setVisability(value);

		if (work) {
			const clearBusy = () => delete this.busy;
			work.then(clearBusy, clearBusy);
		}
	}

	render () {
		const {assignment} = this.props;
		const value = assignment.getVisability();

		const options = [
			getOption('ForCredit'),
			getOption('Everyone')
		];

		return (
			<OptionGroup name="visability" header="Visability" content={t('content')}>
				<SelectBox value={value} options={options} onChange={this.onChange} />
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Visability);
