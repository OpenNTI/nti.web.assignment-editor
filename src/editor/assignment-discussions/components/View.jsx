import React from 'react';
import {Loading} from 'nti-web-commons';

import Discussion from './Discussion';

export default class DiscussionAssignment extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		course: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {
			loading: true,
			discussions: []
		};
	}


	componentDidMount () {
		const {course} = this.props;

		this.loadDiscussionsFromCourse(course);
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


	render () {
		const {loading, discussions} = this.state;

		return (
			<div className="discussion-assignment">
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
		return (
			<li key={discussion.NTIID}>
				<Discussion discussion={discussion} selected={false} />
			</li>
		);
	}
}
