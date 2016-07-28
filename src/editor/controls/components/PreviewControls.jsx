import React, {PropTypes} from 'react';
import autobind from 'nti-commons/lib/autobind';
import Logger from 'nti-util-logger';

const logger = Logger.get('lib:assignment-editor:controls:components:PreviewControls');

export default class PreviewControls extends React.Component {
	static propTypes = {
		previewAssignment: PropTypes.func
	}

	constructor (props) {
		super(props);

		autobind(this, 'handleClick');
	}

	handleClick () {
		if (this.props.previewAssignment) {
			this.props.previewAssignment();
		} else {
			logger.warn('Preview button does not link to assignment... Doing no-op...');
		}
	}

	render () {
		return (
			<div className="assignment-preview-controls">
				<div className="preview-trigger" onClick={this.handleClick}>
					<i className="icon-view small" />
					<span className="preview-trigger-text">
						Preview
					</span>
				</div>
			</div>
		);
	}
}