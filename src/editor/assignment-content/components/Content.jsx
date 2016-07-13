import React from 'react';
import cx from 'classnames';

import BufferedTextEditor from '../../inputs/BufferedTextEditor';

import Selectable from '../../utils/Selectable';
import ControlsConfig from '../../controls/ControlsConfig';

const PLACEHOLDER = 'Write an assignment description here...';

export default class ContentEditor extends React.Component {
	static propTypes = {
		value: React.PropTypes.string.isRequired,
		schema: React.PropTypes.object,
		error: React.PropTypes.any,
		onChange: React.PropTypes.func
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
		const {value, error} = this.state;
		const {selectableId, selectableValue} = this.state;
		const cls = cx('assignment-content-editor', {error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue}>
				<BufferedTextEditor
					initialValue={value}
					placeholder={PLACEHOLDER}
					onFocus={this.onEditorFocus}
					onChange={this.onChange}
					error={error}
				/>
			</Selectable>
		);
	}
}
