import React from 'react';

export default class AssignmentInfo extends React.Component {
	constructor (props) {
		super(props);

		this.onTitleChange = this.onTitleChange.bind(this);
	}

	onTitleChange () {
		debugger;
	}

	render () {

		return (
			<div className="assignment-info">
				<input type="text" value={this.state.value} onChange={this.onTitleChange}/>
			</div>
		);
	}
}
