import React from 'react';
import cx from 'classnames';
import {TextEditor, valuesEqual} from 'nti-modeled-content';
import autobind from 'nti-commons/lib/autobind';

import {getContentPlaceholderFor} from '../assignment-inputs/';

import {saveQuestionContent} from './Actions';


export default class QuestionContent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		isSaving: React.PropTypes.bool,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		error: React.PropTypes.any,
		warning: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		this.setEditorRef = x => this.editorRef = x;

		const {question, error, warning} = props;

		this.state = {
			content: question.content,
			error,
			warning
		};

		autobind(this,
			'onEditorFocus',
			'onEditorBlur',
			'onEditorChange'
		);
	}


	componentWillReceiveProps (nextProps) {
		const {question:oldQuestion, error:oldError, warning:oldWarning} = this.props;
		const {question:newQuestion, error:newError, warning:newWarning} = nextProps;
		let state = null;

		if (oldQuestion.content !== newQuestion.content) {
			state = state || {};

			state.content = newQuestion.content;
		}

		if (oldError !== newError) {
			state = state || {};

			state.error = newError;
		}

		if (oldWarning !== newWarning) {
			state = state || {};

			state.warning = newWarning;
		}

		if (state) {
			this.setState(state);
		}
	}


	onChange () {
		const {onBlur, question} = this.props;
		const content = this.editorRef.getValue();

		if (onBlur) {
			onBlur();
		}

		saveQuestionContent(question, content);
	}


	onEditorBlur () {
		this.onChange();
	}


	onEditorFocus () {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus(this.editorRef);
		}
	}


	onEditorChange () {
		const {error, warning, content:oldContent} = this.state;
		const newContent = this.editorRef && this.editorRef.getValue();

		if (!valuesEqual(oldContent, newContent)) {
			if (error && error.clear) {
				error.clear();
				this.onChange();
			} else if (warning && warning.clear) {
				warning.clear();
				this.onChange();
			}
		}
	}


	render () {
		const {isSaving, question} = this.props;
		const {content, error, warning} = this.state;
		const cls = cx('question-content-editor', {error});

		const placeholder = getContentPlaceholderFor(question);

		return (
			<div className={cls}>
				{!isSaving ?
					<TextEditor
						className={cls}
						ref={this.setEditorRef}
						initialValue={content}
						placeholder={placeholder}
						onFocus={this.onEditorFocus}
						onBlur={this.onEditorBlur}
						onChange={this.onEditorChange}
						error={!warning && error}
						warning={warning}
					/> :
					null
				}
			</div>
		);
	}
}
