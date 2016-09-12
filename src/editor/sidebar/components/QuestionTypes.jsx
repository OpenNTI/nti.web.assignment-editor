import React from 'react';
import cx from 'classnames';
import {HOC} from 'nti-web-commons';
import autobind from 'nti-commons/lib/autobind';

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
		assignment: React.PropTypes.object.isRequired,
		schema: React.PropTypes.object,
		activeInsert: React.PropTypes.object,
		readOnly: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		autobind(this, 'onChange');
	}


	onChange () {
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
