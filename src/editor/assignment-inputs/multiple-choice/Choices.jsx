import React from 'react';
import cx from 'classnames';
import Choice from './Choice';
import Add from './AddButton';
import {Ordering} from '../../../dnd';

export default class SingleChoices extends React.Component {
	static propTypes = {
		choices: React.PropTypes.array.isRequired,
		partId: React.PropTypes.string,
		partType: React.PropTypes.string,
		onChange: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool
	}

	constructor (props) {
		super(props);

		let {choices, partType} = props;

		choices = choices.slice(0);

		this.state = {
			choices: choices
		};

		this.acceptTypes = [partType];

		this.onChoiceChanged = this.onChoiceChanged.bind(this);
		this.onSolutionChanged = this.onSolutionChanged.bind(this);
		this.renderChoice = this.renderChoice.bind(this);
		this.onAdd = this.onAdd.bind(this);
		this.onOrderChange = this.onOrderChange.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		let {choices} = nextProps;

		choices = choices.slice(0);

		this.setState({
			choices: choices
		});
	}


	onChange () {
		const {onChange} = this.props;
		const {choices} = this.state;

		if (onChange) {
			onChange(choices);
		}
	}


	onOrderChange (newOrder) {
		this.setState({
			choices: newOrder
		}, () => {
			this.onChange();
		});
	}


	onChoiceChanged (id, label, correct) {
		let {choices} = this.state;

		choices = choices.map((choice) => {
			let choiceId = choice.NTIID || choice.ID;

			if (choiceId === id) {
				choice.label = label;
				choice.correct = correct;
			}

			return choice;
		});

		this.setState({
			choices: choices
		}, () => {
			this.onChange();
		});
	}


	onSolutionChanged (id, correct) {
		const {multipleAnswers} = this.props;
		let {choices} = this.state;

		choices = choices.map((choice) => {
			let choiceId = choice.NTIID || choice.ID;

			if (choiceId === id) {
				choice.correct = correct;
			} else if (choice.correct && !multipleAnswers) {
				choice.correct = !correct;
			}

			return choice;
		});

		this.setState({
			choices: choices
		});
	}


	onAdd () {
		const {choices} = this.state;

		choices.push('');

		this.setState({
			choices: choices
		});
	}


	render () {
		const {multipleAnswers, partId} = this.props;
		const {choices} = this.state;
		const cls = cx('multiple-choice', {'multiple-answer': multipleAnswers});

		return (
			<div className={cls}>
				<Ordering containerId={partId} items={choices} renderItem={this.renderChoice} accepts={this.acceptTypes} onChange={this.onOrderChange}/>
				{this.renderAddButton()}
			</div>
		);
	}


	renderChoice (choice) {
		const {partId, multipleAnswers} = this.props;
		const group = partId + '--solution-group';

		return (
			<Choice
				choice={choice}
				group={group}
				onChange={this.onChoiceChanged}
				onSolutionChange={this.onSolutionChanged}
				multipleAnswers={multipleAnswers}
			/>
		);
	}


	renderAddButton () {
		const {multipleAnswers} = this.props;

		return (
			<Add multipleAnswers={multipleAnswers} onAdd={this.onAdd} />
		);
	}
}
