import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Publish, Prompt, ConflictResolution } from '@nti/web-commons';

import Footer from './Footer';
import PublishState, { PUBLISH, SCHEDULE, DRAFT } from './Publish';
import Reset from './Reset';
import DueDate from './DueDate';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		assignmentRef: PropTypes.object.isRequired,
		onDismiss: PropTypes.func,
	};

	state = {};

	constructor(props) {
		super(props);

		const { assignment } = this.props;

		let selectedPublishType = PUBLISH;
		let scheduledDate;
		let dueDate = new Date();
		let hasDate = false;

		if (assignment) {
			const availableBeginning =
				assignment['available_for_submission_beginning'];
			const availableEnding =
				assignment['available_for_submission_ending'];

			const available =
				availableBeginning && new Date(availableBeginning);
			const value = Publish.evaluatePublishStateFor({
				isPublished: () =>
					assignment &&
					assignment.PublicationState != null &&
					(!available || available < Date.now()),
				getPublishDate: () => assignment && available,
			});

			if (value) {
				if (value instanceof Date) {
					selectedPublishType = SCHEDULE;
					scheduledDate = value;
				} else {
					selectedPublishType = value.toLowerCase();
				}
			}

			if (availableEnding) {
				dueDate = new Date(availableEnding);
				hasDate = true;
			}
		}

		this.state = {
			selectedPublishType,
			scheduledDate,
			dueDate,
			dueDateChecked: hasDate,
		};
	}

	publishConflictHandler(challenge) {
		return new Promise((confirm, reject) => {
			Prompt.areYouSure('', challenge.message, {
				iconClass: 'alert',
				confirmButtonClass: 'alert',
				confirmButtonLabel: 'Yes',
				cancelButtonLabel: 'No',
			}).then(
				() => challenge.confirm(),
				() => challenge.reject()
			);
		});
	}

	componentDidMount() {
		ConflictResolution.registerHandler(
			'AvailableToUnavailable',
			this.publishConflictHandler
		);
		ConflictResolution.registerHandler(
			'AssessmentDateConfirm',
			this.publishConflictHandler
		);
		ConflictResolution.registerHandler(
			'UnAvailableToAvailable',
			this.publishConflictHandler
		);

		this.setup(this.props.assignment);
	}

	componentWillUnmount() {
		ConflictResolution.unregisterHandler(
			'AvailableToUnavailable',
			this.publishConflictHandler
		);
		ConflictResolution.unregisterHandler(
			'AssessmentDateConfirm',
			this.publishConflictHandler
		);
		ConflictResolution.unregisterHandler(
			'UnAvailableToAvailable',
			this.publishConflictHandler
		);
	}

	componentDidUpdate(oldProps) {
		if (oldProps.assignment !== this.props.assignment) {
			this.setup(this.props.assignment);
		}
	}

	setup(assignment) {
		let selectedPublishType = PUBLISH;
		let scheduledDate;
		let dueDate = new Date();
		let hasDate = false;

		if (assignment) {
			const availableBeginning =
				assignment['available_for_submission_beginning'];
			const availableEnding =
				assignment['available_for_submission_ending'];

			const available =
				availableBeginning && new Date(availableBeginning);

			const value = Publish.evaluatePublishStateFor({
				isPublished: () =>
					assignment &&
					assignment.PublicationState != null &&
					(!available || available < Date.now()),
				getPublishDate: () => assignment && available,
			});

			if (value) {
				if (value instanceof Date) {
					selectedPublishType = SCHEDULE;
					scheduledDate = value;
				} else {
					selectedPublishType = value.toLowerCase();
				}
			}

			if (availableEnding) {
				dueDate = new Date(availableEnding);
				hasDate = true;
			}
		}

		this.setState({
			selectedPublishType,
			scheduledDate,
			dueDate,
			dueDateChecked: hasDate,
		});
	}

	onPublishChange = (selectedPublishType, scheduledDate) => {
		this.setState({ selectedPublishType, scheduledDate });
	};

	onReset = async () => {
		const { assignment } = this.props;

		this.setState({ loading: true });

		if (assignment.hasLink('Reset')) {
			await assignment.postToLink('Reset');
		}

		await assignment.refresh();

		this.setState({ loading: false });
	};

	onDueDateChecked = dueDateChecked => {
		this.setState({ dueDateChecked });
	};

	onDueDateChange = dueDate => {
		this.setState({ dueDate });
	};

	onSave = async () => {
		const { assignment, onDismiss } = this.props;
		const {
			selectedPublishType,
			scheduledDate,
			dueDate,
			dueDateChecked,
		} = this.state;

		this.setState({ error: null, loading: true });

		let continueWithOp = true;
		let success = false;

		try {
			if (assignment.hasLink('publish')) {
				await assignment.postToLink('publish');
			}

			const link = assignment.hasLink('date-edit')
				? 'date-edit'
				: assignment.hasLink('edit')
				? 'edit'
				: null;

			if (link) {
				await assignment.putToLink(link, {
					available_for_submission_beginning:
						selectedPublishType === SCHEDULE
							? scheduledDate.getTime() / 1000.0
							: null,
					available_for_submission_ending:
						dueDateChecked && dueDate
							? dueDate.getTime() / 1000.0
							: null,
				});
			}

			if (continueWithOp) {
				if (
					selectedPublishType === DRAFT &&
					assignment.hasLink('unpublish')
				) {
					await assignment.postToLink('unpublish');
				}

				await assignment.refresh();

				success = true;
			}
		} catch (e) {
			if (
				e.code !== 'AvailableToUnavailable' &&
				e.code !== 'AssessmentDateConfirm'
			) {
				// any other errors that happen along the way
				this.setState({ error: e.message });
			}
		}

		this.setState({ loading: false });

		if (success && onDismiss) {
			onDismiss(true);
		}
	};

	onCancel = () => {
		const { onDismiss } = this.props;

		if (onDismiss) {
			onDismiss();
		}
	};

	hasPublishingLinks() {
		const { assignment } = this.props;

		return assignment.hasLink('publish') || assignment.hasLink('unpublish');
	}

	render() {
		const { assignment, assignmentRef } = this.props;
		const hasNoPublishEditLinks =
			!this.hasPublishingLinks() &&
			!assignment.hasLink('date-edit-start');
		const showReset = assignment.hasLink('Reset') || hasNoPublishEditLinks;
		const nonInstructorAdmin =
			!assignment.hasLink('Reset') && !this.hasPublishingLinks();

		return (
			<div className="assignment-inline-editor menu-container">
				<div className="assignment-due-date-editor">
					<div className="contents">
						{!showReset && (
							<PublishState
								onPublishChange={this.onPublishChange}
								selectedType={this.state.selectedPublishType}
								scheduledDate={this.state.scheduledDate}
								assignment={assignment}
								assignmentRef={assignmentRef}
							/>
						)}
						{showReset && (
							<Reset
								onReset={this.onReset}
								nonInstructorAdmin={nonInstructorAdmin}
							/>
						)}
						<DueDate
							onDateChanged={this.onDueDateChange}
							date={this.state.dueDate}
							onDueDateChecked={this.onDueDateChecked}
							dueDateChecked={this.state.dueDateChecked}
						/>
						{this.state.error && (
							<div className="error">{this.state.error}</div>
						)}
					</div>
					<Footer onSave={this.onSave} onCancel={this.onCancel} />
				</div>
			</div>
		);
	}
}
