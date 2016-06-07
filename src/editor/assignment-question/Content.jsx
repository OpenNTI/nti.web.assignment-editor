import React from 'react';
import cx from 'classnames';

import TextArea from '../inputs/TextArea';

import {saveQuestionContent} from './Actions';

export default class QuestionContent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		error: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		const {question, error} = props;

		this.state = {
			content: question.content,
			error
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		this.setState({
			error: nextProps.error
		});
	}


	onFocus () {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus();
		}
	}


	onBlur () {
		const {onBlur, question} = this.props;
		const content = this.textarea.getValue();

		if (onBlur) {
			onBlur();
		}

		saveQuestionContent(question, content);
	}


	onChange () {
		//TODO: start save timer?
		const {error} = this.state;

		if (error && error.clear) {
			error.clear();
		}
	}


	render () {
		const {content, error} = this.state;
		const cls = cx('question-content-editor', {error});

		return (
			<TextArea className={cls} ref={x => this.textarea = x} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} value={content} />
		);
	}
}
