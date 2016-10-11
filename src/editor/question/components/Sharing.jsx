import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	shared: 'Shared',
	disclosure: 'Edits will be shared with other assignments',
	detach: 'Detach from Other Assignments'
};

const t = scoped('QUESTION_SHARING', DEFAULT_TEXT);

QuestionSharing.propTypes = {
	question: React.PropTypes.object,
	course: React.PropTypes.object
};
export default function QuestionSharing ({question, course}) {
	const cls = cx('question-sharing');

	//If the question isn't in at least 2 assessments there's no need
	//to show the sharing widget.
	if (!question.associationCount || question.associationCount < 2) {
		return null;
	}

	return (
		<div className={cls}>
			<div className="pill">
				<i className="icon-link" />
				<span>{t('shared')}</span>
			</div>
			<div className="message">
				<span className="disclosure">{t('disclosure')}</span>
				<span className="detach">{t('detach')}</span>
			</div>
		</div>
	);
}
