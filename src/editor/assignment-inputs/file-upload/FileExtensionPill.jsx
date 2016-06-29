import React from 'react';

export default class FileExtensionPill extends React.Component {

	constructor (props) {
		super(props);
		this.remove = this.remove.bind(this);
	}

	static propTypes = {
		onRemove: React.PropTypes.func,
		value: React.PropTypes.string.isRequired
	}

	remove () {
		const {value, onRemove} = this.props;
		onRemove(value);
	}

	render () {

		const {value} = this.props;

		return (
			<div className="file-extension-pill">
			<span className="value">{value}</span>
			<i onClick={this.remove} className="x-close">x</i>
			</div>
		);
	}
}
