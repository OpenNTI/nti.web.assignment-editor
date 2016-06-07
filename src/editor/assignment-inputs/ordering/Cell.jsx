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

		this.state = {
			label,
			selectableId: ID,
			selectableValue: label
		};

		this.onChange = this.onChange.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
		this.onUnselect = this.onUnselect.bind(this);
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
			<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onUnselect}>
				<input type="text" value={label} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onChange} />
			</Selectable>
		);
	}
}
