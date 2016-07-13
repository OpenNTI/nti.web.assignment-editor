import React, {PropTypes} from 'react';
import {Publish, Constants, Prompt} from 'nti-web-commons';
import {HOC} from 'nti-web-commons';
import Logger from 'nti-util-logger';

import Delete from './DeleteAssignment';
import PublishLocked from './PublishLocked';

const {ItemChanges} = HOC;
const {PUBLISH_STATES} = Constants;
const logger = Logger.get('lib:asssignment-editor:PublishControls');

class PublishControls extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}


	static getItem (props) {
		return props.assignment;
	}

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

		return assignment.setPublishState(state)
			.catch((err) => Prompt.alert(err.message));
	}


	render () {
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
					value={value}
					onChange={this.onChange}
					assignment={assignment}
				>
					<Delete assignment={assignment}/>
				</Control>
			</div>
		);
	}
}

export default ItemChanges.compose(PublishControls);
