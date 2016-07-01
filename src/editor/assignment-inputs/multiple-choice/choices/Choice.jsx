import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';
import {Radio, Checkbox} from 'nti-web-commons';

import Choice from '../../choices/Choice';

export default class MultipleChoiceChoice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		heightSyncGroup: React.PropTypes.object,
		error: React.PropTypes.object,
		group: React.PropTypes.string,
		onChange: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool,
		plainText: React.PropTypes.bool
	}

	constructor (props) {
		super(props);

		const {choice} = this.props;

		this.state = {
			correct: choice.correct
		};

		autobind(this,
			'onSolutionChange',
			'onChoiceChange'
		);
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


	onChoiceChange (choice) {
		this.onChange(choice);
	}


	onSolutionChange (e) {
		const {choice:oldChoice} = this.props;
		let newChoice = oldChoice.clone();

		newChoice.correct = e.target.checked;

		this.onChange(newChoice);
	}


	render () {
		const {choice, plainText, multipleAnswers, group, error, heightSyncGroup} = this.props;
		const {correct} = this.state;
		const cls = cx('multiple-choice-choice', {correct});

		return (
			<div className={cls}>
				<Choice choice={choice} onChange={this.onChoiceChange} error={error} plainText={plainText} heightSyncGroup={heightSyncGroup} />
				{this.renderSolution(correct, multipleAnswers, group)}
			</div>
		);
	}


	renderSolution (correct, multipleAnswers, group) {
		if (multipleAnswers) {
			return (
				<Checkbox color="green" checked={correct} onChange={this.onSolutionChange} />
			);
		}

		return (
			<Radio color="green" name={group} checked={correct} onChange={this.onSolutionChange} />
		);
	}
}
