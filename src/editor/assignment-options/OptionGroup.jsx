import React, { PropTypes } from 'react';
import cx from 'classnames';

class OptionGroup extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		content: PropTypes.string,
		children: PropTypes.any,
		header: PropTypes.string
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {name, content, header} = this.props;
		const classNames = cx(name, 'assignment-option-group');

		return (
			<div className={classNames}>
				<div className="header">{header}</div>
				<div className="options">
					{this.props.children}
				</div>
				<div className="option-content">
					<p>{content}</p>
				</div>
			</div>
		);
	}
}

export default OptionGroup;
