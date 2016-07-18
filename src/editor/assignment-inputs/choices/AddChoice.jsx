import React from 'react';

export default class AddChoice extends React.Component {
	static propTypes = {
		addLabel: React.PropTypes.string,
		add: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = { isFocused: false };

		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	onBlur (e) {
		e.stopPropagation();
		this.setState({isFocused: false});
	}

	onFocus (e) {
		e.stopPropagation();
		this.setState({isFocused: true});
	}

	render () {
		const {addLabel} = this.props;
		const {add} = this.props;
		const cls = this.state.isFocused ? 'add-choice selectable selected' : 'add-choice';

		return (
			<div
				className={cls}
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
