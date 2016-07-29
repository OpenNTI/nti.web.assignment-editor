import React from 'react';
import cx from 'classnames';
import {RadioGroup, DialogButtons, TokenEditor} from 'nti-web-commons';

const ALL_TYPES = 'All File Types';
const SPECIFIC_TYPES = 'Specific File Types';
const WILDCARD = '*';

const WILDCARDS = x => x !== WILDCARD;

export default class Settings extends React.Component {

	static propTypes = {
		onDismiss: React.PropTypes.func,
		onSave: React.PropTypes.func,
		part: React.PropTypes.object.isRequired
	}

	state = {}

	componentWillMount () {
		this.setup();
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.part !== this.props.part) {
			this.setup(nextProps);
		}
	}

	setup (props = this.props) {
		const {part} = props;
		const extensions = part.allowed_extensions || [];
		this.setState({
			extensions,
			selectedRadio: extensions.filter(x => x !== WILDCARD).length > 0 ? SPECIFIC_TYPES : ALL_TYPES
		});
	}

	cancel = () => {
		this.props.onDismiss();
	}

	save = () => {
		if(this.props.onSave(this.value())) {
			this.props.onDismiss();
		}
	}

	value () {
		const option = this.radioGroup.value;
		const fileExtensions = option === ALL_TYPES ? [WILDCARD] : this.fileExtensions.value;
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

	preprocessToken (token) {
		if (!token.startsWith('.')) {
			token = '.' + token;
		}
		return token.toLowerCase();
	}

	render () {

		const {extensions = [], selectedRadio} = this.state;
		const fileExtensionsClasses = cx({
			'disabled': selectedRadio === ALL_TYPES
		});

		return (
			<div className="settings-panel">
				<div className="titlebar">
					<div className="title">Allowed File Extensions</div>
					<i className="icon-light-x" onClick={this.cancel} />
				</div>
				<div className="content">
					<form>
						<RadioGroup name="accepted-file-types"
							ref={x => this.radioGroup = x}
							onChange={this.onRadioChange}
							options={[ALL_TYPES, SPECIFIC_TYPES]}
							initialValue={selectedRadio}
						/>
						<TokenEditor
							ref={x => this.fileExtensions = x}
							tokens={extensions.filter(WILDCARDS)}
							preprocessToken={this.preprocessToken}
							placeholder="Enter all the file types you want to accept"
							onFocus={this.activateSpecific}
							className={fileExtensionsClasses}
						/>
					</form>
				</div>
				<DialogButtons flat buttons={[
					{
						label: 'Cancel',
						onClick: this.cancel
					},
					{
						label: 'Save',
						onClick: this.save
					}
				]} />
			</div>
		);
	}

}
