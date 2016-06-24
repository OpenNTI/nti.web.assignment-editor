import React from 'react';
import {Flyout} from 'nti-web-commons';

import DurationPicker from './DurationPicker';

export default class TimeLimit extends React.Component {
	constructor (props) {
		super(props);

		this.timeChanged = this.timeChanged.bind(this);
		this.onEditorDismiss = this.onEditorDismiss.bind(this);
		this.state = {};
	}

	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	componentWillMount () {
		const {assignment} = this.props;
		const value = assignment.MaximumTimeAllowed || 0;
		this.setState({
			value
		});
	}

	timeChanged (value) {
		this.setState({value});
	}

	onEditorDismiss () {
		const {assignment} = this.props;
		const {value} = this.state;
		assignment.save({
			MaximumTimeAllowed: value
		});
	}

	render () {

		const {value} = this.state;

		return (
			<div className="field time-limit">
				<Flyout trigger={this.renderDisplay()} onDismiss={this.onEditorDismiss}>
					<DurationPicker onChange={this.timeChanged} value={value} />
				</Flyout>
			</div>
		);
	}

	renderDisplay () {

		const {value} = this.state;

		return (
			<div className="time-limit-display">
				<div className="field-label">Time Limit</div>
				<div className="field-value">{`${Math.floor(value / 3600)} hr. ${Math.floor((value / 60) % 60)} min.`}</div>
			</div>
		);
	}
}
