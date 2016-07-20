import React from 'react';
import cx from 'classnames';
import buffer from 'nti-commons/lib/function-buffer';
import {Errors} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {DragHandle} from '../../../dnd';
import InlineDialog from '../../../inline-dialog';

import Store from '../../Store';
import {QUESTION_ERROR, QUESTION_WARNING} from '../../Constants';
import {Component as Selectable} from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';

import {updateQuestion} from '../Actions';

import Between from './Between';
import Content from './Content';
import Parts from './Parts';
import Controls from './controls/View';

const {Field:{Component:ErrorCmp}} = Errors;

const DEFAULT_TEXT = {
	save: 'Save',
	cancel: 'Cancel',
	visibleDisclaimer: 'You assignment is currently being viewed. Auto saving is disabled to prevent unfinished work from being seen.'
};

const t = scoped('ASSIGNMENT_AUTHORING_QUESTION', DEFAULT_TEXT);

function isKnownPartError (error) {
	if (!error) { return false; }

	const known = {choices: true, values: true, labels: true};
	const {raw} = error;

	return known[raw.field] && raw.index;
}


function isLastQuestion (question, questionSet) {
	const {questions} = questionSet;
	const last = questions[questions.length - 1];

	return last && last.NTIID === question.NTIID;
}


function isVisible (question, assignment) {
	const now = new Date();
	const available = assignment.getAvailableForSubmissionBeginning();

	//look at if the assignment is published and available
	return assignment.isPublished() && now > available;
}

export default class Question extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired,
		index: React.PropTypes.number
	}


	buttons = [
		{label: t('cancel'), onClick: () => this.onDialogCancel()},
		{label: t('save'), onClick: () => this.onDialogSave()}
	]

	constructor (props) {
		super(props);

		const {question} = this.props;

		this.onChangeBuffered = buffer(500, () => this.onChange());

		this.state = {
			selectableId: question.NTIID,
			selectableValue: new ControlsConfig(null, {after: true, item: question}),
			modal: false
		};
	}


	attachRef = (x) => this.editorRef = x;


	componentDidMount () {
		const {question} = this.props;

		Store.addChangeListener(this.onStoreChange);

		if (question && question.addListener) {
			question.addListener('change', this.onQuestionChange);
		}
	}


	componentWillUnmount () {
		const {question} = this.props;

		Store.removeChangeListener(this.onStoreChange);

		if (question && question.removeListener) {
			question.removeListener('change', this.onQuestionChange);
		}
	}


	focusEditor = () => {
		if (this.editorRef) {
			this.editorRef.focus();
		}
	}


	onStoreChange = (data) => {
		if (data.type === QUESTION_ERROR || data.type === QUESTION_WARNING) {
			this.onQuestionMessages();
		}
	}


	onQuestionChange = () => {
		const {questionError, contentWarning} = this.state;

		if (questionError && questionError.clear) {
			questionError.clear();
		}
		if(contentWarning && contentWarning.clear) {
			contentWarning.clear();
		}
		if((!questionError || !questionError.clear) && (!contentWarning || !contentWarning.clear)) {
			this.forceUpdate();
		}
	}


	onQuestionMessages () {
		const {question} = this.props;
		const {NTIID} = question;
		const contentError = Store.getErrorFor(NTIID, 'content');
		const contentWarning = Store.getWarningFor(NTIID, 'content');
		const partsError = Store.getErrorFor(NTIID, 'parts');
		let partError;
		let questionError;

		if (isKnownPartError(partsError)) {
			partError = partsError;
		} else {
			questionError = partsError;
		}

		this.setState({
			contentError,
			contentWarning,
			questionError,
			partError
		});
	}


	onChange = () => {
		const {question} = this.props;

		if (this.pendingChanges) {
			return updateQuestion(question, this.pendingChanges);
		}

		return Promise.resolve();
	}


	flushChanges = () => {
		this.onChangeBuffered.flush();
	}


	onContentChange = (content) => {
		this.pendingChanges = this.pendingChanges || {};

		this.pendingChanges.content = content;
		this.onChangeBuffered();
	}


	onPartsChange = (index, part) => {
		this.pendingChanges = this.pendingChanges || {};

		//When are support multi-part per question we need to revisit this.
		this.pendingChanges.parts = [part];
		this.onChangeBuffered();
	}


	onContentFocus = (editor) => {
		const {question} = this.props;

		this.setState({
			selectableValue: new ControlsConfig(editor, question)
		});
	}


	onContentBlur = () => {
		const {question} = this.props;

		this.setState({
			selectableValue: new ControlsConfig(null, {after: true, item: question})
		});
	}


	onMouseDown = () => {
		const {question, assignment} = this.props;

		if (isVisible(question, assignment)) {
			this.setModal(true);
		} else {
			this.setModal(false);
		}
	}


	setModal (modal) {
		const {modal:isModal} = this.state;

		if (isModal === modal) { return; }

		if (modal) {
			this.onChangeBuffered = () => {};
		} else {
			this.onChangeBuffered = buffer(500, () => this.onChange());
		}

		this.setState({
			savingMask: false,
			modal
		});
	}


	onDialogSave = () => {
		this.setState({
			savingMask: true
		});

		this.onChange()
			.then(() => {
				this.setModal(false);
			})
			.catch(() => {
				this.setState({
					savingMask: false
				});
			});
	}


	onDialogCancel = () => {
		this.setModal(false);
	}


	render () {
		const {
			question,
			index,
			questionSet,
			assignment
		} = this.props;
		const {
			selectableId,
			selectableValue,
			contentError,
			contentWarning,
			partError,
			questionError,
			modal,
			savingMask
		} = this.state;
		const {isSaving} = question;
		const cls = cx('question-editor', {
			'is-saving': isSaving,
			error: contentError || questionError || question.error,
			'saving-mask': savingMask
		});

		return (
			<div className="assignment-editing-question-container">
				<Between question={question} before />
				<InlineDialog active={modal} dialogButtons={this.buttons} topPadding={80} bottomPadding={70}>
					<Selectable className={cls} id={selectableId} value={selectableValue} tabIndex="-1" onMouseDown={this.onMouseDown}>
						{modal && (<div className="visible-disclaimer">{t('visibleDisclaimer')}</div>)}
						<div className="wrap" onClick={this.focusEditor}>
							<DragHandle className="question-drag-handle hide-when-saving" />
							<div className="index">{index + 1}</div>
							<Content
								ref={this.attachRef}
								question={question}
								onFocus={this.onContentFocus}
								onBlur={this.onContentBlur}
								error={contentError}
								warning={contentWarning}
								onChange={this.onContentChange}
							/>
						</div>
						<Parts question={question} error={partError} onChange={this.onPartsChange} />
						{questionError && (<ErrorCmp error={questionError} />)}
					</Selectable>
				</InlineDialog>
				{!isSaving && (<Controls question={question} questionSet={questionSet} assignment={assignment} flushChanges={this.flushChanges} />)}
				{isLastQuestion(question, questionSet) && (<Between question={question} after />)}
			</div>
		);
	}
}
