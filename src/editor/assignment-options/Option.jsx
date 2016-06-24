import React, { PropTypes } from 'react';
import {Checkbox, Radio} from 'nti-web-commons';

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
		const {type} = this.props;
		const Control = type === 'radio' ? Radio : Checkbox;

		return (
			<div className="assignment-single-option">
				<div className="option-input">
					<Control {...this.props} type={void type}/>
				</div>
			</div>
		);
	}
}