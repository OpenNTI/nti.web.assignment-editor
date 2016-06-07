import React from 'react';
import Placeholder from '../modeled-content/Placeholder';

export default class FreeResponseEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<Placeholder singleLine />
		);
	}
}
