import React from 'react';
import {Loading, Errors} from 'nti-web-commons';

import Store from '../../Store';
import {ASSIGNMENT_ERROR, ASSIGNMENT_WARNING, REVERT_ERRORS} from '../../Constants';
import {warnIfDiscussionEmpty} from '../Actions';

import Discussion from './Discussion';

const {Field:{Component:ErrorCmp}} = Errors;

export default class DiscussionAssignment extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		course: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		Store.addChangeListener(this.onStoreChange);

		this.state = {
			loading: true,
			discussions: []
		};
	}


	componentDidMount () {
		const {course, assignment} = this.props;

		this.loadDiscussionsFromCourse(course);
		warnIfDiscussionEmpty(assignment);
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}


	onStoreChange = (data) => {
		const {assignment} = this.props;

		if ((data.type === ASSIGNMENT_ERROR || data.type === ASSIGNMENT_WARNING) && assignment.NTIID === data.NTIID) {
			this.onAssignmentMessages();
		} else if (data.type === REVERT_ERRORS) {
			this.onAssignmentMessages();
		}
	}


	onAssignmentMessages () {
		const {assignment} = this.props;
		const {NTIID} = assignment;
		const error = Store.getErrorFor(NTIID, 'discussion_ntiid');
		const warning = Store.getWarningFor(NTIID, 'discussion_ntiid');

		this.setState({
			error,
			warning
		});
	}


	loadDiscussionsFromCourse (course) {
		return new Promise((fulfill) => {
			this.setState({
				loading: true
			}, () => {
				fulfill(course.getCourseDiscussions());
			});
		}).then((discussions) => {
			this.setState({
				loading: false,
				discussions
			});
		});
	}


	selectDiscussion (discussion) {
		debugger;
	}


	render () {
		const {loading, discussions, error, warning} = this.state;

		return (
			<div className="discussion-assignment-list">
				<div className="messages">
					{error && <ErrorCmp error={error} />}
					{warning && <ErrorCmp error={warning} isWarning/>}
				</div>
				{
					loading ?
						(<Loading.Mask />) :
						(
							<ul>
								{discussions.map(x => this.renderDiscussion(x))}
							</ul>
						)
				}
			</div>
		);
	}


	renderDiscussion = (discussion) => {
		const {course} = this.props;

		return (
			<li key={discussion.NTIID}>
				<Discussion discussion={discussion} selected={false} onSelect={this.selectDiscussion} course={course} />
			</li>
		);
	}
}
