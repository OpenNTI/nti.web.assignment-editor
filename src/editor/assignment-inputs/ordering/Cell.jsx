import React from 'react';
import cx from 'classnames';

import Selectable from '../../utils/Selectable';

export default class OrderingCell extends React.Component {
	static propTypes = {
		cell: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		const {cell} = this.props;
		const {label, ID} = cell;

		this.isNew = cell.isNew;

		this.state = {
			label,
			selectableId: ID,
			selectableValue: label
		};

		this.setInputRef = x => this.inputRef = x;

		this.onChange = this.onChange.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
		this.onUnselect = this.onUnselect.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}


	componentDidMount () {
		if (this.isNew && this.inputRef) {
			delete this.isNew;
			this.inputRef.focus();
		}
	}


	onChange (e) {
		this.setState({
			label: e.target.value
		});
	}


	onInputFocus () {
		const {label} = this.state;

		this.setState({
			selectableValue: label + ' FOCUSED'
		});
	}


	onInputBlur () {
		const {label} = this.state;

		this.setState({
			selectableValue: label
		});
	}


	onSelect () {
		if (this.inputRef) {
			this.inputRef.focus();
		}
	}


	onUnselect () {
		const {onChange, cell} = this.props;
		const {label} = this.state;

		if (onChange) {
			onChange(label, cell);
		}
	}


	render () {
		const {cell} = this.props;
		const {label, selectableId, selectableValue} = this.state;
		const cls = cx('ordering-editing-cell', {label: cell.isLabel, value: cell.isValue});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onSelect={this.onSelect} onUnselect={this.onUnselect}>
				<input type="text" ref={this.setInputRef} value={label} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onChange} />
			</Selectable>
		);
	}
}
