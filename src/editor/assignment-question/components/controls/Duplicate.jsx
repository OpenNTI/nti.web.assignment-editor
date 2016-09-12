import React from 'react';
import cx from 'classnames';

import {duplicateQuestionFrom} from '../../Actions';

const TITLE = 'Duplicate';

export default class DeleteControl extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired,
		flushChanges: React.PropTypes.func,
		disabled: React.PropTypes.bool
	}


	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {disabled, question, assignment, questionSet, flushChanges} = this.props;

		if (disabled) {
			return;
		}

		flushChanges();

		duplicateQuestionFrom(question, questionSet, assignment.isAvailable());
	}


	render () {
		const {disabled} = this.props;
		return (
			<i className={cx('icon-duplicate', {disabled})} title={TITLE} onClick={this.onClick}/>
		);
	}
}
