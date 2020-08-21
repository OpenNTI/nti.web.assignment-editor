import './TimeLimit.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from '@nti/util-logger';
import {
	Checkbox,
	DurationPicker,
	Flyout,
	LabeledValue,
	HOC,
	Button
} from '@nti/web-commons';

import store from '../../Store';
import {REVERT_ERRORS} from '../../Constants';

const logger = Logger.get('lib:asssignment-editor:TimeLimit');

const TIME_LIMIT_KEY = 'maximum_time_allowed';
const {ItemChanges} = HOC;

class TimeLimit extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired
	}

	static getItem (props) {
		return props.assignment;
	}

	state = {}

	attachFlyoutRef = x => this.flyout = x

	componentWillMount () {
		this.setup();

		store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		store.removeChangeListener(this.onStoreChange);
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.assignment !== nextProps.assignment) {
			this.setup(nextProps);
		}
	}


	onStoreChange = (data) => {
		if (data.type === REVERT_ERRORS) {
			this.setState({
				error: null
			});
		}
	}

	setup = (props = this.props) => {
		const {assignment} = props;
		const value = assignment[TIME_LIMIT_KEY] || 0;
		const hasTimeLimit = assignment[TIME_LIMIT_KEY] != null;
		this.setState({
			value,
			hasTimeLimit,
			changed: false
		});
	}

	timeChanged = (value) => {
		this.setState({value, changed: true, error: null, hasTimeLimit: value > 0});
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

	onItemChanged () {
		this.forceUpdate();
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
			[TIME_LIMIT_KEY]: hasTimeLimit ? value : null
		},
		void 0,
		'maximum-time-allowed'
		).then(() => {
			this.setState({
				changed: false,
				saving: false
			});
			this.flyout.dismiss();
		}).catch((error) => {
			logger.error(error);
			this.setState({
				error,
				saving: false
			});
		});
	}

	render () {
		const {assignment} = this.props;
		const {value, hasTimeLimit, saving, changed, error} = this.state;
		const buttonClasses = cx('flyout-fullwidth-btn', {
			'changed': changed || error
		});


		return (
			<div className="field time-limit">
				<Flyout.Triggered
					className="assignment-option-flyout"
					trigger={this.renderDisplay()}
					onDismiss={this.onEditorDismiss}
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					sizing={Flyout.SIZES.MATCH_SIDE}
					ref={this.attachFlyoutRef}
				>
					<div className={cx('time-limit-editor', {saving})}>
						<Checkbox label="Time Limit"
							disabled={!assignment.hasLink('edit')}
							checked={hasTimeLimit}
							onChange={this.toggleTimeLimit}/>
						<DurationPicker onChange={this.timeChanged} value={value} />
						{error && <div className="error">{error.toString()}</div>}
						{<Button component="span" className={buttonClasses} onClick={this.save}>Save Changes</Button>}
						{saving && (<div className="saving-mask" />)}
					</div>
				</Flyout.Triggered>
			</div>
		);
	}

	renderDisplay () {
		const {assignment} = this.props;
		const {value, hasTimeLimit, error} = this.state;

		const label = error ? 'Error' : (hasTimeLimit && value > 0) ? DurationPicker.getDisplay(value) : 'No Limit';

		const labelClasses = cx({
			'placeholder': !hasTimeLimit || value === 0
		});

		// no need to check isModifiable anymore.  it's safe to assume that
		// if there is a 'maximum-time-allowed' rel, there is also an 'edit'
		// rel, which is basically what drives isModifiable
		const enabled = !assignment.isDiscussion
			&& assignment.hasLink('maximum-time-allowed');

		return (
			<LabeledValue label="Time Limit" arrow disabled={!enabled}>
				<span className={labelClasses}>{label}</span>
			</LabeledValue>
		);
	}
}

export default ItemChanges.compose(TimeLimit);
