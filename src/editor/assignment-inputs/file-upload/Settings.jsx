import React from 'react';
import cx from 'classnames';
import {RadioGroup} from 'nti-web-commons';

import FileExtensionsEditor from './FileExtensionsEditor';

const ALL_TYPES = 'All File Types';
const SPECIFIC_TYPES = 'Specific File Types';

export default class Settings extends React.Component {

	constructor (props) {
		super(props);

		this.cancel = this.cancel.bind(this);
		this.save = this.save.bind(this);
		this.state = {};
	}

	static propTypes = {
		onDismiss: React.PropTypes.func,
		onSave: React.PropTypes.func,
		part: React.PropTypes.object.isRequired
	}

	componentWillMount () {
		this.setup();
	}

	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}

	setup (props = this.props) {
		const {part} = props;
		const extensions = part.allowed_extensions || [];
		this.setState({
			extensions,
			selectedRadio: extensions.length > 0 ? SPECIFIC_TYPES : ALL_TYPES
		});
	}

	cancel () {
		this.props.onDismiss();
	}

	save () {
		if(this.props.onSave(this.value())) {
			this.props.onDismiss();
		}
	}

	value () {
		const option = this.radioGroup.value;
		const fileExtensions = option === ALL_TYPES ? [] : this.fileExtensions.value;
		return {
			fileExtensions
		};
	}

	onRadioChange = (value) => {
		this.setState({
			selectedRadio: value
		});
	}

	activateSpecific = () => {
		this.setState({
			selectedRadio: SPECIFIC_TYPES
		});
	}

	render () {

		const {extensions = [], selectedRadio} = this.state;
		const fileExtensionsClasses = cx({
			'disabled': selectedRadio === ALL_TYPES
		});

		return (
			<div className="settings-panel">
				<div className="titlebar">
					<div className="title">Settings</div>
					<i className="icon-light-x" onClick={this.cancel} />
				</div>
				<div className="content">
					<form>
						<div>Accepted File Types</div>
						<RadioGroup name="accepted-file-types"
							ref={x => this.radioGroup = x}
							onChange={this.onRadioChange}
							options={[ALL_TYPES, SPECIFIC_TYPES]}
							initialValue={selectedRadio}
						/>
						<FileExtensionsEditor
							ref={x => this.fileExtensions = x}
							extensions={extensions}
							onFocus={this.activateSpecific}
							className={fileExtensionsClasses}
						/>
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
