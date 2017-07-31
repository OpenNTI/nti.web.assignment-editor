import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import {Dropzone} from '../../../dnd';
import {createPartWithQuestion} from '../Actions';

import {QUESTION_TYPE} from './QuestionSet';


const DEFAULT_TEXT = {
	placeholder: 'No questions yet. Select question from the right to add one.'
};

const t = scoped('assignment.parts.none', DEFAULT_TEXT);

export default class NoParts extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}


	constructor (props) {
		super(props);

		this.accepts = [QUESTION_TYPE];
		this.dropHandlers = {
			[QUESTION_TYPE]: this.onQuestionAdded
		};
	}


	onQuestionAdded = (data) => {
		const {assignment} = this.props;

		createPartWithQuestion(assignment, data, null, assignment.isAvailable());
	}


	render () {
		return (
			<Dropzone accepts={this.accepts} dropHandlers={this.dropHandlers}>
				<div className="assignment-editor-no-parts">
					<div className="empty-message">
						{t('placeholder')}
					</div>
				</div>
			</Dropzone>
		);
	}
}
