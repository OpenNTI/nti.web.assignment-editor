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


	onChange = (e) => {
		if (this.busy) { return; }

		const {target} = e;
		const {questionSet:qset} = this.props;

		if (!qset) { return; }

		let work;

		if (target.name === RANDOMIZE_QUESTIONS) {
			work = qset.toggleRandomized();
		} else if (target.name === RANDOMIZE_ANSWERS) {
			work = qset.toggleRandomizedPartTypes();
		}

		if (work) {
			this.busy = true;

			const clearBusy = () => delete this.busy;
			work.then(clearBusy, clearBusy);
		}
	}

	render () {
		const {questionSet:qset} = this.props;
		const {isRandomized, isPartTypeRandomized} = qset || {};
		const editable = qset && qset.hasLink('edit');

		return (
			<OptionGroup
				name="ordering"
				header="Randomize Ordering"
				content={t('content')}
				disabled={!qset}
				disabledText={t('disabled')}
			>
				<Option label={t('labels.randomizeQuestions')} name={RANDOMIZE_QUESTIONS} value={isRandomized} onChange={this.onChange} disabled={!editable}/>
				<Option label={t('labels.randomizeAnswers')} name={RANDOMIZE_ANSWERS} value={isPartTypeRandomized} onChange={this.onChange} disabled={!editable}/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Randomize);
