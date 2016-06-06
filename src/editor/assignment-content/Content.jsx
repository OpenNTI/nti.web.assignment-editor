import React from 'react';
import cx from 'classnames';

import Selectable from '../utils/Selectable';

const PLACEHOLDER = 'Write a description...';

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
			selectableId: 'description',
			selectableValue: 'Description',
			value: value,
			error: error
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			error: nextProps.error
		});
	}


	onBlur () {
		const {onChange} = this.props;
		const {value} = this.state;

		if (onChange) {
			onChange(value);
		}
	}


	onChange (e) {
		const {error} = this.state;

		this.setState({
			value: e.target.value
		});

		if (error && error.clear) {
			error.clear();
		}
	}


	onInputFocus () {
		this.setState({
			selectableValue: 'Description FOCUSED'
		});
	}


	onInputBlur () {
		this.setState({
			selectableValue: 'Description'
		});
	}


	render () {
		const {selectableId, selectableValue, value, error} = this.state;
		const cls = cx('assignment-content-editor', {error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onBlur}>
				<textarea placeholder={PLACEHOLDER} value={value} onChange={this.onChange} onFocus={this.onInputFocus} onBlur={this.onInputBlur}>
				</textarea>
			</Selectable>
		);
	}
}
