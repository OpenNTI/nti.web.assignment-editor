import React, {PropTypes} from 'react';
import {Publish, Constants} from 'nti-web-commons';
import {HOC} from 'nti-web-commons';

import {allowPublish} from '../pre-publish';

import Delete from './DeleteAssignment';
import PublishLocked from './PublishLocked';

const {ItemChanges} = HOC;
const {PUBLISH_STATES} = Constants;


class PublishControls extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}


	static getItem (props) {
		return props.assignment;
	}

	state = {}

	onChange = (value) => {
		const assignment = PublishControls.getItem(this.props);
		if (!assignment) {
			return;
		}

		const PublishStateMap = {
			[PUBLISH_STATES.DRAFT]: false,
			[PUBLISH_STATES.PUBLISH]: true
		};

		const state = PublishStateMap[value] || (value instanceof Date ? value : void value);

		return allowPublish(assignment, state)
			.then(() => {
				return assignment.setPublishState(state)
					.catch(err => (
						this.setState({error: err.message}),
						Promise.reject(err)
					));
			}, () => {
				this.resetError();
			});
	}


	resetError = () => {
		this.setState({error: void 0});
	}


	onItemChanged () {
		this.forceUpdate();
	}

	render () {
		const {error} = this.state;
		const assignment = PublishControls.getItem(this.props);
		const value = Publish.evaluatePublishStateFor({
			isPublished: () => assignment && (assignment.isPublished() && assignment.getPublishDate() < Date.now()),
			getPublishDate: () => assignment && assignment.getPublishDate()
		});

		const isPublishable = assignment && (assignment.hasLink('publish') || assignment.hasLink('unpublish'));
		const Control = isPublishable ? Publish : PublishLocked;

		return (
			<div className="assignment-publish-controls">
				<Control alignment="top-right"
					error={error ? error : void error}
					value={value}
					onChange={this.onChange}
					onDismiss={this.resetError}
					assignment={assignment}
				>
					<Delete assignment={assignment}/>
				</Control>
			</div>
		);
	}
}

export default ItemChanges.compose(PublishControls);
