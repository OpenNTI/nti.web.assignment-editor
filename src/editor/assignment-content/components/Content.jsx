import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import BufferedTextEditor from '../../inputs/BufferedTextEditor';
import {Component as Selectable} from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';

const PLACEHOLDER = 'Write an assignment description here...';

export default class ContentEditor extends React.Component {
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
			selectableId: 'description',
			selectableValue: new ControlsConfig(),
			value: props.value
		};
	}


	onChange = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);

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
		const {disabled} = this.props;
		const {value, error} = this.state;
		const {selectableId, selectableValue} = this.state;
		const cls = cx('assignment-content-editor', {error, disabled});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue}>
				{disabled ? null : (
					<BufferedTextEditor
						initialValue={value}
						placeholder={PLACEHOLDER}
						onFocus={this.onEditorFocus}
						onChange={this.onChange}
						error={error}
					/>
				)}
			</Selectable>
		);
	}
}
