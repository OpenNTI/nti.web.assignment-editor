import './Placeholder.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	title: 'Editing is not available for this assignment.',
	message: 'Assignments you did not create can only be previewed.',
	defaultTitle: 'Unknown Assignment',
	buttonText: 'Preview Assignment',
};

const t = scoped('assignment.editing.placeholder', DEFAULT_TEXT);

const SHORT = 'short';
const LONG = 'long';

const RADIO = 'radio';

const DEFAULT_FAKE_QUESTIONS = [
	{ lines: [SHORT], answers: [RADIO] },
	{ lines: [SHORT, SHORT, LONG], answers: [RADIO, RADIO, RADIO, RADIO] },
	{ lines: [SHORT, SHORT], answers: [RADIO, RADIO, RADIO] },
	{ lines: [LONG], answers: [RADIO, RADIO] },
];

AssignmentEditorPlaceholder.propTypes = {
	assignment: PropTypes.object,
	title: PropTypes.string,
	message: PropTypes.string,
	previewAssignment: PropTypes.func,
	fakeQuestions: PropTypes.array,
};

function renderAnswer(answer, index) {
	return <div key={index} className="answer" />;
}

function renderLine(line, index) {
	const cls = cx('line', { long: line === LONG });

	return <div key={index} className={cls} />;
}

function renderFakeQuestion(question, index) {
	return (
		<div key={index} className="question">
			<div className="prompt">{question.lines.map(renderLine)}</div>
			<div className="answer-container">
				<div className="answers">
					{question.answers.map(renderAnswer)}
				</div>
			</div>
		</div>
	);
}

function renderFakeQuestions(questions = []) {
	return (
		<div className="fake-questions">
			{questions.map(renderFakeQuestion)}
		</div>
	);
}

function AssignmentEditorPlaceholder({
	assignment,
	title = t('title'),
	message = t('message'),
	previewAssignment,
	fakeQuestions = DEFAULT_FAKE_QUESTIONS,
}) {
	const { title: assignmentTitle } = assignment || {};

	return (
		<div className="assignment-editing-placeholder">
			<div className="header">{assignmentTitle || t('defaultTitle')}</div>
			{renderFakeQuestions(fakeQuestions)}
			<div className="alert">
				<div className="title">{title}</div>
				<div className="message">{message}</div>
				{previewAssignment && (
					<div className="button" onClick={previewAssignment}>
						{t('buttonText')}
					</div>
				)}
			</div>
		</div>
	);
}

export default AssignmentEditorPlaceholder;
