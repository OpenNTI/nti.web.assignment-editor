import React from 'react';
import cx from 'classnames';

import Selectable from '../../utils/Selectable';

export default class OrderingChoice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func,
		error: React.PropTypes.any
	}

	constructor (props) {
		super(props);

		const {choice, error} = this.props;
		const {label, ID} = choice;

		this.isNew = choice.isNew;

		this.state = {
			label,
			error,
			selectableId: ID,
			selectableValue: label
		};

		this.setInputRef = x => this.inputRef = x;

		this.onInputChange = this.onInputChange.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
		this.onUnselect = this.onUnselect.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choice: newChoice, error: newError} = nextProps;
		const {choice: oldChoice, error: oldError} = this.props;
		const {label, ID} = newChoice;
		let state = null;

		if (newChoice !== oldChoice) {
			state = state || {};

			state.label = label;
			state.selectableId = ID;
			state.selectableValue = label;
		}

		if (newError !== oldError) {
			state = state || {};

			state.error = newError;
		}
	}


	onChange () {
		const {onChange, choice} = this.props;
		const {label} = this.state;

		if (onChange && choice.label !== label) {
			onChange(choice.NTIID || choice.ID, label, choice.isLabel);
		}
	}


	onInputChange (e) {
		const {error} = this.state;

		this.setState({
			label: e.target.value
		}, () => {
			if (error && error.clear) {
				error.clear();
				this.onChange();
			}
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
		this.onChange();
	}

	render () {
		const {choice} = this.props;
		const {label, error, selectableId, selectableValue} = this.state;
		const cls = cx('ordering-editing-choice', {label: choice.isLabel, value: choice.isValue, error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onSelect={this.onSelect} onUnselect={this.onUnselect}>
				<input type="text" ref={this.setInputRef} value={label} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onInputChange} />
			</Selectable>
		);
	}
}

