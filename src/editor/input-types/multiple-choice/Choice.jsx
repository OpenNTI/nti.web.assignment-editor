import './Choice.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Radio, Checkbox} from '@nti/web-commons';

import Choice, {Placeholder as ChoicePlaceholder} from '../choices/Choice';

export default class MultipleChoiceChoice extends React.Component {
	static propTypes = {
		choice: PropTypes.object,
		heightSyncGroup: PropTypes.object,
		error: PropTypes.object,
		group: PropTypes.string,
		onChange: PropTypes.func,
		onSolutionChange: PropTypes.func,
		onDelete: PropTypes.func,
		multipleAnswers: PropTypes.bool,
		plainText: PropTypes.bool,
		insertNewChoiceAfter: PropTypes.func,
		focusNext: PropTypes.func,
		focusPrev: PropTypes.func,
		maybeDeleteRow: PropTypes.func,
	}

	setChoiceCmpRef = x => this.choiceCmp = x;

	constructor (props) {
		super(props);

		const {choice} = this.props;

		this.state = {
			correct: choice.correct
		};
	}


	componentWillReceiveProps (nextProps) {
		const {choice:newChoice} = nextProps;
		const {choice:oldChoice} = this.props;

		if (newChoice !== oldChoice) {
			this.setState({
				correct: newChoice.correct
			});
		}
	}


	onChange (choice) {
		const {onChange} = this.props;

		if (onChange) {
			onChange(choice);
		}
	}


	onChoiceChange = (choice) => {
		this.onChange(choice);
	}


	onSolutionChange = (e) => {
		const {choice:oldChoice, onSolutionChange} = this.props;
		let newChoice = oldChoice.clone();

		newChoice.correct = e.target.checked;

		if (onSolutionChange) {
			onSolutionChange(newChoice);
		}
	}


	render () {
		const {
			choice,
			plainText,
			multipleAnswers,
			group,
			error,
			heightSyncGroup,
			onDelete,
			focusNext,
			focusPrev,
			insertNewChoiceAfter,
			maybeDeleteRow
		} = this.props;

		const {correct} = this.state;
		const cls = cx('multiple-choice-choice', {correct});

		return (
			<div className={cls}>
				<Choice
					ref={this.setChoiceCmpRef}
					choice={choice}
					onChange={this.onChoiceChange}
					error={error}
					plainText={plainText}
					heightSyncGroup={heightSyncGroup}
					onDelete={onDelete}
					focusNext={focusNext}
					focusPrev={focusPrev}
					insertNewChoiceAfter={insertNewChoiceAfter}
					maybeDeleteRow={maybeDeleteRow}
				/>
				{this.renderSolution(correct, multipleAnswers, group)}
			</div>
		);
	}


	renderSolution (correct, multipleAnswers, group) {
		if (multipleAnswers) {
			return (
				<Checkbox green checked={!!correct} onChange={this.onSolutionChange} tabIndex="-1"/>
			);
		}

		return (
			<Radio green name={group} checked={!!correct} onChange={this.onSolutionChange} tabIndex="-1"/>
		);
	}
}

Placeholder.propTypes = {
	correct: PropTypes.bool
};
export function Placeholder ({correct}) {
	return (
		<div className={cx('multiple-choice-choice placeholder', {correct})}>
			<ChoicePlaceholder correct={correct} />
			<Radio green name="placeholder-group" checked={correct} />
		</div>
	);
}
