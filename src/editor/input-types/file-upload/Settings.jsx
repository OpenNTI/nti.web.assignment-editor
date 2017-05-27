import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {RadioGroup, DialogButtons, TokenEditor} from 'nti-web-commons';

import Suggestions from './Suggestions';

const ALL_TYPES = 'All File Types';
const SPECIFIC_TYPES = 'Specific File Types';
const WILDCARD = '*';

const WILDCARDS = x => x !== WILDCARD;

export default class Settings extends React.Component {

	static propTypes = {
		onDismiss: PropTypes.func,
		onSave: PropTypes.func,
		part: PropTypes.object.isRequired
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
			extensions: extensions.filter(WILDCARDS),
			selectedRadio: extensions.filter(WILDCARDS).length > 0 ? SPECIFIC_TYPES : ALL_TYPES
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
		const {extensions, selectedRadio: option} = this.state;
		const fileExtensions = option === ALL_TYPES ? [WILDCARD] : extensions;
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

	onTokenChange = (values) => {
		this.setState({extensions: values});
	}

	onSuggestionSelect = (value) => {
		const {extensions: values} = this.state;
		this.setState({extensions: [...values, value]});
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
							onChange={this.onRadioChange}
							options={[ALL_TYPES, SPECIFIC_TYPES]}
							initialValue={selectedRadio}
						/>
						<TokenEditor
							value={extensions}
							preprocessToken={this.preprocessToken}
							onChange={this.onTokenChange}
							placeholder="Enter all the file types you want to accept"
							onFocus={this.activateSpecific}
							className={fileExtensionsClasses}
						/>
						<Suggestions
							tokens={extensions}
							onSelect={this.onSuggestionSelect}
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
