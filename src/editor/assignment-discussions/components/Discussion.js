import React from 'react';
import cx from 'classnames';

export default class Discussion extends React.Component {
	static propTypes = {
		discussion: React.PropTypes.object,
		selected: React.PropTypes.bool
	}


	onClick = () => {
		debugger;
	}


	render () {
		const {discussion, selected} = this.props;
		const cls = cx('assignment-discussion', {selected});
		const {title} = discussion;

		return (
			<div className={cls} onClick={this.onClick}>
				<span>{title}</span>
			</div>
		);
	}
}
