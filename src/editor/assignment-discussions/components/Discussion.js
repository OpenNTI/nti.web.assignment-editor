import './Discussion.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Discussion extends React.Component {
	static propTypes = {
		discussion: PropTypes.object,
		selected: PropTypes.bool,
		course: PropTypes.object,
		onSelect: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			icon: null,
		};
	}

	componentDidMount() {
		const { course, discussion } = this.props;

		this.resolveIcon(discussion, course);
	}

	resolveIcon(discussion, course) {
		course.resolveContentURL(discussion.getIcon()).then(url => {
			this.setState({
				icon: url,
			});
		});
	}

	onClick = () => {
		const { discussion, onSelect } = this.props;

		if (onSelect) {
			onSelect(discussion);
		}
	};

	render() {
		const { discussion, selected, onSelect } = this.props;
		const { icon } = this.state;
		const cls = cx('discussion-assignment-item', {
			selected,
			selectable: !!onSelect,
		});
		const { title } = discussion;
		const iconStyle = icon ? { backgroundImage: `url(${icon})` } : null;

		return (
			<div className={cls} onClick={this.onClick}>
				<div style={iconStyle} className="icon" />
				<div className="title">{title}</div>
			</div>
		);
	}
}
