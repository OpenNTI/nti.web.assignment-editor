import React from 'react';
import Logger from 'nti-util-logger';
import {Flyout, Checkbox, LabeledValue, TinyLoader as Loading} from 'nti-web-commons';
import cx from 'classnames';

import {DurationPicker} from 'nti-web-commons';

const logger = Logger.get('lib:asssignment-editor:TimeLimit');

export default class TimeLimit extends React.Component {
	constructor (props) {
		super(props);

		this.onEditorDismiss = this.onEditorDismiss.bind(this);
		this.save = this.save.bind(this);
		this.setUp = this.setUp.bind(this);
		this.timeChanged = this.timeChanged.bind(this);
		this.toggleTimeLimit = this.toggleTimeLimit.bind(this);

		this.state = {};
	}

	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	componentWillMount () {
		this.setUp();
	}

	componentWillReceiveProps (nextProps) {
		this.setUp(nextProps);
	}

	setUp (props = this.props) {
		const {assignment} = props;
		const value = assignment.maximum_time_allowed || 0;
		const hasTimeLimit = !!assignment.isTimed;
		this.setState({
			value,
			hasTimeLimit,
			changed: false,
			error: null
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
		this.reset();
	}

	reset () {
		this.setUp();
	}

	save () {
		const {assignment} = this.props;
		const {value, hasTimeLimit} = this.state;
		this.setState({
			saving: true,
			error: null
		});
		assignment.save({
			maximum_time_allowed: hasTimeLimit ? value : null //eslint-disable-line
		})
		.catch((error) => {
			logger.error(error);
			this.setState({
				error
			});
		})
		.then(() => {
			this.setState({
				changed: false,
				saving: false
			});
			this.flyout.dismiss();
		});
	}

	render () {

		const {value, hasTimeLimit, saving, changed, error} = this.state;
		const buttonClasses = cx('flyout-fullwidth-btn', {
			'changed': changed || error
		});

		return (
			<div className="field time-limit">
				<Flyout
					className="assignment-option-flyout"
					trigger={this.renderDisplay()}
					onDismiss={this.onEditorDismiss}
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					sizing={Flyout.SIZES.MATCH_SIDE}
					ref={x => this.flyout = x}
				>
					<div className="time-limit-editor">
						<Checkbox label="Time Limit" checked={hasTimeLimit} onChange={this.toggleTimeLimit}/>
						<DurationPicker onChange={this.timeChanged} value={value} />
						{error && <div className="error">{error}</div>}
						{saving ? <Loading /> : <div className={buttonClasses} onClick={this.save}>Save Changes</div>}
					</div>
				</Flyout>
			</div>
		);
	}

	renderDisplay () {

		const {value, hasTimeLimit, error} = this.state;
		const days = DurationPicker.days(value);
		const hours = DurationPicker.hours(value);
		const minutes = DurationPicker.minutes(value);

		const p = (val, unit) => val > 0 ? `${val} ${unit}` + (val === 1 ? '' : 's') : '';

		const label = error ? 'Error' : (hasTimeLimit && value > 0) ? `${p(days, 'day')} ${p(hours, 'hour')} ${p(minutes, 'minute')}` : 'No Limit';

		const labelClasses = cx({
			'placeholder': !hasTimeLimit || value === 0
		});

		return (
			<LabeledValue label="Time Limit" arrow><span className={labelClasses}>{label}</span></LabeledValue>
		);
	}
}
