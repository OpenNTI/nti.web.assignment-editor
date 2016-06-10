import React from 'react';
import Base from '../base/Button';


export default class FreeResponseButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		activeQuestion: React.PropTypes.object
	}

	static set handles (handles) {
		this.handledMimetypes = handles;
	}

	static get handles () {
		return this.handledMimetypes;
	}

	label = 'Free Response'
	defaultQuestionContent = 'Essay Question'
	iconCls = 'freeresponse';


	render () {
		const {assignment, activeQuestion} = this.props;
		const {handles} = this.constructor;
		return (
			<Base
				part={this.getBlankPart()}
				assignment={assignment}
				activeQuestion={activeQuestion}
				label={this.label}
				defaultQuestionContent={this.defaultQuestionContent}
				handles={handles}
				iconCls={this.iconCls} />
		);
	}


	getBlankPart () {
		// TODO: Implement this function.
		return {};
	}
}
