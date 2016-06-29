import React, {PropTypes} from 'react';
import {Publish, Constants} from 'nti-web-commons';
import {HOC} from 'nti-web-commons';
import Logger from 'nti-util-logger';
import PublishLocked from './PublishLocked';


const {ItemChanges} = HOC;
const {PUBLISH_STATES} = Constants;
const logger = Logger.get('lib:asssignment-editor:publish-controls');

class PublishControls extends React.Component {
	static propTypes = {
		assignment: PropTypes.object
	}


	static getItem (props) {
		return props.assignment;
	}

	onChange = (value) => {
		const assignment = PublishControls.getItem(this.props);

		const PublishStateMap = {
			[PUBLISH_STATES.DRAFT]: false,
			[PUBLISH_STATES.PUBLISH]: true
		};

		const state = PublishStateMap[value] || (value instanceof Date ? value : void value);

		return assignment.setPublishState(state)
			.catch((err) => logger.error(err.stack || err.message || err));
	}


	render () {
		const assignment = PublishControls.getItem(this.props);
		const value = Publish.evaluatePublishStateFor({
			isPublished: () => assignment.isPublished() && assignment.getPublishDate() < Date.now(),
			getPublishDate: () => assignment.getPublishDate()
		});

		const canDelete = assignment.hasLink('edit');
		const isPublishable = assignment.hasLink('publish') || assignment.hasLink('unpublish');
		const Control = isPublishable ? Publish : PublishLocked;

		return (
			<div className="assignment-publish-controls">
				<Control alignment="top-right"
					value={value}
					onChange={this.onChange}
					assignment={assignment}
					enableDelete={canDelete}
				/>
			</div>
		);
	}
}

export default ItemChanges.compose(PublishControls);
