import React from 'react';
import PropTypes from 'prop-types';
import {Publish, Prompt} from 'nti-web-commons';

import Footer from './Footer';
import PublishState, {PUBLISH, SCHEDULE, DRAFT} from './Publish';
import Reset from './Reset';
import DueDate from './DueDate';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		assignmentRef: PropTypes.object.isRequired,
		onDismiss: PropTypes.func
	}

	state = {}


	constructor (props) {
		super(props);

		const {assignment} = this.props;

		let selectedPublishType = PUBLISH;
		let scheduledDate;
		let dueDate = new Date();
		let hasDate = false;

		if(assignment) {
			const availableBeginning = assignment['available_for_submission_beginning'];
			const availableEnding = assignment['available_for_submission_ending'];

			const available = availableBeginning && new Date(availableBeginning);
			const value = Publish.evaluatePublishStateFor({
				isPublished: () => assignment && (assignment.PublicationState != null && (!available || available < Date.now())),
				getPublishDate: () => assignment && available
			});

			if(value) {
				if(value instanceof Date) {
					selectedPublishType = SCHEDULE;
					scheduledDate = value;
				}
				else {
					selectedPublishType = value.toLowerCase();
				}
			}

			if(availableEnding) {
				dueDate = new Date(availableEnding);
				hasDate = true;
			}
		}

		this.state = {
			selectedPublishType,
			scheduledDate,
			dueDate,
			dueDateChecked: hasDate
		};
	}

	componentDidMount () {
		this.setup(this.props.assignment);
	}


	componentDidUpdate (oldProps) {
		if(oldProps.assignment !== this.props.assignment) {
			this.setup(this.props.assignment);
		}
	}

	setup (assignment) {
		let selectedPublishType = PUBLISH;
		let scheduledDate;
		let dueDate = new Date();
		let hasDate = false;

		if(assignment) {
			const availableBeginning = assignment['available_for_submission_beginning'];
			const availableEnding = assignment['available_for_submission_ending'];

			const available = availableBeginning && new Date(availableBeginning);

			const value = Publish.evaluatePublishStateFor({
				isPublished: () => assignment && (assignment.PublicationState != null && (!available || available < Date.now())),
				getPublishDate: () => assignment && available
			});

			if(value) {
				if(value instanceof Date) {
					selectedPublishType = SCHEDULE;
					scheduledDate = value;
				}
				else {
					selectedPublishType = value.toLowerCase();
				}
			}

			if(availableEnding) {
				dueDate = new Date(availableEnding);
				hasDate = true;
			}
		}

		this.setState({
			selectedPublishType,
			scheduledDate,
			dueDate,
			dueDateChecked: hasDate
		});
	}


	onPublishChange = (selectedPublishType, scheduledDate) => {
		this.setState({selectedPublishType, scheduledDate});
	}


	onReset = async () => {
		const {assignment} = this.props;

		this.setState({loading: true});

		if(assignment.hasLink('Reset')) {
			await assignment.postToLink('Reset');
		}

		await assignment.refresh();

		this.setState({loading: false});
	}


	onDueDateChecked = (dueDateChecked) => {
		this.setState({dueDateChecked});
	}


	onDueDateChange = (dueDate) => {
		this.setState({dueDate});
	}


	onSave = async () => {
		const {assignment, onDismiss} = this.props;
		const {selectedPublishType, scheduledDate, dueDate, dueDateChecked} = this.state;

		this.setState({loading: true});

		let continueWithOp = true;
		let success = false;

		try {
			if(assignment.hasLink('publish')) {
				await assignment.postToLink('publish');
			}

			const link = assignment.hasLink('date-edit') ? 'date-edit' : assignment.hasLink('edit') ? 'edit' : null;

			try {
				if(link) {
					await assignment.putToLink(link, {
						'available_for_submission_beginning': selectedPublishType === SCHEDULE ? scheduledDate.getTime() / 1000.0 : null,
						'available_for_submission_ending': dueDateChecked && dueDate ? dueDate.getTime() / 1000.0 : null
					});
				}
			}
			catch(putEx) {
				// the initial put "fails", could just be needing confirmation
				if(putEx.code === 'AvailableToUnavailable' || 'AssessmentDateConfirm') {
					try {
						await Prompt.areYouSure('', putEx.message, { iconClass: 'alert', confirmButtonClass: 'alert', confirmButtonLabel: 'Yes', cancelButtonLabel: 'No' });

						try {
							await assignment.requestLink (
								link,
								'put',
								{
									'available_for_submission_beginning': selectedPublishType === SCHEDULE ? scheduledDate.getTime() / 1000.0 : null,
									'available_for_submission_ending': dueDateChecked && dueDate ? dueDate.getTime() / 1000.0 : null,
								},
								{
									force: 'True'
								});
						} catch(forcePutEx) {
							// error with force put
							continueWithOp = false;
							this.setState({error: forcePutEx.message});
						}
					}
					catch(promptEx) {
						// user selected "No" on prompt
						continueWithOp = false;
					}
				} else {
					// if not asking for confirmation, then this was a legitimate error
					// so set the state accordingly
					continueWithOp = false;
					this.setState({error: putEx.message});
				}
			}

			if(continueWithOp) {
				if(selectedPublishType === DRAFT && assignment.hasLink('unpublish')) {
					await assignment.postToLink('unpublish');
				}

				await assignment.refresh();

				success = true;
			}
		} catch(e) {
			// any other errors that happen along the way
			this.setState({error: e.message});
		}

		this.setState({loading: false});

		if(success && onDismiss) {
			onDismiss(true);
		}
	}


	onCancel = () => {
		const {onDismiss} = this.props;

		if(onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {assignment, assignmentRef} = this.props;
		const showReset = assignment.hasLink('Reset') || (!assignment.hasLink('date-edit-start'));

		return (
			<div className="assignment-inline-editor menu-container">
				<div className="assignment-due-date-editor">
					<div className="contents">
						<PublishState
							onPublishChange={this.onPublishChange}
							selectedType={this.state.selectedPublishType}
							scheduledDate={this.state.scheduledDate}
							assignment={assignment}
							assignmentRef={assignmentRef}
						/>
						{showReset && <Reset onReset={this.onReset}/>}
						<DueDate
							onDateChanged={this.onDueDateChange}
							date={this.state.dueDate}
							onDueDateChecked={this.onDueDateChecked}
							dueDateChecked={this.state.dueDateChecked}
						/>
						{this.state.error && <div className="error">{this.state.error}</div>}
					</div>
					<Footer onSave={this.onSave} onCancel={this.onCancel}/>
				</div>
			</div>
		);
	}
}
