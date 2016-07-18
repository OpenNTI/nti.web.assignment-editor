import React from 'react';
import cx from 'classnames';

import {scoped} from 'nti-lib-locale';
import Logger from 'nti-util-logger';
import {
	Checkbox,
	DurationPicker,
	Flyout,
	LabeledValue,
	TinyLoader as Loading
} from 'nti-web-commons';

const logger = Logger.get('lib:asssignment-editor:TimeLimit');

const DEFAULT_TEXT = {
	days: {
		one: '%(count)s Day',
		other: '%(count)s Days'
	},
	hours: {
		one: '%(count)s Hour',
		other: '%(count)s Hours'
	},
	minutes: {
		one: '%(count)s Minute',
		other: '%(count)s Minutes'
	}
};

const t = scoped('UNITS', DEFAULT_TEXT);


export default class TimeLimit extends React.Component {

	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	state = {}

	componentWillMount () {
		this.setup();
	}

	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}

	setup = (props = this.props) => {
		const {assignment} = props;
		const value = assignment.maximum_time_allowed || 0;
		const hasTimeLimit = !!assignment.isTimed;
		this.setState({
			value,
			hasTimeLimit,
			changed: false
		});
	}

	timeChanged = (value) => {
		this.setState({value, changed: true, hasTimeLimit: value > 0});
	}

	toggleTimeLimit = () => {
		this.setState({
			hasTimeLimit: !this.state.hasTimeLimit,
			changed: true
		});
	}

	onEditorDismiss = () => {
		if(this.state.changed) {
			this.reset();
		}
	}

	reset = () => {
		this.setup();
	}

	save = () => {
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
						{error && <div className="error">{error.toString()}</div>}
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

		const p = (val, unit) => val ? t(unit, {count:val}) : '';

		const label = error ? 'Error' : (hasTimeLimit && value > 0) ? `${p(days, 'days')} ${p(hours, 'hours')} ${p(minutes, 'minutes')}` : 'No Limit';

		const labelClasses = cx({
			'placeholder': !hasTimeLimit || value === 0
		});

		return (
			<LabeledValue label="Time Limit" arrow><span className={labelClasses}>{label}</span></LabeledValue>
		);
	}
}
