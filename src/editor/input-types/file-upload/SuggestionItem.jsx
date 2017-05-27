import React from 'react';
import PropTypes from 'prop-types';


export default class SuggestionItem extends React.Component {

	static propTypes = {
		value: PropTypes.string,
		name: PropTypes.string,
		onAdd: PropTypes.func,
		onDismiss: PropTypes.func,
		controls: PropTypes.bool
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
				<a href="#" className="control add" onClick={this.onAddClick}>Add Extension</a>
				<a href="#" className="control dismiss" onClick={this.onDismissClick}>Dismiss</a>
			</div>
		);
	}

	onAddClick = (e) => {
		const {onAdd, value} = this.props;

		e.preventDefault();
		e.stopPropagation();
		if (onAdd) {
			onAdd(value);
		}
	}

	onDismissClick = (e) => {
		const {onDismiss, value} = this.props;

		e.preventDefault();
		e.stopPropagation();
		if (onDismiss) {
			onDismiss(value);
		}
	}
}
