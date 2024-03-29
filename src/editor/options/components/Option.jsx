import './Option.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Checkbox, Radio } from '@nti/web-commons';

export default class Option extends React.Component {
	static propTypes = {
		label: PropTypes.node,
		type: PropTypes.string,
		value: PropTypes.bool,
		onChange: PropTypes.func,
		name: PropTypes.string,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		type: 'checkbox',
	};

	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const { type, value, disabled, ...props } = this.props;
		const Control = type === 'radio' ? Radio : Checkbox;
		const classNames = cx('assignment-single-option', { disabled });

		return (
			<div className={classNames}>
				<div className="option-input">
					<Control
						{...props}
						disabled={disabled}
						checked={Boolean(value)}
					/>
				</div>
			</div>
		);
	}
}
