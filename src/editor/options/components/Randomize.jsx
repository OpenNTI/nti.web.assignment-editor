import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { HOC } from '@nti/web-commons';

import { maybeResetAssignmentOnError } from '../../Actions';

import OptionGroup from './OptionGroup';
import Option from './Option';

const RANDOMIZE_QUESTIONS = 'randomize-questions';
const RANDOMIZE_ANSWERS = 'randomize-answers';

const DEFAULT_TEXT = {
	content:
		'Randomizing will override the order of the questions and answers you created.',
	disabledNoQuestions: 'Add some questions to enable this option.',
	disabledLimitedEdit:
		'You cannot change these settings once students have begun work on this assignment.',
	disabledMaxLimit: 'Max Limit is enabled.',
	disabled: 'Currently unavailable for this assignment.',
	labels: {
		randomizeQuestions: 'Randomize Question Order',
		randomizeAnswers: 'Randomize Answer Order',
	},
};

const t = scoped('assignment.editing.options.randomize', DEFAULT_TEXT);

class Randomize extends React.Component {
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

	async componentDidUpdate(prevProps) {
		const { questionSet } = this.props;
		const hasChanged =
			questionSet &&
			['isRandomized', 'isPartTypeRandomized'].some(
				x => questionSet[x] !== this.state[x]
			);

		if (this.props.questionSet !== prevProps.questionSet) {
			await this.setupValue();
		}

		if (hasChanged) {
			this.save();
		}
	}

	save = () => {
		const { questionSet } = this.props;
		const updaters = {
			isRandomized: () => questionSet.toggleRandomized(),
			isPartTypeRandomized: () => questionSet.toggleRandomizedPartTypes(),
		};

		for (let key of Object.keys(updaters)) {
			if (questionSet[key] !== this.state[key]) {
				updaters[key]()
					.catch(maybeResetAssignmentOnError(questionSet))
					.catch(error => {
						this.setState({ error });
						this.setupValue();
					});
			}
		}
	};

	setupValue(props = this.props) {
		//eslint-disable-next-line react/no-direct-mutation-state
		const setState = (s, cb) =>
			this.state ? this.setState(s, cb) : ((this.state = s), cb());
		const { questionSet } = props;
		const { isRandomized, isPartTypeRandomized } = questionSet || {};

		return new Promise(resolve =>
			setState(
				{
					isRandomized,
					isPartTypeRandomized,
				},
				resolve
			)
		);
	}

	onItemChanged = () => {
		this.setupValue();
	};

	onChange = ({ target }) => {
		const map = {
			[RANDOMIZE_QUESTIONS]: 'isRandomized',
			[RANDOMIZE_ANSWERS]: 'isPartTypeRandomized',
		};

		const key = map[target.name];

		if (key) {
			const checked = !this.state[key];
			this.setState({ [key]: checked, error: void 0 });
		}
	};

	disabledText(questionSet) {
		if (!questionSet || questionSet.questions.length === 0) {
			return t('disabledNoQuestions');
		}
		if (questionSet.LimitedEditingCapabilities) {
			return t('disabledLimitedEdit');
		}
		if (questionSet.draw) {
			return t('disabledMaxLimit');
		}
		return t('disabled');
	}

	render() {
		const { isRandomized, isPartTypeRandomized, error } = this.state;
		const { questionSet } = this.props;
		const editRand =
			questionSet &&
			(questionSet.hasLink('Randomize') ||
				questionSet.hasLink('Unrandomize'));
		const editRandParts =
			questionSet &&
			(questionSet.hasLink('RandomizePartsType') ||
				questionSet.hasLink('UnrandomizePartsType'));
		const disabledText = this.disabledText(questionSet);

		const errorMessage = error && (error.message || '');

		return (
			<OptionGroup
				name="ordering"
				header="Randomize Ordering"
				content={t('content')}
				disabledText={disabledText}
				error={errorMessage}
				partiallyDisabled={!editRand || !editRandParts}
			>
				<Option
					label={t('labels.randomizeQuestions')}
					name={RANDOMIZE_QUESTIONS}
					value={isRandomized}
					onChange={this.onChange}
					disabled={!editRand}
				/>
				<Option
					label={t('labels.randomizeAnswers')}
					name={RANDOMIZE_ANSWERS}
					value={isPartTypeRandomized}
					onChange={this.onChange}
					disabled={!editRandParts}
				/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Randomize);
