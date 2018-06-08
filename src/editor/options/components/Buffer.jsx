import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {HOC, Checkbox, DurationPicker} from '@nti/web-commons';
import cx from 'classnames';

import OptionGroup from './OptionGroup';

const DEFAULT_TEXT = {
	content: 'Allow submissions after the due date.',
	label: 'Enable submission buffer'
};

const SAVE_WAIT_TIME = 500;

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

	componentDidUpdate () {
		const {assignment} = this.props;
		const {submissionBuffer} = this.state;

		if (assignment.submissionBuffer !== submissionBuffer) {
			this.saveTimeout = setTimeout(() => { this.save(); }, SAVE_WAIT_TIME);
		}
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


	setupValue (props = this.props) {
		const {assignment} = props;

		const submissionBuffer = this.nullOrValue(assignment.submissionBuffer);

		this.setState({submissionBuffer});
	}


	onChange = () => {
		// for checkbox changes, just save right away
		clearTimeout(this.saveTimeout);
		const enabled = this.state.submissionBuffer != null && this.state.submissionBuffer !== false;

		this.setState({submissionBuffer: enabled ? null : 0}, this.save());
	}


	timeChanged = (value) => {
		clearTimeout(this.saveTimeout);
		this.setState({submissionBuffer: value});
	}


	render () {
		const {submissionBuffer} = this.state;

		const enabled = submissionBuffer != null && submissionBuffer !== false;
		const cls = cx('inputs', {disabled: !enabled});

		return (
			<OptionGroup
				name="buffer"
				header="Buffer"
				content={t('content')}
			>
				<Checkbox label="Enable buffer time" onChange={this.onChange} checked={enabled}/>
				<div className={cls}>
					<DurationPicker onChange={this.timeChanged} value={submissionBuffer || 0} />
				</div>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Buffer);
