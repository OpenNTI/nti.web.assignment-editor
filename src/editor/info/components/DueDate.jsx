import React from 'react';
import AvailablePicker from './AvailablePicker';//TODO: merge this and that component together.

export default class DueDate extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}
	constructor (props) {
		super(props);

		this.state = {};
	}

	componentWillMount () {
		const {assignment} = this.props;
		const value = assignment.getAvailableForSubmissionEnding();
		this.setState({
			value
		});
	}

	dateChanged = (value) => {
		this.setState({value});
	}

	save = (value) => {
		const {assignment} = this.props;

		this.setState({
			saving: true,
			error: null
		});

		return assignment.save({
			'available_for_submission_ending': value
		})
		.then(() => {
			this.setState({
				value,
				saving: false
			});

			return value;
		})
		.catch((error) => {
			this.setState({
				error,
				saving: false
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
