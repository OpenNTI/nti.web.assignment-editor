import React from 'react';
import cx from 'classnames';
import {TextEditor, valuesEqual} from 'nti-modeled-content';
import autobind from 'nti-commons/lib/autobind';

import Selectable from '../utils/Selectable';
import ControlsConfig from '../controls/ControlsConfig';

const PLACEHOLDER = 'Title';

function getMaxLength (schema = {}) {
	const {Fields:fields} = schema;
	const {title} = fields || {};

	return title.max_length || 1000;
}

export default class TitleEditor extends React.Component {
	static propTypes = {
		value: React.PropTypes.string.isRequired,
		schema: React.PropTypes.object,
		error: React.PropTypes.any,
		onChange: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		const {value, error} = props;

		this.state = {
			selectableId: 'title',
			selectableValue: new ControlsConfig(),
			value,
			error
		};

		this.setEditorRef = x => this.editorRef = x;

		autobind(this,
			'onUnselect',
			'onEditorChange',
			'onEditorFocus'
		);
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
		const {onChange, schema} = this.props;
		const value = this.editorRef.getValue();

		if (onChange && this.editorRef) {
			onChange(value, getMaxLength(schema));

			this.setState({
				value
			});
		}
	}


	onUnselect () {
		this.onChange();
	}


	onEditorChange () {
		const {error, value:oldValue} = this.state;
		const newValue = this.editorRef.getValue();

		if (error && error.clear && !valuesEqual(newValue, oldValue)) {
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
		const {schema} = this.props;
		const {selectableId, selectableValue, value, error} = this.state;
		const cls = cx('assignment-title-editor', {error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onUnselect}>
				<TextEditor
					charLimit={getMaxLength(schema)}
					countDown
					ref={this.setEditorRef}
					initialValue={value}
					placeholder={PLACEHOLDER}
					onFocus={this.onEditorFocus}
					onChange={this.onEditorChange}
					error={error}
					singleLine
					plainText
				/>
			</Selectable>
		);
	}
}
