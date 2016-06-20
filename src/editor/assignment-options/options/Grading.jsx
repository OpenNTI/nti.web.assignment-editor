import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';

import OptionGroup from '../OptionGroup';
import Option from '../Option';

const DEFAULT_TEXT = {
	content: 'Save time with auto grading.',
	label: 'Enable Auto Grading'
};

const t = scoped('OPTIONS_GRADING', DEFAULT_TEXT);

export default class Grading extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}


	onChange = () => {
		if (this.busy) { return; }
		this.busy = true;

		const {assignment} = this.props;
		const {isAutoGraded} = assignment;
		const clearBusy = () => delete this.busy;

		assignment.setAutoGrade(!isAutoGraded)
			.then(clearBusy, clearBusy);
	}

	render () {
		const {assignment} = this.props;
		const {isAutoGraded} = assignment;
		const disabled = !assignment.hasLink('edit');

		return (
			<OptionGroup name="grading" content={t('content')}>
				<Option label={t('label')} name="auto-grading" value={isAutoGraded} onChange={this.onChange} disabled={disabled}/>
			</OptionGroup>
		);
	}
}
