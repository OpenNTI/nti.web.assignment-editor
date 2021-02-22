import './Attempts.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { HOC, Select } from '@nti/web-commons';

import OptionGroup from './OptionGroup';
import Option from './Option';

const MAX_LIMIT = 19;
const LIMITED_ARRAY = Array.from({ length: MAX_LIMIT }).map((_, i) => i + 2); //2 - 20

const t = scoped('assignment.editing.options.Attempts', {
	header: 'Number of Attempts',
	content: 'Specify how many times learners can take this assignment.',
	disabled: {
		noQuestions: 'Add some questions to enable this option.',
		noPassingScore:
			'Assignments must have a passing score to enable multiple attempts',
	},
	labels: {
		oneAttempt: 'One Attempt',
		limitedAttempts: 'Limited Attempts',
		unlimitedAttempts: 'Unlimited Attempts',
	},
	attempts: {
		one: '%(count)s Attempt',
		other: '%(count)s Attempts',
	},
});

class Attempts extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		questionSet: PropTypes.object,
	};

	static getItem(props) {
		return props.assignment;
	}

	state = {};

	numberInput = React.createRef();

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps, prevState) {
		const { assignment } = this.props;
		const { maxSubmissions, passingScore } = this.state;
		const { assignment: prevAssignment } = prevProps;
		const { maxSubmisions: prevMax } = prevState;

		if (
			assignment !== prevAssignment ||
			assignment.passingScore !== passingScore
		) {
			this.setupFor(this.props);
		}

		if (prevMax !== maxSubmissions) {
			this.saveMaxSubmissions();
		}
	}

	setupFor(props) {
		const { assignment, questionSet } = this.props;
		const { maxSubmissions } = assignment;

		let disabled = !assignment.canSetMaxSubmissions();
		let disabledText = null;

		if (!disabled && !questionSet) {
			disabled = true;
			disabledText = t('disabled.noQuestions');
		}

		if (!disabled && !assignment.passingScore) {
			disabled = true;
			disabledText = t('disabled.noPassingScore');
		}

		this.setState({
			passingScore: assignment.passingScore,
			disabled,
			disabledText,
			maxSubmissions: disabled ? 1 : maxSubmissions,
			limitedSubmissions:
				maxSubmissions && maxSubmissions > 1 ? maxSubmissions : 2,
		});
	}

	saveMaxSubmissions() {
		const { assignment } = this.props;

		if (this.saveBufferTimeout) {
			return;
		}

		this.saveBufferTimeout = setTimeout(async () => {
			delete this.saveBufferTimeout;

			const { maxSubmissions: oldMax } = assignment;
			const { maxSubmissions: newMax } = this.state;

			if (oldMax === newMax) {
				return;
			}

			try {
				await assignment.setMaxSubmissions(newMax);

				this.setupFor(this.props);
			} catch (e) {
				this.setupFor(this.props);
				this.setState({
					error: e,
				});
			}
		}, 100);
	}

	setOneAttempt = () => {
		this.setState({
			maxSubmissions: 1,
		});
	};

	setMultipleAttempts = () => {
		const { limitedSubmissions } = this.state;

		this.setState({
			maxSubmissions: limitedSubmissions,
		});
	};

	setUnlimitedAttempts = () => {
		this.setState({
			maxSubmissions: -1,
		});
	};

	setMaxSubmissions = value => {
		this.setState({
			maxSubmissions: value,
		});
	};

	changeLimitedAttempts = e => {
		const value = parseInt(e.target.value, 10);

		this.setState({
			maxSubmissions: value,
			limitedSubmissions: value,
		});
	};

	render() {
		const { maxSubmissions, disabled, disabledText, error } = this.state;

		if (disabled && !disabledText) {
			return null;
		}

		return (
			<OptionGroup
				name="attempts"
				header={t('header')}
				content={t('content')}
				disabled={disabled}
				disabledText={disabledText}
				error={error && (error.message || '')}
			>
				<Option
					label={t('labels.oneAttempt')}
					type="radio"
					value={maxSubmissions === 1}
					onChange={this.setOneAttempt}
				/>
				<Option
					label={this.renderLimitedChoices()}
					type="radio"
					value={maxSubmissions && maxSubmissions > 1}
					onChange={this.setMultipleAttempts}
				/>
				<Option
					label={t('labels.unlimitedAttempts')}
					type="radio"
					value={maxSubmissions < 0}
					onChange={this.setUnlimitedAttempts}
				/>
			</OptionGroup>
		);
	}

	renderLimitedChoices() {
		const { limitedSubmissions } = this.state;
		const limited = limitedSubmissions || 2;

		return (
			<div className="select-container">
				<Select value={limited} onChange={this.changeLimitedAttempts}>
					{LIMITED_ARRAY.map(limit => {
						return (
							<option value={limit} key={limit}>
								{limited === limit
									? t('attempts', { count: limit })
									: limit}
							</option>
						);
					})}
				</Select>
			</div>
		);
	}
}

export default HOC.ItemChanges.compose(Attempts);
