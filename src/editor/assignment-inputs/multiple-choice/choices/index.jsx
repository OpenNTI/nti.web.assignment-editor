import React from 'react';

import Choices from '../../choices';
import {isErrorForChoice, cloneChoice} from '../../choices/Factory';
import Choice from './Choice';

export default class MultipleChoiceChoices extends Choices {
	static propTypes = {
		...Choices.propTypes,
		multipleAnswers: React.PropTypes.bool
	}


	className = 'multiple-choice-choices'


	onChoiceChange (column, choice) {
		const {multipleAnswers} = this.props;
		const {columns} = this.state;
		const oldColumn = columns[column];
		let newColumn = [];
		let solutionChanged = false;


		for (let oldChoice of oldColumn) {
			if (this.isSameChoice(oldChoice, choice)) {
				if (oldChoice.correct !== choice.correct) {
					solutionChanged = true;
				}

				oldChoice.label = choice.label;

				newColumn.push(cloneChoice(oldChoice));
			} else {
				newColumn.push(cloneChoice(oldChoice));
			}
		}

		if (solutionChanged) {
			newColumn = newColumn.map((newChoice) => {
				if (this.isSameChoice(newChoice, choice)) {
					newChoice.correct = choice.correct;
				} else if (newChoice.correct && !multipleAnswers) {
					newChoice.correct = !choice.correct;
				}

				return newChoice;
			});
		}

		columns[column] = newColumn;

		this.setState({
			columns
		}, () => {
			this.onChange();
		});
	}


	renderChoice (column, choice) {
		const {multipleAnswers, containerId} = this.props;
		const {error} = this.state;
		const onChange = this.choiceChangeHandlers[column];

		return (
			<Choice
				key={choice.NTIID || choice.ID}
				choice={choice}
				group={containerId + '-choice'}
				onChange={onChange}
				error={isErrorForChoice(error, choice)}
				multipleAnswers={multipleAnswers}
			/>
		);
	}
}
