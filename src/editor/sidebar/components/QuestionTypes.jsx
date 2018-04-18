import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {HOC} from '@nti/web-commons';

import {getButtons} from '../../input-types';

const {ItemChanges} = HOC;

function getQuestionSetFrom (assignment) {
	const {parts} = assignment;
	const part = parts && parts[0];
	const {'question_set':questionSet} = part || {};

	return questionSet;
}

export default class QuestionTypes extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		schema: PropTypes.object,
		activeInsert: PropTypes.object,
		readOnly: PropTypes.bool
	}


	constructor (props) {
		super(props);
	}


	onChange = () => {
		this.forceUpdate();
	}


	render () {
		const {assignment, activeInsert, readOnly} = this.props;
		const questionSet = getQuestionSetFrom(assignment);
		const cls = cx('question-types', {'read-only': readOnly});

		return (
			<ItemChanges item={assignment} onItemChanged={this.onChange}>
				<ItemChanges item={questionSet} onItemChanged={this.onChange}>
					<div className={cls}>
						{getButtons(null, assignment, activeInsert)}
					</div>
				</ItemChanges>
			</ItemChanges>
		);
	}
}
