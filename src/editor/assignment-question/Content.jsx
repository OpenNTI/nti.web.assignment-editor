import React from 'react';
import cx from 'classnames';
import {TextEditor} from 'nti-modeled-content';
import autobind from 'nti-commons/lib/autobind';

import {saveQuestionContent} from './Actions';

const PLACEHOLDER = 'Question Content';

export default class QuestionContent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		isSaving: React.PropTypes.bool,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		error: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		this.setEditorRef = x => this.editorRef = x;

		const {question, error} = props;

		this.state = {
			content: question.content,
			error
		};

		autobind(this,
			'onEditorFocus',
			'onEditorBlur',
			'onEditorChange'
		);
	}


	componentWillReceiveProps (nextProps) {
		const {question:oldQuestion, error:oldError} = this.props;
		const {question:newQuestion, error:newError} = nextProps;
		let state = null;

		if (oldQuestion.content !== newQuestion.content) {
			state = state || {};

			state.content = newQuestion.content;
		}

		if (oldError !== newError) {
			state = state || {};

			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	onEditorBlur () {
		const {onBlur, question} = this.props;
		const content = this.editorRef.getValue();

		if (onBlur) {
			onBlur();
		}

		saveQuestionContent(question, content);
	}


	onEditorFocus () {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus(this.editorRef);
		}
	}


	onEditorChange () {
		//TODO: start save timer?
		const {error} = this.state;

		if (error && error.clear) {
			error.clear();
		}
	}


	render () {
		const {isSaving} = this.props;
		const {content, error} = this.state;
		const cls = cx('question-content-editor', {error});

		return (
			<div className={cls}>
				{!isSaving ?
					<TextEditor
						className={cls}
						ref={this.setEditorRef}
						initialValue={content}
						placeholder={PLACEHOLDER}
						onFocus={this.onEditorFocus}
						onBlur={this.onEditorBlur}
						onChange={this.onEditorChange}
					/> :
					null
				}
			</div>
		);
	}
}
