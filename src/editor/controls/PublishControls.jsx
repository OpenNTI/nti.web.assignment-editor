import React, {PropTypes} from 'react';
import {Publish, Constants} from 'nti-web-commons';
import {HOC} from 'nti-web-commons';

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

	onChange = (value) => {
		const assignment = PublishControls.getItem(this.props);

		const PublishStateMap = {
			[PUBLISH_STATES.DRAFT]: false,
			[PUBLISH_STATES.PUBLISH]: true
		};

		const state = PublishStateMap[value] || (value instanceof Date ? value : void value);

		return assignment.setPublishState(state);
	}


	render () {
		const assignment = PublishControls.getItem(this.props);
		const value = Publish.evaluatePublishStateFor(assignment);
		const canDelete = assignment.hasLink('edit');

		const Control = false ? PublishLocked : Publish;

		return (
			<div className="assignment-publish-controls">
				<Control alignment="top-right"
					value={value}
					onChange={this.onChange}
				/>
			</div>
		);
	}
}

export default ItemChanges.compose(PublishControls);
