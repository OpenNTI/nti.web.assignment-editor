import './Header.scss';
import React from 'react';

export default class TabBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="assignment-editing-sidebar-tabbar">
				<div className="tab active">Types</div>
				<div className="tab" />
			</div>
		);
	}
}
