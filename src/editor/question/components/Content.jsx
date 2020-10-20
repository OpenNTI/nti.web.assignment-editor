import './Content.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {isNTIID} from '@nti/lib-ntiids';

import BufferedTextEditor from '../../inputs/BufferedTextEditor';
import Store from '../../Store';
import {getContentPlaceholderFor} from '../../input-types/';
import {warnIfQuestionEmpty} from '../Actions';


export default class QuestionContent extends React.Component {
	static propTypes = {
		question: PropTypes.object.isRequired,
		isSaving: PropTypes.bool,
		published: PropTypes.bool,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		error: PropTypes.any,
		warning: PropTypes.any,
		onChange: PropTypes.func
	}


	attachRef = (x) => this.editor = x;


	componentDidMount () {
		const {question} = this.props;

		if (question && isNTIID(question.NTIID)) {
			warnIfQuestionEmpty(question);
		}
	}


	componentDidUpdate (prevProps) {
		const {question:nextQuestion} = this.props;
		const {question:oldQuestion} = prevProps;

		if (nextQuestion !== oldQuestion) {
			warnIfQuestionEmpty(nextQuestion);
		}
	}


	onEditorFocus = (editor) => {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus(editor);
		}
	}


	onEditorBlur = () => {
		const {onBlur} = this.props;

		if (onBlur) {
			onBlur();
		}
	}


	onChange = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
		}
	}


	focus = () => {
		if(this.editor) {
			this.editor.focus();
		}
	}

	/**
	 * If we have a warning, and are in a state to show it return it.
	 *
	 * We show the warning if: the assignment is published, the question
	 * was created after the assignment editor is open, or the question
	 * has been edited since it was created.
	 *
	 * @return {Object} the warning that should be shown, if any
	 */
	getWarning () {
		const {warning, published, question} = this.props;

		if (!warning) { return null; }

		const {openSince} = Store;
		const created = question.getCreatedTime();
		const modified = question.getLastModified();

		return (published || created < openSince || modified > created) ? warning : null;
	}


	render () {
		const {isSaving, question, error} = this.props;
		const warning = this.getWarning();
		const {content} = question;
		const cls = cx('question-content-editor', {error});

		const placeholder = getContentPlaceholderFor(question);

		return (
			<div className={cls}>
				{!isSaving ? (
					<BufferedTextEditor
						ref={this.attachRef}
						className={cls}
						initialValue={content}
						placeholder={placeholder}
						onFocus={this.onEditorFocus}
						onChange={this.onChange}
						error={warning ? void 0 : error || void 0}
						warning={warning || void 0}
					/>
				) :
					null
				}
			</div>
		);
	}
}
