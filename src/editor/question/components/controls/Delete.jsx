import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { deleteQuestionFrom } from '../../Actions';

const TITLE = 'Delete';

export default class DeleteControl extends React.Component {
	static propTypes = {
		question: PropTypes.object.isRequired,
		questionSet: PropTypes.object.isRequired,
		assignment: PropTypes.object.isRequired,
		disabled: PropTypes.bool,
	};

	onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		const { disabled, question, questionSet, assignment } = this.props;

		if (disabled) {
			return;
		}

		deleteQuestionFrom(question, questionSet, assignment);
	};

	render() {
		const { disabled } = this.props;
		return (
			<i
				className={cx('icon-delete', { disabled })}
				title={TITLE}
				onClick={this.onClick}
			/>
		);
	}
}
