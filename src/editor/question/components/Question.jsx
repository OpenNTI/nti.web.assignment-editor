import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {buffer} from 'nti-commons';
import {Errors} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {DragHandle} from '../../../dnd';
import InlineDialog from '../../../inline-dialog';
import Store from '../../Store';
import {QUESTION_ERROR, QUESTION_WARNING, REVERT_ERRORS} from '../../Constants';
import {Component as Selectable} from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';
import {updateQuestion} from '../Actions';

import Between from './Between';
import Content from './Content';
import Parts, {Placeholder as PartsPlaceholder} from './Parts';
import Controls, {Placeholder as ControlsPlaceholder} from './controls/View';
import Sharing from './Sharing';

const {Field:{Component:ErrorCmp}} = Errors;

const DEFAULT_TEXT = {
	save: 'Save',
	cancel: 'Cancel',
	visibleDisclaimer: 'Your assignment is currently being viewed. Auto saving is disabled to prevent unfinished work from being seen.'
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
	return question.IsAvailable || assignment.IsAvailable;
}

export default class Question extends React.Component {
	static propTypes = {
		question: PropTypes.object.isRequired,
		questionSet: PropTypes.object.isRequired,
		assignment: PropTypes.object.isRequired,
		course: PropTypes.object,
		index: PropTypes.number
	}


	buttons = [
		{label: t('cancel'), onClick: () => this.onDialogCancel()},
		{label: t('save'), onClick: () => this.onDialogSave()}
	]

	setSelectableRef = x => this.selectableRef = x

	constructor (props) {
		super(props);

		const {question} = this.props;
		const showModal = question.delaySaving;

		this.version = 0;

		this.onChangeBuffered = showModal ? () => {} : buffer(500, () => this.onChange());

		Store.addChangeListener(this.onStoreChange);

		if (question && question.addListener) {
			question.addListener('change', this.onQuestionChange);
		}

		this.state = {
			selectableId: question.NTIID,
			selectableValue: new ControlsConfig(null, {after: true, item: question}),
			modal: showModal
		};
	}


	componentWillMount () {
		this.onQuestionMessages();
	}


	attachRef = (x) => this.editorRef = x


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
		const {question} = this.props;

		if ((data.type === QUESTION_ERROR || data.type === QUESTION_WARNING) && question.NTIID === data.NTIID) {
			this.onQuestionMessages();
		} else if (data.type === REVERT_ERRORS) {
			this.keepStateHash += 1;
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
		const {question, assignment} = this.props;
		const {delaySaving} = question;

		if (this.pendingChanges || delaySaving) {
			return updateQuestion(question, this.pendingChanges || {}, assignment, delaySaving);
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


	onSelect = () => {
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

		Promise.resolve(this.onChange()) //protect against non-promise return value
			.then(() => {
				this.setModal(false);

				if (this.selectableRef) {
					this.selectableRef.doUnselect();
				}
			})
			.catch(() => {
				this.setState({
					savingMask: false
				});
			});
	}


	onDialogCancel = () => {
		const {question} = this.props;

		this.setModal(false);

		if (question.delaySaving && question.remove) {
			question.remove();
		}

		if (this.selectableRef) {
			this.selectableRef.doUnselect();
		}
	}


	render () {
		const {
			question,
			index,
			questionSet,
			assignment,
			course
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
		const cls = cx('question-editor', {
			'is-saving': question.isSaving && !modal,
			error: contentError || questionError || question.error,
			'saving-mask': savingMask,
			'in-modal': modal,
			'is-visible': isVisible(question, assignment)
		});

		return (
			<div className="assignment-editing-question-container">
				<Between question={question} before />
				<InlineDialog active={modal} dialogButtons={this.buttons} topPadding={80} bottomPadding={70}>
					<Selectable
						className={cls}
						ref={this.setSelectableRef}
						id={selectableId}
						value={selectableValue}
						tabIndex="-1"
						onChildSelect={this.onSelect}
						onSelect={this.onSelect}
					>
						{modal && (<div className="visible-disclaimer">{t('visibleDisclaimer')}</div>)}
						<Sharing question={question} course={course} questionSet={questionSet} assignment={assignment} />
						<div className="wrap" onClick={this.focusEditor}>
							<DragHandle className="question-drag-handle hide-when-saving" disabled={modal} />
							<div className="index">{index + 1}</div>
							<Content
								ref={this.attachRef}
								question={question}
								onFocus={this.onContentFocus}
								onBlur={this.onContentBlur}
								error={contentError}
								warning={contentWarning}
								onChange={this.onContentChange}
								published={assignment.isPublished()}
							/>
						</div>
						<Parts question={question} error={partError} onChange={this.onPartsChange} keepStateHash={this.keepStateHash} />
						{questionError && (<ErrorCmp error={questionError} />)}
					</Selectable>
				</InlineDialog>
				<Controls question={question} questionSet={questionSet} assignment={assignment} flushChanges={this.flushChanges} course={course} />
				{isLastQuestion(question, questionSet) && (<Between question={question} after />)}
			</div>
		);
	}
}


export function Placeholder () {
	return (
		<div className="assignment-editing-question-container placeholder">
			<div className="question-editor">
				<div className="wrap">
					<DragHandle className="question-drag-handle" force />
					<div className="index">1</div>
					<div className="placeholder-text" />
				</div>
				<PartsPlaceholder />
			</div>
			<ControlsPlaceholder />
		</div>
	);
}
