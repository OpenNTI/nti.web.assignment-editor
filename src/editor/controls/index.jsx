import React from 'react';

import FormatControls from './FormatControls';

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
		const {selection} = this.state;

		return (
			<div className="assignment-editor-controls">
				<FormatControls selection={selection} />
			</div>
		);
	}
}
