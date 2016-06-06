import React from 'react';

export default class Controls extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		selection: React.PropTypes.any
	}


	constructor (props) {
		super(props);

		this.state = {
			selection: props.selection
		};
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			selection: nextProps.selection
		});
	}


	render () {
		return (
			<span>{this.state.selection}</span>
		);
	}
}
