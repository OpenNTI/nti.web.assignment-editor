import React from 'react';
import cx from 'classnames';

import BufferedTextEditor from '../inputs/BufferedTextEditor';
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

		this.state = {
			selectableId: 'title',
			selectableValue: new ControlsConfig()
		};
	}


	onChange = (value) => {
		const {onChange, schema} = this.props;

		if (onChange) {
			onChange(value, getMaxLength(schema));

			this.setState({
				value
			});
		}
	}


	onEditorFocus = (editor) => {
		const {selectableValue} = this.state;

		if (editor && selectableValue.editor !== editor) {
			this.setState({
				selectableValue: new ControlsConfig(editor)
			});
		}
	}


	render () {
		const {schema, error, value} = this.props;
		const {selectableId, selectableValue} = this.state;
		const cls = cx('assignment-title-editor', {error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue}>
				<BufferedTextEditor
					charLimit={getMaxLength(schema)}
					countDown
					initialValue={value}
					placeholder={PLACEHOLDER}
					onFocus={this.onEditorFocus}
					onChange={this.onChange}
					error={error}
					singleLine
					plainText
				/>
			</Selectable>
		);
	}
}
