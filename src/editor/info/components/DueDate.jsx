import React from 'react';
import PropTypes from 'prop-types';

import AvailablePicker from './AvailablePicker'; //TODO: merge this and that component together.

export default class DueDate extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
	};
	constructor(props) {
		super(props);

		this.state = this.reset() || {};
	}

	dateChanged = value => {
		this.setState({ value });
	};

	reset = () => {
		const setState = this.state ? x => this.setState(x) : x => x;
		const { assignment } = this.props;

		if (!assignment || !assignment.getAvailableForSubmissionEnding) {
			return;
		}

		const value = assignment.getAvailableForSubmissionEnding();

		return setState({
			value,
			saving: false,
			error: null,
		});
	};

	save = value => {
		const { assignment } = this.props;

		if (!assignment || !assignment.getAvailableForSubmissionEnding) {
			return;
		}

		this.setState({
			value,
			saving: true,
			error: null,
		});

		return assignment
			.setDueDate(value)
			.then(() => {
				this.setState({
					value,
					saving: false,
					error: null,
				});

				return value;
			})
			.catch(error => {
				this.setState({
					value: assignment.getAvailableForSubmissionEnding(),
					saving: false,
					error: error,
				});
				return Promise.reject(error);
			});
	};

	render() {
		const { assignment } = this.props;
		const { value, saving, error } = this.state;
		return (
			<div className="field due-date">
				<AvailablePicker
					label="Due Date"
					value={value}
					onChange={this.save}
					error={error}
					saving={saving}
					onReset={this.reset}
					disabled={!assignment.canSetDueDate()}
				/>
			</div>
		);
	}
}
