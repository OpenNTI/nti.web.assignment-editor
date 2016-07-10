import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';
import {HOC} from 'nti-web-commons';

import OptionGroup from '../OptionGroup';
import Option from '../Option';

const RANDOMIZE_QUESTIONS = 'randomize-questions';
const RANDOMIZE_ANSWERS = 'randomize-answers';

const DEFAULT_TEXT = {
	content: 'Randomizing will override the order of the questions and answers you created.',
	disabled: 'Add some questions to enable this option.',
	labels: {
		randomizeQuestions: 'Randomize Question Order',
		randomizeAnswers: 'Randomize Answer Order'
	}
};

const t = scoped('OPTIONS_RANDOMIZE', DEFAULT_TEXT);


class Randomize extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
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
				updaters[key]();
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

			this.setState({ [key]: checked });
		}
	}

	render () {
		const {isRandomized, isPartTypeRandomized} = this.state;
		const {questionSet:qset} = this.props;
		const editable = qset && qset.hasLink('edit');

		return (
			<OptionGroup
				name="ordering"
				header="Randomize Ordering"
				content={t('content')}
				disabled={!qset}
				disabledText={t('disabled')}
			>
				<Option label={t('labels.randomizeQuestions')}
					name={RANDOMIZE_QUESTIONS}
					value={isRandomized}
					onChange={this.onChange}
					disabled={!editable}/>
				<Option label={t('labels.randomizeAnswers')}
					name={RANDOMIZE_ANSWERS}
					value={isPartTypeRandomized}
					onChange={this.onChange}
					disabled={!editable}/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Randomize);
