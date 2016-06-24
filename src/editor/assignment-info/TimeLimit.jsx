import React from 'react';
import {Flyout, Checkbox} from 'nti-web-commons';
import cx from 'classnames';

import DurationPicker from './DurationPicker';

export default class TimeLimit extends React.Component {
	constructor (props) {
		super(props);

		this.onEditorDismiss = this.onEditorDismiss.bind(this);
		this.save = this.save.bind(this);
		this.timeChanged = this.timeChanged.bind(this);
		this.toggleTimeLimit = this.toggleTimeLimit.bind(this);

		this.state = {};
	}

	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	componentWillMount () {
		const {assignment} = this.props;
		const value = assignment.MaximumTimeAllowed || 0;
		const hasTimeLimit = assignment.isTimedAssignment;
		this.setState({
			value,
			hasTimeLimit,
			changed: false
		});
	}

	timeChanged (value) {
		this.setState({value, changed: true, hasTimeLimit: value > 0});
	}

	toggleTimeLimit () {
		this.setState({
			hasTimeLimit: !this.state.hasTimeLimit,
			changed: true
		});
	}

	onEditorDismiss () {
		// this.save();
	}

	save () {
		const {assignment} = this.props;
		const {value, hasTimeLimit} = this.state;
		assignment.save({
			IsTimedAssignment: hasTimeLimit,
			MaximumTimeAllowed: value
		})
		.then(() => {
			this.setState({
				changed: false
			});
			this.flyout.dismiss();
		});
	}

	render () {

		const {value, hasTimeLimit} = this.state;
		const buttonClasses = cx('flyout-fullwidth-btn', {
			'changed': this.state.changed
		});

		return (
			<div className="field time-limit">
				<Flyout trigger={this.renderDisplay()} onDismiss={this.onEditorDismiss} ref={x => this.flyout = x}>
					<div className="time-limit-editor">
						<Checkbox label="Time Limit" checked={hasTimeLimit} onChange={this.toggleTimeLimit}/>
						<DurationPicker onChange={this.timeChanged} value={value} />
						<div className={buttonClasses} onClick={this.save}>Save Changes</div>
					</div>
				</Flyout>
			</div>
		);
	}

	renderDisplay () {

		const {value, hasTimeLimit} = this.state;
		const days = DurationPicker.days(value);
		const hours = DurationPicker.hours(value);
		const minutes = DurationPicker.minutes(value);

		const p = (val, unit) => val > 0 ? `${val} ${unit}` + (val === 1 ? '' : 's') : '';

		const label = hasTimeLimit ? `${p(days, 'day')} ${p(hours, 'hour')} ${p(minutes, 'minute')}` : 'No Limit';

		return (
			<div className="time-limit-display">
				<div className="field-label">Time Limit</div>
				<div className="field-value">{label}</div>
			</div>
		);
	}
}
