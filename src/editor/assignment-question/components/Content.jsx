import React from 'react';
import cx from 'classnames';

import BufferedTextEditor from '../../inputs/BufferedTextEditor';

import {getContentPlaceholderFor} from '../../assignment-inputs/';


export default class QuestionContent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		isSaving: React.PropTypes.bool,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		error: React.PropTypes.any,
		warning: React.PropTypes.any,
		onChange: React.PropTypes.func
	}


	constructor (props) {
		super(props);
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


	render () {
		const {isSaving, question, error, warning} = this.props;
		const {content} = question;
		const cls = cx('question-content-editor', {error});

		const placeholder = getContentPlaceholderFor(question);

		return (
			<div className={cls}>
				{!isSaving ?
					<BufferedTextEditor
						className={cls}
						initialValue={content}
						placeholder={placeholder}
						onFocus={this.onEditorFocus}
						onChange={this.onChange}
						error={warning ? void 0 : error || void 0}
						warning={warning || void 0}
					/> :
					null
				}
			</div>
		);
	}
}
