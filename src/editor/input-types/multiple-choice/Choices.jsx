import React from 'react';
import PropTypes from 'prop-types';

import Choices, {Placeholder as ChoicesPlaceholder} from '../choices';
import {isErrorForChoice} from '../choices/Factory';

import Choice, {Placeholder as ChoicePlaceholder} from './Choice';

export default class MultipleChoiceChoices extends Choices {
	static propTypes = {
		...Choices.propTypes,
		multipleAnswers: PropTypes.bool
	}


	className = 'multiple-choice-choices'

	setUpHandlers (columns, deletes) {
		super.setUpHandlers(columns, deletes);

		this.solutionHandlers = [];

		for (let i = 0; i < columns.length; i++) {
			this.solutionHandlers[i] = this.onSolutionChange.bind(this, i);
		}
	}


	onSolutionChange (column, choice) {
		const {multipleAnswers} = this.props;
		const {columns} = this.state;
		const oldColumn = columns[column];
		const newColumn = [];
		let solutionChanged = false;

		for (let oldChoice of oldColumn) {
			if (this.isSameChoice(choice, oldChoice)) {
				if (oldChoice.correct !== choice.correct) {
					solutionChanged = true;
				}
			}

			newColumn.push(oldChoice.clone());
		}

		if (solutionChanged) {
			columns[column] = newColumn.map((newChoice) => {
				if (this.isSameChoice(newChoice, choice)) {
					newChoice.correct = choice.correct;
				} else if (newChoice.correct && !multipleAnswers) {
					newChoice.correct = !choice.correct;
				}

				return newChoice;
			});

			this.setState({
				columns
			}, () => {
				this.onChange();
			});
		}
	}


	renderChoice (column, choice, row) {
		const {plainText} = this.props;
		const {multipleAnswers, containerId} = this.props;
		const {error, canRemove} = this.state;
		const onChange = this.choiceChangeHandlers[column];
		const focusNext = this.focusNextHandlers[column];
		const focusPrev = this.focusPrevHandlers[column];
		const insertNewChoice = this.insertNewHandlers[column];
		const solutionHandler = this.solutionHandlers[column];
		const maybeDeleteRow = canRemove ? this.deleteRowHandlers[column] : void 0;
		const sync = this.getSyncForRow(row);
		const onDelete = canRemove ? this.deleteHandlers[row] : null;

		return (
			<Choice
				key={choice.NTIID || choice.ID}
				choice={choice}
				heightSyncGroup={sync}
				group={containerId + '-choice'}
				onChange={onChange}
				onSolutionChange={solutionHandler}
				error={isErrorForChoice(error, choice)}
				multipleAnswers={multipleAnswers}
				onDelete={onDelete}
				plainText={plainText}
				focusNext={focusNext}
				focusPrev={focusPrev}
				insertNewChoiceAfter={insertNewChoice}
				maybeDeleteRow={maybeDeleteRow}
			/>
		);
	}
}


export function Placeholder () {
	return (
		<ChoicesPlaceholder className="multiple-choice-placeholder">
			<ChoicePlaceholder correct />
			<ChoicePlaceholder />
			<ChoicePlaceholder />
		</ChoicesPlaceholder>
	);
}
