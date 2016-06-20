import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';

import OptionGroup from '../OptionGroup';
import Option from '../Option';


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
		const gradingContent = 'Save time with auto grading.';
		const {assignment} = this.props;
		const {isAutoGraded} = assignment;
		const disabled = !assignment.hasLink('edit');

		return (
			<OptionGroup name="grading" content={gradingContent}>
				<Option label="Enable Auto Grading" name="auto-grading" value={isAutoGraded} onChange={this.onChange} disabled={disabled}/>
			</OptionGroup>
		);
	}
}
