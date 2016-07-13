import React from 'react';
import cx from 'classnames';
import buffer from 'nti-commons/lib/function-buffer';
import {Errors} from 'nti-web-commons';

import {DragHandle} from '../../dnd';

import Store from '../Store';
import {QUESTION_ERROR, QUESTION_WARNING} from '../Constants';
import Selectable from '../utils/Selectable';
import ControlsConfig from '../controls/ControlsConfig';

import {updateQuestion} from './Actions';
import Between from './Between';
import Content from './Content';
import Parts from './Parts';
import Controls from './controls';

const {Field:{Component:ErrorCmp}} = Errors;

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

export default class QuestionComponent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired,
		index: React.PropTypes.number
	}

	constructor (props) {
		super(props);

		const {question} = this.props;

		this.state = {
			selectableId: question.NTIID,
			selectableValue: new ControlsConfig(null, {after: true, item: question})
		};
	}


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


	onStoreChange = (data) => {
		if (data.type === QUESTION_ERROR || data.type === QUESTION_WARNING) {
			this.onQuestionMessages();
		}
	}


	onQuestionChange = () => {
		const {questionError} = this.state;

		if (questionError && questionError.clear) {
			questionError.clear();
		} else {
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


	onChange = buffer(500, () => {
		const {question} = this.props;

		if (this.pendingChanges) {
			updateQuestion(question, this.pendingChanges);
		}
	})


	flushChanges = () => {
		this.onChange.flush();
	}


	onContentChange = (content) => {
		this.pendingChanges = this.pendingChanges || {};

		this.pendingChanges.content = content;
		this.onChange();
	}


	onPartsChange = (index, part) => {
		this.pendingChanges = this.pendingChanges || {};

		//When are support multi-part per question we need to revisit this.
		this.pendingChanges.parts = [part];
		this.onChange();
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


	render () {
		const {question, index, questionSet, assignment} = this.props;
		const {selectableId, selectableValue, contentError, contentWarning, partError, questionError} = this.state;
		const {isSaving} = question;
		const cls = cx('question-editor', {'is-saving': isSaving, error: contentError || questionError || question.error});

		return (
			<div className="assignment-editing-question-container">
				<Between question={question} before />
				<Selectable className={cls} id={selectableId} value={selectableValue} tabIndex="0">
					<div className="wrap">
						<DragHandle className="question-drag-handle hide-when-saving" />
						<div className="index">{index + 1}</div>
						<Content
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
				{!isSaving && (<Controls question={question} questionSet={questionSet} assignment={assignment} flushChanges={this.flushChanges} />)}
				{isLastQuestion(question, questionSet) && (<Between question={question} after />)}
			</div>
		);
	}
}
