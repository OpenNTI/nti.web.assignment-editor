import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';
import {HOC} from 'nti-web-commons';

import {maybeResetAssignmentOnError} from '../../Actions';

import OptionGroup from './OptionGroup';
import Option from './Option';

const RANDOMIZE_QUESTIONS = 'randomize-questions';
const RANDOMIZE_ANSWERS = 'randomize-answers';

const DEFAULT_TEXT = {
	content: 'Randomizing will override the order of the questions and answers you created.',
	disabledNoQuestions: 'Add some questions to enable this option.',
	disabledLimitedEdit: 'You cannot change these settings once students have begun work on this assignment.',
	disabledMaxLimit: 'Max Limit is enabled.',
	disabled: 'Currently unavailable for this assignment.',
	labels: {
		randomizeQuestions: 'Randomize Question Order',
		randomizeAnswers: 'Randomize Answer Order'
	}
};

const t = scoped('OPTIONS_RANDOMIZE', DEFAULT_TEXT);


class Randomize extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		questionSet: PropTypes.object
	}

	static isQuestionSetOption = true


	static getItem (props) {
		return props.questionSet;
	}


	constructor (props) {
		super();

		this.setupValue(props);
	}

	componentDidUpdate () {
		const {questionSet: qset} = this.props;
		const hasChanged = qset && ['isRandomized', 'isPartTypeRandomized'].some(x => qset[x] !== this.state[x]);

		if (hasChanged) {
			this.save();
		}
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.questionSet !== nextProps.questionSet) {
			this.setupValue(nextProps);
		}
	}


	save = () => {
		const {questionSet: qset} = this.props;
		const updaters = {
			isRandomized: () => qset.toggleRandomized(),
			isPartTypeRandomized: () => qset.toggleRandomizedPartTypes()
		};

		for (let key of Object.keys(updaters)) {
			if (qset[key] !== this.state[key]) {
				updaters[key]()
					.catch(maybeResetAssignmentOnError(qset))
					.catch(error => {
						this.setState({error});
						this.setupValue();
					});
			}
		}
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {questionSet} = props;
		const {isRandomized, isPartTypeRandomized} = questionSet || {};

		setState({
			isRandomized,
			isPartTypeRandomized
		});
	}


	onItemChanged = () => {
		this.setupValue();
	}


	onChange = ({target}) => {
		const map = {
			[RANDOMIZE_QUESTIONS]: 'isRandomized',
			[RANDOMIZE_ANSWERS]: 'isPartTypeRandomized'
		};

		const key = map[target.name];

		if (key) {
			const checked = !this.state[key];
			this.setState({ [key]: checked, error: void 0 });
		}
	}

	disabledText (qset) {
		if(!qset || qset.questions.length === 0) {
			return t('disabledNoQuestions');
		}
		if(qset.LimitedEditingCapabilities) {
			return t('disabledLimitedEdit');
		}
		if(qset.draw) {
			return t('disabledMaxLimit');
		}
		return t('disabled');
	}

	render () {
		const {isRandomized, isPartTypeRandomized, error} = this.state;
		const {questionSet:qset} = this.props;
		const editRand = qset && (qset.hasLink('Randomize') || qset.hasLink('Unrandomize'));
		const editRandParts = qset && (qset.hasLink('RandomizePartsType') || qset.hasLink('UnrandomizePartsType'));
		const disabledText = this.disabledText(qset);

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
				<Option label={t('labels.randomizeQuestions')}
					name={RANDOMIZE_QUESTIONS}
					value={isRandomized}
					onChange={this.onChange}
					disabled={!editRand}/>
				<Option label={t('labels.randomizeAnswers')}
					name={RANDOMIZE_ANSWERS}
					value={isPartTypeRandomized}
					onChange={this.onChange}
					disabled={!editRandParts}/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Randomize);
