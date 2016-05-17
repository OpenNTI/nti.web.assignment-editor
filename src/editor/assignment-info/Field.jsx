import React from 'react';
import Selectable from '../utils/Selectable';
import cx from 'classnames';

export default class PointValue extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {
			selectableValue: this.getSelectableValue()
		};
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


	render () {
		const {selectableValue, error} = this.state;
		const selectableId = this.getSelectableId();
		const cls = cx('assignment-field', this.fieldName, {error: error});


		return (
			<Selectable className={cls} id={selectableId} value={selectableValue}>
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
