import React from 'react';
import cx from 'classnames';
import {TextEditor} from 'nti-modeled-content';

import Selectable from '../utils/Selectable';
import ControlsConfig from '../controls/ControlsConfig';

const PLACEHOLDER = 'Write a description...';

export default class ContentEditor extends React.Component {
	static propTypes = {
		value: React.PropTypes.string.isRequired,
		schema: React.PropTypes.object,
		error: React.PropTypes.any,
		onChange: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		const {value, error} = props;

		this.setEditorRef = x => this.editorRef = x;

		this.state = {
			selectableId: 'description',
			selectableValue: new ControlsConfig(),
			value,
			error
		};

		this.onUnselect = this.onUnselect.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);
		this.onEditorFocus = this.onEditorFocus.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		const {value:newValue, error:newError} = nextProps;
		const {value:oldValue, error:oldError} = this.props;
		let state = null;

		if (newValue !== oldValue) {
			state = state || {};

			state.value = newValue;
		}

		if (newError !== oldError) {
			state = state || {};

			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	onChange () {
		const {onChange} = this.props;

		if (onChange && this.editorRef) {
			onChange(this.editorRef.getValue());
		}
	}


	onUnselect () {
		this.onChange();
	}


	onEditorChange () {
		const {error} = this.state;

		if (error && error.clear) {
			error.clear();
		}
	}


	onEditorFocus () {
		const {selectableValue} = this.state;

		if (this.editorRef && selectableValue.editor !== this.editorRef) {
			this.setState({
				selectableValue: new ControlsConfig(this.editorRef)
			});
		}
	}


	render () {
		const {selectableId, selectableValue, value, error} = this.state;
		const cls = cx('assignment-content-editor', {error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onUnselect}>
				<TextEditor
					charLimit={1000}
					ref={this.setEditorRef}
					initialValue={value}
					placeholder={PLACEHOLDER}
					onFocus={this.onEditorFocus}
					onChange={this.onEditorChange}
				/>
			</Selectable>
		);

		// return (
		// 	<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onBlur}>
		// 		<textarea placeholder={PLACEHOLDER} value={value} onChange={this.onChange} onFocus={this.onEditorFocus} onBlur={this.onEditorBlur}>
		// 		</textarea>
		// 	</Selectable>
		// );
	}
}
