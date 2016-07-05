import React from 'react';
import Logger from 'nti-util-logger';
import {HOC} from 'nti-web-commons';
import autobind from 'nti-commons/lib/autobind';

import NoParts from './NoParts';
import Part from './Part';

const {ItemChanges} = HOC;

const logger = Logger.get('lib:asssignment-editor:AssignmentParts');

export default class AssignmentParts extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		autobind(this, 'onAssignmentUpdate');
	}


	onAssignmentUpdate () {
		this.forceUpdate();
	}


	render () {
		const {assignment} = this.props;

		if (!assignment) {
			return (
				<div className="assignment-parts loading"></div>
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
		if (parts.length > 1) {
			logger.warn('More than one assignment part, not sure how to handle it. Just taking the first.', parts);
		}

		return (
			<Part part={parts[0]} assignment={this.props.assignment} />
		);
	}


	renderNoParts () {
		const {assignment} = this.props;

		return (
			<NoParts assignment={assignment} />
		);
	}
}
