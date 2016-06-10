import React from 'react';
import Button from '../base/Button';

export default class FileUploadButton extends React.Component {
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

	label = 'File Upload'
	defaultQuestionContent = 'File Upload Question'
	iconCls = 'file-upload'

	render () {
		const {assignment, activeQuestion} = this.props;
		const {handles} = this.constructor;
		return (
			<Button
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
		return {};
	}
}
