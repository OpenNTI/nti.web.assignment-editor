import React from 'react';

export default class PointValue extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<div className="field point-value">
				<div className="field-label">Point Value</div>
			</div>
		);
	}
}
