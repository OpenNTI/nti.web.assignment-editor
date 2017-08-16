import React from 'react';
import PropTypes from 'prop-types';

export default class PartsButton extends React.Component {
	static propTypes = {
		onCreate: PropTypes.func,
		part: PropTypes.object,
		label: PropTypes.string
	}


	onClick = (e) => {
		debugger;
	}

	render () {
		const {label} = this.props;

		return (
			<div className="question-part-button" onClick={this.onClick}>
				<div className="icon" />
				<div className="label">
					<span>{label}</span>
				</div>
			</div>
		);
	}
}
