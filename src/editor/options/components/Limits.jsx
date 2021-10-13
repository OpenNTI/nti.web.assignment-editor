import './Limits.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { HOC, Input } from '@nti/web-commons';

import { maybeResetAssignmentOnError } from '../../Actions';

import OptionGroup from './OptionGroup';
import Option from './Option';

const LIMIT_NONE = 'limit-none';
const LIMIT_PORTION = 'limit-portion';

const DEFAULT_TEXT = {
	content:
		'Setting a max number of questions will result in unique quizzes with randomly chosen questions for every student.',
	disabledNoQuestions: 'Add some questions to enable this option.',
	disabledLimitedEdit:
		'You cannot change these settings once students have begun work on this assignment.',
	disabled: 'Currently unavailable for this assignment.',
	labels: {
		all: 'All of the Questions',
		portion: 'Portion of the Questions',
	},
};

const t = scoped('assignment.editing.options.limits', DEFAULT_TEXT);

class Limits extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		questionSet: PropTypes.object,
	};

	static isQuestionSetOption = true;

	static getItem(props) {
		return props.questionSet;
	}

	constructor(props) {
		super();

		this.setupValue(props);
	}

	setLimitInputRef = x => (this.limitInputRef = x);

	setupValue(props = this.props) {
		const setState = (s, cb) =>
			//eslint-disable-next-line react/no-direct-mutation-state
			this.state ? this.setState(s, cb) : ((this.state = s), cb());
		const { questionSet } = props;
		const { draw } = questionSet || {};

		return new Promise(resolve =>
			setState(
				{
					draw: (typeof draw === 'number' ? draw : 0) || null,
				},
				() => resolve()
			)
		);
	}

	async componentDidUpdate(prevProps, prevState) {
		const { questionSet: prev } = prevProps;
		const { questionSet } = this.props;

		if (questionSet !== prev) {
			await this.setupValue();
		}

		const prevValue = prevState.draw || null;
		const value = this.state.draw || null;

		//draw changed, but the questionSet is the same.
		if (value !== prevValue && questionSet === prev) {
			clearTimeout(this.saveDelay);
			this.saveDelay = setTimeout(this.save, 500);
		}
	}

	onItemChanged = () => {
		if (!this.busy) {
			this.setupValue();
		}
	};

	onLimitBlur = () => {
		const { value } = this.limitInputRef;
		this.setState({ draw: value || null }, this.save);
	};

	/**
	 * Upon typing in the limit input field, update the draw number to reflect the new value.
	 * This is not yet gone to the server to be saved.
	 *
	 * @param {number} value draw?
	 * @returns {void}
	 */
	onLimitChange = value => {
		if (value < 0) {
			return;
		}
		this.setState({ draw: value });
	};

	/**
	 * Upon clicking the portion checkbox, set it as checked.
	 *
	 * @returns {void}
	 */
	onLimitSelect = () => {
		const { draw } = this.state;
		this.setState({ draw: draw || 0 }, () => this.limitInputRef.focus());
	};

	onUnlimitedSelected = () => {
		this.setState({ draw: null });
	};

	save = () => {
		clearTimeout(this.saveDelay);
		const {
			props: { questionSet },
			state: { draw },
		} = this;
		const value = draw || null;

		const afterOthers = () =>
			(this.busy || Promise.resolve()).catch(() => {}); // the .catch(()=>{}) prevents rejections from interrupting the chain

		let work;
		if (questionSet.draw !== value) {
			work = afterOthers().then(() =>
				questionSet.setQuestionLimit(value)
			);
		}

		if (work) {
			const clearBusy = () => work === this.busy && delete this.busy;
			work = this.busy = work
				.catch(maybeResetAssignmentOnError(questionSet))
				.catch(() => this.setState({ draw: questionSet.draw }))
				.then(clearBusy);
		}
	};

	disabledText(questionSet) {
		if (!questionSet || questionSet.questions.length === 0) {
			return t('disabledNoQuestions');
		}
		if (questionSet.LimitedEditingCapabilities) {
			return t('disabledLimitedEdit');
		}
		return t('disabled');
	}

	render() {
		const { questionSet, assignment } = this.props;
		const { draw, error } = this.state;
		const value = typeof draw === 'number' ? true : false;

		const errorMessage = error && (error.message || '');

		return (
			<OptionGroup
				name="limiting"
				header="Max Limit"
				content={t('content')}
				disabled={
					!questionSet ||
					questionSet.LimitedEditingCapabilities ||
					!assignment ||
					!assignment.isModifiable
				}
				disabledText={this.disabledText(questionSet)}
				error={errorMessage}
			>
				<Option
					label={t('labels.all')}
					type="radio"
					name={LIMIT_NONE}
					value={!value}
					onChange={this.onUnlimitedSelected}
				/>
				<Option
					label={t('labels.portion')}
					type="radio"
					value={value}
					onChange={this.onLimitSelect}
				/>
				<Input.Number
					className="portion-max-input"
					placeholder="Max set of questions"
					min={0}
					value={draw || ''}
					name={LIMIT_PORTION}
					ref={this.setLimitInputRef}
					onBlur={this.onLimitBlur}
					onFocus={this.onLimitSelect}
					onChange={this.onLimitChange}
				/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Limits);
