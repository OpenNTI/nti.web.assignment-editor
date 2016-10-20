import React from 'react';
import {OrderedContents} from 'nti-lib-interfaces';
import {scoped} from 'nti-lib-locale';

import {detachSharedQuestion} from '../Actions';

const DEFAULT_TEXT = {
	shared: 'Shared',
	disclosure: 'Edits will be shared with other assignments',
	detach: 'Detach from Other Assignments'
};

const t = scoped('QUESTION_SHARING', DEFAULT_TEXT);

export default class QuestionShareing extends React.Component {
	static propTypes = {
		question: React.PropTypes.object,
		questionSet: React.PropTypes.object,
		assignment: React.PropTypes.object,
		course: React.PropTypes.object
	}


	canDetach () {
		const {questionSet} = this.props;

		return OrderedContents.hasOrderedContents(questionSet);
	}


	onDetach = () => {
		const {question, questionSet, assignment} = this.props;

		detachSharedQuestion(question, questionSet, assignment.isAvailable());
	}


	//To keep the question selectable from preventing the click event from firing
	//stop our focus event from propagating
	onFocus = (e) => {
		e.stopPropagation();
	}


	render () {
		const {question} = this.props;

		//If the question isn't in at least 2 assessments there's no need
		//to show the sharing widget.
		if (!question.associationCount || question.associationCount < 2) {
			return null;
		}

		return (
			<div className="question-sharing">
				<div className="pill">
					<i className="icon-link" />
					<span>{t('shared')}</span>
				</div>
				<div className="message">
					<span className="disclosure">{t('disclosure')}</span>
					{this.canDetach() && (<span className="detach" onClick={this.onDetach} onFocus={this.onFocus} tabIndex="-1">{t('detach')}</span>)}
				</div>
			</div>
		);
	}
}
