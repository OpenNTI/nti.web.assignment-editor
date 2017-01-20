import React from 'react';
import cx from 'classnames';

export default class Discussion extends React.Component {
	static propTypes = {
		discussion: React.PropTypes.object,
		selected: React.PropTypes.bool,
		course: React.PropTypes.object,
		onSelect: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {
			icon: null
		};
	}


	componentDidMount () {
		const {course, discussion} = this.props;

		this.resolveIcon(discussion, course);
	}


	resolveIcon (discussion, course) {
		course.resolveContentURL(discussion.getIcon())
			.then((url) => {
				this.setState({
					icon: url
				});
			});
	}


	onClick = () => {
		const {discussion, onSelect} = this.props;

		if (onSelect) {
			onSelect(discussion);
		}
	}


	render () {
		const {discussion, selected} = this.props;
		const {icon} = this.state;
		const cls = cx('discussion-assignment-item', {selected});
		const {title} = discussion;
		const iconStyle = icon ? {backgroundImage: `url(${icon})`} : null;

		return (
			<div className={cls} onClick={this.onClick}>
				<div style={iconStyle} className="icon" />
				<div className="title">{title}</div>
			</div>
		);
	}
}
