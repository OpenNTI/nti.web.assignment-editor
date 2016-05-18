import React from 'react';

import {saveQuestionContent} from './Actions';

export default class QuestionContent extends React.Component {
	static propTypes = {
		Question: React.PropTypes.object.isRequired,
		onFocus: React.PropTypes.fn,
		onBlur: React.PropTypes.fn
	}


	constructor (props) {
		super(props);

		const {Question} = props;

		this.state = {
			content: Question.content
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}


	onFocus () {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus();
		}
	}


	onBlur () {
		const {onBlur, Question} = this.props;
		const {content} = this.state;

		if (onBlur) {
			onBlur();
		}

		saveQuestionContent(Question, content);
	}


	onChange (e) {
		this.setState({
			content: e.target.value
		});
	}


	render () {
		const {content} = this.state;

		return (
			<textarea onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} value={content}></textarea>
		);
	}
}
