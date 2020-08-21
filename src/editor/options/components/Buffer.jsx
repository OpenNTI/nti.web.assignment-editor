import './Buffer.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {HOC, DurationPicker, SelectBox} from '@nti/web-commons';
import cx from 'classnames';

import OptionGroup from './OptionGroup';

const DEFAULT_TEXT = {
	content: 'Allow or prevent learners from submitting work late.',
	label: 'Late Submissions'
};

const SAVE_WAIT_TIME = 500;

const ALLOW_BUFFER_TIME = {
	value: 'allow_buffer_time',
	label: 'Allow within Grace Period'
};
const STRICT_LIMIT = {
	value: 'strict_limit',
	label: 'Never Allow'
};
const OPEN_SUBMISSIONS = {
	value: 'open_submissions',
	label: 'Always Allow (Default)'
};

const t = scoped('assignment.editing.options.buffer', DEFAULT_TEXT);

class Buffer extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		questionSet: PropTypes.object
	}

	static getItem = (props) => props.assignment

	state = {}

	constructor (props) {
		super();
	}

	componentDidMount () {
		this.setupValue(this.props);
	}

	nullOrValue (submissionBuffer) {
		return submissionBuffer === false || submissionBuffer === null ? null : submissionBuffer;
	}

	save = () => {
		const {assignment} = this.props;
		const {submissionBuffer} = this.state;

		if (assignment.submissionBuffer !== submissionBuffer) {
			assignment.setSubmissionBuffer(this.nullOrValue(submissionBuffer))
				.catch(error => {
					const newSubmissionBuffer = this.nullOrValue(assignment.submissionBuffer);

					this.setState({submissionBuffer: newSubmissionBuffer, error});
				});
		}
	}

	saveWithTimeout = () => {
		const {assignment} = this.props;
		const {submissionBuffer} = this.state;

		if (assignment.submissionBuffer !== submissionBuffer) {
			this.saveTimeout = setTimeout(() => { this.save(); }, SAVE_WAIT_TIME);
		}
	}


	setupValue (props = this.props) {
		const {assignment} = props;

		const submissionBuffer = this.nullOrValue(assignment.submissionBuffer);

		if(submissionBuffer == null) {
			this.setState({bufferPolicy: OPEN_SUBMISSIONS});
		}
		else if(submissionBuffer === 0) {
			this.setState({bufferPolicy: STRICT_LIMIT, submissionBuffer});
		}
		else {
			this.setState({bufferPolicy: ALLOW_BUFFER_TIME, submissionBuffer});
		}
	}

	timeChanged = (value) => {
		clearTimeout(this.saveTimeout);

		if(value === 0 && this.state.bufferPolicy === ALLOW_BUFFER_TIME) {
			// alert user, don't save while invalid
			this.setState({submissionBuffer: value, error: 'Buffer time must be non-zero'});
		}
		else {
			this.setState({submissionBuffer: value, error: null}, this.saveWithTimeout);
		}
	}

	setOpenBuffer = () => {
		this.setState({bufferPolicy: OPEN_SUBMISSIONS, submissionBuffer: null, error: null}, this.saveWithTimeout);
	}

	setStrictBuffer = () => {
		this.setState({bufferPolicy: STRICT_LIMIT, submissionBuffer: 0, error: null}, this.saveWithTimeout);
	}

	setAllowBufferTime = () => {
		let state = {
			bufferPolicy: ALLOW_BUFFER_TIME
		};

		if(!this.state.submissionBuffer) {
			state.submissionBuffer = 60 * 60;
			state.error = null;
		}

		this.setState(state, this.saveWithTimeout);
	}

	onPolicyChange = (val) => {
		if(val === OPEN_SUBMISSIONS.value) {
			this.setOpenBuffer();
		} else if(val === STRICT_LIMIT.value) {
			this.setStrictBuffer();
		} else {
			this.setAllowBufferTime();
		}
	}

	renderPolicySelect () {
		const options = [
			OPEN_SUBMISSIONS,
			ALLOW_BUFFER_TIME,
			STRICT_LIMIT
		];

		return <SelectBox options={options} onChange={this.onPolicyChange} value={this.state.bufferPolicy && this.state.bufferPolicy.value} showSelectedOption/>;
	}

	render () {
		const {assignment} = this.props;
		const {submissionBuffer, error} = this.state;

		const enabled = submissionBuffer != null && submissionBuffer !== false;
		const cls = cx('inputs', {disabled: !enabled});
		const isEditable = assignment.hasLink('edit');

		return (
			<OptionGroup
				name="buffer"
				header={t('label')}
				content={t('content')}
				disabled={!isEditable}
			>
				{this.renderPolicySelect()}
				{this.state.bufferPolicy === ALLOW_BUFFER_TIME && (
					<div className={cls}>
						<DurationPicker onChange={this.timeChanged} value={submissionBuffer || 0} />
						{error && <div className="error">{error}</div>}
					</div>
				)}
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Buffer);
