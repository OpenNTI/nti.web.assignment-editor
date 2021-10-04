import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Loading, Errors, HOC } from '@nti/web-commons';
import { Button } from '@nti/web-core';
import { scoped } from '@nti/lib-locale';

import Store from '../../Store';
import {
	ASSIGNMENT_ERROR,
	ASSIGNMENT_WARNING,
	REVERT_ERRORS,
} from '../../Constants';
import { warnIfDiscussionEmpty, setDiscussionOnAssignment } from '../Actions';

import Discussion from './Discussion';

const {
	Field: { Component: ErrorCmp },
} = Errors;
const { ItemChanges } = HOC;

const DEFAULT_TEXT = {
	description: 'Grade a student on their participation in a discussion.',
	enter: 'Enter a NTIID:',
	save: 'Save',
};

const t = scoped('assignment.viewer.discussion', DEFAULT_TEXT);

export default class DiscussionAssignment extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		course: PropTypes.object,
	};

	constructor(props) {
		super(props);

		const { assignment } = props;

		Store.addChangeListener(this.onStoreChange);

		this.state = {
			loading: true,
			activeValue: assignment.discussionId || '',
			discussions: [],
		};
	}

	componentDidMount() {
		const { course, assignment } = this.props;

		this.loadDiscussionsFromCourse(course);
		warnIfDiscussionEmpty(assignment);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = data => {
		const { assignment } = this.props;

		if (
			(data.type === ASSIGNMENT_ERROR ||
				data.type === ASSIGNMENT_WARNING) &&
			assignment.NTIID === data.NTIID
		) {
			this.onAssignmentMessages();
		} else if (data.type === REVERT_ERRORS) {
			this.onAssignmentMessages();
		}
	};

	onAssignmentMessages() {
		const { assignment } = this.props;
		const { NTIID } = assignment;
		const error = Store.getErrorFor(NTIID, 'discussionId');
		const warning = Store.getWarningFor(NTIID, 'discussionId');

		this.setState({
			error,
			warning,
		});
	}

	loadDiscussionsFromCourse(course) {
		return new Promise(fulfill => {
			this.setState(
				{
					loading: true,
				},
				() => {
					fulfill(course.getCourseDiscussions());
				}
			);
		}).then(discussions => {
			this.setState({
				loading: false,
				discussions,
			});
		});
	}

	selectDiscussion = discussion => {
		this.selectDiscussionID(discussion.NTIID);
	};

	selectDiscussionID(id) {
		const { assignment } = this.props;

		setDiscussionOnAssignment(id, assignment);
	}

	onAssignmentUpdate = () => {
		const { assignment } = this.props;

		this.setState({
			activeValue: assignment.discussionId || '',
		});
	};

	onManualInputChange = e => {
		const { error, warning } = this.state;

		this.setState({
			activeValue: e.target.value,
		});

		if (error) {
			error.clear();
		}

		if (warning) {
			warning.clear();
		}
	};

	saveManualInput = () => {
		const { activeValue } = this.state;

		this.selectDiscussionID(activeValue);
	};

	render() {
		const { assignment } = this.props;
		const { loading, discussions, error, warning } = this.state;

		return (
			<ItemChanges
				item={assignment}
				onItemChanged={this.onAssignmentUpdate}
			>
				<div className="discussion-assignment-list">
					<p className="description">{t('description')}</p>
					{!loading && this.renderManualInput()}
					<div className="messages">
						{error && <ErrorCmp error={error} />}
						{!error && warning && (
							<ErrorCmp error={warning} isWarning />
						)}
					</div>
					{loading ? (
						<Loading.Mask />
					) : (
						<ul>
							{discussions.map(x => this.renderDiscussion(x))}
						</ul>
					)}
				</div>
			</ItemChanges>
		);
	}

	renderDiscussion = discussion => {
		const { course, assignment } = this.props;
		const { discussionId: activeNTIID } = assignment;
		const selected = discussion.NTIID === activeNTIID;

		return (
			<li key={discussion.NTIID}>
				<Discussion
					discussion={discussion}
					selected={selected}
					onSelect={this.selectDiscussion}
					course={course}
				/>
			</li>
		);
	};

	renderManualInput = () => {
		const { assignment } = this.props;
		const { activeValue } = this.state;

		if (!assignment.canManuallyEdit) {
			return null;
		}

		return (
			<div className="manual-input">
				<label htmlFor="discussion_id_input">{t('enter')}</label>
				<input
					name="discussion_id_input"
					type="text"
					value={activeValue}
					onChange={this.onManualInputChange}
				/>
				<Button onClick={this.saveManualInput}>
					<span>{t('save')}</span>
				</Button>
			</div>
		);
	};
}
