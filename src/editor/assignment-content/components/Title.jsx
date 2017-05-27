import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import BufferedTextEditor from '../../inputs/BufferedTextEditor';
import {Component as Selectable} from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';

const PLACEHOLDER = 'Title';

function getMaxLength (schema = {}) {
	const {Fields:fields} = schema;
	const {title = {}} = fields || {};

	return title.max_length || 1000;
}

export default class TitleEditor extends React.Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		schema: PropTypes.object,
		error: PropTypes.any,
		onChange: PropTypes.func,
		disabled: PropTypes.bool
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
		const {schema, error, value, disabled} = this.props;
		const {selectableId, selectableValue} = this.state;
		const cls = cx('assignment-title-editor', {error, disabled});

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
