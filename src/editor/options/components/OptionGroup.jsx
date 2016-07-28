import React, { PropTypes } from 'react';
import cx from 'classnames';

class OptionGroup extends React.Component {
	static propTypes = {
		error: PropTypes.node,
		name: PropTypes.string,
		content: PropTypes.string,
		children: PropTypes.any,
		header: PropTypes.string,
		disabled: PropTypes.bool,
		disabledText: PropTypes.string,
		partiallyDisabled: PropTypes.bool
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {name, content, header, disabled, disabledText, error, partiallyDisabled} = this.props;
		const status = disabled ? 'disabled' : partiallyDisabled ? 'partially-disabled' : '';
		const classNames = cx(name, 'assignment-option-group', status);

		return (
			<div className={classNames}>
				<div className="header">{header}</div>
				<div className="options">
					{this.props.children}
				</div>
				<div className="assignment-option-content">
					<p>{content}</p>
					{(disabled || partiallyDisabled) && ( <span className="disabled-text">{disabledText}</span> )}
					{error && (
						<p className="error"><i className="icon-alert small"/>{error}</p>
					)}
				</div>
			</div>
		);
	}
}

export default OptionGroup;
