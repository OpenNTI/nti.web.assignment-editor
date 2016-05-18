import React from 'react';
import Logger from 'nti-util-logger';
import Part from './Part';

const logger = Logger.get('assignment-editor:assignment-parts');

export default class AssignmentParts extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		this.state = {};
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
			<div className="assignment-parts">
				{parts && parts.length ?
					this.renderParts(parts) :
					(<span>No parts</span>)
				}
			</div>
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
}
