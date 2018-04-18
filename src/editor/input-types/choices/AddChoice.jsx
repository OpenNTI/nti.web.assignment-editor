import React from 'react';
import PropTypes from 'prop-types';
import {Events} from '@nti/lib-commons';

const {getKeyCode} = Events;

export default class AddChoice extends React.Component {
	static propTypes = {
		addLabel: PropTypes.string,
		add: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = { isFocused: false };

		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onBlur (e) {
		e.stopPropagation();
		this.setState({isFocused: false});
	}

	onFocus (e) {
		e.stopPropagation();
		this.setState({isFocused: true});
	}

	onKeyPress (e) {
		e.preventDefault();

		if (getKeyCode(e) === getKeyCode.ENTER && this.props.add) {
			this.props.add();
		}
	}

	render () {
		const {addLabel} = this.props;
		const {add} = this.props;
		const cls = this.state.isFocused ? 'add-choice selectable selected' : 'add-choice';

		return (
			<div
				className={cls}
				onKeyPress={this.onKeyPress}
				onClick={add}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				tabIndex="0"
			>
				<i className="icon-add" />
				<span>{addLabel}</span>
			</div>
		);
	}
}
