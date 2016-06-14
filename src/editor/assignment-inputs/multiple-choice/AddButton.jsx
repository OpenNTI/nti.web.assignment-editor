import React from 'react';
import cx from 'classnames';

const defaultLabel = 'Add Choice';

export default class AddButton extends React.Component {
	static propTypes = {
		onAdd: React.PropTypes.func.isRequired,
		multipleAnswers: React.PropTypes.bool,
		label: React.PropTypes.string
	}


	static defaultProps = {
		label: defaultLabel
	}


	constructor (props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}


	onClick () {
		const {onAdd} = this.props;

		if (onAdd) {
			onAdd();
		}
	}


	render () {
		const {multipleAnswers, label} = this.props;
		const cls = cx('multiple-choice-add-new', {'multiple-answer': multipleAnswers});

		return (
			<div className={cls} onClick={this.onClick}>
				<span>{label}</span>
			</div>
		);
	}
}
