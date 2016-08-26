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
		this.reset();
	}

	dateChanged = (value) => {
		this.setState({value});
	}

	reset = () => {
		const {assignment} = this.props;

		if (!assignment || !assignment.getAvailableForSubmissionEnding) {
			return;
		}

		const value = assignment.getAvailableForSubmissionEnding();

		this.setState({
			value,
			saving: false,
			error: null
		});
	}

	save = (value) => {
		const {assignment} = this.props;

		if (!assignment || !assignment.getAvailableForSubmissionEnding) {
			return;
		}

		this.setState({
			value,
			saving: true,
			error: null
		});

		return assignment.save({
			'available_for_submission_ending': value
		})
		.then(() => {
			this.setState({
				value,
				saving: false,
				error: null
			});

			return value;
		})
		.catch((error) => {
			this.setState({
				value: assignment.getAvailableForSubmissionEnding(),
				saving: false,
				error: error
			});
			return Promise.reject(error);
		});
	}

	render () {
		const {value, saving, error} = this.state;
		return (
			<div className="field due-date">
				<AvailablePicker
					label="Due Date"
					value={value}
					onChange={this.save}
					error={error}
					saving={saving}
					onReset={this.reset}
				/>
			</div>
		);
	}
}
