import React from 'react';

import Choices from '../../choices';
import {isErrorForChoice} from '../../choices/Factory';
import Choice from './Choice';

function canEditMultipleAnswerSolution (choice, correctCount) {
	return correctCount > 1 || choice.correct;
}

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
		let correctCount = 0;
		let newColumn = [];
		let solutionChanged = false;

		for (let oldChoice of oldColumn) {
			if (oldChoice.correct) {
				correctCount += 1;
			}

			if (this.isSameChoice(oldChoice, choice)) {
				if (oldChoice.correct !== choice.correct) {
					solutionChanged = true;
				}

				oldChoice.label = choice.label;

				newColumn.push(oldChoice.clone());
			} else {
				newColumn.push(oldChoice.clone());
			}
		}

		if (solutionChanged && (!multipleAnswers || canEditMultipleAnswerSolution(choice, correctCount))) {
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


	renderChoice (column, choice, row) {
		const {plainText} = this.props;
		const {multipleAnswers, containerId} = this.props;
		const {error, canRemove} = this.state;
		const onChange = this.choiceChangeHandlers[column];
		const sync = this.getSyncForRow(row);
		const onDelete = canRemove ? this.deleteHandlers[row] : null;

		return (
			<Choice
				key={choice.NTIID || choice.ID}
				choice={choice}
				heightSyncGroup={sync}
				group={containerId + '-choice'}
				onChange={onChange}
				error={isErrorForChoice(error, choice)}
				multipleAnswers={multipleAnswers}
				onDelete={onDelete}
				plainText={plainText}
			/>
		);
	}
}
