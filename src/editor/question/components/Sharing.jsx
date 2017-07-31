import React from 'react';
import PropTypes from 'prop-types';
import {OrderedContents} from 'nti-lib-interfaces';
import {scoped} from 'nti-lib-locale';
import {Associations} from 'nti-web-commons';

import {detachSharedQuestion} from '../Actions';

const {createInterfaceForItem, openEditorModal, Display} = Associations;

const AssignmentType = 'application/vnd.nextthought.assessment.assignment';

const DEFAULT_TEXT = {
	shared: 'Shared',
	disclosure: 'Edits will affect other assignments.',
	detach: 'Detach from Other Assignments',
	modalLabel: 'Add to Assignment',
	noActiveLessons: 'Add to Assignment',
	availableLabel: 'Available Assignments',
	noShared: {
		subHeader: 'Add to a Assignment.'
	}
};

const t = scoped('assignment.editing.question.sharing', DEFAULT_TEXT);

export default class QuestionShareing extends React.Component {
	static propTypes = {
		question: PropTypes.object,
		questionSet: PropTypes.object,
		assignment: PropTypes.object,
		course: PropTypes.object
	}


	canDetach () {
		const {questionSet} = this.props;

		return OrderedContents.hasOrderedContents(questionSet);
	}


	onDetach = () => {
		const {question, questionSet} = this.props;

		detachSharedQuestion(question, questionSet);
	}


	onPillClick = () => {
		const {question, course} = this.props;
		const associations = createInterfaceForItem(question, course, [AssignmentType]);

		openEditorModal(t('modalLabel'), associations, null, t);
	}


	//To keep the question selectable from preventing the click event from firing
	//stop our focus event from propagating
	onFocus = (e) => {
		e.stopPropagation();
	}


	render () {
		const {question, course} = this.props;

		//If the question isn't in at least 2 assessments there's no need
		//to show the sharing widget.
		if (!question.associationCount || question.associationCount < 2) {
			return null;
		}

		return (
			<div className="question-sharing">
				<Display.Pill className="question-sharing-pill" item={question} scope={course} onShow={this.onPillClick} />
				<div className="message">
					<span className="disclosure">{t('disclosure')}</span>
					{this.canDetach() && (<span className="detach" onClick={this.onDetach} onFocus={this.onFocus} tabIndex="-1">{t('detach')}</span>)}
				</div>
			</div>
		);
	}
}
