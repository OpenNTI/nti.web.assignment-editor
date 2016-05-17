import React from 'react';
import Selectable from '../utils/Selectable';
import cx from 'classnames';
import {saveFieldOnAssignment} from './Actions';

export default class PointValue extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {
			selectableValue: this.getSelectableValue(),
			value: this.getValue()
		};

		const bindList = [
			'onChange',
			'onUnselect'
		];

		for (let fn of bindList) {
			this[fn] = this[fn].bind(this);
		}
	}


	getValue () {
		return this.props.assignment[this.fieldName];
	}


	onChange (value) {
		this.setState({
			value: value
		});
	}


	getSelectableId () {
		return this.props.assignment.NTIID + this.fieldName;
	}


	getSelectableValue () {
		return 'Override This';
	}


	setSelectableValue (value) {
		this.setState({
			selectableValue: value
		});
	}


	onUnselect () {
		//TODO: Check if the value has saved, add a timeout to wait
		if (this.saveState) {
			this.saveState(this.state);
		} else {
			saveFieldOnAssignment(this.props.assignment, this.fieldName, this.state.value);
		}
	}


	render () {
		const {selectableValue, error} = this.state;
		const selectableId = this.getSelectableId();
		const cls = cx('assignment-field', this.fieldName, {error: error});


		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onUnselect}>
				{this.renderInput()}
			</Selectable>
		);
	}


	renderInput () {
		return (
			<span>Override this!</span>
		);
	}
}
