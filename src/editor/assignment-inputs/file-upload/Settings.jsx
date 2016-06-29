import React from 'react';
import {Radio} from 'nti-web-commons';

import FileExtensionsEditor from './FileExtensionsEditor';

export default class Settings extends React.Component {

	constructor (props) {
		super(props);

		this.cancel = this.cancel.bind(this);
		this.save = this.save.bind(this);
		this.state = {};
	}

	static propTypes = {
		onCancel: React.PropTypes.func,
		onSave: React.PropTypes.func,
		part: React.PropTypes.object.isRequired
	}

	cancel () {
		this.props.onCancel();
	}

	save () {
		this.props.onSave(this.value());
	}

	value () {
		const fileExtensions = this.fileExtensions.value;
		return {
			fileExtensions
		};
	}

	render () {

		const {part} = this.props;

		return (
			<div className="settings-panel">
				<div className="titlebar">
					<div className="title">Settings</div>
					<div className="x-close" onClick={this.cancel}>X</div>
				</div>
				<div className="content">
					<form>
						<div>Accepted File Types</div>
						<div><Radio name="accepted-file-types" label="Allow All File Types" /></div>
						<div><Radio name="accepted-file-types" label="Specific File Types" /></div>
						<FileExtensionsEditor ref={x => this.fileExtensions = x} extensions={part.allowed_extensions} />
					</form>
				</div>
				<div className="button-row">
					<div className="button secondary cancel" onClick={this.cancel}>Cancel</div>
					<div className="button primary save" onClick={this.save}>Save</div>
				</div>
			</div>
		);
	}

}
