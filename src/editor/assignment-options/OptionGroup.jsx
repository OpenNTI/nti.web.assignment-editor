import React, { PropTypes } from 'react';
import cx from 'classnames';

class OptionGroup extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		content: PropTypes.string,
		children: PropTypes.any,
		header: PropTypes.string,
		disabled: PropTypes.bool,
		disabledText: PropTypes.string
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {name, content, header, disabled, disabledText} = this.props;
		const classNames = cx(name, 'assignment-option-group', {disabled});

		return (
			<div className={classNames}>
				<div className="header">{header}</div>
				<div className="options">
					{this.props.children}
				</div>
				<div className="assignment-option-content">
					<p>{content}</p>
					<span className="disabled-text">{disabledText}</span>
				</div>
			</div>
		);
	}
}

export default OptionGroup;
