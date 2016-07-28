import React, { PropTypes } from 'react';
import {Checkbox, Radio} from 'nti-web-commons';
import cx from 'classnames';

export default class Option extends React.Component {
	static propTypes = {
		label: PropTypes.string,
		type: PropTypes.string,
		value: PropTypes.bool,
		onChange: PropTypes.func,
		name: PropTypes.string,
		disabled: PropTypes.bool
	}

	static defaultProps = {
		type: 'checkbox'
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {type, value, ...props} = this.props;
		const {disabled} = this.props;
		const Control = type === 'radio' ? Radio : Checkbox;
		const classNames = cx('assignment-single-option', (disabled ? 'disabled' : ''));

		return (
			<div className={classNames}>
				<div className="option-input">
					<Control {...props} checked={Boolean(value)} />
				</div>
			</div>
		);
	}
}
