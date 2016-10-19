import React from 'react';
import Logger from 'nti-util-logger';
import {HOC} from 'nti-web-commons';

import NoParts from './NoParts';
import Part from './Part';

const {ItemChanges} = HOC;

const logger = Logger.get('lib:asssignment-editor:AssignmentParts');

export default class AssignmentPartsView extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onAssignmentUpdate = () => {
		this.forceUpdate();
	}


	render () {
		const {assignment} = this.props;

		if (!assignment) {
			return (
				<div className="assignment-parts loading" />
			);
		}

		const parts = assignment.parts;

		return (
			<ItemChanges item={assignment} onItemChanged={this.onAssignmentUpdate}>
				<div className="assignment-parts">
					{parts && parts.length ?
						this.renderParts(parts) :
						this.renderNoParts()
					}
				</div>
			</ItemChanges>
		);
	}


	renderParts (parts) {
		const {assignment, course} = this.props;

		if (parts.length > 1) {
			logger.warn('More than one assignment part, not sure how to handle it. Just taking the first.', parts);
		}

		return (
			<Part part={parts[0]} assignment={assignment} course={course} />
		);
	}


	renderNoParts () {
		const {assignment} = this.props;

		return (
			<NoParts assignment={assignment} />
		);
	}
}
