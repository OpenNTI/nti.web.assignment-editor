import React from 'react';
import cx from 'classnames';

import {deleteQuestionFrom} from '../../Actions';

const TITLE = 'Delete';

export default class DeleteControl extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired,
		disabled: React.PropTypes.bool
	}


	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {disabled, question, questionSet, assignment} = this.props;

		if (disabled) {
			return;
		}

		deleteQuestionFrom(question, questionSet, assignment);
	}


	render () {
		const {disabled} = this.props;
		return (
			<i className={cx('icon-delete', {disabled})} title={TITLE} onClick={this.onClick}/>
		);
	}
}
