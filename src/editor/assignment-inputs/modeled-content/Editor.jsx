import React from 'react';
import Placeholder from './Placeholder';

export default class EssayEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		return (
			<Placeholder/>
		);
	}
}
