import React from 'react';


export default class SuggestionItem extends React.Component {

	static propTypes = {
		value: React.PropTypes.string,
		name: React.PropTypes.string,
		onAdd: React.PropTypes.func,
		onDismiss: React.PropTypes.func,
		controls: React.PropTypes.bool
	}

	render () {
		const {value, name, controls} = this.props;

		return (
			<div>
				<span className="value">{value}</span>
				<span>{name}</span>
				{controls && this.renderControls()}
			</div>
		);
	}

	renderControls () {
		return (
			<div className="controls file-suggestion-controls">
				<span className="control add" onClick={this.onAddClick}>Add Extension</span>
				<span className="control dismiss" onClick={this.onDismissClick}>Dismiss</span>
			</div>
		);
	}

	onAddClick = () => {
		const {onAdd, value} = this.props;
		if (onAdd) {
			onAdd(value);
		}
	}

	onDismissClick = () => {
		const {onDismiss, value} = this.props;
		if (onDismiss) {
			onDismiss(value);
		}
	}
}
