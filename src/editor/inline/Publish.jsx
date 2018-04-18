import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Radio} from '@nti/web-commons';
import cx from 'classnames';

import DateEditor from './DateEditor';

const DEFAULT_TEXT = {
	publish: 'Publish',
	schedule: 'Schedule',
	draft: 'Draft',
	publishDesc: 'Assignment is visible to students',
	scheduleDesc: 'When do you want students to have access to the assignment?',
	draftDesc: 'Currently not visible to any students'
};
const t = scoped('course.overview.lesson.items.questionset.editor.Publish', DEFAULT_TEXT);

export const PUBLISH = 'publish';
export const SCHEDULE = 'schedule';
export const DRAFT = 'draft';

export default class AssignmentEditorPublish extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		assignmentRef: PropTypes.object.isRequired,
		onPublishChange: PropTypes.func,
		selectedType: PropTypes.oneOf([PUBLISH, SCHEDULE, DRAFT]),
		scheduledDate: PropTypes.object
	}

	constructor (props) {
		super(props);
	}


	state = {}


	onChange (newType, scheduledDate) {
		const {onPublishChange} = this.props;

		if(onPublishChange) {
			onPublishChange(newType, scheduledDate);
		}
	}


	selectPublish = () => {
		this.onChange(PUBLISH, this.props.scheduledDate);
	}


	selectSchedule = () => {
		this.onChange(SCHEDULE, this.props.scheduledDate || new Date());
	}


	selectDraft = () => {
		this.onChange(DRAFT, this.props.scheduledDate);
	}


	renderPublish () {
		const selected = this.props.selectedType === PUBLISH;

		return (
			<div className="publish-option">
				<div className="label schedule">
					<div className="nti-radio-input">
						<Radio name={this.getInputName()} label={t(PUBLISH)} checked={selected} onChange={this.selectPublish}/>
					</div>
				</div>
				{selected && (
					<div className="publish-container">
						<div className="publish-label">{t('publishDesc')}</div>
					</div>
				)}
			</div>
		);
	}


	onScheduledDateChanged = (newDate) => {
		this.onChange(this.props.selectedType, newDate);
	}


	getInputName () {
		return 'assignment-publish-option-input-' + this.props.assignmentRef.NTIID;
	}

	renderSchedule () {
		const selected = this.props.selectedType === SCHEDULE;

		return (
			<div className="schedule-option">
				<div className="label schedule">
					<div className="nti-radio-input">
						<Radio name={this.getInputName()} label={t(SCHEDULE)} checked={selected} onChange={this.selectSchedule}/>
					</div>
				</div>
				{selected && (
					<div className="schedule-container">
						<div className="schedule-label">{t('scheduleDesc')}</div>
						<DateEditor date={this.props.scheduledDate} onDateChanged={this.onScheduledDateChanged}/>
					</div>
				)}
			</div>
		);
	}


	renderDraft () {
		const {assignment, selectedType} = this.props;

		const selected = selectedType === DRAFT;
		const disabled = !assignment.hasLink('unpublish');

		const className = cx('draft-option', { disabled });

		return (
			<div className={className}>
				<div className="label draft">
					<div className="nti-radio-input">
						<Radio disabled={disabled} name={this.getInputName()} label={t(DRAFT)} checked={selected} onChange={this.selectDraft}/>
					</div>
				</div>
				{selected && (
					<div className="draft-container">
						<div className="draft-label">{t('draftDesc')}</div>
					</div>
				)}
			</div>
		);
	}


	render () {
		return (
			<div className="inline-publish-editor">
				{this.renderPublish()}
				{this.renderSchedule()}
				{this.renderDraft()}
			</div>
		);
	}
}
