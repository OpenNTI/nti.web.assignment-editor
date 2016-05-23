import React from 'react';
import cx from 'classnames';

export default class AddButton extends React.Component {
	static propTypes = {
		onAdd: React.PropTypes.func.isRequired,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		this.state = {};

		this.onClick = this.onClick.bind(this);
	}


	onClick () {
		const {onAdd} = this.props;

		if (onAdd) {
			onAdd();
		}
	}


	render () {
		const {multipleAnswers} = this.props;
		const cls = cx('choice', 'add-new', {'multiple-answer': multipleAnswers});

		return (
			<div className={cls} onClick={this.onClick}>
				<span>Add Choice</span>
			</div>
		);
	}
}
