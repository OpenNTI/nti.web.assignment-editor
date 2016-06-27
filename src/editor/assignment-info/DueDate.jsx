import React from 'react';
import {AvailablePicker} from 'nti-web-commons';

export default class AvailableBeginning extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}
	constructor (props) {
		super(props);

		this.state = {};
		this.dateChanged = this.dateChanged.bind(this);
		this.save = this.save.bind(this);
	}

	componentWillMount () {
		const {assignment} = this.props;
		const value = assignment.getAvailableForSubmissionEnding();
		this.setState({
			value,
			changed: false
		});
	}

	dateChanged (value) {
		this.setState({value, changed: true});
	}

	save (value) {
		const {assignment} = this.props;

		this.setState({
			saving: true,
			error: null
		});

		assignment.save({
			'available_for_submission_ending': value
		})
		.then(() => {
			return this.setState({
				changed: true,
				value
			});
		})
		.catch((error) => {
			this.setState({
				error
			});
		});
	}

	render () {
		const {value, saving, error} = this.state;
		return (
			<div className="field due-date">
				<AvailablePicker label="Due Date" value={value} onChange={this.save} error={error} saving={saving} />
			</div>
		);
	}
}
